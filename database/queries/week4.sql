-- AGGREGATE FUNCTIONS
-- Average score of all assessments
SELECT AVG(total_score) AS average_score FROM assessments;

-- Maximum score
SELECT MAX(total_score) AS max_score FROM assessments;

-- Minimum score
SELECT MIN(total_score) AS min_score FROM assessments;

-- CONSTRAINT DEMONSTRATION
-- This should FAIL (score > 20)
INSERT INTO responses (assessment_id, question_id, score)
VALUES (1, 1, 25);

-- SET OPERATION(UNION)
SELECT user_id FROM users
UNION
SELECT user_id FROM assessments;