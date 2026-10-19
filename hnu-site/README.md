# موقع أسرة طلاب من أجل مصر — جامعة حلوان الأهلية

موقع Static (HTML/CSS/JS) بدون Build، مع Client-side Routing حقيقي:
`/` · `/committees` · `/committees/oc` · `/committees/hr` · `/committees/media` · `/committees/pr`

## التشغيل محليًا
```
npm start        # = npx serve -s . -l 3000  (الـ -s ضروري عشان الـ routing)
```
> لا يعمل بفتح index.html مباشرة بالدبل كليك، لأن الروابط مسارات حقيقية.

## الرفع على Vercel
ارفع الفولدر على GitHub ← Add New Project ← Framework: **Other** ← Deploy. ملف `vercel.json` فيه rewrites بتخلي فتح/ريفريش أي مسار (زي `/committees/pr`) يشتغل.

## تعديل البيانات — كله من `config.js`
- **اللجان**: الأسماء، الوصف، المهام، الفوائد، رؤساء ونواب اللجان وصورهم، لينكات فيسبوك اللجنة (`links.facebook`). ترتيب الكروت من `committeeOrder` (OC → HR → Media → PR).
- **القيادة**: `leadership` (حسن الجندي / عمر عبدالعظيم).
- **الفعاليات، المعرض، الأرقام، السوشيال، الإيميل/الموبايل**، ولينك "انضم لينا" (`joinUrl`).
- **النصوص الثابتة** عربي/إنجليزي في `STR` أسفل نفس الملف.

## الصور (`assets/images/`)
- اللوجو الرسمي: `logo.png` (الأصل) + `logo.webp` / `logo-sm.webp` + favicons + `og-image.jpg` — كلها من نفس الصورة بدون تعديل.
- صور الأشخاص: `big-brother.jpg` `vice-big-brother.jpg` `oc-head.jpg` `oc-vice-1.jpg` `oc-vice-2.jpg` `hr-head.jpg` `media-head.jpg` `pr-head.jpg`
- الفعاليات: `event-1.jpg` .. `event-3.jpg` — المعرض: `gallery-1.jpg` .. `gallery-6.jpg`
- أي صورة ناقصة تظهر مكانها Placeholder تلقائي.

## نموذج "تواصل معنا"
اعمل فورم على formspree.io وحط رابطه في `formspree`. قبل كده الموقع بيعرض رسالة إنه غير مفعّل بدل ما يفشل.

## ملاحظات
- LinkedIn وTikTok بدون رابط حقيقي: بيظهروا أيقونات باهتة بعلامة "قريبًا" لحد ما تضيف الروابط.
- أسماء رؤساء/نواب اللجان Placeholders (`[OC Head Name]`...) لحد ما تكتب الأسماء.
