CREATE TRIGGER sv_hope_shift_insert_trigger 
AFTER INSERT ON td_hope_shift_sv
FOR EACH ROW 
INSERT INTO ts_sv_hope_shift_log  
(
	tdsv_user_id,
	tdsv_shift_date,
	tdsv_shift_time,
	tdsv_fixed_flg,
	tdsv_free_descripsion,
	tdsv_memo,
	tdsv_create_date,
	tdsv_update_date,
	tdsv_update_user,
	log_time,
	ins_flag
) 
VALUES
(
	NEW.tdsv_user_id,
	NEW.tdsv_shift_date,
	NEW.tdsv_shift_time,
	NEW.tdsv_fixed_flg,
	NEW.tdsv_free_descripsion,
	NEW.tdsv_memo,
	NEW.tdsv_create_date,
	NEW.tdsv_update_date,
	NEW.tdsv_update_user,
	NOW(),
	1
);

DELIMITER //
CREATE TRIGGER sv_hope_shift_update_trigger 
AFTER UPDATE ON td_hope_shift_sv 
FOR EACH ROW 
BEGIN
	IF  OLD.tdsv_shift_time != NEW.tdsv_shift_time OR
		OLD.tdsv_fixed_flg != NEW.tdsv_fixed_flg OR
		OLD.tdsv_free_descripsion != NEW.tdsv_free_descripsion OR
		OLD.tdsv_memo != NEW.tdsv_memo THEN

		INSERT INTO ts_sv_hope_shift_log  
		(
			tdsv_user_id,
			tdsv_shift_date,
			tdsv_shift_time,
			tdsv_fixed_flg,
			tdsv_free_descripsion,
			tdsv_memo,
			tdsv_shift_time_old,
			tdsv_fixed_flg_old,
			tdsv_free_descripsion_old,
			tdsv_memo_old,
			tdsv_create_date,
			tdsv_update_date,
			tdsv_update_user,
			log_time,
			ins_flag
		) 
		VALUES
		(
			NEW.tdsv_user_id,
			NEW.tdsv_shift_date,
			NEW.tdsv_shift_time,
			NEW.tdsv_fixed_flg,
			NEW.tdsv_free_descripsion,
			NEW.tdsv_memo,
			OLD.tdsv_shift_time,
			OLD.tdsv_fixed_flg,
			OLD.tdsv_free_descripsion,
			OLD.tdsv_memo,
			NEW.tdsv_create_date,
			NEW.tdsv_update_date,
			NEW.tdsv_update_user,
			NOW(),
			0
		);
		
	END IF;
END;//
DELIMITER ;

