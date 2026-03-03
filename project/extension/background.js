const FOCUS_DURATION = 25 * 60 * 1000;
const BREAK_DURATION = 5 * 60 * 1000;
const ALARM_NAME = 'pomodoroTimer';

let currentSegment = null;

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function extractDomain(url) {
  if (!url) return 'unknown';
  try {
    const urlObj = new URL(url);
    return urlObj.hostname || 'unknown';
  } catch {
    return 'unknown';
  }
}

async function closeCurrentSegment() {
  if (!currentSegment) return;

  const now = Date.now();
  const elapsed = now - currentSegment.startTime;
  const domain = currentSegment.domain;

  const todayKey = getTodayKey();
  const result = await chrome.storage.local.get(['dailyTotals', 'todayKey']);

  let dailyTotals = result.dailyTotals || { date: todayKey, byDomain: {}, totalMs: 0 };

  if (result.todayKey !== todayKey) {
    dailyTotals = { date: todayKey, byDomain: {}, totalMs: 0 };
  }

  dailyTotals.byDomain[domain] = (dailyTotals.byDomain[domain] || 0) + elapsed;
  dailyTotals.totalMs += elapsed;

  await chrome.storage.local.set({ dailyTotals, todayKey });

  currentSegment = null;
}

async function startNewSegment(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      return;
    }

    const domain = extractDomain(tab.url);
    currentSegment = {
      domain,
      startTime: Date.now(),
      tabId
    };
  } catch (error) {
    console.error('Error starting segment:', error);
  }
}

async function handleTabActivated(activeInfo) {
  await closeCurrentSegment();
  await startNewSegment(activeInfo.tabId);
}

async function handleTabUpdated(tabId, changeInfo, tab) {
  if (currentSegment && currentSegment.tabId === tabId && changeInfo.url) {
    await closeCurrentSegment();
    await startNewSegment(tabId);
  }
}

async function handleWindowFocusChanged(windowId) {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await closeCurrentSegment();
  } else {
    const [tab] = await chrome.tabs.query({ active: true, windowId });
    if (tab) {
      await startNewSegment(tab.id);
    }
  }
}

async function startTimer(mode) {
  await closeCurrentSegment();

  const duration = mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION;
  const endsAt = Date.now() + duration;

  await chrome.storage.local.set({
    timerState: {
      mode,
      endsAt,
      lastUpdated: Date.now()
    }
  });

  await chrome.alarms.create(ALARM_NAME, {
    when: endsAt
  });
}

async function resetTimer() {
  await chrome.alarms.clear(ALARM_NAME);
  await chrome.storage.local.set({
    timerState: {
      mode: 'idle',
      endsAt: null,
      lastUpdated: Date.now()
    }
  });
}

async function handleAlarm(alarm) {
  if (alarm.name !== ALARM_NAME) return;

  const result = await chrome.storage.local.get(['timerState', 'focusStats', 'todayKey']);
  const timerState = result.timerState || { mode: 'idle' };
  const todayKey = getTodayKey();

  if (timerState.mode === 'focus') {
    let focusStats = result.focusStats || { date: todayKey, focusSessionsCompleted: 0 };

    if (result.todayKey !== todayKey) {
      focusStats = { date: todayKey, focusSessionsCompleted: 0 };
    }

    focusStats.focusSessionsCompleted += 1;
    await chrome.storage.local.set({ focusStats });

    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon128.png',
      title: 'Focus Session Complete!',
      message: 'Great work! Time for a 5-minute break.',
      priority: 2
    });
  } else if (timerState.mode === 'break') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon128.png',
      title: 'Break Complete!',
      message: 'Break is over. Ready for another focus session?',
      priority: 2
    });
  }

  await resetTimer();
}

async function getTimerState() {
  const result = await chrome.storage.local.get('timerState');
  const timerState = result.timerState || { mode: 'idle', endsAt: null, lastUpdated: Date.now() };

  if (timerState.mode !== 'idle' && timerState.endsAt) {
    const remaining = Math.max(0, timerState.endsAt - Date.now());
    if (remaining === 0) {
      await resetTimer();
      return { mode: 'idle', remaining: 0 };
    }
    return { mode: timerState.mode, remaining };
  }

  return { mode: 'idle', remaining: 0 };
}

async function getTodayStats() {
  const todayKey = getTodayKey();
  const result = await chrome.storage.local.get(['dailyTotals', 'focusStats', 'todayKey']);

  let dailyTotals = result.dailyTotals || { date: todayKey, byDomain: {}, totalMs: 0 };
  let focusStats = result.focusStats || { date: todayKey, focusSessionsCompleted: 0 };

  if (result.todayKey !== todayKey) {
    dailyTotals = { date: todayKey, byDomain: {}, totalMs: 0 };
    focusStats = { date: todayKey, focusSessionsCompleted: 0 };
  }

  const topDomains = Object.entries(dailyTotals.byDomain)
    .map(([domain, ms]) => ({ domain, ms }))
    .sort((a, b) => b.ms - a.ms)
    .slice(0, 10);

  return {
    totalMs: dailyTotals.totalMs,
    focusSessionsCompleted: focusStats.focusSessionsCompleted,
    topDomains
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      switch (message.action) {
        case 'GET_TIMER_STATE':
          const timerState = await getTimerState();
          sendResponse(timerState);
          break;

        case 'START_FOCUS':
          await startTimer('focus');
          sendResponse({ success: true });
          break;

        case 'START_BREAK':
          await startTimer('break');
          sendResponse({ success: true });
          break;

        case 'RESET_TIMER':
          await resetTimer();
          sendResponse({ success: true });
          break;

        case 'GET_TODAY_STATS':
          const stats = await getTodayStats();
          sendResponse(stats);
          break;

        default:
          sendResponse({ error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Message handler error:', error);
      sendResponse({ error: error.message });
    }
  })();

  return true;
});

chrome.tabs.onActivated.addListener(handleTabActivated);
chrome.tabs.onUpdated.addListener(handleTabUpdated);
chrome.windows.onFocusChanged.addListener(handleWindowFocusChanged);
chrome.alarms.onAlarm.addListener(handleAlarm);

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    await startNewSegment(tab.id);
  }
})();
