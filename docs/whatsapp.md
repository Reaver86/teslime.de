# WhatsApp instructions from Dad

**“WhatsApp + timeframe”** means: read **Otto Schuster** (Dad) in the already
open native WhatsApp app. Do not ask which app or contact. Access is read-only:
never send messages or react.

Start directly with the tested native-app connection:

```js
let app = await cua.getApp("net.whatsapp.WhatsApp");
```

- Check the chat header is **Otto Schuster**; select his chat if needed.
- Locate the requested dates in the conversation. Use the current date and
  user's timezone for “today”/“yesterday”.
- Scroll the **ChatMessagesTableView** conversation pane, using its current
  accessibility index or screenshot coordinates. Read in overlapping steps;
  refresh with `await app.getAXState()` after each action group.
- Use `await app.getScreenshot()` to read visually: WhatsApp's accessibility
  text omits content visible in screenshots. Read consecutive messages, captions,
  images, and screenshots together; later corrections may change the request.
- Open relevant images at full size. Left/Right moves between images; the
  **download** button saves the original. Inspect current controls and use fresh
  accessibility indices.
- If the batch includes a DOCX, download and read it too, including relevant
  tables/images.
- Briefly summarize the requested changes, flag anything unreadable or ambiguous,
  and follow the user's requested next step and this repo's existing rules.
