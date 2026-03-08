# Pixel Wellness App

A super-minimal Chrome Extension (Manifest V3) that tracks your active tab time by domain and includes a Pomodoro timer with a dashboard. All data is stored locally.

## Features

- **Activity Tracking**: Automatically tracks time spent on each domain while browsing
- **Pomodoro Timer**: Focus sessions (25 min) and breaks (5 min) with notifications
- **Dashboard**: View today's total tracked time, completed focus sessions, and top 10 domains
- **100% Local**: All data stored in Chrome's local storage, no accounts or cloud sync

## Installation

### Load as Unpacked Extension

1. **Download or Clone**
   - Download this extension folder to your computer

2. **Open Chrome Extensions**
   - Open Chrome and navigate to `chrome://extensions/`
   - Or go to Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to and select the `extension` folder containing `manifest.json`

5. **Verify Installation**
   - The extension icon should appear in your toolbar
   - You should see "Wellness MVP Tracker" in your extensions list

## Usage

### Pomodoro Timer (Popup)

1. Click the extension icon in your toolbar to open the popup
2. Click "Start Focus (25m)" to begin a 25-minute focus session
3. Click "Start Break (5m)" to begin a 5-minute break
4. Click "Reset" to stop the current timer
5. You'll receive a notification when your timer ends

### Dashboard (Options Page)

1. Right-click the extension icon and select "Options"
   - Or click "Open Dashboard" in the popup
2. View:
   - Total tracked time today
   - Number of completed focus sessions
   - Top 10 domains you visited today with time spent

### Automatic Activity Tracking

The extension automatically tracks:
- Active tab time by domain
- Only tracks when Chrome is focused
- Pauses when you switch to another window
- Resets daily at midnight

## Data Storage

All data is stored locally using Chrome's `chrome.storage.local`:
- Daily totals reset automatically each day
- No data leaves your computer
- No accounts or sign-up required
- No analytics or tracking

## Permissions

The extension requires:
- `storage`: Store timer state and activity data locally
- `alarms`: Run Pomodoro timer in background
- `notifications`: Alert you when timer completes
- `tabs`: Track active tab for time tracking
- `<all_urls>`: Read domain names for activity tracking

## Technical Details

- **Manifest Version**: V3
- **Background**: Service Worker (background.js)
- **Storage**: chrome.storage.local only
- **Timer**: Uses chrome.alarms API
- **No external dependencies**

## Privacy

- All data stays on your device
- No network requests
- No user accounts
- No data collection or analytics
- Open source and auditable

## Development

The extension consists of:
- `manifest.json` - Extension configuration
- `background.js` - Service worker for tracking and timer logic
- `popup.html/js/css` - Timer controls UI
- `options.html/js/css` - Dashboard UI
- Icon files (16x16, 48x48, 128x128)

## Troubleshooting

**Timer doesn't persist after closing Chrome**
- Make sure Chrome is allowed to run in the background in system settings

**Activity not tracking**
- The extension only tracks regular web pages (not chrome:// or extension pages)
- Make sure the extension has proper permissions

**Notifications not showing**
- Check Chrome notification settings
- Make sure notifications are enabled for Chrome in your OS settings

## License

MIT
## Audio 
https://pixabay.com/sound-effects/musical-lo-fi-alarm-clock-243766/
https://pixabay.com/sound-effects/film-special-effects-alarm-327234/
