# Screenshot 01 — Claude Code + Remotion Skill in action

> **מה לראות כאן**: חלון Cursor / Claude Code שבו הוזרק הפרומפט הראשון שמנחה את המודל לבנות את הסרטון ב-Remotion.

## מה צריך להופיע בצילום המסך

- **חלון שמאל**: עורך הקוד (Cursor / VS Code) עם `script/script.fountain` פתוח.
- **חלון ימין (או למטה)**: Claude Code CLI שמציג את הפרומפט:
  > "Read the Fountain script and the song JSON spec. Use the Remotion skill (`npx skills add remotiondev/skills`) to build a 60-second video for Aura — a smart water bottle. Six scenes, 10 seconds each. Modern wellness aesthetic, blue + aqua palette, Hebrew text where appropriate."
- **פלט המודל**: הסוכן מציע יצירת `src/Composition.tsx` עם 6 `<Sequence>`.

## מקום לשמירה

`docs/screenshots/01-prompt.png`

## איך לצלם

```powershell
# 1. התקן את ה-Remotion skill (אם עדיין לא הותקן)
Set-Location -LiteralPath "c:\Users\User\Documents\בר אילן\LLM בינה מלכואתית\metla6\metla6"
npx skills add remotiondev/skills

# 2. פתח את Cursor / VS Code
code .

# 3. פתח את הפרומפט ב-Claude Code
claude

# 4. הדבק את הפרומפט למעלה

# 5. צלם את החלון (Win+Shift+S)
```

---

_placeholder — להחלפה בצילום מסך אמיתי לאחר הרצה._
