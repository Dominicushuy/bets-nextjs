---

# Danh sách hàm và trigger sử dụng trong dự án

---

## Các Trigger trong Schema `public`

1. **Function Name:** `handle_new_user`  
   - **Schema:** `public`  
   - **Return Type:** `trigger`  
   - **Language:** `plpgsql`  
   - **Definition:**
     ```plpgsql
     BEGIN
     END;
     ```

2. **Function Name:** `update_game_round_total_bets`  
   - **Schema:** `public`  
   - **Return Type:** `trigger`  
   - **Language:** `plpgsql`  
   - **Definition:**
     ```plpgsql
     BEGIN
       -- Cập nhật tổng tiền đặt cược trong game_round
       UPDATE game_rounds
         SET total_bets = (
           SELECT COALESCE(SUM(amount), 0)
           FROM bets
           WHERE game_round_id = NEW.game_round_id
         )
         WHERE id = NEW.game_round_id;
       
       RETURN NEW;
     END;
     ```

3. **Function Name:** `auto_update_game_round_status`  
   - **Schema:** `public`  
   - **Return Type:** `trigger`  
   - **Language:** `plpgsql`  
   - **Definition:**
     ```plpgsql
     BEGIN
       -- Nếu game đang ở trạng thái pending và đã đến thời gian bắt đầu, chuyển thành active
       IF NEW.status = 'pending' AND NEW.start_time <= NOW() THEN
         NEW.status := 'active';
       END IF;
       
       -- Cập nhật thời gian
       NEW.updated_at := NOW();
       
       RETURN NEW;
     END;
     ```

---

## Các Function trong Schema `public`

1. **Function Name:** `place_bet`  
   - **Schema:** `public`  
   - **Arguments:** `p_user_id uuid, p_game_round_id uuid, p_selected_number text, p_amount numeric`  
   - **Return Type:** `json`  
   - **Language:** `plpgsql`  
   - **Definition:**
     ```plpgsql
     DECLARE
       v_game_status TEXT;
       v_user_balance NUMERIC;
       v_bet_id UUID;
       v_result JSON;
     BEGIN
       -- Kiểm tra xem game có đang active không
       SELECT status INTO v_game_status
         FROM game_rounds
         WHERE id = p_game_round_id;
       
       IF v_game_status IS NULL THEN
         RETURN json_build_object('success', false, 'message', 'Game round not found');
       END IF;
       
       IF v_game_status != 'active' THEN
         RETURN json_build_object('success', false, 'message', 'Game is not active');
       END IF;
       
       -- Kiểm tra số dư của user
       SELECT balance INTO v_user_balance
         FROM profiles
         WHERE id = p_user_id;
       
       IF v_user_balance < p_amount THEN
         RETURN json_build_object('success', false, 'message', 'Insufficient balance');
       END IF;
       
       -- Bắt đầu transaction
       BEGIN
         -- Trừ tiền từ tài khoản người dùng
         UPDATE profiles
           SET 
             balance = balance - p_amount,
             total_wagered = total_wagered + p_amount,
             updated_at = NOW()
           WHERE id = p_user_id;
         
         -- Tạo bet mới
         INSERT INTO bets(
           user_id,
           game_round_id,
           selected_number,
           amount,
           created_at,
           updated_at
         )
         VALUES (
           p_user_id,
           p_game_round_id,
           p_selected_number,
           p_amount,
           NOW(),
           NOW()
         )
         RETURNING id INTO v_bet_id;
         
         -- Cập nhật tổng tiền cược cho game round
         UPDATE game_rounds
           SET 
             total_bets = COALESCE(total_bets, 0) + p_amount,
             updated_at = NOW()
           WHERE id = p_game_round_id;
         
         -- Tạo log hoạt động
         INSERT INTO system_logs(
           action_type,
           description,
           user_id,
           timestamp
         )
         VALUES (
           'place_bet',
           format('User %s placed bet %s on game %s with amount %s', 
             p_user_id, v_bet_id, p_game_round_id, p_amount),
           p_user_id,
           NOW()
         );
         
         -- Tạo thông báo cho người dùng
         INSERT INTO notifications(
           user_id,
           title,
           message,
           type,
           related_resource_id,
           related_resource_type,
           is_read,
           created_at
         )
         VALUES (
           p_user_id,
           'Đặt cược thành công',
           format('Bạn đã đặt cược %s VND cho số %s', p_amount, p_selected_number),
           'game',
           p_game_round_id,
           'game_rounds',
           FALSE,
           NOW()
         );
         
         -- Thành công, trả về kết quả
         v_result = json_build_object(
           'success', true,
           'bet_id', v_bet_id,
           'message', 'Bet placed successfully'
         );
         
         RETURN v_result;
       EXCEPTION WHEN OTHERS THEN
         -- Rollback nếu có lỗi
         RAISE;
         RETURN json_build_object('success', false, 'message', SQLERRM);
       END;
     END;
     ```

---

## Các Function trong Schema `auth`

1. **Function Name:** `uid`  
   - **Schema:** `auth`  
   - **Return Type:** `uuid`  
   - **Language:** `sql`  
   - **Definition:**
     ```sql
     select 
       coalesce(
         nullif(current_setting('request.jwt.claim.sub', true), ''),
         (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
       )::uuid
     ```

2. **Function Name:** `role`  
   - **Schema:** `auth`  
   - **Return Type:** `text`  
   - **Language:** `sql`  
   - **Definition:**
     ```sql
     select 
       coalesce(
         nullif(current_setting('request.jwt.claim.role', true), ''),
         (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
       )::text
     ```

3. **Function Name:** `email`  
   - **Schema:** `auth`  
   - **Return Type:** `text`  
   - **Language:** `sql`  
   - **Definition:**
     ```sql
     select 
       coalesce(
         nullif(current_setting('request.jwt.claim.email', true), ''),
         (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
       )::text
     ```

4. **Function Name:** `jwt`  
   - **Schema:** `auth`  
   - **Return Type:** `jsonb`  
   - **Language:** `sql`  
   - **Definition:**
     ```sql
     select 
       coalesce(
         nullif(current_setting('request.jwt.claim', true), ''),
         nullif(current_setting('request.jwt.claims', true), '')
       )::jsonb
     ```

---