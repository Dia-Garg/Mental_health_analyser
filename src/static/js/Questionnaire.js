/* MindCheck — questionnaire.js */

const QUESTIONS = [
  "Do you feel stressed frequently?",
  "Do you have trouble sleeping?",
  "Do you feel anxious without reason?",
  "Do you feel emotionally drained?",
  "Do you lose interest in activities you used to enjoy?",
  "Do you feel irritated or frustrated often?",
  "Do you struggle to concentrate?",
  "Do you feel hopeless about the future?",
  "Do you experience mood swings?",
  "Do you avoid social interaction?"
];

const OPTIONS = [
  { label: "Never",        score: 2  },
  { label: "Rarely",       score: 6  },
  { label: "Sometimes",    score: 10 },
  { label: "Often",        score: 14 },
  { label: "Almost always",score: 18 }
];

// Stores selected score for each question (index 0–9)
const answers = new Array(10).fill(null);
let quizStarted = false;

// ─── BUILD QUESTION CARDS ───
function buildQuestions() {
  const container = document.getElementById('questions-container');
  container.innerHTML = '';

  QUESTIONS.forEach(function (qText, i) {
    const block = document.createElement('div');
    block.className = 'question-block';
    block.id = 'q-block-' + i;
    block.style.display = 'none';

    const optionsHTML = OPTIONS.map(function (opt, j) {
      return `
        <div class="answer-option" id="opt-${i}-${j}" onclick="selectAnswer(${i}, ${j}, ${opt.score})">
          <div class="answer-radio"></div>
          ${opt.label}
        </div>`;
    }).join('');

    block.innerHTML = `
      <div class="q-label">Question ${i + 1} of ${QUESTIONS.length}</div>
      <p class="q-text">${qText}</p>
      <div class="answer-options">${optionsHTML}</div>
      <div class="quiz-nav">
        ${i > 0 ? `<button class="btn-ghost" onclick="goTo(${i - 1})">← Previous</button>` : '<span></span>'}
        <button class="btn-primary" id="next-btn-${i}" onclick="goNext(${i})" style="opacity:0.4; pointer-events:none;">
          ${i < QUESTIONS.length - 1 ? 'Next question →' : 'Review answers →'}
        </button>
      </div>`;

    container.appendChild(block);
  });
}

// ─── START QUIZ ───
function startQuiz() {
  const name  = document.getElementById('user-name').value.trim();
  const email = document.getElementById('user-email').value.trim();
  const err   = document.getElementById('info-error');

  if (!name || !email) {
    err.style.display = 'block';
    return;
  }
  err.style.display = 'none';

  quizStarted = true;
  document.getElementById('step-0').style.display = 'none';
  buildQuestions();
  goTo(0);
}

// ─── SHOW A QUESTION ───
function goTo(index) {
  // Hide all blocks
  document.querySelectorAll('.question-block').forEach(function (b) {
    b.style.display = 'none';
  });

  // Show target
  const block = document.getElementById('q-block-' + index);
  if (block) {
    block.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // If past all questions, show submit
  if (index >= QUESTIONS.length) {
    document.getElementById('submit-section').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    document.getElementById('submit-section').style.display = 'none';
  }

  updateProgress(index);
}

// ─── SELECT AN ANSWER ───
function selectAnswer(qIndex, optIndex, score) {
  answers[qIndex] = score;

  // Highlight selected option
  OPTIONS.forEach(function (_, j) {
    const el = document.getElementById('opt-' + qIndex + '-' + j);
    if (el) el.classList.toggle('selected', j === optIndex);
  });

  // Enable next button
  const nextBtn = document.getElementById('next-btn-' + qIndex);
  if (nextBtn) {
    nextBtn.style.opacity = '1';
    nextBtn.style.pointerEvents = 'auto';
  }
}

// ─── NEXT BUTTON ───
function goNext(currentIndex) {
  if (answers[currentIndex] === null) return;

  if (currentIndex < QUESTIONS.length - 1) {
    goTo(currentIndex + 1);
  } else {
    // All questions done — show submit
    document.querySelectorAll('.question-block').forEach(function (b) {
      b.style.display = 'none';
    });
    document.getElementById('submit-section').style.display = 'block';
    updateProgress(QUESTIONS.length);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ─── UPDATE PROGRESS BAR ───
function updateProgress(currentIndex) {
  const total    = QUESTIONS.length + 1; // +1 for user info step
  const done     = currentIndex + 1;     // +1 because step-0 is done
  const percent  = Math.round((currentIndex / QUESTIONS.length) * 100);

  const label   = document.getElementById('progress-label');
  const pct     = document.getElementById('progress-percent');
  const fill    = document.getElementById('quiz-progress-fill');

  if (currentIndex >= QUESTIONS.length) {
    if (label) label.textContent = 'All questions answered';
    if (pct)   pct.textContent   = '100% complete';
    if (fill)  fill.style.width  = '100%';
  } else {
    if (label) label.textContent = 'Question ' + (currentIndex + 1) + ' of ' + QUESTIONS.length;
    if (pct)   pct.textContent   = percent + '% complete';
    if (fill)  fill.style.width  = percent + '%';
  }
}

// ─── SUBMIT ───
function submitQuiz() {
  // Check all answered
  const unanswered = answers.indexOf(null);
  if (unanswered !== -1) {
    alert('Please answer question ' + (unanswered + 1) + ' before submitting.');
    goTo(unanswered);
    return;
  }

  const totalScore = answers.reduce(function (sum, s) { return sum + s; }, 0);
  const name  = document.getElementById('user-name').value.trim();
  const email = document.getElementById('user-email').value.trim();

  // Store in sessionStorage so result page can read it
  sessionStorage.setItem('mhResult', JSON.stringify({
    name:        name,
    email:       email,
    totalScore:  totalScore,
    answers:     answers
  }));

  // Create a form dynamically and send to Flask
const form = document.createElement('form');
form.method = 'POST';
form.action = '/submit';

// Add name + email
const nameInput = document.createElement('input');
nameInput.type = 'hidden';
nameInput.name = 'user_name';
nameInput.value = name;
form.appendChild(nameInput);

const emailInput = document.createElement('input');
emailInput.type = 'hidden';
emailInput.name = 'user_email';
emailInput.value = email;
form.appendChild(emailInput);

// Add all answers
answers.forEach((score, index) => {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = `q${index + 1}`;
  input.value = score;
  form.appendChild(input);
});

// Submit form
document.body.appendChild(form);
form.submit();
}

// ─── INIT: show step-0 on load ───
document.addEventListener('DOMContentLoaded', function () {
  updateProgress(0);
});