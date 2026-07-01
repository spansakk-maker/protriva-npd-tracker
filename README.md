# Multi Timezone Digital Clock

This is a lightweight client-side web app that shows the current time in multiple time zones. It uses the browser's Intl API to format times and allows you to add and remove time zones. Selections persist in localStorage.

How to use

- Open `index.html` in a modern browser (Chrome, Firefox, Edge, Safari).
- Type or choose an IANA time zone (e.g., `America/New_York`, `Europe/London`, `Asia/Tokyo`), or choose `Local` or `UTC`, then click Add.
- Remove a time zone by clicking the ✕ button on a card.

Files added
- `index.html` — the UI page
- `styles.css` — styling
- `script.js` — clock logic
- `README.md` — this file

Notes
- The app attempts to call `Intl.supportedValuesOf('timeZone')` to populate the time zone suggestions. If the browser does not support that API, a short fallback list of common zones is used.
- This is pure client-side code (no build step).

You can preview by opening `index.html` in the repository root in your browser.