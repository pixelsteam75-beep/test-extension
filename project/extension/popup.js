const modeDisplay = document.getElementById('modeDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const startFocusBtn = document.getElementById('startFocusBtn');
const startBreakBtn = document.getElementById('startBreakBtn');
const resetBtn = document.getElementById('resetBtn');
const openDashboardBtn = document.getElementById('openDashboardBtn');

function formatTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateDisplay(state) {
  const modeText = {
    'idle': 'Idle',
    'focus': 'Focus Session',
    'break': 'Break Time'
  };

  modeDisplay.textContent = modeText[state.mode] || 'Idle';
  timeDisplay.textContent = formatTime(state.remaining || 0);

  startFocusBtn.disabled = state.mode !== 'idle';
  startBreakBtn.disabled = state.mode !== 'idle';
  resetBtn.disabled = state.mode === 'idle';
}

async function refreshTimer() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'GET_TIMER_STATE' });
    updateDisplay(response);
  } catch (error) {
    console.error('Error refreshing timer:', error);
  }
}

startFocusBtn.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ action: 'START_FOCUS' });
  await refreshTimer();
});

startBreakBtn.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ action: 'START_BREAK' });
  await refreshTimer();
});

resetBtn.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ action: 'RESET_TIMER' });
  await refreshTimer();
});

openDashboardBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

refreshTimer();
setInterval(refreshTimer, 1000);
