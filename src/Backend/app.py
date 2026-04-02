# MindCheck — app.py
# Run: python app.py

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector
import os

app = Flask(
    __name__,
    template_folder='../frontend/templates',
    static_folder='../frontend/static'
)
CORS(app)

# ─── DB CONFIG ───
# Replace password with your MySQL root password
DB_CONFIG = {
    'host':     'localhost',
    'user':     'root',
    'password': 'your_password_here',
    'database': 'mental_health_tracker'
}

def get_db():
    return mysql.connector.connect(**DB_CONFIG)


# ─── SERVE PAGES ───
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/questionnaire')
def questionnaire():
    return render_template('questionnaire.html')

@app.route('/result')
def result():
    return render_template('result.html')


# ─── API: SUBMIT ASSESSMENT ───
@app.route('/api/submit', methods=['POST'])
def submit():
    data = request.get_json()

    name    = data.get('name')
    email   = data.get('email')
    answers = data.get('answers')   # list of 10 scores
    total   = data.get('totalScore')

    if not name or not email or not answers or total is None:
        return jsonify({'error': 'Missing data'}), 400

    if len(answers) != 10:
        return jsonify({'error': 'Expected 10 answers'}), 400

    try:
        conn   = get_db()
        cursor = conn.cursor()

        # 1. Insert or get user
        cursor.execute(
            "SELECT user_id FROM users WHERE user_email = %s",
            (email,)
        )
        row = cursor.fetchone()

        if row:
            user_id = row[0]
        else:
            cursor.execute(
                "INSERT INTO users (user_name, user_email) VALUES (%s, %s)",
                (name, email)
            )
            user_id = cursor.lastrowid

        # 2. Insert assessment (total_score starts NULL, trigger updates it)
        cursor.execute(
            "INSERT INTO assessments (user_id) VALUES (%s)",
            (user_id,)
        )
        assessment_id = cursor.lastrowid

        # 3. Insert all 10 responses
        # Trigger in DB will auto-update total_score after each insert
        for i, score in enumerate(answers):
            question_id = i + 1   # questions are 1–10 in DB
            cursor.execute(
                "INSERT INTO responses (assessment_id, question_id, score) VALUES (%s, %s, %s)",
                (assessment_id, question_id, score)
            )

        conn.commit()

        # 4. Fetch result category from mental_health_reference
        cursor.execute("""
            SELECT m.status_category, m.severity_level
            FROM assessments a
            JOIN mental_health_reference m
              ON a.total_score BETWEEN m.score_range_min AND m.score_range_max
            WHERE a.assessment_id = %s
        """, (assessment_id,))

        ref = cursor.fetchone()
        category = ref[0] if ref else 'Unknown'
        severity = ref[1] if ref else 'Unknown'

        cursor.close()
        conn.close()

        return jsonify({
            'success':       True,
            'assessment_id': assessment_id,
            'total_score':   total,
            'category':      category,
            'severity':      severity
        })

    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500


# ─── SERVE ADMIN PAGE ───
@app.route('/admin')
def admin():
    return render_template('admin.html')


# ─── API: ADMIN — ALL ASSESSMENTS ───
@app.route('/api/admin/assessments', methods=['GET'])
def admin_assessments():
    try:
        conn   = get_db()
        cursor = conn.cursor(dictionary=True)

        # All assessments with user + category
        cursor.execute("""
            SELECT
                a.assessment_id,
                u.user_name,
                u.user_email,
                a.total_score,
                a.submission_date,
                m.status_category,
                m.severity_level
            FROM assessments a
            JOIN users u ON a.user_id = u.user_id
            LEFT JOIN mental_health_reference m
                ON a.total_score BETWEEN m.score_range_min AND m.score_range_max
            ORDER BY a.submission_date DESC
        """)
        assessments = cursor.fetchall()

        # Convert datetime to string for JSON
        for row in assessments:
            if row['submission_date']:
                row['submission_date'] = str(row['submission_date'])

        # Stats
        cursor.execute("SELECT COUNT(DISTINCT user_id) AS c FROM users")
        total_users = cursor.fetchone()['c']

        cursor.execute("SELECT COUNT(*) AS c FROM assessments")
        total_assessments = cursor.fetchone()['c']

        cursor.execute("SELECT ROUND(AVG(total_score)) AS avg FROM assessments WHERE total_score IS NOT NULL")
        avg_row = cursor.fetchone()
        avg_score = avg_row['avg'] if avg_row['avg'] else None

        cursor.execute("""
            SELECT m.status_category, COUNT(*) AS cnt
            FROM assessments a
            JOIN mental_health_reference m
                ON a.total_score BETWEEN m.score_range_min AND m.score_range_max
            GROUP BY m.status_category
            ORDER BY cnt DESC
            LIMIT 1
        """)
        common_row = cursor.fetchone()
        most_common = common_row['status_category'] if common_row else None

        cursor.close()
        conn.close()

        return jsonify({
            'assessments':       assessments,
            'total_users':       total_users,
            'total_assessments': total_assessments,
            'avg_score':         avg_score,
            'most_common':       most_common
        })

    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500


# ─── API: GET RESULT BY ASSESSMENT ID ───
@app.route('/api/result/<int:assessment_id>', methods=['GET'])
def get_result(assessment_id):
    try:
        conn   = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT u.user_name, a.total_score, a.submission_date,
                   m.status_category, m.severity_level
            FROM assessments a
            JOIN users u ON a.user_id = u.user_id
            JOIN mental_health_reference m
              ON a.total_score BETWEEN m.score_range_min AND m.score_range_max
            WHERE a.assessment_id = %s
        """, (assessment_id,))

        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if not row:
            return jsonify({'error': 'Assessment not found'}), 404

        return jsonify(row)

    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)