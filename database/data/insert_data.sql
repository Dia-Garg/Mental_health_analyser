INSERT INTO users (user_name, user_email) VALUES
('Rahul Sharma', 'rahul@example.com'),
('Ananya Iyer', 'ananya@example.com');

INSERT INTO questions (question_text) VALUES
('Do you feel stressed frequently?'),
('Do you have trouble sleeping?'),
('Do you feel anxious without reason?'),
('Do you feel emotionally drained?'),
('Do you lose interest in activities?'),
('Do you feel irritated often?'),
('Do you struggle to concentrate?'),
('Do you feel hopeless?'),
('Do you experience mood swings?'),
('Do you avoid social interaction?');

INSERT INTO assessments (user_id, total_score) VALUES
(1, NULL),
(2, NULL);

INSERT INTO responses (assessment_id, question_id, score) VALUES
(1,1,10),(1,2,12),(1,3,11),(1,4,13),(1,5,9),
(1,6,10),(1,7,11),(1,8,12),(1,9,10),(1,10,11);

INSERT INTO responses (assessment_id, question_id, score) VALUES
(2,1,5),(2,2,6),(2,3,7),(2,4,6),(2,5,5),
(2,6,6),(2,7,7),(2,8,6),(2,9,5),(2,10,6);

INSERT INTO mental_health_reference 
(score_range_min, score_range_max, status_category, severity_level)
VALUES
(10, 60, 'Stable', 'Low'),
(61, 110, 'Mild Stress', 'Moderate'),
(111, 150, 'Moderate Distress', 'High'),
(151, 200, 'Severe Distress', 'Critical');