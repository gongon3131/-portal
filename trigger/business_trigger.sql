CREATE TRIGGER shift_business_insert_trigger 
AFTER INSERT ON td_shift_business 
FOR EACH ROW 
INSERT INTO ts_shift_business_log  
(
	tdsb_shift_date,
	tdsb_user_id,
	tdsb_shift_hour,
	tdsb_business_id,
	tdsb_free_description,
	tdsb_create_date,
	tdsb_update_date,
	tdsb_update_user,
	log_time,
	ins_flag
) 
VALUES
(
	NEW.tdsb_shift_date,
	NEW.tdsb_user_id,
	NEW.tdsb_shift_hour,
	NEW.tdsb_business_id,
	NEW.tdsb_free_description,
	NEW.tdsb_create_date,
	NEW.tdsb_update_date,
	NEW.tdsb_update_user,
	NOW(),
	1
);

DELIMITER //
CREATE TRIGGER shift_business_update_trigger 
AFTER UPDATE ON td_shift_business 
FOR EACH ROW 
BEGIN
	IF OLD.tdsb_business_id != NEW.tdsb_business_id THEN

		INSERT INTO ts_shift_business_log  
		(
			tdsb_shift_date,
			tdsb_user_id,
			tdsb_shift_hour,
			tdsb_business_id,
			tdsb_business_id_old,
			tdsb_free_description,
			tdsb_free_description_old,
			tdsb_create_date,
			tdsb_update_date,
			tdsb_update_user,
			log_time,
			ins_flag
		) 
		VALUES
		(
			OLD.tdsb_shift_date,
			OLD.tdsb_user_id,
			OLD.tdsb_shift_hour,
			NEW.tdsb_business_id,
			OLD.tdsb_business_id,
			NEW.tdsb_free_description,
			OLD.tdsb_free_description,
			OLD.tdsb_create_date,
			OLD.tdsb_update_date,
			OLD.tdsb_update_user,
			NOW(),
			0
		);
		
	END IF;
END;//
DELIMITER ;

