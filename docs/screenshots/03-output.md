# Screenshot 03 — הסרטון הסופי בנגן

> **מה לראות כאן**: נגן וידאו (VLC / Windows Media Player / מציג התמונות של Windows) שמציג את ה-MP4 הסופי באמצע הסרטון.

## מה צריך להופיע בצילום המסך

- נגן וידאו פתוח.
- הסרטון באמצע (מומלץ: Scene 3 — Product intro, או Scene 6 — CTA).
- הבקבוק + הטלפון גלויים על המסך.
- הזמן בנגן מציג ~30s / 60s.

## מקום לשמירה

`docs/screenshots/03-output.png`

## איך לצלם

```powershell
# אפשרות 1: נגן VLC
Start-Process "C:\Program Files\VideoLAN\VLC\vlc.exe" -ArgumentList "out\aura-60s.mp4"

# אפשרות 2: סייר הקבצים
explorer "out\"
# לחיצה כפולה על aura-60s.mp4 יפתח בנגן ברירת המחדל
```

לאחר פתיחת הסרטון, חכה לסביבות 30 שניות וצלם את המסך.

---

_placeholder — להחלפה בצילום מסך אמיתי לאחר הרצה._
