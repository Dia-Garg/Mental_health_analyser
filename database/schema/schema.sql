CREATE DATABASE IF NOT EXISTS mental_health_tracker;
USE mental_health_tracker;

-- USERS TABLE
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- QUESTIONS TABLE
CREATE TABLE questions (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    question_text TEXT NOT NULL,
    max_score INT DEFAULT 20
);

-- ASSESSMENTS TABLE
CREATE TABLE assessments (
    assessment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_score INT,
    
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);

-- RESPONSES TABLE
CREATE TABLE responses (
    response_id INT PRIMARY KEY AUTO_INCREMENT,
    assessment_id INT NOT NULL,
    question_id INT NOT NULL,
    score INT CHECK (score BETWEEN 1 AND 20),
    
    FOREIGN KEY (assessment_id)
    REFERENCES assessments(assessment_id)
    ON DELETE CASCADE,
    
    FOREIGN KEY (question_id)
    REFERENCES questions(question_id)
    ON DELETE CASCADE
);

-- REFERENCE TABLE
CREATE TABLE mental_health_reference (
    ref_id INT PRIMARY KEY AUTO_INCREMENT,
    score_range_min INT NOT NULL,
    score_range_max INT NOT NULL,
    status_category VARCHAR(100) NOT NULL,
    status_description TEXT,
    recommendations TEXT,
    severity_level VARCHAR(50),
    
    CHECK (score_range_min <= score_range_max)
);