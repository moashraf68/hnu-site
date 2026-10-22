// ===== كل البيانات القابلة للتعديل هنا (Single source of truth) =====
// كل نص له نسختين: ar / en. الصور: ضع الملف في assets/images/ بنفس الاسم، ولو ناقص يظهر Placeholder تلقائي.
const CONFIG = {
  joinUrl: "/register",
  formspree: "https://formspree.io/f/[ضع_المعرف_هنا]",
  suggestUrl: "https://formspree.io/f/[ضع_معرف_نموذج_الاقتراحات]", // أنشئ نموذجاً منفصلاً لاقتراحات الفعاليات على formspree.io
  social: {
    facebook: "https://www.facebook.com/share/19YSkmjycx/",
    instagram: "https://instagram.com/foregypt.hnu?dlrf=MXdlcXB2NHRrYm4wMA%3D%3D",
    linkedin: "https://www.linkedin.com/company/for-egypt-hnu?trk=feed-detail_main-feed-card_feed-actor-name",
    tiktok: "https://www.tiktok.com/@foregypt.hnu?_r=1&_t=ZS-9AWzNQf90zc"
  },
  contact: { email: "[email@example.com]", phone: "[01XXXXXXXXX]" },
  counters: [
    { n: 1800, plus: true, ar: "عضو", en: "Members" },
    { n: 70, plus: true, ar: "فعالية", en: "Events" },
    { n: 15, plus: true, ar: "نشاط", en: "Activities" },
    { n: 4, plus: false, ar: "لجان", en: "Committees" }
  ],
  about: {
    lead: { ar: "أسرة «طلاب من أجل مصر» هي أسرة طلابية مركزية رائدة متواجدة على مستوى كافة الجامعات المصرية الحكومية والأهلية والخاصة. تُنظم الأسرة أنشطتها في إطار مؤسسي متكامل بالتنسيق والمتابعة الرسمية مع الجهات المعنية وقطاع الأمن الوطني حرصاً على توفير بيئة طلابية واعية وآمنة. تُتيح المشاركة في الأسرة والأنشطة الطلابية للشباب فرصة استثنائية لصقل مهاراتهم القيادية والميدانية واكتساب خبرات عملية تثري السيرة الذاتية (CV) وتفتح أمامهم آفاق التميز المهني وسوق العمل.",
            en: "Students For Egypt is a premier central student organization across all Egyptian universities — public, national, and private. Operating within an institutional framework in official coordination and follow-up with relevant authorities and National Security, the family provides a secure and empowering environment for students. Engaging in the family and student activities equips youth with vital leadership and practical expertise, enriching their CV and preparing them for future career success." },
    vision: { ar: "أن نكون أقوى كيان طلابي يخدم الطلاب والمجتمع.", en: "To be the strongest student body serving students and society." },
    mission: { ar: "نصنع فرص حقيقية للشباب من خلال الأنشطة والشراكات.", en: "We create real opportunities for youth through activities and partnerships." },
    values: [
      { ar: "الالتزام", en: "Commitment" }, { ar: "العمل الجماعي", en: "Teamwork" }, { ar: "الانتماء", en: "Belonging" },
      { ar: "الإبداع", en: "Creativity" }, { ar: "المسؤولية", en: "Responsibility" }
    ]
  },
  leadership: {
    supervisor: { name: "Dr. Mohamed Helmy", photo: "/assets/images/supervisor.jpg", title: { ar: "رائد الأسرة", en: "Supervisor" } },
    bigBrother: { name: "Hassan El-Gendy", photo: "/assets/images/big-brother.jpg", title: { ar: "الأخ الأكبر", en: "Big Brother" } },
    viceBigBrother: { name: "Omar Abdelazem", photo: "/assets/images/vice-big-brother.jpg", title: { ar: "نائب الأخ الأكبر", en: "Vice Big Brother" } }
  },
  // الترتيب الإجباري: OC → HR → Media → PR
  committeeOrder: ["oc", "hr", "media", "pr"],
  committees: {
    oc: { icon: "💪", code: "OC", ar: "التنظيم", en: "Operations Committee",
      intro: { ar: "العمود الفقري لكل فعاليات الأسرة.", en: "The backbone of every event we run." },
      desc: { ar: "هي العمود الفقري لكل فعاليات الأسرة، وبتحوّل أي فكرة لفعالية بتتنفذ على أرض الواقع.", en: "The backbone of all the family's events — it turns any idea into an event that actually happens on the ground." },
      role: { ar: "بتخطط وتنفّذ كل فعالية من أول الفكرة لحد آخر لحظة في اليوم، وبتنسّق شغل باقي اللجان وقت الفعالية.", en: "Plans and runs every event from the first idea to the last minute of the day, coordinating all other committees during the event." },
      tasks: [
        { ar: "التخطيط للفعاليات", en: "Event planning" }, { ar: "الجدولة", en: "Scheduling" }, { ar: "توزيع المهام", en: "Task distribution" },
        { ar: "حجز القاعات", en: "Venue booking" }, { ar: "التصاريح", en: "Permissions" }, { ar: "التنسيق مع إدارة الجامعة", en: "Coordination with university administration" },
        { ar: "اللوجستيات", en: "Logistics" }, { ar: "التسجيل", en: "Registration" }, { ar: "الاستقبال", en: "Reception" },
        { ar: "إدارة الحضور", en: "Crowd management" }, { ar: "إدارة الوقت", en: "Time management" }, { ar: "التنسيق مع باقي اللجان", en: "Coordination with other committees" },
        { ar: "تقييم ما بعد الفعالية", en: "Post-event evaluation" }
      ],
      gains: [
        { ar: "خبرة في إدارة الفعاليات", en: "Event Management Experience" }, { ar: "القيادة", en: "Leadership" }, { ar: "إدارة الفريق", en: "Team Management" },
        { ar: "تواصل حقيقي مع الناس", en: "Real-world Communication" }, { ar: "مهارات تنظيمية", en: "Organizational Skills" }
      ],
      head: { name: "Eslam Eldaly", photo: "/assets/images/oc-head.jpg" },
      vices: [{ name: "Mohamed Ashraf", photo: "/assets/images/oc-vice-1.jpg" }, { name: "Kerolos Fakhry", photo: "/assets/images/oc-vice-2c.jpg" }],
      links: { facebook: "" } },
    hr: { icon: "🧠", code: "HR", ar: "الموارد البشرية", en: "Human Resources",
      intro: { ar: "استقطاب، تأهيل، وتطوير كفاءات الأسرة.", en: "Talent acquisition, onboarding, and team development." },
      desc: { ar: "HR هي اللجنة المسؤولة عن استقطاب الأعضاء الجدد، تنظيم عملية الانضمام، متابعة الأعضاء، تقييم الأداء، دعم الفريق، وتطوير تجربة الأعضاء داخل الأسرة.", en: "Human Resources is responsible for talent acquisition, onboarding new members, performance evaluation, team support, conflict resolution, and member development across the family." },
      role: { ar: "بتختار الأعضاء الجدد وتنظّم عملية الانضمام والمقابلات وتتابع الأعضاء وتقيم الأداء وتدعم الفريق وتطوّر تجربة الأعضاء طول فترة العمل.", en: "Selects new members, organizes onboarding and interviews, follows up with members, evaluates performance, supports the team, and develops member experiences throughout the season." },
      tasks: [
        { ar: "استقطاب الأعضاء (Recruitment)", en: "Recruitment" },
        { ar: "المقابلات الشخصية (Interviews)", en: "Interviews" },
        { ar: "التأهيل والتهيئة (Onboarding)", en: "Onboarding" },
        { ar: "متابعة الأعضاء (Member Follow-up)", en: "Member Follow-up" },
        { ar: "تقييم الأداء (Performance Evaluation)", en: "Performance Evaluation" },
        { ar: "إدارة بيانات الأعضاء (Member Data Management)", en: "Member Data Management" },
        { ar: "بناء الفريق والأنشطة المشتركة (Team Building)", en: "Team Building" },
        { ar: "حل النزاعات ودعم الأعضاء (Conflict Resolution)", en: "Conflict Resolution" },
        { ar: "تطوير مهارات الأعضاء (Member Development)", en: "Member Development" }
      ],
      gains: [
        { ar: "مهارات المقابلات الشخصية (Interviewing Skills)", en: "Interviewing Skills" },
        { ar: "مهارات التواصل الفعّال (Communication Skills)", en: "Communication Skills" },
        { ar: "خبرة عملية في الموارد البشرية (HR Experience)", en: "HR Experience" },
        { ar: "إدارة وقيادة فرق العمل (Team Management)", en: "Team Management" },
        { ar: "مهارات التقييم وتحليل الأداء (Evaluation Skills)", en: "Evaluation Skills" }
      ],
      head: { name: "Rawan Tamer", photo: "/assets/images/hr-head.jpg" }, vices: [], links: { facebook: "" } },
    media: { icon: "🎬", code: "Media", ar: "الميديا", en: "Media Committee",
      intro: { ar: "عين الأسرة.", en: "The eyes of the family." },
      desc: { ar: "هي عين الأسرة، بتوثّق كل الأنشطة والفعاليات وتظهرها بشكل احترافي.", en: "The eyes of the family — it documents every activity and event and presents it professionally." },
      role: { ar: "بتظهر كل الحاجات الحلوة اللي الأسرة بتعملها بالصورة والفيديو وعلى كل صفحات السوشيال ميديا.", en: "Shows everything great the family does through photos, videos and all of our social media pages." },
      tasks: [
        { ar: "التصوير الفوتوغرافي", en: "Photography" }, { ar: "تصوير الفيديو", en: "Videography" }, { ar: "المونتاج", en: "Video Editing" },
        { ar: "الريلز", en: "Reels" }, { ar: "التصميم الجرافيكي", en: "Graphic Design" }, { ar: "البوسترات", en: "Posters" },
        { ar: "إدارة السوشيال ميديا", en: "Social Media Management" }, { ar: "صناعة المحتوى", en: "Content Creation" }, { ar: "الكابشنز", en: "Captions" },
        { ar: "النشر", en: "Publishing" }, { ar: "الأرشفة", en: "Archiving" }
      ],
      gains: [
        { ar: "Portfolio حقيقي", en: "Real Portfolio" }, { ar: "صناعة المحتوى", en: "Content Creation" }, { ar: "المونتاج", en: "Video Editing" },
        { ar: "التصوير", en: "Photography" }, { ar: "التصميم", en: "Design" }, { ar: "خبرة في السوشيال ميديا", en: "Social Media Experience" }
      ],
      head: { name: "[Media Head Name]", photo: "/assets/images/media-head.jpg" }, vices: [], links: { facebook: "" } },
    pr: { icon: "🤝", code: "PR", ar: "العلاقات العامة", en: "Public Relations",
      intro: { ar: "الجسر بين الأسرة والشركاء.", en: "The bridge to our partners." },
      desc: { ar: "هي الجسر بين الأسرة والشركات والمؤسسات والشركاء.", en: "The bridge between the family and companies, institutions and partners." },
      role: { ar: "بتتواصل مع الشركات والمؤسسات لجلب الرعاة والشركاء لأنشطة الأسرة وتمثّلها رسميًا.", en: "Reaches out to companies and institutions to bring sponsors and partners to our activities, and represents the family officially." },
      tasks: [
        { ar: "التواصل مع الشركات", en: "Communication with companies" }, { ar: "البحث عن الرعاة", en: "Sponsorship Outreach" }, { ar: "ملف الرعاية", en: "Sponsorship Proposal" },
        { ar: "التفاوض", en: "Negotiation" }, { ar: "إدارة الشراكات", en: "Partnership Management" }, { ar: "متابعة الرعاة", en: "Sponsor Follow-up" },
        { ar: "التواصل الخارجي", en: "External Communication" }, { ar: "التمثيل الرسمي", en: "Official Representation" }
      ],
      gains: [
        { ar: "مهارات المبيعات", en: "Sales Skills" }, { ar: "التفاوض", en: "Negotiation" }, { ar: "التواصل", en: "Communication" },
        { ar: "علاقات الأعمال", en: "Business Relations" }, { ar: "كتابة العروض", en: "Proposal Writing" }
      ],
      head: { name: "Ziad Tarek", photo: "/assets/images/pr-head.jpg" }, vices: [{ name: "Maryam Tamer", photo: "/assets/images/pr-vice-1.jpg" }], links: { facebook: "" } }
  },
  // الترتيب الإجباري: إفطار رمضان → التقديمات → حفل التخرج
  events: [
    { date: { ar: "رمضان 2026", en: "Ramadan 2026" }, title: { ar: "إفطار رمضان 2026", en: "Ramadan Iftar 2026" }, img: "/assets/images/event-1.jpg", icon: "🌙",
      desc: { ar: "نظّمت أسرة «طلاب من أجل مصر» — جامعة حلوان الأهلية، بالتعاون مع جامعة العاصمة، حفلَ إفطار جماعيًا احتفاءً بحلول شهر رمضان المبارك، جمعَ أعضاء الأسرة في أجواء من الألفة والتعاون. وقد نال الحفل ثناءً واسعًا من معالي رئيس الجامعة وسائر الضيوف والحضور، تقديرًا لمستوى التنظيم الرفيع وروح التعاون والبهجة التي طبعت الفعالية.", en: "The 'Students for Egypt' family at Helwan National University, in collaboration with Al-Asema University, organized a collective iftar gathering to celebrate the holy month of Ramadan. The event brought together family members in an atmosphere of warmth and cooperation, and was met with wide praise from the University President and all guests for its exceptional organization, team spirit, and joyful atmosphere." } },
    { date: { ar: "2026", en: "2026" }, title: { ar: "تقديمات دفعة 2027 — الجولة الثالثة", en: "2027 Batch Applications — 3rd Edition" }, img: "/assets/images/event-2.jpg", icon: "📝",
      desc: { ar: "تُعدّ فعالية التقديمات من أبرز وأهم فعاليات الأسرة على الإطلاق، وهي ليست يومًا واحدًا بل برنامج متكامل يمتد على مدار شهرين كاملين. خلال هذه الفترة، تضع الأسرة خبرتها في خدمة الطلاب الجدد وأولياء أمورهم؛ بالإجابة على جميع استفساراتهم، وتوضيح الفروق الجوهرية بين البرامج الأكاديمية المتاحة، ومساعدتهم على اتخاذ قرارهم بثقة ووضوح. وقد شهدت هذه الجولة — الثالثة على التوالي — إقبالًا واسعًا وأثرت إيجابيًا في مسيرة مئات الطلاب.", en: "The Applications Program stands as one of the most impactful events in the family's calendar — and it is far more than a single day. It spans a full two months during which our family dedicates its expertise to guiding new students and their parents through one of the most important decisions of their academic journey. We answer every question, clarify the differences between available programs, and ensure each student can make a confident and informed choice. This edition — the third consecutive one — saw remarkable turnout and positively shaped the paths of hundreds of students." } },
    { date: { ar: "2026", en: "2026" }, title: { ar: "حفل تخرج BIDT — كلية العلوم الإنسانية", en: "BIDT Graduation Ceremony — Faculty of Humanities" }, img: "/assets/images/event-3.jpg", icon: "🎓",
      desc: { ar: "لحظة تاريخية بامتياز — احتضنت جامعة حلوان الأهلية أول حفل تخرج في تاريخها كله، وكان شرف تنظيمه من نصيب أسرة «طلاب من أجل مصر». تخرّجت أولى دفعات كلية العلوم الإنسانية — تخصص BIDT — في أجواء احتفالية استثنائية مُبهجة، فاضت بالفخر والعواطف وتركت أثرًا لا يُنسى في قلوب الخريجين وأولياء أمورهم. نُفِّذ الحفل بمستوى تنظيمي رفيع بالتنسيق الوثيق مع إدارة البرنامج وإدارة الجامعة، وكان شهادةً حقيقية على قدرة الأسرة في صناعة اللحظات التي تستحق أن تُحفر في الذاكرة.", en: "A truly historic milestone — Helwan National University witnessed its very first graduation ceremony ever, proudly organized by the 'Students for Egypt' family. The inaugural graduating class of the Faculty of Humanities, BIDT department, celebrated their achievement in an exceptionally joyful and emotional atmosphere that left an unforgettable mark on graduates and their families alike. Executed at the highest organizational standard in close coordination with both the program administration and the university leadership, this day stood as a testament to our family's ability to create moments worth remembering forever." } }
  ],
  gallery: ["gallery-1.jpg", "gallery-2.jpg", "gallery-3.jpg", "gallery-4.jpg", "gallery-5.jpg", "gallery-6.jpg", "gallery-7.jpg", "gallery-8.jpg", "gallery-9.jpg", "gallery-10.jpg"].map(f => "/assets/images/" + f)
};

// ===== النصوص الثابتة (UI strings) =====
const STR = {
  ar: { brand: "من أجل مصر", n_home: "الرئيسية", n_about: "عن الأسرة", n_lead: "قيادة الأسرة", n_com: "اللجان", n_ev: "الفعاليات", n_gal: "الميديا", n_join: "انضم لينا", n_con: "اقترح فعالية", n_portal: "بوابة الأعضاء",
    join: "انضم لينا", know: "تعرّف علينا", h1a: "أسرة طلاب من أجل", h1b: "مصر", sub: "جامعة حلوان الأهلية — شباب بيبني، وبيشارك، وبيصنع الفرق", slogan: "من أجل مصر.. نبدأ من الجامعة",
    vis: "الرؤية", mis: "الرسالة", val: "القيم", com_sub: "اختار اللجنة اللي تناسبك واعرف تفاصيلها", view_com: "عرض اللجنة", back: "الرجوع للجان",
    intro: "نبذة", role: "دور اللجنة", resp: "المهام الأساسية", gain: "هتستفيد إيه", lead: "قيادة اللجنة", follow: "تابعنا على", quick: "روابط سريعة", soc: "صفحة اللجنة",
    big: "الأخ الأكبر", ev_sub: "أبرز فعاليات الأسرة", gal_sub: "لحظات من أنشطتنا", join_t: "جاهز تبقى جزء من الأسرة؟", join_d: "املا استمارة الانضمام وهنتواصل معاك.", s: ["قدّم", "مقابلة", "قبول", "ابدأ"],
    sug_t: "اقترح فعالية أو نشاطاً", sug_sub: "فكرتك مهمة — كل اقتراح بيوصلنا مباشرة وبنأخده بجدية", f_name: "اسمك", f_email: "إيميلك", f_act: "اسم النشاط / الفعالية المقترحة", f_aud: "الجمهور المستهدف", f_msg: "اشرح الفكرة بالتفصيل", send: "أرسل الاقتراح", ph: "شكل المكان", close: "إغلاق", prev: "السابق", next: "التالي", menu: "القائمة", lang: "EN",
    login: "تسجيل الدخول", logout: "تسجيل الخروج", portal_t: "بوابة الأسرة المركزية", admin_t: "لوحة تحكم الإدارة",
    err: "من فضلك راجع الحقول المحددة بالأحمر.", ok: "وصل اقتراحك! شكراً على مشاركتك 🌟", fail: "حصل خطأ في الإرسال، حاول تاني.", nocfg: "نموذج الاقتراحات لسه مش مفعّل — تواصل معنا على السوشيال ميديا.",
    nf_t: "الصفحة مش موجودة", nf_d: "الرابط ده غير صحيح أو اتنقل.", home: "الرئيسية", soon: "الرابط هيتضاف قريبًا", gimg: "صورة من معرض الأسرة", copy: "© 2026 أسرة طلاب من أجل مصر — جامعة حلوان الأهلية." },
  en: { brand: "For Egypt", n_home: "Home", n_about: "About", n_lead: "Leadership", n_com: "Committees", n_ev: "Events", n_gal: "Media", n_join: "Join Us", n_con: "Suggest", n_portal: "Member Portal",
    join: "Join Us", know: "Learn More", h1a: "Students For", h1b: "Egypt", sub: "Helwan National University — Youth who build, participate and make a difference", slogan: "For Egypt.. we start from the university",
    vis: "Vision", mis: "Mission", val: "Values", com_sub: "Pick the committee that fits you and explore it", view_com: "View Committee", back: "Back to Committees",
    intro: "Introduction", role: "Role of the Committee", resp: "Main Responsibilities", gain: "What You Will Learn / Gain", lead: "Leadership", follow: "Follow us", quick: "Quick links", soc: "Committee page",
    big: "Big Brother", ev_sub: "Highlights from our family", gal_sub: "Moments from our activities", join_t: "Ready to be part of the family?", join_d: "Fill in the application form and we will get in touch.", s: ["Apply", "Interview", "Accepted", "Start"],
    sug_t: "Suggest an Activity or Event", sug_sub: "Your idea matters — every suggestion reaches us directly and is taken seriously", f_name: "Your Name", f_email: "Your Email", f_act: "Suggested Activity / Event Name", f_aud: "Target Audience", f_msg: "Describe your idea in detail", send: "Submit Suggestion", ph: "Placeholder", close: "Close", prev: "Previous", next: "Next", menu: "Menu", lang: "AR",
    login: "Login", logout: "Logout", portal_t: "Central Family Portal", admin_t: "Admin Dashboard",
    err: "Please check the fields marked in red.", ok: "Your suggestion has been received! Thank you for contributing 🌟", fail: "Something went wrong, please try again.", nocfg: "The suggestion form is not activated yet — reach us on social media.",
    nf_t: "Page not found", nf_d: "This link is incorrect or has moved.", home: "Home", soon: "Link coming soon", gimg: "Photo from our gallery", copy: "© 2026 Students For Egypt — Helwan National University." }
};
