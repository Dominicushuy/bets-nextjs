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