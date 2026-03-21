-- JOIN
SELECT u.user_name, a.total_score
FROM users u
JOIN assessments a ON u.user_id = a.user_id;

-- SUBQUERY
SELECT * FROM assessments
WHERE total_score > (
    SELECT AVG(total_score) FROM assessments
);

-- VIEW
CREATE VIEW user_scores AS
SELECT u.user_name, a.total_score
FROM users u
JOIN assessments a ON u.user_id = a.user_id;
-- TO TEST IT:
SELECT * FROM user_scores;