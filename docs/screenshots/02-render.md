# Screenshot 02 — הרצת הרינדור

> **מה לראות כאן**: חלון PowerShell שבו רץ הפקודה `npx remotion render`, כולל פלט התקדמות וזמן רינדור.

## מה צריך להופיע בצילום המסך

- כותרת PowerShell עם נתיב הפרויקט:
  ```
  PS C:\Users\User\Documents\בר אילן\LLM בינה מלכואתית\metla6\metla6>
  ```
- הפקודה שהוזנה: `npx remotion render src/Composition.tsx out/aura-60s.mp4`
- הפלט של Remotion — כולל סרגל התקדמות (Encoded N frames), זמן כולל, וגודל קובץ ה-MP4.

## מקום לשמירה

`docs/screenshots/02-render.png`

## דוגמה לפלט צפוי

```
✔ Rendered 1800 frames in 5m 12s.
✔ Output: C:\Users\User\Documents\בר אילן\LLM בינה מלכואתית\metla6\metla6\out\aura-60s.mp4
✔ File size: 18.3 MB
✔ Codec: h264, yuv420p, 1920x1080 @ 30fps
```

## איך לצלם

```powershell
Set-Location -LiteralPath "c:\Users\User\Documents\בר אילן\LLM בינה מלכואתית\metla6\metla6"
npx remotion render src/Composition.tsx out/aura-60s.mp4
# המתן עד שהרינדור יסתיים (~5 דקות על מחשב ממוצע)
# צלם את המסך עם Win+Shift+S
```

---

_placeholder — להחלפה בצילום מסך אמיתי לאחר הרצה._
