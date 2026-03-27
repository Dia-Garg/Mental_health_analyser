# 🧠 Mental Health Analyzer

A DBMS-based web application that evaluates user responses to mental health questions, calculates a score, and classifies mental health status using predefined reference data.

---

## 🚀 Features
- Interactive frontend for user input (10-question assessment)
- Automatic score calculation using SQL Trigger
- Mental health classification using score ranges
- Demonstrates core DBMS concepts:
  - Constraints, Aggregate Functions, Set Operations  
  - Joins, Subqueries, Views  
  - Triggers, Stored Procedures, Cursors  

---

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Python (Flask - in progress)  
- **Database:** MySQL  

---

## 📂 Project Structure

mental-health-dbms/
├── src/ # Backend (Python)
├── templates/ # HTML (Frontend pages)
├── static/ # CSS / JS
├── database/ # SQL scripts (schema, queries, triggers)
├── docs/ # Report
├── results/ # Query outputs & screenshots


---

## ⚙️ How to Run

### 1. Setup Database
- Run `schema.sql`
- Run `insert_data.sql`

### 2. Run Frontend
- Open `index.html` in browser  
- Fill user details and answer questions  

### 3. (In Progress)
- Backend integration using Flask to connect frontend with database

---