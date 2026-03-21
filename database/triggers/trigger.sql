DELIMITER $$

CREATE TRIGGER calculate_total_score
AFTER INSERT ON responses
FOR EACH ROW
BEGIN
    UPDATE assessments
    SET total_score = (
        SELECT SUM(score)
        FROM responses
        WHERE assessment_id = NEW.assessment_id
    )
    WHERE assessment_id = NEW.assessment_id;
END$$

DELIMITER ;