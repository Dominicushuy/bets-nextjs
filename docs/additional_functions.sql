-- Function để tạo thông báo khi game kết thúc
CREATE OR REPLACE FUNCTION notify_users_on_game_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Chỉ thực hiện khi game thay đổi từ active sang completed
  IF OLD.status = 'active' AND NEW.status = 'completed' THEN
    -- Thông báo cho tất cả người tham gia
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      related_resource_id,
      related_resource_type,
      is_read,
      created_at
    )
    SELECT DISTINCT
      b.user_id,
      'Kết quả lượt chơi đã có',
      'Lượt chơi đã kết thúc với số trúng thưởng: ' || NEW.winning_number,
      'game',
      NEW.id,
      'game_round',
      false,
      NOW()
    FROM bets b
    WHERE b.game_round_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo trigger cho thông báo khi game kết thúc
DROP TRIGGER IF EXISTS on_game_completion_notify ON game_rounds;
CREATE TRIGGER on_game_completion_notify
AFTER UPDATE OF status ON game_rounds
FOR EACH ROW
EXECUTE FUNCTION notify_users_on_game_completion();

-- Function để tính lợi nhuận của game
CREATE OR REPLACE FUNCTION calculate_game_profit(game_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  v_total_bets NUMERIC;
  v_total_payout NUMERIC;
BEGIN
  SELECT COALESCE(total_bets, 0), COALESCE(total_payout, 0)
  INTO v_total_bets, v_total_payout
  FROM game_rounds
  WHERE id = game_id;
  
  RETURN v_total_bets - v_total_payout;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;