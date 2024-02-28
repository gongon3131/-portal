CREATE TRIGGER op_hope_shift_insert_trigger 
AFTER INSERT ON td_hope_shift 
FOR EACH ROW 
INSERT INTO ts_op_hope_shift_log  
(
	tdsh_user_id,
	tdsh_shift_date,
	tdsh_start_time_first,
	tdsh_end_time_first,
	tdsh_start_time_second,
	tdsh_end_time_second,
	tdsh_holiday_flg,
	tdsh_paid_holiday_flg,
	tdsh_midnight_flg,
	tdsh_memo,
	tdsh_create_date,
	tdsh_update_date,
	tdsh_update_user,
	log_time,
	ins_flag
) 
VALUES
(
	NEW.tdsh_user_id,
	NEW.tdsh_shift_date,
	NEW.tdsh_start_time_first,
	NEW.tdsh_end_time_first,
	NEW.tdsh_start_time_second,
	NEW.tdsh_end_time_second,
	NEW.tdsh_holiday_flg,
	NEW.tdsh_paid_holiday_flg,
	NEW.tdsh_midnight_flg,
	NEW.tdsh_memo,
	NEW.tdsh_create_date,
	NEW.tdsh_update_date,
	NEW.tdsh_update_user,
	NOW(),
	1
);

DELIMITER //
CREATE TRIGGER op_hope_shift_update_trigger 
AFTER UPDATE ON td_hope_shift 
FOR EACH ROW 
BEGIN
	IF  OLD.tdsh_start_time_first != NEW.tdsh_start_time_first OR
		OLD.tdsh_end_time_first != NEW.tdsh_end_time_first OR
		OLD.tdsh_start_time_second != NEW.tdsh_start_time_second OR
		OLD.tdsh_end_time_second != NEW.tdsh_end_time_second OR
		OLD.tdsh_holiday_flg != NEW.tdsh_holiday_flg OR
		OLD.tdsh_paid_holiday_flg != NEW.tdsh_paid_holiday_flg OR
		OLD.tdsh_midnight_flg != NEW.tdsh_midnight_flg OR
		OLD.tdsh_memo != NEW.tdsh_memo THEN

		INSERT INTO ts_op_hope_shift_log  
		(
			tdsh_user_id,
			tdsh_shift_date,
			tdsh_start_time_first,
			tdsh_end_time_first,
			tdsh_start_time_second,
			tdsh_end_time_second,
			tdsh_holiday_flg,
			tdsh_paid_holiday_flg,
			tdsh_midnight_flg,
			tdsh_memo,
			tdsh_start_time_first_old,
			tdsh_end_time_first_old,
			tdsh_start_time_second_old,
			tdsh_end_time_second_old,
			tdsh_holiday_flg_old,
			tdsh_paid_holiday_flg_old,
			tdsh_midnight_flg_old,
			tdsh_memo_old,
			tdsh_create_date,
			tdsh_update_date,
			tdsh_update_user,
			log_time,
			ins_flag
		) 
		VALUES
		(
			NEW.tdsh_user_id,
			NEW.tdsh_shift_date,
			NEW.tdsh_start_time_first,
			NEW.tdsh_end_time_first,
			NEW.tdsh_start_time_second,
			NEW.tdsh_end_time_second,
			NEW.tdsh_holiday_flg,
			NEW.tdsh_paid_holiday_flg,
			NEW.tdsh_midnight_flg,
			NEW.tdsh_memo,
			OLD.tdsh_start_time_first,
			OLD.tdsh_end_time_first,
			OLD.tdsh_start_time_second,
			OLD.tdsh_end_time_second,
			OLD.tdsh_holiday_flg,
			OLD.tdsh_paid_holiday_flg,
			OLD.tdsh_midnight_flg,
			OLD.tdsh_memo,
			NEW.tdsh_create_date,
			NEW.tdsh_update_date,
			NEW.tdsh_update_user,
			NOW(),
			0
		);
		
	END IF;
END;//
DELIMITER ;

