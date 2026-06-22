# Screenshots — תיעוד ויזואלי של תהליך ההפקה

> סעיף 7.2.1 בחוברת הקורס דורש **צילומי מסך** של תהליך ההפקה.
> צילומי המסך האלה מוכיחים שהפרויקט רץ בפועל, לא רק קיים בקוד.

הערה חשובה: סביבת ה-Cursor שבה נכתב הפרויקט לא יכולה להריץ `npm install` או `npx remotion render` בפועל, ולכן **צילומי המסך עצמם הם placeholders**. המשתמש צריך להחליף אותם בצילומי מסך אמיתיים לאחר שיריץ את הפרויקט במחשב שלו.

---

## אילו צילומי מסך צריך להוסיף

| # | שם הקובץ | מה לצלם |
|---|---------|--------|
| 01 | `01-prompt.png` | חלון Cursor / Claude Code עם הפרומפט הראשון ל-Remotion (לפי דוגמה בסעיף 7.1.1 בחוברת) |
| 02 | `02-render.png` | הרצה של `npx remotion render` בטרמינל |
| 03 | `03-output.png` | נגן וידאו עם ה-MP4 הסופי (או VLC / Windows Media Player) |
| 04 | `04-studio.png` | חלון Remotion Studio בזמן תצוגה מקדימה |

---

## הוראות לצילום מסך

### 01-prompt.png
1. פתח את Cursor (או VS Code + Claude Code).
2. פתח את `script/video-spec.json` בצד אחד.
3. בצד השני, פתח את ה-CLI של Claude Code.
4. כתוב פרומפט כמו:
   > "Read script/video-spec.json. Use your Remotion skill to build a 60-second video with 3 scenes (opening, problem, solution). The brand is TeamPulse — an AI dashboard for managers."
5. צלם את החלון.

### 02-render.png
1. פתח PowerShell בתיקיית הפרויקט.
2. הרץ:
   ```powershell
   npx remotion render src/Root.tsx out/teampulse-60s.mp4 --comp=TeamPulse60s
   ```
   (או `node render-direct.js` אם הנתיב העברי שובר.)
3. צלם את הפלט (יוצג סרגל התקדמות + זמן רינדור).

### 03-output.png
1. אחרי הרינדור, נווט ל-`out/teampulse-60s.mp4`.
2. פתח ב-VLC או ב-Windows Media Player.
3. צלם באמצע הסרטון (או ברגע ה-CTA).

### 04-studio.png (אופציונלי)
1. הרץ `npx remotion studio`.
2. צלם את החלון עם הסרטון בזמן נגינה.

---

## הערות טכניות

- העדיף PNG (lossless) או JPG באיכות גבוהה.
- גודל מומלץ: 1600×900 או 1920×1080.
- אם הצילום מכיל מידע רגיש (API keys בטרמינל), טשטש לפני ההעלאה.

---

_נכתב ע"י Cursor + Claude Code Skill, 22/06/2026._
