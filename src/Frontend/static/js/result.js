/* MindCheck — result.js */

const CATEGORIES = [
  {
    min:         20,
    max:         60,
    key:         'stable',
    label:       'Stable',
    tagline:     'You appear to be in a good mental space right now.',
    description: 'Your responses suggest low levels of stress, anxiety, and emotional strain. You are managing daily life well and showing healthy coping patterns. Keep maintaining the habits and routines that are working for you.',
    recommendations: [
      'Maintain regular sleep and exercise routines',
      'Stay connected with friends and family',
      'Continue any mindfulness or relaxation practices',
      'Check in with yourself regularly'
    ],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
  },
  {
    min:         61,
    max:         110,
    key:         'mild',
    label:       'Mild Stress',
    tagline:     'You may be experiencing some stress or emotional tension.',
    description: 'Your responses indicate mild levels of stress or emotional imbalance. This is common and manageable. Small changes to your daily routine can make a meaningful difference to how you feel.',
    recommendations: [
      'Try short daily mindfulness or breathing exercises',
      'Ensure you are getting 7–8 hours of sleep',
      'Reduce caffeine and screen time before bed',
      'Talk to a friend or trusted person about how you feel'
    ],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 15h8M9 9h.01M15 9h.01"/></svg>`
  },
  {
    min:         111,
    max:         150,
    key:         'moderate',
    label:       'Moderate Distress',
    tagline:     'You are showing signs of noticeable emotional strain.',
    description: 'Your responses suggest moderate levels of stress and emotional difficulty. This level of distress is worth taking seriously. Consider reaching out for support — speaking to someone you trust or a professional can help significantly.',
    recommendations: [
      'Speak to a counsellor, therapist, or trusted adult',
      'Prioritise rest and avoid overcommitting',
      'Break tasks into smaller, manageable steps',
      'Limit news and social media consumption'
    ],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  },
  {
    min:         151,
    max:         180,
    key:         'severe',
    label:       'Severe Distress',
    tagline:     'Your responses indicate high levels of emotional distress.',
    description: 'Your answers suggest significant stress and emotional difficulty across multiple areas. Please know this result does not define you — but it does suggest that reaching out for professional support would be beneficial. You do not have to manage this alone.',
    recommendations: [
      'Speak to a mental health professional as soon as possible',
      'Contact a trusted person — a friend, family member, or counsellor',
      'If in immediate distress, contact a crisis helpline',
      'Be kind to yourself — seeking help is a sign of strength'
    ],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  }
];

// ─── MATCH SCORE TO CATEGORY ───
function getCategory(score) {
  return CATEGORIES.find(function (c) {
    return score >= c.min && score <= c.max;
  }) || CATEGORIES[CATEGORIES.length - 1];
}

// ─── RENDER RESULT ───
function renderResult(data) {
  const cat      = getCategory(data.totalScore);
  const container = document.getElementById('result-content');

  const recommendationsHTML = cat.recommendations.map(function (r) {
    return `<li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
      ${r}
    </li>`;
  }).join('');

  container.innerHTML = `
    <div class="result-card">
      <div class="result-icon ${cat.key}">${cat.icon}</div>
      <p class="result-name">Hi, ${data.name}</p>
      <h2 class="result-category">${cat.label}</h2>
      <p class="result-tagline">${cat.tagline}</p>
      <div class="result-score-bar-wrap">
        <div class="result-score-bar">
          <div class="result-score-fill" style="width: ${Math.round((data.totalScore / 180) * 100)}%"></div>
        </div>
        <span class="result-score-label">Score: ${data.totalScore} / 180</span>
      </div>
    </div>

    <div class="result-details">
      <h3>What this means</h3>
      <p>${cat.description}</p>
    </div>

    <div class="result-details">
      <h3>What you can do</h3>
      <ul class="honesty-list" style="margin-top: 0.5rem;">
        ${recommendationsHTML}
      </ul>
    </div>
  `;
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', function () {
  const raw = sessionStorage.getItem('mhResult');

  if (!raw) {
    // No data — redirect back
    document.getElementById('result-content').innerHTML = `
      <div class="result-card">
        <p style="color: var(--slate-mid); font-size: 0.95rem;">No assessment data found. Please complete the questionnaire first.</p>
      </div>`;
    return;
  }

  const data = JSON.parse(raw);
  renderResult(data);
});