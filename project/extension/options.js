const totalTimeEl = document.getElementById('totalTime');
const focusSessionsEl = document.getElementById('focusSessions');
const domainsTableBody = document.getElementById('domainsTableBody');
const weeklySummaryEl = document.getElementById('weeklySummary');
const recommendationsEl = document.getElementById('recommendationsSection');
const quoteTextEl = document.getElementById('quoteText');
const quoteAuthorEl = document.getElementById('quoteAuthor');

function formatDuration(ms) {
  const totalMinutes = Math.floor(ms / 60000);
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function drawWeeklyChart(weeklyStats) {
  const canvas = document.getElementById('weeklyChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.parentElement.offsetWidth;
  const height = 300;

  canvas.width = width;
  canvas.height = height;

  const dates = Object.keys(weeklyStats).sort();

  if (dates.length === 0) {
    ctx.fillStyle = '#9ca3af';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No data yet — start browsing to track your activity', width / 2, height / 2);
    return;
  }

  const barWidth = width / 8;
  const categories = ['Productivity', 'Social', 'News', 'Shopping', 'Entertainment'];
  const colors = {
    Productivity: '#10b981',
    Social: '#3b82f6',
    News: '#f59e0b',
    Shopping: '#f97316',
    Entertainment: '#a855f7'
  };

  const maxTime = Math.max(
    ...dates.map(date => weeklyStats[date].totalMs),
    1
  );

  dates.forEach((date, index) => {
    const stats = weeklyStats[date];
    const x = index * barWidth + barWidth / 2;
    let stackedHeight = 0;

    categories.forEach(category => {
      const categoryMs = stats[category] || 0;
      if (categoryMs > 0) {
        const barHeight = (categoryMs / maxTime) * (height - 60);
        ctx.fillStyle = colors[category];
        ctx.fillRect(x - 20, height - 40 - stackedHeight - barHeight, 40, barHeight);
        stackedHeight += barHeight;
      }
    });

    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dayName, x, height - 10);
  });

  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, height - 40);
  ctx.lineTo(width, height - 40);
  ctx.stroke();

  let legendY = 20;
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  categories.forEach((category) => {
    ctx.fillStyle = colors[category];
    ctx.fillRect(10, legendY - 8, 12, 12);
    ctx.fillStyle = '#6b7280';
    ctx.fillText(category, 28, legendY);
    legendY += 18;
  });
}

function generateRecommendations(weeklyStats) {
  const recommendations = [];
  const dates = Object.keys(weeklyStats).sort();

  let totalSocial = 0;
  let totalProductive = 0;
  let totalNews = 0;
  let totalFocus = 0;
  let topDay = null;
  let topDayTime = 0;

  dates.forEach(date => {
    const stats = weeklyStats[date];
    totalSocial += stats.Social || 0;
    totalProductive += stats.Productivity || 0;
    totalNews += stats.News || 0;
    totalFocus += stats.focusSessionsCompleted;

    const dayTotal = stats.totalMs;
    if (dayTotal > topDayTime) {
      topDayTime = dayTotal;
      topDay = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    }
  });

  const totalTime = totalSocial + totalProductive + totalNews;
  const socialPercentage = totalTime > 0 ? (totalSocial / totalTime) * 100 : 0;
  const newsPercentage = totalTime > 0 ? (totalNews / totalTime) * 100 : 0;

  if (socialPercentage > 40) {
    recommendations.push({
      title: 'Reduce Distractions',
      text: `You spent ${Math.round(socialPercentage)}% of your time on social sites this week. Try blocking distractions during your first 2 hours of work.`
    });
  }

  if (newsPercentage > 30) {
    recommendations.push({
      title: 'News Consumption High',
      text: `You spent ${Math.round(newsPercentage)}% of your time reading news. Consider batching news reading into dedicated time blocks.`
    });
  }

  if (totalFocus > 20) {
    recommendations.push({
      title: 'Great Momentum!',
      text: `You completed ${totalFocus} focus sessions this week. Keep the momentum going—consistent focus sessions lead to better productivity!`
    });
  }

  const emptyDays = dates.filter(date => weeklyStats[date].totalMs === 0).length;

  if (emptyDays > 0) {
    const dayNames = dates
      .filter(date => weeklyStats[date].totalMs === 0)
      .map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' }))
      .join(', ');
    recommendations.push({
      title: 'Tracking Gaps Detected',
      text: `You had gaps in tracking on ${dayNames}. Make sure the extension is active during your work sessions.`
    });
  }

  if (recommendations.length === 0 && topDay) {
    recommendations.push({
      title: 'Keep It Up!',
      text: `You're maintaining a healthy balance this week. Your most productive day was ${topDay}—keep leveraging what works!`
    });
  }

  return recommendations.slice(0, 3);
}

async function loadStats() {
  try {
    const stats = await chrome.runtime.sendMessage({ action: 'GET_TODAY_STATS' });

    totalTimeEl.textContent = formatDuration(stats.totalMs);
    focusSessionsEl.textContent = stats.focusSessionsCompleted;

    if (stats.topDomains.length === 0) {
      domainsTableBody.innerHTML = '<tr><td colspan="3" class="empty-state">No activity tracked yet today</td></tr>';
    } else {
      domainsTableBody.innerHTML = stats.topDomains
        .map((item) => `
          <tr>
            <td>${item.category}</td>
            <td class="domain-name">${item.displayName}</td>
            <td>${formatDuration(item.ms)}</td>
          </tr>
        `)
        .join('');
    }
  } catch (error) {
    console.error('Error loading stats:', error);
    domainsTableBody.innerHTML = '<tr><td colspan="3" class="empty-state">Error loading stats</td></tr>';
  }
}

async function loadWeeklyStats() {
  try {
    const weeklyStats = await chrome.runtime.sendMessage({ action: 'GET_WEEKLY_STATS' });

    drawWeeklyChart(weeklyStats);

    const dates = Object.keys(weeklyStats).sort();
    let totalProductive = 0;
    let totalFocus = 0;

    dates.forEach(date => {
      totalProductive += weeklyStats[date].Productivity || 0;
      totalFocus += weeklyStats[date].focusSessionsCompleted;
    });

    weeklySummaryEl.innerHTML = `
      <div>Total productive time: ${formatDuration(totalProductive)} | Focus sessions: ${totalFocus}</div>
    `;

    const recommendations = generateRecommendations(weeklyStats);
    recommendationsEl.innerHTML = recommendations
      .map(rec => `
        <div class="recommendation-card">
          <h3>${rec.title}</h3>
          <p>${rec.text}</p>
        </div>
      `)
      .join('');
  } catch (error) {
    console.error('Error loading weekly stats:', error);
  }
}

async function loadQuote() {
  try {
    const quote = await chrome.runtime.sendMessage({ action: 'GET_DAILY_QUOTE' });
    quoteTextEl.textContent = `"${quote.text}"`;
    quoteAuthorEl.textContent = `— ${quote.author}`;
  } catch (error) {
    console.error('Error loading quote:', error);
  }
}

loadStats();
loadWeeklyStats();
loadQuote();
setInterval(loadStats, 5000);
