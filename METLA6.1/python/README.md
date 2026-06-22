# Python pipeline — גיבוי (אופציונלי)

> צינור Python חלופי ליצירת הסרטון במקרה ש-Remotion לא זמין.
> לפי סעיף 7.2.1 בחוברת, חובה לספק fallback גם אם לא משתמשים בו.

## מה כאן?

| קובץ | תפקיד |
|------|------|
| `seedance_client.py` | לקוח HTTP ל-Seedance 2.0 API (גיבוי ליצירת קליפים) |
| `generate_soundtrack.py` | יוצר פסקול MP3 באמצעות Suno API |
| `generate_assets.py` | יוצר assets (placeholder) לסצנות |
| `requirements.txt` | dependencies |

## הרצה

```bash
# 1. התקנה
pip install -r requirements.txt

# 2. הגדרת API key
cp ../.env.example ../.env
# עריכת .env והכנסת SUNO_API_KEY ו-SEEDANCE_API_KEY

# 3. יצירת פסקול (אופציונלי — לא חובה להגשה)
python generate_soundtrack.py

# 4. יצירת קליפים לכל סצנה (אופציונלי)
python generate_assets.py
```

## מתי להשתמש בזה?

רק אם Remotion נכשל במחשב שלך (למשל Chromium לא מותקן, או בעיות נתיב עברית חמורות). ה-Remotion pipeline הוא המומלץ בממצגת.
