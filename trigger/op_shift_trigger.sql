CREATE TRIGGER op_shift_insert_trigger 
AFTER INSERT ON td_before_confirm_shift 
FOR EACH ROW 
INSERT INTO ts_op_shift_log  
(
	tdbc_user_id,
	tdbc_shift_date,
	tdbc_start_time_first,
	tdbc_end_time_first,
	tdbc_start_time_second,
	tdbc_end_time_second,
	tdbc_holiday_flg,
	tdbc_paid_holiday_flg,
	tdbc_midnight_flg,
	tdbc_memo,
	tdbc_release_flg,
	tdbc_create_date,
	tdbc_update_date,
	tdbc_update_user,
	log_time,
	ins_flag
) 
VALUES
(
	NEW.tdbc_user_id,
	NEW.tdbc_shift_date,
	NEW.tdbc_start_time_first,
	NEW.tdbc_end_time_first,
	NEW.tdbc_start_time_second,
	NEW.tdbc_end_time_second,
	NEW.tdbc_holiday_flg,
	NEW.tdbc_paid_holiday_flg,
	NEW.tdbc_midnight_flg,
	NEW.tdbc_memo,
	NEW.tdbc_release_flg,
	NEW.tdbc_create_date,
	NEW.tdbc_update_date,
	NEW.tdbc_update_user,
	NOW(),
	1
);

DELIMITER //
CREATE TRIGGER op_shift_update_trigger 
AFTER UPDATE ON td_before_confirm_shift 
FOR EACH ROW 
BEGIN
	IF  OLD.tdbc_start_time_first != NEW.tdbc_start_time_first OR
		OLD.tdbc_end_time_first != NEW.tdbc_end_time_first OR
		OLD.tdbc_start_time_second != NEW.tdbc_start_time_second OR
		OLD.tdbc_end_time_second != NEW.tdbc_end_time_second OR
		OLD.tdbc_holiday_flg != NEW.tdbc_holiday_flg OR
		OLD.tdbc_paid_holiday_flg != NEW.tdbc_paid_holiday_flg OR
		OLD.tdbc_midnight_flg != NEW.tdbc_midnight_flg OR
		OLD.tdbc_memo != NEW.tdbc_memo THEN

		INSERT INTO ts_op_shift_log  
		(
			tdbc_user_id,
			tdbc_shift_date,
			tdbc_start_time_first,
			tdbc_end_time_first,
			tdbc_start_time_second,
			tdbc_end_time_second,
			tdbc_holiday_flg,
			tdbc_paid_holiday_flg,
			tdbc_midnight_flg,
			tdbc_memo,
			tdbc_start_time_first_old,
			tdbc_end_time_first_old,
			tdbc_start_time_second_old,
			tdbc_end_time_second_old,
			tdbc_holiday_flg_old,
			tdbc_paid_holiday_flg_old,
			tdbc_midnight_flg_old,
			tdbc_memo_old,
			tdbc_release_flg,
			tdbc_create_date,
			tdbc_update_date,
			tdbc_update_user,
			log_time,
			ins_flag
		) 
		VALUES
		(
			NEW.tdbc_user_id,
			NEW.tdbc_shift_date,
			NEW.tdbc_start_time_first,
			NEW.tdbc_end_time_first,
			NEW.tdbc_start_time_second,
			NEW.tdbc_end_time_second,
			NEW.tdbc_holiday_flg,
			NEW.tdbc_paid_holiday_flg,
			NEW.tdbc_midnight_flg,
			NEW.tdbc_memo,
			OLD.tdbc_start_time_first,
			OLD.tdbc_end_time_first,
			OLD.tdbc_start_time_second,
			OLD.tdbc_end_time_second,
			OLD.tdbc_holiday_flg,
			OLD.tdbc_paid_holiday_flg,
			OLD.tdbc_midnight_flg,
			OLD.tdbc_memo,
			NEW.tdbc_release_flg,
			NEW.tdbc_create_date,
			NEW.tdbc_update_date,
			NEW.tdbc_update_user,
			NOW(),
			0
		);
		
	END IF;
END;//
DELIMITER ;

