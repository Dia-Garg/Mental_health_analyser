# 🧠 Mental Health Analyzer

A DBMS-based system that evaluates user responses to mental health questions, calculates a score, and classifies mental health status using predefined reference data.

---

## 🚀 Features
- 10-question assessment system  
- Automatic score calculation using SQL Trigger  
- Mental health classification using score ranges  
- Demonstrates core DBMS concepts:
  - Constraints, Aggregate Functions, Set Operations  
  - Joins, Subqueries, Views  
  - Triggers, Stored Procedures, Cursors  

---

## 🛠️ Tech Stack
- Frontend: HTML, CSS, JavaScript  
- Backend: Python (Flask - in progress)  
- Database: MySQL  

---

## 📂 Structure

mental-health-dbms/
├── src/ # Backend (Python)
├── templates/ # HTML files
├── static/ # CSS / JS
├── database/ # SQL scripts
├── docs/ # Report
├── results/ # Outputs


---

## ⚙️ How to Run
1. Run `schema.sql` and `insert_data.sql` in MySQL  
2. Execute queries from `database/queries/`  
3. Open `index.html` in browser  

---

## 📊 Workflow
User → Answers Questions → Data Stored → Trigger Calculates Score → Result Classified

---

## ⚠️ Note
For academic use only. Not a medical diagnosis tool.
