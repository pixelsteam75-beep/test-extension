const modeDisplay = document.getElementById('modeDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const startFocusBtn = document.getElementById('startFocusBtn');
const startBreakBtn = document.getElementById('startBreakBtn');
const resetBtn = document.getElementById('resetBtn');
const audioToggle = document.getElementById('audioToggle');
const openDashboardBtn = document.getElementById('openDashboardBtn');
const alarmSoundSelect = document.getElementById('alarmSound');

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

async function updateAudioToggle() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'GET_MUTE_STATE' });
    // Checked = audio ON (not muted), unchecked = audio OFF (muted)
    audioToggle.checked = !response.muteAudio;
  } catch (error) {
    console.error('Error updating audio toggle:', error);
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

audioToggle.addEventListener('change', async () => {
  // Toggle is checked = audio ON, unchecked = audio OFF (muted)
  const muteAudio = !audioToggle.checked;
  await chrome.runtime.sendMessage({ action: 'TOGGLE_MUTE' });
  await updateAudioToggle();
});

openDashboardBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// Load and save alarm sound preference
async function loadAlarmPreference() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'GET_ALARM_PREFERENCE' });
    if (response.alarmSound) {
      alarmSoundSelect.value = response.alarmSound;
    }
  } catch (error) {
    console.error('Error loading alarm preference:', error);
  }
}

alarmSoundSelect.addEventListener('change', async () => {
  try {
    await chrome.runtime.sendMessage({ 
      action: 'SET_ALARM_PREFERENCE', 
      alarmSound: alarmSoundSelect.value 
    });
  } catch (error) {
    console.error('Error saving alarm preference:', error);
  }
});

refreshTimer();
updateAudioToggle();
loadAlarmPreference();
setInterval(refreshTimer, 1000);
