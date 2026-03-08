// Offscreen document for audio playback
// This runs in a DOM context so it can play audio properly

let currentAudio = null;

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'PLAY_ALARM') {
    try {
      // Stop any currently playing alarm
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }

      // Play the specified alarm sound
      const alarmFile = message.alarmType === 'loud' ? 'alarm-loud.mp3' : 'alarm-quiet.mp3';
      currentAudio = new Audio(chrome.runtime.getURL(alarmFile));
      currentAudio.volume = 0.7;
      
      await currentAudio.play();
      console.log('Alarm sound played:', alarmFile);
      
      // Clean up after playing
      currentAudio.onended = () => {
        currentAudio = null;
      };
      
      sendResponse({ success: true });
    } catch (error) {
      console.error('Alarm playback error:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true; // Required for async response
  }
  
  if (message.type === 'PLAY_BEEP') {
    try {
      // Fallback beep using Web Audio API
      const audioContext = new AudioContext();
      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.frequency.value = message.frequency || 880;
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + (message.duration || 0.3));

      osc.start(now);
      osc.stop(now + (message.duration || 0.3));
      
      console.log('Beep played:', message.frequency);
      sendResponse({ success: true });
    } catch (error) {
      console.error('Beep playback error:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }
});

console.log('Offscreen document loaded and ready for audio playback');
