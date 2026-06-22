# PLAN — תוכנית ההפקה

> תוכנית טכנית מפורטת להפקת סרטון המוצר TeamPulse · METLA6.1

## 1. סקירת הארכיטקטורה

הפרויקט בנוי לפי **4 השלבים המופיעים בשקף 3 של הממצגת**:

```
┌──────────────────────────────────────────────────────────────────────┐
│                          Content Pipeline                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────────┐        │
│  │ 1. Prompt   │ →  │ 2. JSON      │ →  │ 3. Template      │        │
│  │ (Manager    │    │ Brief        │    │ (Remotion React) │        │
│  │ intent)     │    │ (contract!)  │    │                  │        │
│  └─────────────┘    └──────────────┘    └──────────────────┘        │
│         │                  │                    │                     │
│         ▼                  ▼                    ▼                     │
│  ┌─────────────────────────────────────────────────────────┐          │
│  │ 4. Render → out/teampulse-60s.mp4                       │          │
│  │    (Remotion CLI / render-direct.js)                    │          │
│  └─────────────────────────────────────────────────────────┘          │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

## 2. מיפוי מדריך → קבצים

| שלב במדריך | מימוש בקוד |
|-----------|------------|
| שקף 3: כוונת המנהל | [docs/prompts.log](docs/prompts.log) — פרומפט מנהל → JSON |
| שקף 3: חוזה JSON | [script/video-spec.json](script/video-spec.json) — מקור אמת |
| שקף 5: RTL CSS | [src/components/AnimatedTitle.tsx](src/components/AnimatedTitle.tsx) (`dir="rtl"`, `display: table`) |
| שקף 6: Fountain | [script/script.fountain](script/script.fountain) |
| שקף 7: Show Don't Tell | [src/scenes/SceneProblem.tsx](src/scenes/SceneProblem.tsx) — סטטיסטיקות פיזיות (47/3/0), לא רגש |
| שקף 8: ארכיטקטורת שיר | [music/song-lyrics.md](music/song-lyrics.md) — Verse/Pre/Chorus/Bridge |
| שקף 9: הנדסת רגש | [music/song-spec.json](music/song-spec.json) — mood/instruments/energy |
| שקף 10: Remotion = standard | [src/Composition.tsx](src/Composition.tsx) + [render-direct.js](render-direct.js) |
| שקף 13: מ-JSON ל-React | [src/Composition.tsx](src/Composition.tsx) — מיפוי `scenes[].id` → קומפוננטה |
| שקף 14: תרגיל שטח | 5 הצעדים שלהלן |

## 3. שלבי ביצוע (Phases)

### Phase A — Conceptual ✅

| משימה | סטטוס |
|------|------|
| בחירת מוצר (TeamPulse) | ✅ |
| כתיבת PRD | ✅ |
| הגדרת 3 סצנות × 20 שניות | ✅ |
| בחירת פלטה ויזואלית (כחול-סגול) | ✅ |

### Phase B — Script & Content ✅

| משימה | סטטוס |
|------|------|
| כתיבת תסריט בפורמט Fountain | ✅ |
| יצירת `script/video-spec.json` (החוזה) | ✅ |
| כתיבת מילות שיר (spoken word) | ✅ |
| הפקת JSON spec ל-Suno | ✅ |
| כתיבת Suno Style-of-Music prompt | ✅ |

### Phase C — Technical Setup ✅

| משימה | סטטוס |
|------|------|
| יצירת מבנה הפרויקט | ✅ |
| `package.json` עם Remotion 4.x | ✅ |
| `tsconfig.json` (strict mode) | ✅ |
| `remotion.config.ts` | ✅ |
| `.gitignore` מקיף | ✅ |
| `.env.example` (ללא מפתחות אמיתיים) | ✅ |

### Phase D — Composition ✅

| משימה | סטטוס |
|------|------|
| `theme.ts` (palette, fonts, easings) | ✅ |
| `Root.tsx` (Composition registration) | ✅ |
| `Composition.tsx` (קורא JSON → 3 × Sequence) | ✅ |
| `SceneOpening.tsx` (brand reveal) | ✅ |
| `SceneProblem.tsx` (47/3/0 stats) | ✅ |
| `SceneSolution.tsx` (3 action cards + CTA) | ✅ |
| `AnimatedTitle.tsx` (slide-in + RTL) | ✅ |
| `SceneCard.tsx` (ActionCard, Stat, PainLine, Cta) | ✅ |
| `LogoMark.tsx` (ECG pulse + wordmark) | ✅ |

### Phase E — Validation ⏳

| משימה | סטטוס |
|------|------|
| `npm install` בנתיב נקי | ⏳ משתמש |
| `npx remotion studio` לתצוגה מקדימה | ⏳ משתמש |
| `npx remotion render` ל-MP4 (או `node render-direct.js`) | ⏳ משתמש |
| בדיקת פלט ויזואלי | ⏳ משתמש |
| שילוב פסקול Suno (post-production) | ⏳ אופציונלי |

### Phase F — Submission ⏳

| משימה | סטטוס |
|------|------|
| צילומי מסך של תהליך הרינדור | ⏳ |
| הוספת צילומי מסך ל-[`docs/screenshots/`](docs/screenshots/) | ⏳ |
| וידוא שכל הקבצים ב-GitHub | ⏳ |
| הגשה למערכת הקורס | ⏳ |

## 4. החלטות טכניות מרכזיות

### 4.1 למה 3 סצנות ולא 6?

הממצגת (שקף 14) מציינת מפורשות: "סצנות: פתיח, בעיה, פתרון". זהו המבנה המינימלי שמספר סיפור מוצר ב-60 שניות, ובדיוק תואם את ה-Playbook.

### 4.2 למה JSON brief?

ה-JSON הוא "החוזה המחייב" (שקף 3). `Composition.tsx` לא מכיל קוד סצנה — רק מיפוי `id → Component`. שינוי סדר או תוכן של סצנה = עריכת JSON אחד, ללא מגע בקוד React.

### 4.3 למה Remotion ולא MoviePy/Seedance?

| קריטריון | Remotion ✅ | MoviePy/Seedance ❌ |
|---------|-----------|-------------------|
| שליטה מלאה באנימציה | כן (React) | לא (רק fade/cut) |
| וקטורי / רזולוציה-בלתי-תלויה | כן (CSS) | לא (פיקסלים) |
| עברית תקינה (RTL) | כן (CSS) | חלקי |
| התקנה מהירה | `npm install` | דורש ffmpeg מותקן |
| ניתן לעריכה בקלות | כן (hot reload) | לא |
| חינמי לחלוטין | כן | תלוי ב-API |

### 4.4 למה CSS Art ולא תמונות?

- משקל קבצים אפסי.
- ניתן לשנות צבעים/גדלים בקלות.
- רזולוציה-בלתי-תלויה.
- אין צורך ב-AI image generation (חוסך טוקנים וזמן).

### 4.5 Workaround ל-Windows + עברית

Remotion 4 לפעמים נתקל בבעיות בנתיבים לא-ASCII. הפתרון: `render-direct.js` מעתיק את הפרויקט ל-`C:\metla6-1-clean\` (נתיב ASCII), מרנדר שם, ומעתיק את ה-MP4 בחזרה. תהליך דומה עבד ב-[metla6/metla6](../metla6/README.md).

## 5. תרחישי כשל (Failure Modes)

| תרחיש | הסתברות | פתרון |
|------|----------|--------|
| `npm install` נכשל | בינונית | הרץ `npm install --legacy-peer-deps` |
| Chromium חסר לרינדור | גבוהה | `npx remotion install chromium` |
| בעיות Hebrew rendering | נמוכה | בדוק שהגופן תומך בעברית (Heebo / Rubik) |
| זמן רינדור ארוך | נמוכה | הקטן רזולוציה ל-1280×720 בפעם הראשונה |
| נתיב עברית שובר Remotion | גבוהה ב-Windows | `node render-direct.js` (workaround) |

## 6. סדר פעולות למשתמש

```powershell
# 1. מעבר לתיקייה
Set-Location -LiteralPath "c:\Users\User\Documents\בר אילן\LLM בינה מלכואתית\metla6\METLA6.1"

# 2. התקנת dependencies
npm install

# 3. תצוגה מקדימה
npx remotion studio

# 4. רינדור (דרך CLI רגילה — אם הנתיב תקין)
npx remotion render src/Root.tsx out/teampulse-60s.mp4 --comp=TeamPulse60s

# 4b. או דרך ה-workaround לעברית ב-Windows
node render-direct.js

# 5. אימות מבנה
python scripts/verify_structure.py
```

## 7. תוספות אופציונליות (Nice-to-have)

- [ ] החלפת ה-CSS Art באנימציות Lottie מוכנות.
- [ ] תמיכה ב-portrait mode (1080×1920).
- [ ] וריאציות של הסרטון באורך 15s / 30s.
- [ ] תרגום הסרטון לאנגלית.

---

_תוכנית זו נכתבה על-ידי Cursor + Claude Code Skill לפי הנחיות הממצגת "Vibe Coding Playbook" והספר "Vibe Coding for Managers" (ד"ר יורם סגל), פרק 7._
