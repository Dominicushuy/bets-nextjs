-- Function xử lý khi có một user mới được tạo
BEGIN
  -- Tạo bản ghi cơ bản trong profiles
  INSERT INTO public.profiles (
    id, 
    email,
    role, 
    is_active, 
    balance, 
    level,
    experience_points,
    total_wagered,
    total_won,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id, 
    NEW.email,
    'user',  
    TRUE,    
    0,       
    1,       
    0,       
    0,       
    0,       
    NOW(),   
    NOW()    
  );
  
  -- Ghi log
  INSERT INTO system_logs (action_type, description, user_id, timestamp)
  VALUES ('user_created', 'New user account created with email: ' || NEW.email, NEW.id, NOW());
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NULL;
END;

-- =================================================================================================

-- Function xóa avatar cũ khi cập nhật avatar mới
CREATE OR REPLACE FUNCTION delete_old_avatar()
RETURNS TRIGGER AS $$
DECLARE
  old_avatar_url TEXT;
  old_avatar_path TEXT;
BEGIN
  -- Kiểm tra nếu avatar_url bị thay đổi
  IF OLD.avatar_url IS DISTINCT FROM NEW.avatar_url AND OLD.avatar_url IS NOT NULL THEN
    -- Extract path từ URL (Lưu ý: điều chỉnh regex này phù hợp với URL thực tế của bạn)
    old_avatar_path := regexp_replace(OLD.avatar_url, '^.+/user_avatars/(.+)$', '\1');
    
    -- Xóa file cũ từ storage
    PERFORM storage.delete('user_avatars', old_avatar_path);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger khi profile được cập nhật
DROP TRIGGER IF EXISTS on_avatar_update ON profiles;
CREATE TRIGGER on_avatar_update
BEFORE UPDATE ON profiles
FOR EACH ROW
WHEN (OLD.avatar_url IS DISTINCT FROM NEW.avatar_url)
EXECUTE FUNCTION delete_old_avatar();

-- =================================================================================================

-- Function để tổng hợp thống kê người dùng
CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Kiểm tra và tạo bản ghi thống kê nếu chưa có
  INSERT INTO user_statistics (
    user_id, 
    total_games_played,
    games_won,
    win_rate,
    biggest_win,
    lucky_number,
    total_rewards,
    last_updated
  )
  VALUES (
    NEW.user_id, 
    1,
    CASE WHEN NEW.is_winner THEN 1 ELSE 0 END,
    CASE WHEN NEW.is_winner THEN 100 ELSE 0 END,
    CASE WHEN NEW.is_winner THEN NEW.amount ELSE 0 END,
    CASE WHEN NEW.is_winner THEN NEW.selected_number ELSE NULL END,
    0,
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Cập nhật thống kê nếu đã có
  WITH stats AS (
    SELECT 
      user_id,
      COUNT(*) AS total_games,
      SUM(CASE WHEN is_winner THEN 1 ELSE 0 END) AS games_won,
      CASE 
        WHEN COUNT(*) > 0 THEN
          ROUND((SUM(CASE WHEN is_winner THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
        ELSE 0
      END AS win_rate
    FROM bets 
    WHERE user_id = NEW.user_id
    GROUP BY user_id
  ),
  max_win AS (
    SELECT MAX(amount) AS biggest_win
    FROM bets
    WHERE user_id = NEW.user_id AND is_winner = TRUE
  ),
  lucky_numbers AS (
    SELECT
      selected_number,
      COUNT(*) AS wins
    FROM bets
    WHERE user_id = NEW.user_id AND is_winner = TRUE
    GROUP BY selected_number
    ORDER BY wins DESC
    LIMIT 1
  )
  UPDATE user_statistics
  SET 
    total_games_played = stats.total_games,
    games_won = stats.games_won,
    win_rate = stats.win_rate,
    biggest_win = COALESCE(max_win.biggest_win, biggest_win),
    lucky_number = COALESCE((SELECT selected_number FROM lucky_numbers), lucky_number),
    last_updated = NOW()
  FROM stats, max_win
  WHERE user_statistics.user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger khi có bet mới hoặc bet được cập nhật
DROP TRIGGER IF EXISTS on_bet_update ON bets;
CREATE TRIGGER on_bet_update
AFTER INSERT OR UPDATE OF is_winner ON bets
FOR EACH ROW
EXECUTE FUNCTION update_user_statistics();

-- Function để tổng hợp thống kê game
CREATE OR REPLACE FUNCTION get_game_stats(p_game_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'totalPlayers', COUNT(DISTINCT user_id),
    'totalWinners', COUNT(DISTINCT CASE WHEN is_winner THEN user_id END),
    'totalBets', COALESCE(SUM(amount), 0),
    'totalPayout', COALESCE(SUM(CASE WHEN is_winner THEN amount * 80 ELSE 0 END), 0)
  ) INTO result
  FROM bets
  WHERE game_round_id = p_game_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =================================================================================================

-- Function để tự động update thống kê khi game round kết thúc
CREATE OR REPLACE FUNCTION update_statistics_on_game_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Chỉ thực hiện khi game thay đổi từ active sang completed
  IF OLD.status = 'active' AND NEW.status = 'completed' THEN
    -- Thống kê có thể được cập nhật qua trigger của bets
    -- hoặc có thể thực hiện thêm ở đây nếu cần
    
    -- Ví dụ: cập nhật lại toàn bộ user_statistics cho các user tham gia game này
    WITH bet_stats AS (
      SELECT 
        user_id,
        COUNT(*) AS total_games,
        SUM(CASE WHEN is_winner THEN 1 ELSE 0 END) AS games_won
      FROM bets
      WHERE game_round_id = NEW.id
      GROUP BY user_id
    )
    UPDATE user_statistics us
    SET 
      total_games_played = us.total_games_played + bs.total_games,
      games_won = us.games_won + bs.games_won,
      win_rate = CASE 
        WHEN (us.total_games_played + bs.total_games) > 0 THEN
          ((us.games_won + bs.games_won)::FLOAT / (us.total_games_played + bs.total_games)::FLOAT) * 100
        ELSE 0
      END,
      last_updated = NOW()
    FROM bet_stats bs
    WHERE us.user_id = bs.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger cho game_rounds
DROP TRIGGER IF EXISTS on_game_completion ON game_rounds;
CREATE TRIGGER on_game_completion
AFTER UPDATE OF status ON game_rounds
FOR EACH ROW
EXECUTE FUNCTION update_statistics_on_game_completion();