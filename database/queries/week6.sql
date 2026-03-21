-- STORED PROCEDURE
DELIMITER $$

CREATE PROCEDURE get_result(IN aid INT)
BEGIN
    SELECT a.total_score, m.status_category
    FROM assessments a
    JOIN mental_health_reference m
    ON a.total_score BETWEEN m.score_range_min AND m.score_range_max
    WHERE a.assessment_id = aid;
END$$

DELIMITER ;
-- TO RUN:
CALL get_result(1);

-- CURSOR
DELIMITER $$

CREATE PROCEDURE list_users()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE uname VARCHAR(100);

    DECLARE cur CURSOR FOR SELECT user_name FROM users;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO uname;
        IF done THEN
            LEAVE read_loop;
        END IF;
    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;