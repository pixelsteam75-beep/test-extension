const totalTimeEl = document.getElementById('totalTime');
const focusSessionsEl = document.getElementById('focusSessions');
const domainsTableBody = document.getElementById('domainsTableBody');

function formatDuration(ms) {
  const totalMinutes = Math.floor(ms / 60000);
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

async function loadStats() {
  try {
    const stats = await chrome.runtime.sendMessage({ action: 'GET_TODAY_STATS' });

    totalTimeEl.textContent = formatDuration(stats.totalMs);
    focusSessionsEl.textContent = stats.focusSessionsCompleted;

    if (stats.topDomains.length === 0) {
      domainsTableBody.innerHTML = '<tr><td colspan="3" class="empty-state">No activity tracked yet today</td></tr>';
      return;
    }

    domainsTableBody.innerHTML = stats.topDomains
      .map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td class="domain-name">${item.domain}</td>
          <td>${formatDuration(item.ms)}</td>
        </tr>
      `)
      .join('');
  } catch (error) {
    console.error('Error loading stats:', error);
    domainsTableBody.innerHTML = '<tr><td colspan="3" class="empty-state">Error loading stats</td></tr>';
  }
}

loadStats();
setInterval(loadStats, 5000);
