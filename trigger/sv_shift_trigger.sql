CREATE TRIGGER op_hope_shift_insert_trigger 
AFTER INSERT ON td_before_confirm_shift_sv
FOR EACH ROW 
INSERT INTO ts_sv_shift_log  
(
	tdbs_user_id,
	tdbs_shift_date,
	tdbs_shift_time,
	tdbs_fixed_flg,
	tdbs_free_descripsion,
	tdbs_memo,
	tdbs_release_flg,
	tdbs_create_date,
	tdbs_update_date,
	tdbs_update_user,
	log_time,
	ins_flag
) 
VALUES
(
	NEW.tdbs_user_id,
	NEW.tdbs_shift_date,
	NEW.tdbs_shift_time,
	NEW.tdbs_fixed_flg,
	NEW.tdbs_free_descripsion,
	NEW.tdbs_memo,
	NEW.tdbs_release_flg,
	NEW.tdbs_create_date,
	NEW.tdbs_update_date,
	NEW.tdbs_update_user,
	NOW(),
	1
);

DELIMITER //
CREATE TRIGGER sv_shift_update_trigger 
AFTER UPDATE ON td_before_confirm_shift_sv 
FOR EACH ROW 
BEGIN
	IF  OLD.tdbs_shift_time != NEW.tdbs_shift_time OR
		OLD.tdbs_fixed_flg != NEW.tdbs_fixed_flg OR
		OLD.tdbs_free_descripsion != NEW.tdbs_free_descripsion OR
		OLD.tdbs_memo != NEW.tdbs_memo THEN

		INSERT INTO ts_sv_shift_log  
		(
			tdbs_user_id,
			tdbs_shift_date,
			tdbs_shift_time,
			tdbs_fixed_flg,
			tdbs_free_descripsion,
			tdbs_memo,
			tdbs_shift_time_old,
			tdbs_fixed_flg_old,
			tdbs_free_descripsion_old,
			tdbs_memo_old,
			tdbs_release_flg,
			tdbs_create_date,
			tdbs_update_date,
			tdbs_update_user,
			log_time,
			ins_flag
		) 
		VALUES
		(
			NEW.tdbs_user_id,
			NEW.tdbs_shift_date,
			NEW.tdbs_shift_time,
			NEW.tdbs_fixed_flg,
			NEW.tdbs_free_descripsion,
			NEW.tdbs_memo,
			OLD.tdbs_shift_time,
			OLD.tdbs_fixed_flg,
			OLD.tdbs_free_descripsion,
			OLD.tdbs_memo,
			NEW.tdbs_release_flg,
			NEW.tdbs_create_date,
			NEW.tdbs_update_date,
			NEW.tdbs_update_user,
			NOW(),
			0
		);
		
	END IF;
END;//
DELIMITER ;

