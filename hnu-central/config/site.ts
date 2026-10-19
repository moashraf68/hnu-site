export interface LocalizedString {
  ar: string
  en: string
}

export interface LocalizedArray {
  ar: string[]
  en: string[]
}

export interface Leader {
  name: string
  nameAr?: string
  nameEn?: string
  role: LocalizedString
  photo: string
  bio?: string
}

export interface CommitteeItem {
  slug: string
  code: string
  icon: string
  nameAr: string
  nameEn: string
  descAr: string
  descEn: string
  tasks: string[]
  responsibilities: LocalizedArray
  gains: LocalizedArray
  headName: string
  headPhoto: string
  headRole: string
}

export interface EventItem {
  id: string
  titleAr: string
  titleEn: string
  descAr: string
  descEn: string
  date: string
  img: string
  icon: string
  committeeName?: string
  committeeSlug?: string
}

export interface SiteConfig {
  name: string
  nameEn: string
  joinUrl: string
  email: string
  phone: string
  location: string
  socialLinks: {
    facebook: string
    instagram: string
    whatsapp: string
  }
  social: Record<string, string>
}

export interface AboutConfig {
  about: LocalizedString
  vision: LocalizedString
  mission: LocalizedString
  values: LocalizedArray
  counters: {
    members: number
    events: number
    committees: number
    universities: number
  }
}

export const SITE: SiteConfig = {
  name: 'أسرة طلاب من أجل مصر — جامعة حلوان الأهلية',
  nameEn: 'Students For Egypt — Helwan National University',
  joinUrl: 'https://forms.gle/sfe-hnu-registration',
  email: 'contact@sfe-hnu.edu.eg',
  phone: '+20 100 000 0000',
  location: 'جامعة حلوان الأهلية — مبنى الأنشطة الطلابية، عين حلوان، القاهرة',
  socialLinks: {
    facebook: 'https://facebook.com/hnu.sfe',
    instagram: 'https://instagram.com/hnu.sfe',
    whatsapp: 'https://wa.me/201000000000',
  },
  social: {
    facebook: 'https://facebook.com/hnu.sfe',
    instagram: 'https://instagram.com/hnu.sfe',
    whatsapp: 'https://wa.me/201000000000',
    linkedin: 'https://linkedin.com/company/hnu-sfe',
    tiktok: 'https://tiktok.com/@hnu.sfe',
    youtube: 'https://youtube.com/@hnu.sfe',
    twitter: 'https://twitter.com/hnu_sfe',
  },
}

export const LEADERSHIP: Leader[] = [
  {
    name: 'أ.د. محمد حلمي',
    nameAr: 'أ.د. محمد حلمي',
    nameEn: 'Prof. Dr. Mohamed Helmy',
    role: {
      ar: 'رائد الأسرة ومستشار الأنشطة الطلابية',
      en: 'Family Supervisor & Student Advisor',
    },
    photo: '/assets/images/leaders/dr-helmy.jpg',
    bio: 'أستاذ دكتور رائد أسرة طلاب من أجل مصر بجامعة حلوان الأهلية وموجه الأنشطة والمبادرات الطلابية المركزية.',
  },
  {
    name: 'أحمد محمود سالم',
    nameAr: 'أحمد محمود سالم',
    nameEn: 'Ahmed Mahmoud Salem',
    role: {
      ar: 'رئيس الأسرة بجامعة حلوان الأهلية',
      en: 'Family President',
    },
    photo: '/assets/images/leaders/president.jpg',
    bio: 'رئيس أسرة طلاب من أجل مصر للعام الجامعي 2025/2026 وممثل الاتحاد الطلابي المركزي.',
  },
  {
    name: 'مريم عمرو عبد الله',
    nameAr: 'مريم عمرو عبد الله',
    nameEn: 'Mariam Amr Abdullah',
    role: {
      ar: 'نائب رئيس الأسرة',
      en: 'Vice President',
    },
    photo: '/assets/images/leaders/vice-president.jpg',
    bio: 'نائب رئيس الأسرة ومسؤولة التنسيق العام ومتابعة خطط اللجان التنفيذية.',
  },
  {
    name: 'عمر خالد الشافعي',
    nameAr: 'عمر خالد الشافعي',
    nameEn: 'Omar Khaled El-Shafei',
    role: {
      ar: 'أمين السر والمنسق العام',
      en: 'Secretary General & Coordinator',
    },
    photo: '/assets/images/leaders/coordinator.jpg',
    bio: 'مسؤول المتابعة الإدارية والأرشفة والتنسيق اليومي بين قيادات اللجان المركزية.',
  },
  {
    name: 'نورهان طارق الباز',
    nameAr: 'نورهان طارق الباز',
    nameEn: 'Nourhan Tarek El-Baz',
    role: {
      ar: 'مسؤول العلاقات العامة والاتصال',
      en: 'Head of Public Relations & Communications',
    },
    photo: '/assets/images/leaders/pr-head.jpg',
    bio: 'مسؤولة البروتوكول الرسمي والتواصل مع إدارة الجامعة والجهات الخارجية الشريكة.',
  },
]

export const COMMITTEES: CommitteeItem[] = [
  {
    slug: 'hr',
    code: 'HR',
    icon: '🧠',
    nameAr: 'الموارد البشرية',
    nameEn: 'Human Resources',
    descAr: 'قلب الأسرة النابض المسؤول عن استقطاب المواهب الطلابية وتطوير أدائهم وتقييمهم الدوري وبناء بيئة عمل محفزة ومتماسكة.',
    descEn: 'The heartbeat of the family responsible for talent acquisition, performance evaluation, leadership coaching, and organizational culture.',
    tasks: [
      'تنظيم مقابلات الانضمام للأسرة وتوزيع المقبولين على اللجان المناسبة',
      'متابعة الحضور والالتزام وتقييم الأداء الشهري للأعضاء',
      'إعداد ورش تدريبية لتطوير المهارات القيادية والتواصل الفعال',
      'حل المشكلات الداخلية وتعزيز روح التعاون والعمل الجماعي',
    ],
    responsibilities: {
      ar: [
        'إجراء المقابلات الشخصية وتقييم المتقدمين للجان',
        'متابعة أداء الأعضاء وتطبيق نظام التقييم الدوري',
        'تنظيم ورش عمل وبرامج تدريبية لتأهيل الكوادر الطلابية',
        'الحفاظ على بيئة إيجابية وبناء جسور التواصل بين الأعضاء',
      ],
      en: [
        'Conduct member recruitment interviews and role placement',
        'Monitor performance and run periodic evaluation frameworks',
        'Organize leadership workshops and skill development sessions',
        'Cultivate team engagement, culture, and internal conflict resolution',
      ],
    },
    gains: {
      ar: [
        'إتقان مهارات المقابلات الشخصية وتقييم الأفراد',
        'خبرة عملية في إدارة فرق العمل وقيادة المجموعات الكبيرة',
        'تطوير الذكاء العاطفي والتواصل الإنساني وحل النزاعات',
        'شهادة خبرة معتمدة في إدارة الموارد البشرية والتدريب',
      ],
      en: [
        'Master recruitment interview techniques and performance tracking',
        'Hands-on experience in leadership and large team coordination',
        'Emotional intelligence, conflict resolution, and communication mastery',
        'Certified leadership and human resources credentials',
      ],
    },
    headName: 'سارة خالد المنشاوي',
    headPhoto: '/assets/images/committees/hr-head.jpg',
    headRole: 'رئيس لجنة الموارد البشرية',
  },
  {
    slug: 'pr',
    code: 'PR',
    icon: '📢',
    nameAr: 'العلاقات العامة',
    nameEn: 'Public Relations',
    descAr: 'واجهة الأسرة وسفراؤها لدى الجامعة والجهات الخارجية، وتتولى تمثيل الأسرة في المؤتمرات والبروتوكول الرسمي والتغطيات المباشرة.',
    descEn: 'The public face and ambassadors of the family, driving strategic communication, university relations, and official protocol.',
    tasks: [
      'بناء علاقات استراتيجية مع إدارة الجامعة والاتحادات والمؤسسات',
      'استقبال كبار الزوار والضيوف في المؤتمرات والفعاليات الرسمية',
      'صياغة الخطابات والبيانات الرسمية والتنسيق الإعلامي الخارجي',
      'تمثيل الأسرة في الملتقيات والمؤتمرات الطلابية الوطنية',
    ],
    responsibilities: {
      ar: [
        'التنسيق البروتوكولي واستقبال الضيوف والشخصيات البارزة',
        'إدارة العلاقات الحكومية والأكاديمية داخل الجامعة وخارجها',
        'إعداد البيانات الصحفية وإدارة خطابات التنسيق الرسمية',
        'بناء شبكة تواصل فعالة ومستمرة مع الشركاء المؤسسيين',
      ],
      en: [
        'Oversee official protocol and executive guest reception',
        'Manage institutional and governmental relationships',
        'Draft formal correspondence and external press communiques',
        'Expand strategic partnership networks across Egypt',
      ],
    },
    gains: {
      ar: [
        'مهارات تفاوض وإقناع عالية وممارسة أصول الإتيكيت والبروتوكول',
        'بناء شبكة علاقات قوية وواسعة مع قيادات وأساتذة الجامعة',
        'تطوير كاريزما الإلقاء والحديث الرسمي أمام الجمهور',
        'خبرة قيّمة في العلاقات المؤسسية والاتصال الدبلوماسي',
      ],
      en: [
        'Executive negotiation, diplomacy, and official etiquette skills',
        'An expansive professional network with university leaders and executives',
        'Charisma in public speaking and presentation',
        'Practical corporate communication and partnership experience',
      ],
    },
    headName: 'مصطفى أشرف رضوان',
    headPhoto: '/assets/images/committees/pr-head.jpg',
    headRole: 'رئيس لجنة العلاقات العامة',
  },
  {
    slug: 'it',
    code: 'IT',
    icon: '💻',
    nameAr: 'تكنولوجيا المعلومات',
    nameEn: 'Information Technology',
    descAr: 'العقل التقني الذي يطور ويدير البنية الرقمية للأسرة، من المنصات البرمجية وبوابة الطلاب إلى أنظمة تسجيل الحضور الذكية وقواعد البيانات.',
    descEn: 'The tech powerhouse powering digital infrastructure, student portals, web platforms, and automated QR attendance systems.',
    tasks: [
      'تطوير وصيانة البوابة المركزية والموقع الإلكتروني للأسرة',
      'إدارة قواعد البيانات ونظام التحقق الرقمي عبر رموز QR',
      'تنظيم المعسكرات التقنية والهاكاثونات ومسابقات البرمجة',
      'تقديم الدعم الفني للبنية التحتية الرقمية في جميع الفعاليات',
    ],
    responsibilities: {
      ar: [
        'تطوير وتحديث البوابة المركزية والتطبيقات الويب الخاصة بالأسرة',
        'إدارة وتأمين قواعد البيانات وسيرفرات النظام والحضور الرقمي',
        'برمجة أنظمة التسجيل والتقييم الداخلي وإحصائيات الطلاب',
        'تقديم الدعم التقني الشامل وتنظيم الورش البرمجية والمسابقات',
      ],
      en: [
        'Architect and develop full-stack web portals and digital services',
        'Secure database management and automated QR check-in flows',
        'Build analytics dashboards and internal administrative systems',
        'Deliver tech support and lead university hackathons and bootcamps',
      ],
    },
    gains: {
      ar: [
        'خبرة عملية في بناء مشاريع ويب متكاملة تعمل على أرض الواقع',
        'التعامل مع تقنيات حديثة مثل Next.js, PostgreSQL, TypeScript, Cloudinary',
        'تعزيز ملفك الشخصي ومحفظة أعمالك البرمجية (Portfolio)',
        'العمل الجماعي في بيئة تطوير تحاكي شركات التكنولوجيا العالمية',
      ],
      en: [
        'Real-world production engineering on full-scale platforms',
        'Master modern stack: Next.js, TypeScript, PostgreSQL, and Cloudinary',
        'Build an impressive developer portfolio with live production code',
        'Collaborate in agile team environments mirroring top tech companies',
      ],
    },
    headName: 'زياد طارق إبراهيم',
    headPhoto: '/assets/images/committees/it-head.jpg',
    headRole: 'رئيس لجنة تكنولوجيا المعلومات',
  },
  {
    slug: 'media',
    code: 'MEDIA',
    icon: '📸',
    nameAr: 'الإعلام والتوثيق',
    nameEn: 'Media & Documentation',
    descAr: 'عين الأسرة التي توثق كل لحظة تصنع الفارق من خلال التصوير الاحترافي والمونتاج وصناعة المحتوى الرقمي المؤثر عبر المنصات.',
    descEn: 'The visual storytelling arm preserving every historic moment through photography, video production, and social storytelling.',
    tasks: [
      'التغطية الفوتوغرافية والفيديوغرافية لكافة فعاليات ومؤتمرات الأسرة',
      'صناعة الريلز والفيديوهات الترويجية والمونتاج السينمائي الاحترافي',
      'إدارة النشر على منصات التواصل الاجتماعي وتفاعل الجمهور',
      'أرشفة الذاكرة المرئية لجميع الأنشطة الطلابية بالجامعة',
    ],
    responsibilities: {
      ar: [
        'تصوير الفعاليات بكاميرات احترافية وإخراج الصور التوثيقية',
        'مونتاج الأفلام القصيرة والمقاطع الدعائية بجودة عالية',
        'كتابة المحتوى الإعلامي وإدارة حملات الترويج الرقمية',
        'توثيق وأرشفة المعرض المرئي والريلز لكل لجنة ونشاط',
      ],
      en: [
        'On-ground photo and video coverage with professional equipment',
        'Cinematic video editing and promotional reel creation',
        'Creative copywriting and multi-channel campaign management',
        'Media archiving and curation of digital photo albums',
      ],
    },
    gains: {
      ar: [
        'احتراف التصوير وتكوين اللقطات والإضاءة المسرحية والميدانية',
        'إتقان برامج المونتاج العالمية مثل Adobe Premiere وAfter Effects',
        'إدارة الحملات الإعلامية وتوسيع مدى وصول المحتوى الرقمي',
        'بناء سيرة ذاتية ومعرض أعمال إعلامي متميز (Showreel)',
      ],
      en: [
        'Mastery in professional camera composition and dynamic lighting',
        'Proficiency in industry-standard tools (Premiere, After Effects, DaVinci)',
        'Digital brand growth and viral media distribution expertise',
        'A comprehensive media portfolio and professional showreel',
      ],
    },
    headName: 'كريم هاني الدسوقي',
    headPhoto: '/assets/images/committees/media-head.jpg',
    headRole: 'رئيس لجنة الإعلام والتوثيق',
  },
  {
    slug: 'events',
    code: 'EVT',
    icon: '🎪',
    nameAr: 'تنظيم الفعاليات',
    nameEn: 'Event Management',
    descAr: 'مهندسو الأحداث والمؤتمرات الطلابية، يخططون وينفذون الفعاليات الضخمة من لحظة ولادة الفكرة وحتى خروجها بأعلى معايير الإتقان.',
    descEn: 'The masterminds behind massive student conferences, forums, and ceremonies, bringing ideas to life with flawless execution.',
    tasks: [
      'وضع المخطط الزمني والجدول التنفيذي للفعاليات والمؤتمرات',
      'إدارة حركة الحضور وتنظيم المسرح والقاعات الرئيسية',
      'التنسيق بين جميع اللجان لضمان تكامل وسلاسة التنظيم',
      'إدارة الطوارئ وحل المواقف الميدانية بحرفية وسرعة',
    ],
    responsibilities: {
      ar: [
        'إعداد الخطط التشغيلية والجداول الزمنية الدقيقة للفعاليات',
        'تنظيم دخول وتوزيع وتوجيه آلاف الطلاب في الفعاليات الكبرى',
        'إدارة المسرح والإشراف على الفقرات والتوقيتات بدقة متناهية',
        'إدارة فريق العمل الميداني والتعامل السريع مع أي طارئ',
      ],
      en: [
        'Architect end-to-end operational agendas and run-of-show plans',
        'Orchestrate crowd flow, venue layout, and ushering protocols',
        'Direct stage operations, lighting, sound cues, and keynote transitions',
        'Lead rapid-response teams to manage live event variables',
      ],
    },
    gains: {
      ar: [
        'القدرة على إدارة وتنظيم أحداث جماهيرية كبرى بأعلى المعايير',
        'العمل بكفاءة تحت الضغط وسرعة اتخاذ القرارات الحاسمة',
        'تطوير مهارات التنسيق اللوجستي وإدارة الحشود',
        'شهادة خبرة موثقة في إدارة الفعاليات والمؤتمرات الكبرى',
      ],
      en: [
        'Extensive experience managing massive high-stakes live events',
        'Calm leadership under pressure and decisive crisis intervention',
        'Crowd management, spatial planning, and team orchestration mastery',
        'Industry-recognized credential in event operations management',
      ],
    },
    headName: 'يوسف شريف عبد الرحمن',
    headPhoto: '/assets/images/committees/events-head.jpg',
    headRole: 'رئيس لجنة تنظيم الفعاليات',
  },
  {
    slug: 'design',
    code: 'DSG',
    icon: '🎨',
    nameAr: 'التصميم والهوية البصرية',
    nameEn: 'Design & Visual Identity',
    descAr: 'مبدعو الجمال والهوية البصرية، يحولون الأفكار إلى تصاميم مبهرة وهوية بصرية متكاملة تعبر عن أصالة وطموح الأسرة.',
    descEn: 'The visual architects defining our brand identity, posters, stage graphics, social feeds, and digital aesthetics.',
    tasks: [
      'تصميم الهوية البصرية وشعارات وبوسترات الفعاليات والمؤتمرات',
      'إعداد التصاميم التسويقية لمنصات التواصل والموقع الإلكتروني',
      'تصميم المطبوعات الرسمية والبنرات والشهادات التقديرية',
      'الحفاظ على التناسق البصري للألوان والخطوط عبر جميع المنصات',
    ],
    responsibilities: {
      ar: [
        'ابتكار الهويات البصرية والشعارات للفعاليات والمشاريع الطلابية',
        'تصميم بوسترات السوشيال ميديا والقصص المصورة والبنرات الرقمية',
        'تجهيز ملفات المطبوعات والشهادات والبطاقات التعريفية (Badges)',
        'تطبيق دليل الهوية البصرية المعتمد للأسرة بحرفية تامة',
      ],
      en: [
        'Craft unified visual identities and event key visuals (KV)',
        'Produce social media carousels, banners, and digital graphics',
        'Prepare print-ready files for large-format stage backdrops and credentials',
        'Enforce brand consistency across typography, color palettes, and assets',
      ],
    },
    gains: {
      ar: [
        'احتراف حزمة أدوبي العالمية (Photoshop, Illustrator, InDesign, Figma)',
        'فهم عميق لنظريات الألوان والتصميم الطباعي والرقمي',
        'بناء معرض أعمال احترافي (Behance) يفتح أبواب العمل الحر',
        'تطوير التفكير الإبداعي وحل المشكلات البصرية المعقدة',
      ],
      en: [
        'Mastery in modern creative suites (Figma, Photoshop, Illustrator)',
        'Deep grounding in typography, color harmony, and layout theory',
        'A comprehensive Behance portfolio for competitive freelance careers',
        'Elevated aesthetic instinct and conceptual visual design ability',
      ],
    },
    headName: 'ندى أحمد الغندور',
    headPhoto: '/assets/images/committees/design-head.jpg',
    headRole: 'رئيس لجنة التصميم والهوية البصرية',
  },
  {
    slug: 'logistics',
    code: 'LOG',
    icon: '📦',
    nameAr: 'اللوجستيات والدعم الفني',
    nameEn: 'Logistics & Operations',
    descAr: 'العمود الفقري لأي نجاح ميداني، مسؤولون عن توفير كافة التجهيزات والمعدات الفنية وإدارة حركة المواد والمخازن بكفاءة عالية.',
    descEn: 'The backbone of physical execution, procuring equipment, managing staging setups, and ensuring seamless operational support.',
    tasks: [
      'توفير مستلزمات الفعاليات من أجهزة صوت وإضاءة وشاشات ومقاعد',
      'إدارة مخزن الأسرة وجرد المعدات والمطبوعات والأدوات التنظيمية',
      'تجهيز القاعات والمسارح قبل ساعات من انطلاق أي حدث رسمي',
      'التنسيق اللوجستي مع إدارة الأمن والمباني في الجامعة',
    ],
    responsibilities: {
      ar: [
        'حصر وتوفير كافة المتطلبات المادية والفنية للفعاليات',
        'تجهيز المسارح والصوتيات والشاشات والإضاءة بالتنسيق مع الفنيين',
        'إدارة خطة النقل والتوزيع والتخزين لمهمات الأسرة',
        'فحص واختبار التجهيزات وضمان عملها دون أي خلل خلال الفعالية',
      ],
      en: [
        'Procure and inspect all audiovisual and mechanical equipment',
        'Supervise stage setup, lighting rigs, microphones, and seating',
        'Maintain inventory control, storage logistics, and gear transportation',
        'Coordinate site permissions and technical safety with university facilities',
      ],
    },
    gains: {
      ar: [
        'مهارات متقدمة في إدارة سلاسل الإمداد والخدمات اللوجستية',
        'القدرة الفائقة على حل المشكلات التقنية والميكانيكية الميدانية',
        'الانضباط والدقة في إدارة الوقت والمخزون والمعدات الثمينة',
        'شهادة خبرة معتبرة في إدارة العمليات واللوجستيات',
      ],
      en: [
        'Advanced expertise in operational logistics and procurement',
        'Rapid physical troubleshooting and practical technical agility',
        'Excellence in time management, supply chains, and inventory control',
        'Valuable operational management experience on your professional resume',
      ],
    },
    headName: 'محمد سامح الشناوي',
    headPhoto: '/assets/images/committees/logistics-head.jpg',
    headRole: 'رئيس لجنة اللوجستيات',
  },
  {
    slug: 'fundraising',
    code: 'FR',
    icon: '💰',
    nameAr: 'الرعاية والتمويل',
    nameEn: 'Fundraising & Sponsorship',
    descAr: 'المحرك المالي والاستثماري، يجلب الرعاة والشركات الداعمة ويبرم الصفقات التسويقية التي تضمن توفير التمويل اللازم لكافة الأنشطة.',
    descEn: 'The financial growth engine attracting corporate sponsors, securing funding packages, and driving commercial partnerships.',
    tasks: [
      'إعداد حزم الرعاية الرسمية (Sponsorship Proposals) وعرضها على الشركات',
      'التفاوض مع الجهات المانحة والشركات الكبرى لدعم فعاليات الأسرة',
      'إدارة الميزانيات التقديرية والتأكد من تحقيق العوائد الاستثمارية للرعاة',
      'بناء شراكات طويلة الأجل مع المؤسسات الرائدة في القطاع الخاص',
    ],
    responsibilities: {
      ar: [
        'صياغة مقترحات الرعاية وعروض الشراكة التسويقية الجاذبة للشركات',
        'عقد اجتماعات تفاوضية مع مديري التسويق وممثلي العلامات التجارية',
        'متابعة تنفيذ التزامات الرعاة والتغطية الإعلانية الموعودة لهم',
        'إعداد التقارير المالية والختامية للفعاليات الممولة',
      ],
      en: [
        'Draft lucrative sponsorship decks and corporate partnership pitches',
        'Lead high-level pitch meetings with brand marketing executives',
        'Ensure deliverable fulfillment and sponsor visibility during events',
        'Prepare post-event ROI reports and financial impact statements',
      ],
    },
    gains: {
      ar: [
        'إتقان مهارات البيع للشركات (B2B Sales) والتفاوض المالي المتقدم',
        'فهم عميق لعالم التسويق والشراكات التجارية وعوائد الاستثمار (ROI)',
        'شبكة علاقات مباشرة مع كبرى الشركات والمؤسسات المصرية والدولية',
        'خبرة حقيقية تؤهلك للعمل في مجالات الـ Business Development',
      ],
      en: [
        'Professional mastery of corporate B2B sales and deal negotiation',
        'Deep grasp of corporate marketing budgets and sponsor ROI delivery',
        'Direct relationships with prominent brand leaders and business heads',
        'A launchpad into high-earning business development and corporate roles',
      ],
    },
    headName: 'حازم محمود الهواري',
    headPhoto: '/assets/images/committees/fundraising-head.jpg',
    headRole: 'رئيس لجنة الرعاية والتمويل',
  },
]

export const EVENTS: EventItem[] = [
  {
    id: 'evt-welcome-day-2026',
    titleAr: 'حفل استقبال الطلاب الجدد — ملتقى الانطلاقة',
    titleEn: 'Freshmen Welcome Day — The Kickoff',
    descAr: 'أضخم احتفالية طلابية في جامعة حلوان الأهلية للترحيب بالدفعة الجديدة، تضمنت جولات تعريفية باللجان، ومسابقات تفاعلية، وعروضاً فنية مبهجة بمشاركة آلاف الطلاب والقيادات الجامعية.',
    descEn: 'The flagship orientation gala welcoming thousands of new students to Helwan National University with committee showcases, interactive contests, and vibrant performances.',
    date: '15 أكتوبر 2025',
    img: '/assets/images/events/welcome-day.jpg',
    icon: '🎉',
    committeeName: 'تنظيم الفعاليات',
  },
  {
    id: 'evt-hackathon-2026',
    titleAr: 'هاكاثون حلوان للابتكار والذكاء الاصطناعي',
    titleEn: 'Helwan AI & Innovation Hackathon',
    descAr: 'ماراثون برمجي تنافس فيه أكثر من 300 طالب وطالبة من مختلف الكليات لابتكار حلول رقمية تدعم أهداف التنمية المستدامة والتحول الرقمي للجامعة، مع جوائز نقدية وشهادات معتمدة.',
    descEn: 'An intensive 48-hour coding marathon where over 300 student developers built AI-driven applications for smart campus sustainability, backed by tech leaders.',
    date: '22 ديسمبر 2025',
    img: '/assets/images/events/hackathon.jpg',
    icon: '💻',
    committeeName: 'تكنولوجيا المعلومات',
  },
  {
    id: 'evt-leadership-summit-2026',
    titleAr: 'قمة إعداد قادة المستقبل وملتقى التوظيف',
    titleEn: 'Future Leaders Summit & Career Fair',
    descAr: 'ملتقى سنوي شامل جمع كبرى الشركات ومسؤولي الموارد البشرية لتقديم فرص تدريب ووظائف صيفية لطلاب الجامعة، إلى جانب جلسات حوارية ملهمة مع رواد الأعمال والشخصيات العامة.',
    descEn: 'A premier leadership symposium and career expo connecting university students with top corporate recruiters, featuring masterclasses with renowned industry leaders.',
    date: '10 فبراير 2026',
    img: '/assets/images/events/career-fair.jpg',
    icon: '🚀',
    committeeName: 'الموارد البشرية',
  },
  {
    id: 'evt-ramadan-charity-2026',
    titleAr: 'يوم الخير والتكافل المجتمعي الرمضاني',
    titleEn: 'Ramadan Community Giving Day',
    descAr: 'مبادرة مجتمعية تطوعية نظمتها لجان الأسرة لإعداد وتوزيع وجبات الإفطار وكراتين الخير للأسر الأكثر احتياجاً، تأكيداً على دور طلاب الجامعة في خدمة المجتمع والوطن.',
    descEn: 'A nationwide charitable initiative led by student volunteers preparing and distributing warm Iftar meals and food boxes to underprivileged communities.',
    date: '18 مارس 2026',
    img: '/assets/images/events/ramadan-charity.jpg',
    icon: '🌙',
    committeeName: 'العلاقات العامة',
  },
]

export const GALLERY: string[] = [
  '/assets/images/gallery/1.jpg',
  '/assets/images/gallery/2.jpg',
  '/assets/images/gallery/3.jpg',
  '/assets/images/gallery/4.jpg',
  '/assets/images/gallery/5.jpg',
  '/assets/images/gallery/6.jpg',
  '/assets/images/gallery/7.jpg',
  '/assets/images/gallery/8.jpg',
]

export const ABOUT: AboutConfig = {
  about: {
    ar: 'أسرة طلاب من أجل مصر هي الكيان الطلابي الأكبر والأكثر تأثيراً في الجامعات المصرية، تهدف إلى إعداد جيل واعٍ، متمكن علمياً وعملياً، ومؤمن بدوره المحوري في بناء مستقبل وطنه.',
    en: 'Students For Egypt is the foremost student organization across Egyptian universities, empowering a patriotic, capable, and ambitious generation equipped for national leadership.',
  },
  vision: {
    ar: 'أن نكون المنصة الطلابية الرائدة في جمهورية مصر العربية التي تكتشف المواهب الشابة، وتصقل المهارات القيادية، وتسهم في تحقيق رؤية مصر 2030 من خلال كوادر شبابية مؤهلة.',
    en: 'To be Egypt’s premier student ecosystem discovering exceptional talents, fostering transformative leaders, and actively driving Egypt Vision 2030.',
  },
  mission: {
    ar: 'بناء مجتمع جامعي متكامل ومحفز عبر تنظيم فعاليات نوعية، وتوفير برامج تدريب احترافية، وتمكين الطلاب في كافة المجالات العلمية، التكنولوجية، الثقافية، والاجتماعية.',
    en: 'Cultivating a vibrant campus environment through high-impact events, professional development programs, and empowering students across academics, tech, culture, and public service.',
  },
  values: {
    ar: [
      'الانتماء الوطني',
      'العمل الجماعي',
      'الإبداع والابتكار',
      'التميز والاحترافية',
      'النزاهة والشفافية',
      'المسؤولية المجتمعية',
    ],
    en: [
      'National Belonging',
      'Team Synergy',
      'Innovation & Creativity',
      'Excellence & Professionalism',
      'Integrity & Transparency',
      'Community Responsibility',
    ],
  },
  counters: {
    members: 1450,
    events: 48,
    committees: 8,
    universities: 27,
  },
}
