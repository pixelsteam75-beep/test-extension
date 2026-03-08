const FOCUS_DURATION = 25 * 60 * 1000;
const BREAK_DURATION = 5 * 60 * 1000;
const ALARM_NAME = 'pomodoroTimer';

const DOMAIN_CATEGORIES = {
  Productivity: new Set([
    'notion.so', 'asana.com', 'trello.com', 'monday.com', 'clickup.com',
    'basecamp.com', 'todoist.com', 'linear.app', 'height.app', 'airtable.com',
    'docs.google.com', 'sheets.google.com', 'slides.google.com', 'drive.google.com',
    'dropbox.com', 'box.com', 'confluence.atlassian.com', 'coda.io', 'craft.do',
    'slack.com', 'teams.microsoft.com', 'zoom.us', 'meet.google.com', 'whereby.com',
    'loom.com', 'calendly.com', 'cal.com',
    'github.com', 'gitlab.com', 'figma.com', 'canva.com', 'miro.com',
    'vercel.com', 'netlify.com', 'jira.atlassian.com', 'bitbucket.org',
    'coursera.org', 'udemy.com', 'skillshare.com', 'khanacademy.org', 'pluralsight.com',
    'claude.ai', 'chatgpt.com', 'gemini.google.com', 'perplexity.ai',
    'copilot.microsoft.com', 'midjourney.com',
    'mail.google.com', 'outlook.live.com', 'calendar.google.com',
    'proton.me', 'superhuman.com', 'stackoverflow.com'
  ]),
  Social: new Set([
    'twitter.com', 'x.com', 'instagram.com', 'facebook.com', 'reddit.com',
    'tiktok.com', 'youtube.com', 'linkedin.com', 'snapchat.com', 'pinterest.com',
    'threads.net', 'tumblr.com', 'discord.com', 'twitch.tv', 'mastodon.social',
    'bluesky.app', 'bereal.com', 'clubhouse.com', 'nextdoor.com', 'quora.com'
  ]),
  News: new Set([
    'nytimes.com', 'washingtonpost.com', 'theguardian.com', 'bbc.com', 'bbc.co.uk',
    'cnn.com', 'msnbc.com', 'foxnews.com', 'npr.org', 'apnews.com',
    'reuters.com', 'bloomberg.com', 'wsj.com', 'theatlantic.com', 'axios.com',
    'politico.com', 'techcrunch.com', 'theverge.com', 'wired.com', 'arstechnica.com',
    'hackernews.com', 'news.ycombinator.com', 'medium.com', 'substack.com'
  ]),
  Shopping: new Set([
    'amazon.com', 'ebay.com', 'etsy.com', 'walmart.com', 'target.com',
    'bestbuy.com', 'wayfair.com', 'shopify.com', 'shop.app', 'wish.com',
    'aliexpress.com', 'costco.com', 'newegg.com'
  ]),
  Entertainment: new Set([
    'netflix.com', 'hulu.com', 'disneyplus.com', 'hbomax.com', 'max.com',
    'peacocktv.com', 'paramountplus.com', 'spotify.com', 'apple.com',
    'music.apple.com', 'pandora.com', 'soundcloud.com', 'vimeo.com',
    'crunchyroll.com', 'funimation.com'
  ])
};

const BRAND_NAMES = {
  'notion': 'Notion', 'asana': 'Asana', 'trello': 'Trello',
  'monday': 'Monday', 'clickup': 'ClickUp', 'basecamp': 'Basecamp',
  'todoist': 'Todoist', 'linear': 'Linear', 'airtable': 'Airtable',
  'slack': 'Slack', 'zoom': 'Zoom', 'loom': 'Loom',
  'calendly': 'Calendly', 'github': 'GitHub', 'gitlab': 'GitLab',
  'figma': 'Figma', 'canva': 'Canva', 'miro': 'Miro',
  'vercel': 'Vercel', 'netlify': 'Netlify',
  'twitter': 'Twitter', 'x': 'X', 'instagram': 'Instagram',
  'facebook': 'Facebook', 'reddit': 'Reddit', 'tiktok': 'TikTok',
  'youtube': 'YouTube', 'linkedin': 'LinkedIn', 'snapchat': 'Snapchat',
  'pinterest': 'Pinterest', 'threads': 'Threads', 'discord': 'Discord',
  'twitch': 'Twitch',
  'nytimes': 'NY Times', 'washingtonpost': 'Washington Post',
  'theguardian': 'The Guardian', 'bbc': 'BBC', 'cnn': 'CNN',
  'npr': 'NPR', 'bloomberg': 'Bloomberg', 'wsj': 'WSJ',
  'techcrunch': 'TechCrunch', 'theverge': 'The Verge',
  'netflix': 'Netflix', 'spotify': 'Spotify', 'hulu': 'Hulu',
  'disneyplus': 'Disney+', 'soundcloud': 'SoundCloud',
  'stackoverflow': 'Stack Overflow', 'dev': 'Dev.to',
  'gmail': 'Gmail', 'google': 'Google', 'amazon': 'Amazon'
};

const MOTIVATIONAL_QUOTES = [
  { text: "I am deliberate and afraid of nothing.", author: "Audre Lorde" },
  { text: "When you learn, teach. When you get, give.", author: "Maya Angelou" },
  { text: "Do not live someone else's life and someone else's idea of what womanhood is.", author: "Viola Davis" },
  { text: "Step out of the history that is holding you back. Step into the new story you are willing to create.", author: "Oprah Winfrey" },
  { text: "I had to make my own living and my own opportunity. Don't sit down and wait for opportunities to come. Get up and make them.", author: "Madam C.J. Walker" },
  { text: "Just don't give up trying to do what you really want to do. Where there is love and inspiration, I don't think you can go wrong.", author: "Ella Fitzgerald" },
  { text: "We need to reshape our own perception of how we view ourselves.", author: "Beyoncé" },
  { text: "No matter what accomplishments you make, somebody helps you.", author: "Althea Gibson" },
  { text: "The most common way people give up their power is by thinking they don't have any.", author: "Alice Walker" },
  { text: "I have learned over the years that when one's mind is made up, this diminishes fear.", author: "Rosa Parks" },
  { text: "If you are always trying to be normal, you will never know how amazing you can be.", author: "Maya Angelou" },
  { text: "I never lose. I either win or learn.", author: "Attributed to Nelson Mandela, popularized by Simone Biles" },
  { text: "Bring your whole self to every moment.", author: "Michelle Obama" },
  { text: "It's not the load that breaks you down, it's the way you carry it.", author: "Lena Horne" },
  { text: "You can't be hesitant about who you are.", author: "Viola Davis" },
  { text: "I am not afraid of storms, for I am learning how to sail my ship.", author: "Ida B. Wells" },
  { text: "Success is only meaningful and enjoyable if it feels like your own.", author: "Michelle Obama" },
  { text: "When I dare to be powerful, to use my strength in the service of my vision, then it becomes less and less important whether I am afraid.", author: "Audre Lorde" },
  { text: "Think like a queen. A queen is not afraid to fail. Failure is another stepping stone to greatness.", author: "Oprah Winfrey" },
  { text: "You may not control all the events that happen to you, but you can decide not to be reduced by them.", author: "Maya Angelou" },
  { text: "I had to stop letting people define me. I am who I say I am.", author: "Serena Williams" },
  { text: "I'm not going to limit myself just because people won't accept the fact that I can do something else.", author: "Missy Elliott" },
  { text: "The question isn't who's going to let me — it's who's going to stop me.", author: "Shirley Chisholm" },
  { text: "Definitions belong to the definers, not the defined.", author: "Toni Morrison" },
  { text: "You are not a mistake. You are not a problem to be solved.", author: "Nayyirah Waheed" },
  { text: "Do not wait for someone else to come and speak for you. It's you who can change the world.", author: "Issa Rae" },
  { text: "We realized the importance of our voices only when we were silenced.", author: "Tarana Burke" },
  { text: "I am my best work — a series of road maps, reports, recipes, and instructions for my survivors.", author: "Audre Lorde" },
  { text: "I never intended to become a run-of-the-mill person.", author: "Barbara Jordan" },
  { text: "Don't wait around for other people to be happy for you. Any happiness you get you've got to make yourself.", author: "Alice Walker" },
  { text: "If you don't like something, change it. If you can't change it, change your attitude.", author: "Maya Angelou" },
  { text: "Excellence is the best deterrent to racism or sexism.", author: "Oprah Winfrey" },
  { text: "You have to know what sparks the light in you so that you, in your own way, can illuminate the world.", author: "Oprah Winfrey" },
  { text: "I am not free while any woman is unfree, even when her shackles are very different from my own.", author: "Audre Lorde" },
  { text: "The thing women have yet to learn is nobody gives you power. You just take it.", author: "Roseanne Barr" },
  { text: "Greatness is not a destination but a continuous journey that never ends.", author: "Serena Williams" },
  { text: "There is always light. If only we're brave enough to see it. If only we're brave enough to be it.", author: "Amanda Gorman" },
  { text: "The work of your life is to discover your purpose and get on with the business of living it out.", author: "Oprah Winfrey" },
  { text: "You wanna fly, you got to give up the thing that weighs you down.", author: "Toni Morrison" },
  { text: "I was born to make history.", author: "Simone Biles" },
  { text: "I have a lot of things to prove to myself. One is that I can live my life fearlessly.", author: "Oprah Winfrey" },
  { text: "Your crown has been bought and paid for. Put it on your head and wear it.", author: "Maya Angelou" },
  { text: "We must always attempt to lift as we climb.", author: "Angela Davis" },
  { text: "Don't be afraid. Be focused. Be determined. Be hopeful. Be empowered.", author: "Michelle Obama" },
  { text: "I'm living proof that dreams do come true.", author: "Misty Copeland" },
  { text: "What I know for sure is that speaking your truth is the most powerful tool we all have.", author: "Oprah Winfrey" },
  { text: "Even if it makes others uncomfortable, I will love who I am.", author: "Janelle Monáe" },
  { text: "You can't use up creativity. The more you use, the more you have.", author: "Maya Angelou" },
  { text: "Power is not given to you. You have to take it.", author: "Beyoncé" },
  { text: "Above all, be the heroine of your life, not the victim.", author: "Nora Ephron" },
  { text: "If they don't give you a seat at the table, bring a folding chair.", author: "Shirley Chisholm" }
];

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

function formatDomainName(domain) {
  let name = domain.replace(/^www\./, '');
  const parts = name.split('.');
  const baseName = parts[0];

  if (BRAND_NAMES[baseName]) {
    return BRAND_NAMES[baseName];
  }

  if (BRAND_NAMES[domain]) {
    return BRAND_NAMES[domain];
  }

  return baseName.charAt(0).toUpperCase() + baseName.slice(1);
}

function getCategoryForDomain(domain) {
  for (const [category, domains] of Object.entries(DOMAIN_CATEGORIES)) {
    if (domains.has(domain)) {
      return category;
    }
  }
  return 'Other';
}

// Offscreen document management
let creatingOffscreen;

async function ensureOffscreen() {
  const url = chrome.runtime.getURL('offscreen.html');

  const contexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [url],
  });

  if (contexts.length > 0) return;

  if (!creatingOffscreen) {
    creatingOffscreen = chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Play timer notification sound',
    });

    await creatingOffscreen;
    creatingOffscreen = null;
  } else {
    await creatingOffscreen;
  }
}

async function playAlarmSound() {
  try {
    // Ensure offscreen document is created
    await ensureOffscreen();

    // Get alarm preference
    const result = await chrome.storage.local.get('alarmSound');
    const alarmType = result.alarmSound || 'quiet'; // Default to quiet

    // Send message to offscreen document to play alarm
    await chrome.runtime.sendMessage({
      type: 'PLAY_ALARM',
      alarmType: alarmType
    });
    
    console.log('Alarm sound requested:', alarmType);
  } catch (error) {
    console.error('Alarm sound playback error:', error);
    // Fallback to beep sound if offscreen fails
    try {
      await ensureOffscreen();
      await chrome.runtime.sendMessage({
        type: 'PLAY_BEEP',
        frequency: 880,
        duration: 0.3
      });
      setTimeout(async () => {
        await chrome.runtime.sendMessage({
          type: 'PLAY_BEEP',
          frequency: 1046.5,
          duration: 0.3
        });
      }, 200);
    } catch (fallbackError) {
      console.error('Beep fallback also failed:', fallbackError);
    }
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

  const updateObj = { dailyTotals, todayKey };
  updateObj[`dailyTotals_${todayKey}`] = dailyTotals;

  await chrome.storage.local.set(updateObj);

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

  const result = await chrome.storage.local.get('muteAudio');
  if (!result.muteAudio) {
    try {
      await ensureOffscreen();
      if (mode === 'focus') {
        await chrome.runtime.sendMessage({
          type: 'PLAY_BEEP',
          frequency: 523.25,
          duration: 0.3
        });
      } else {
        await chrome.runtime.sendMessage({
          type: 'PLAY_BEEP',
          frequency: 659.25,
          duration: 0.2
        });
        setTimeout(async () => {
          await chrome.runtime.sendMessage({
            type: 'PLAY_BEEP',
            frequency: 783.99,
            duration: 0.2
          });
        }, 150);
      }
    } catch (error) {
      console.error('Start timer sound error:', error);
    }
  }

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

  const result = await chrome.storage.local.get(['timerState', 'focusStats', 'todayKey', 'muteAudio']);
  const timerState = result.timerState || { mode: 'idle' };
  const todayKey = getTodayKey();

  if (timerState.mode === 'focus') {
    let focusStats = result.focusStats || { date: todayKey, focusSessionsCompleted: 0 };

    if (result.todayKey !== todayKey) {
      focusStats = { date: todayKey, focusSessionsCompleted: 0 };
    }

    focusStats.focusSessionsCompleted += 1;
    await chrome.storage.local.set({ focusStats });

    if (!result.muteAudio) {
      await playAlarmSound();
    }

    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon128.png',
      title: 'Focus Session Complete!',
      message: 'Great work! Time for a 5-minute break.',
      priority: 2
    });
  } else if (timerState.mode === 'break') {
    if (!result.muteAudio) {
      await playAlarmSound();
    }

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

  const byCategory = { Productivity: 0, Social: 0, News: 0, Shopping: 0, Entertainment: 0, Other: 0 };
  const topDomains = Object.entries(dailyTotals.byDomain)
    .map(([domain, ms]) => {
      const category = getCategoryForDomain(domain);
      byCategory[category] += ms;
      return {
        domain,
        displayName: formatDomainName(domain),
        category,
        ms
      };
    })
    .sort((a, b) => b.ms - a.ms)
    .slice(0, 10);

  return {
    totalMs: dailyTotals.totalMs,
    focusSessionsCompleted: focusStats.focusSessionsCompleted,
    topDomains,
    byCategory
  };
}

async function getWeeklyStats() {
  const stats = {};
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const result = await chrome.storage.local.get([`dailyTotals_${key}`, `focusStats_${key}`]);
    const dailyTotals = result[`dailyTotals_${key}`] || { byDomain: {}, totalMs: 0 };
    const focusStats = result[`focusStats_${key}`] || { focusSessionsCompleted: 0 };

    const categoryMs = { Productivity: 0, Social: 0, News: 0, Shopping: 0, Entertainment: 0, Other: 0 };

    Object.entries(dailyTotals.byDomain || {}).forEach(([domain, ms]) => {
      const category = getCategoryForDomain(domain);
      categoryMs[category] += ms;
    });

    stats[key] = {
      date: key,
      totalMs: dailyTotals.totalMs,
      ...categoryMs,
      focusSessionsCompleted: focusStats.focusSessionsCompleted
    };
  }

  return stats;
}

async function getDailyQuote() {
  const todayKey = getTodayKey();
  const result = await chrome.storage.local.get(['lastQuoteDate', 'quoteIndex']);

  let quoteIndex = result.quoteIndex || 0;

  if (result.lastQuoteDate !== todayKey) {
    quoteIndex = (quoteIndex + 1) % MOTIVATIONAL_QUOTES.length;
    await chrome.storage.local.set({
      lastQuoteDate: todayKey,
      quoteIndex
    });
  }

  return MOTIVATIONAL_QUOTES[quoteIndex];
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

        case 'GET_WEEKLY_STATS':
          const weeklyStats = await getWeeklyStats();
          sendResponse(weeklyStats);
          break;

        case 'TOGGLE_MUTE':
          const result = await chrome.storage.local.get('muteAudio');
          const newMuteState = !result.muteAudio;
          await chrome.storage.local.set({ muteAudio: newMuteState });
          sendResponse({ muteAudio: newMuteState });
          break;

        case 'GET_MUTE_STATE':
          const muteResult = await chrome.storage.local.get('muteAudio');
          sendResponse({ muteAudio: muteResult.muteAudio || false });
          break;

        case 'GET_DAILY_QUOTE':
          const quote = await getDailyQuote();
          sendResponse(quote);
          break;

        case 'GET_ALARM_PREFERENCE':
          const alarmPref = await chrome.storage.local.get('alarmSound');
          sendResponse({ alarmSound: alarmPref.alarmSound || 'quiet' });
          break;

        case 'SET_ALARM_PREFERENCE':
          await chrome.storage.local.set({ alarmSound: message.alarmSound });
          sendResponse({ success: true });
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
