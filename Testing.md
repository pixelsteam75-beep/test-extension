## esting & Known Issues

### Testing scope (MVP)

- Load unpacked extension in Chrome
- Start/stop Pomodoro timer
- Notification fires on timer completion
- Dashboard loads and displays:
    - Total tracked time today
    - Completed focus sessions
    - Top 10 domains
- Activity tracking only when Chrome is focused

### Test Results

**Test Results:** [5 passing /5 total].

### Known Issues

**Known Issue:** [Description + workaround].

Example:

- Timer notifications do not appear on some systems if Chrome notifications are disabled at OS level.
- **Workaround:** Enable notifications for Chrome in OS settings and Chrome site settings.

### Next Step (with more time)

**Next Step:** [What you would add with more time].

Examples:

- Add keyboard-only and screen reader smoke tests for popup + dashboard
- Add automated contrast checks in CI
- Add deterministic demo mode for reproducible metrics

## Accessibility (Section 508-aligned checks)

Pixel is a lightweight Chrome extension. For this MVP, our accessibility validation focuses on high-impact, feasible checks:

### What we validated

- **WCAG AA color contrast (web pages):** Dashboard and any web-based UI surfaces were checked for readable contrast (aiming for WCAG 2.1 AA).
- **Alt text for images:** All non-decorative images include descriptive `alt` text. Decorative images use empty alt (`alt=""`) so screen readers skip them.
- **Descriptive link text:** Links are written so they make sense out of context (avoid “click here”; use “Open Dashboard”, “View Privacy Notes”, etc.).
- **Demo video captions:** Demo videos include captions (burned-in or platform captions) so the walkthrough is accessible without audio.

### What we did NOT validate in this MVP

- Full keyboard-only navigation and screen reader testing (planned next iteration).
- Formal VPAT documentation (out of scope for hackathon MVP).

### Notes

The extension popup UI is minimal. Accessibility efforts are concentrated on the dashboard/web surfaces and content we present to judges/users.
