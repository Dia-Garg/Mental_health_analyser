from flask import Flask, render_template, request, redirect
import mysql.connector

app = Flask(__name__)

# DB connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Havelock@06",
        database="mental_health_tracker"
    )

# Home page
@app.route('/')
def index():
    return render_template('index.html')

# Questionnaire page
@app.route('/questions')
def questions():
    return render_template('Questionnaire.html')

# Submit form
@app.route('/submit', methods=['POST'])
def submit():
    print("FORM DATA:", request.form)
    name = request.form['user_name']
    email = request.form['user_email']

    conn = get_db_connection()
    cursor = conn.cursor()

    # Insert user
    cursor.execute(
        "INSERT INTO users (user_name, user_email) VALUES (%s, %s)",
        (name, email)
    )
    user_id = cursor.lastrowid

    # Create assessment
    cursor.execute(
        "INSERT INTO assessments (user_id) VALUES (%s)",
        (user_id,)
    )
    assessment_id = cursor.lastrowid

    # Insert responses (assuming 10 questions)
    total_score = 0
    for i in range(1, 11):
        print(f"q{i}:", request.form.get(f'q{i}'))  # debug

        score = int(request.form[f'q{i}'])
        total_score += score

    cursor.execute(
        "INSERT INTO responses (assessment_id, question_id, score) VALUES (%s, %s, %s)",
        (assessment_id, i, score)
    )

    conn.commit()

    # Fetch result
    cursor.execute("""
        SELECT status_category 
        FROM mental_health_reference
        WHERE %s BETWEEN score_range_min AND score_range_max
    """, (total_score,))
    
    result = cursor.fetchone()[0]

    conn.close()

    return render_template('result.html', score=total_score, result=result)

@app.route('/test')
def test():
    conn = get_db_connection()
    cursor = conn.cursor()

    # fake user
    cursor.execute(
        "INSERT INTO users (user_name, user_email) VALUES (%s, %s)",
        ("Test User", "testuser123@gmail.com")
    )
    user_id = cursor.lastrowid

    # create assessment
    cursor.execute(
        "INSERT INTO assessments (user_id) VALUES (%s)",
        (user_id,)
    )
    assessment_id = cursor.lastrowid

    total_score = 0

    # simulate 10 responses
    for i in range(1, 11):
        score = 10  # fixed value
        total_score += score

        cursor.execute(
            "INSERT INTO responses (assessment_id, question_id, score) VALUES (%s, %s, %s)",
            (assessment_id, i, score)
        )

    # update total score
    cursor.execute(
        "UPDATE assessments SET total_score = %s WHERE assessment_id = %s",
        (total_score, assessment_id)
    )

    conn.commit()
    conn.close()

    return "TEST INSERT DONE"

if __name__ == '__main__':
    app.run(debug=True)

