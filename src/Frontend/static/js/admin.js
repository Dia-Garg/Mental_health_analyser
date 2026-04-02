/* MindCheck — admin.js */

const SEVERITY_COLORS = {
  'Low':      'stable',
  'Moderate': 'mild',
  'High':     'moderate',
  'Critical': 'severe'
};

// ─── LOAD ALL DATA ───
function loadData() {
  const container = document.getElementById('table-container');
  container.innerHTML = '<p class="admin-empty">Loading...</p>';

  fetch('http://127.0.0.1:5000/api/admin/assessments')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.error) {
        container.innerHTML = '<p class="admin-empty">Error: ' + data.error + '</p>';
        return;
      }
      renderStats(data);
      renderTable(data.assessments);
    })
    .catch(function () {
      container.innerHTML = '<p class="admin-empty">Could not connect to backend. Make sure Flask is running on port 5000.</p>';
    });
}

// ─── RENDER STATS ───
function renderStats(data) {
  document.getElementById('stat-users').textContent       = data.total_users;
  document.getElementById('stat-assessments').textContent = data.total_assessments;
  document.getElementById('stat-avg').textContent         = data.avg_score || '—';
  document.getElementById('stat-common').textContent      = data.most_common || '—';
}

// ─── RENDER TABLE ───
function renderTable(rows) {
  const container = document.getElementById('table-container');

  if (!rows || rows.length === 0) {
    container.innerHTML = '<p class="admin-empty">No assessments submitted yet.</p>';
    return;
  }

  const rowsHTML = rows.map(function (r) {
    const colorKey = SEVERITY_COLORS[r.severity_level] || 'stable';
    const date     = new Date(r.submission_date).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

    return `<tr>
      <td>${r.assessment_id}</td>
      <td>${r.user_name}</td>
      <td class="admin-email">${r.user_email}</td>
      <td><strong>${r.total_score}</strong></td>
      <td><span class="admin-badge ${colorKey}">${r.status_category}</span></td>
      <td>${r.severity_level}</td>
      <td>${date}</td>
    </tr>`;
  }).join('');

  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Score</th>
          <th>Category</th>
          <th>Severity</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>${rowsHTML}</tbody>
    </table>`;
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', loadData);