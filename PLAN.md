# PLAN — תוכנית ההפקה

> תוכנית טכנית מפורטת להפקת סרטון המוצר Aura · מטלה 6

---

## 1. סקירת הארכיטקטורה

```
┌──────────────────────────────────────────────────────────────────────┐
│                          Content Pipeline                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │ 1.Concept   │ →  │ 2.Script     │ →  │ 3.Song       │              │
│  │ (PRD.md)    │    │ (Fountain)   │    │ (lyrics+spec)│              │
│  └─────────────┘    └──────────────┘    └──────────────┘              │
│         │                  │                    │                      │
│         ▼                  ▼                    ▼                      │
│  ┌─────────────────────────────────────────────────────┐               │
│  │ 4. Claude Code + Remotion Skill (npx skills add)   │               │
│  │    reads the JSON spec → emits React components     │               │
│  └─────────────────────────────────────────────────────┘               │
│         │                                                               │
│         ▼                                                               │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐       │
│  │ 5.src/scenes/*  │ →  │ 6.Remotion      │ →  │ 7.out/*.mp4  │       │
│  │  (React+CSS)    │    │ render          │    │  (60s MP4)   │       │
│  └─────────────────┘    └─────────────────┘    └──────────────┘       │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. שלבי ביצוע (Phases)

### Phase A — Conceptual (שלב רעיוני) ✅

| משימה | סטטוס |
|------|------|
| בחירת מוצר (Aura — בקבוק מים חכם) | ✅ |
| כתיבת PRD | ✅ |
| הגדרת 6 סצנות × 10 שניות | ✅ |
| בחירת פלטה ויזואלית | ✅ |

### Phase B — Script & Content (שלב תוכן) ✅

| משימה | סטטוס |
|------|------|
| כתיבת תסריט בפורמט Fountain | ✅ |
| כתיבת מילות שיר (4 בתים + פזמון) | ✅ |
| הפקת JSON spec ל-Suno | ✅ |
| כתיבת Suno Style-of-Music prompt | ✅ |

### Phase C — Technical Setup (שלב טכני) ✅

| משימה | סטטוס |
|------|------|
| יצירת מבנה הפרויקט | ✅ |
| package.json עם Remotion 4.x | ✅ |
| tsconfig.json (strict mode) | ✅ |
| remotion.config.ts | ✅ |
| .gitignore מקיף | ✅ |
| .env.example (ללא מפתחות אמיתיים) | ✅ |

### Phase D — Composition (שלב קומפוזיציה) ✅

| משימה | סטטוס |
|------|------|
| theme.ts (palette, fonts, easings) | ✅ |
| Root.tsx (Composition registration) | ✅ |
| Composition.tsx (6 × Sequence) | ✅ |
| Scene1Hero (brand reveal) | ✅ |
| Scene2Problem (4 problem cards) | ✅ |
| Scene3Intro (bottle + phone pairing) | ✅ |
| Scene4Lifestyle (3-moment carousel) | ✅ |
| Scene5Features (AI coach typewriter) | ✅ |
| Scene6Cta (logo + button + URL) | ✅ |

### Phase E — Validation (שלב אימות) ⏳

| משימה | סטטוס |
|------|------|
| `npm install` | ⏳ משתמש |
| `npx remotion studio` לתצוגה מקדימה | ⏳ משתמש |
| `npx remotion render` ל-MP4 | ⏳ משתמש |
| בדיקת פלט ויזואלי | ⏳ משתמש |
| שילוב פסקול Suno (post-production) | ⏳ אופציונלי |

### Phase F — Submission (שלב הגשה) ⏳

| משימה | סטטוס |
|------|------|
| צילומי מסך של תהליך הרינדור | ⏳ |
| הוספת צילומי מסך ל-`docs/screenshots/` | ⏳ |
| וידוא שכל הקבצים ב-GitHub | ⏳ |
| הגשה למערכת הקורס | ⏳ |

---

## 3. החלטות טכניות מרכזיות

### 3.1 למה Remotion ולא MoviePy/Seedance?

| קריטריון | Remotion ✅ | MoviePy/Seedance ❌ |
|---------|---------|------------|
| שליטה מלאה באנימציה | כן (React) | לא (רק fade/cut) |
| וקטורי / רזולוציה-בלתי-תלויה | כן (CSS) | לא (פיקסלים) |
| עברית תקינה (RTL) | כן (CSS) | חלקי |
| התקנה מהירה | `npm install` | דורש ffmpeg מותקן |
| ניתן לעריכה בקלות | כן (hot reload) | לא |
| חינמי לחלוטין | כן | תלוי ב-API |

### 3.2 למה CSS Art ולא תמונות?

- משקל קבצים אפסי.
- ניתן לשנות צבעים/גדלים בקלות.
- רזולוציה-בלתי-תלויה.
- אין צורך ב-AI image generation (חוסך טוקנים וזמן).

### 3.3 למה ויתור על-מוזיקה-ברינדור?

- Suno מייצר MP3/WAV, לא ישירות לתוך React.
- שילוב המוזיקה נעשה בשלב post-production (ffmpeg).
- היתרון: רינדור מהיר יותר, וגמישות מלאה בעריכת הסאונד.

---

## 4. תרחישי כשל (Failure Modes)

| תרחיש | הסתברות | פתרון |
|------|----------|--------|
| `npm install` נכשל | בינונית | הרץ `npm install --legacy-peer-deps` |
| Chromium חסר לרינדור | גבוהה | `npx remotion install chromium` |
| בעיות Hebrew rendering | נמוכה | בדוק שהגופן תומך בעברית (Heebo / Rubik) |
| זמן רינדור ארוך | נמוכה | הקטן רזולוציה ל-1280×720 בפעם הראשונה |

---

## 5. סדר פעולות למשתמש

```powershell
# 1. מעבר לתיקייה
Set-Location -LiteralPath "c:\Users\User\Documents\בר אילן\LLM בינה מלכואתית\metla6\metla6"

# 2. התקנת dependencies
npm install

# 3. תצוגה מקדימה
npx remotion studio

# 4. רינדור הסרטון הסופי
npx remotion render src/Composition.tsx out/aura-60s.mp4

# 5. אימות מבנה
python scripts/verify_structure.py
```

---

## 6. תוספות אופציונליות (Nice-to-have)

- [ ] החלפת ה-CSS Art באנימציות Lottie מוכנות.
- [ ] תמיכה ב-portrait mode (1080×1920).
- [ ] וריאציות של הסרטון באורך 15s / 30s.
- [ ] תרגום הסרטון לאנגלית.

---

_תוכנית זו נכתבה על-ידי Cursor + Claude Code Skill לפי הנחיות הספר, פרק 7._
