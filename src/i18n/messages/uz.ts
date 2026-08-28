/**
 * O'zbekcha matnlar — MANBA nusxa.
 *
 * Sayt o'zbek tilida yozilgan, shuning uchun tuzilma shu yerda
 * belgilanadi va `ru.ts` uni AYNAN takrorlaydi (tip shuni majburlaydi).
 * Yangi matn qo'shilsa TypeScript ruscha nusxada yetishmayotganini
 * darrov ko'rsatadi — tarjima qilinmagan qator jimgina qolib ketmaydi.
 */
export const uz = {
  seo: {
    materials: {
      title: 'Tayyor materiallar — universitetlar bo‘yicha topshiriqlar',
      description:
        "O'zbekiston universitetlari bo'yicha tayyor topshiriqlar, mustaqil va laboratoriya ishlari. Fan va kurs bo'yicha qidiring, darhol yuklab oling.",
    },
    universityNotFound: {
      title: 'Universitet topilmadi',
      description: 'So‘ralgan universitet katalogda mavjud emas.',
    },
    university: {
      title: '{name} topshiriqlari — {count} ta fan',
      description:
        "{fullName} uchun tayyor topshiriqlar: {count} ta fan bo'yicha mustaqil, amaliy va laboratoriya ishlari.",
    },
    subjectTitle: '{subject} — {university} topshiriqlari',
    subjectDescription:
      '{university}, {subject}.{course} {count} ta topshiriq: mustaqil, amaliy va laboratoriya ishlari uchun tayyor yechimlar.',
    courseSuffix: ' {course}-kurs.',
    subjectNotFound: {
      title: 'Fan topilmadi',
      description: "So'ralgan fan katalogda mavjud emas.",
    },
    assignmentTitle: '{title} — {subject}',
    assignmentDescription:
      '{university}, {subject} fani bo\'yicha "{title}" topshirig\'i uchun tayyor yechimlar.',
    assignmentNotFound: {
      title: 'Topshiriq topilmadi',
      description: "So'ralgan topshiriq katalogda mavjud emas.",
    },
    login: {
      title: 'Kirish',
      description: 'Yopamiz.uz hisobingizga kiring va topshiriqlaringizni boshqaring.',
    },
    register: {
      title: "Ro'yxatdan o'tish",
      description:
        "Yopamiz.uz'da hisob oching — tayyor materiallar, freelancerlar va topshiriqlar bir joyda.",
    },
    forgot: {
      title: 'Parolni tiklash',
      description:
        'Telefon raqam yoki email orqali tasdiqlash kodini oling va Yopamiz.uz hisobingiz parolini yangilang.',
    },
  },

  common: {
    loading: 'Yuklanmoqda…',
    save: 'Saqlash',
    saving: 'Saqlanmoqda…',
    cancel: 'Bekor qilish',
    close: 'Yopish',
    back: 'Orqaga',
    next: 'Keyingi',
    search: 'Qidirish',
    retry: 'Qayta urinish',
    delete: "O'chirish",
    edit: 'Tahrirlash',
    confirm: 'Tasdiqlash',
    all: 'Barchasi',
    none: '—',
    yes: 'Ha',
    no: "Yo'q",
    more: 'Batafsil',
    showAll: "Hammasini ko'rish",
    empty: "Hozircha ma'lumot yo'q",
    error: 'Xatolik yuz berdi',
    comingSoon: 'Tez orada',
  },

  locale: {
    switcherLabel: 'Sayt tili',
    ariaSwitch: '{from} tilidan {to} tiliga almashtirish',
  },

  assignmentTypes: {
    independent: 'Mustaqil ishlar',
    practical: 'Amaliy ishlar',
    laboratory: 'Laboratoriya ishlari',
    course_work: 'Kurs ishlari',
    other: 'Boshqa',
  },

  tasks: {
    searchPlaceholder: 'Qidirish...',
    filter: 'Filtr',
    notFound: 'Topshiriq topilmadi',
    sectionEmpty: "Bu bo'lim hozircha bo'sh",
    changeSearch: "Qidiruv yoki filtrni o'zgartiring.",
    beFirst: "Birinchi bo'lib topshiriq yuklang.",
    variantCount: '{count} ta variant',
    noVariants: 'Variantsiz',
    hasSolution: 'Yechim bor',
    hasDemand: 'Talab mavjud',
    noSolution: "Yechim yo'q",
    nothingSelected: 'Topshiriq tanlanmagan',
    pickFromList: "Chapdagi ro'yxatdan tanlang yoki yangi topshiriq yuklang.",
  },

  materials: {
    breadcrumbHome: 'Bosh sahifa',
    breadcrumbMaterials: 'Tayyor materiallar',
    heading: 'Tayyor materiallar',
    lead: '{institutes} ta institut va {subjects} ta fan. Kerakli institut, fan va topshiriqni tanlang va tayyor yechimlarni oling.',
    itemListName: 'Yopamiz.uz tayyor materiallari',
    subjectCount: '{count} ta fan',
    subjectsOf: '{name} fanlari',
    assignmentsOf: '{name} topshiriqlari',
    course: '{course}-kurs',
    taskCount: '{count} ta topshiriq',
  },

  nav: {
    home: 'Bosh sahifa',
    notes: 'Konspekt',
    materials: 'Tayyor materiallar',
    freelancers: 'Freelancerlar',
    help: 'Yordam',
    mainMenu: 'Asosiy menyu',
    menu: 'Menyu',
  },

  header: {
    login: 'Kirish',
    register: "Ro'yxatdan o'tish",
    cabinet: 'Kabinet',
    logout: 'Chiqish',
  },

  footer: {
    tagline: 'Talabalar uchun barcha xizmatlar bitta joyda. Sifatli, tezkor va ishonchli.',
    platform: 'Platforma',
    home: 'Asosiy',
    assignments: 'Topshiriqlar',
    notes: 'Konspekt',
    drawing: 'Chizmachilik',
    diploma: 'Diplom ishlari',
    freelancers: 'Freelancerlar',
    becomeFreelancer: "Freelancer bo'lish",
    findFreelancer: 'Freelancer qidirish',
    exchange: 'Birja',
    help: 'Yordam',
    faq: 'FAQ',
    rules: 'Qoidalar',
    about: 'Biz haqimizda',
    appeals: 'Murojaatlar',
    contact: 'Aloqa',
    rights: '© {year} Yopamiz.uz — Barcha huquqlar himoyalangan',
    madeFor: "O'zbekiston uchun yaratilgan",
  },

  auth: {
    loginTitle: 'Kirish',
    loginSubtitle: 'Google, telefon raqam yoki email bilan kiring.',
    registerTitle: "Ro'yxatdan o'tish",
    phone: 'Telefon raqam',
    email: 'Email',
    emailPlaceholder: 'ism@example.com',
    password: 'Parol',
    passwordPlaceholder: '••••••••',
    forgot: 'Parolni unutdingizmi?',
    submitLogin: 'Kirish',
    submittingLogin: 'Kirilmoqda...',
    noAccount: "Hisobingiz yo'qmi?",
    goRegister: "Ro'yxatdan o'ting",
    haveAccount: 'Parolingiz esingizdami?',
    goLogin: 'Kirish',
    or: 'yoki',
    methodPhone: 'Telefon',
    methodEmail: 'Email',
    methodTabsLabel: 'Kirish usuli',
    emailComingSoon: "Email bilan kirish uchun uni profilingizdagi «Kirish usullari»da bog'lang.",
    emailIncomplete: 'Email manzilni to‘liq kiriting.',
    phoneIncomplete: "Telefon raqam to'liq emas. Masalan: 90 123 45 67",
    termsLink: 'Foydalanish shartlari va maxfiylik siyosati',
  },

  register: {
    title: "Ro'yxatdan o'tish",
    subtitle: 'Raqamingizni kiriting — tasdiqlash kodi yuboramiz.',
    sendCode: 'Kod yuborish',
    sending: 'Yuborilmoqda...',
    codeTitle: 'Raqamni tasdiqlang',
    codeSubtitle: '+998 {phone} raqamiga yuborilgan kodni kiriting.',
    codeLength: "Kod {length} xonali bo'lishi kerak",
    demoHint: "SMS hali ulanmagan. Sinov kodi: {code} — bosing, o'zi qo'yiladi.",
    verify: 'Tasdiqlash',
    verifying: 'Tekshirilmoqda...',
    changePhone: "Raqamni o'zgartirish",
    resend: 'Kodni qayta yuborish',
    resendFailed: "Kodni qayta yuborib bo'lmadi",
    profileTitle: "Ma'lumotlaringizni kiriting",
    profileSubtitle: "Raqam tasdiqlandi. Endi ism va parol qo'ying.",
    fullName: 'Ism familiya',
    fullNamePlaceholder: 'Dilnoza Karimova',
    fullNameRequired: 'Ism familiyani kiriting',
    finish: 'Yakunlash',
    haveAccount: 'Hisobingiz bormi?',
    goLogin: 'Kiring',
  },

  forgot: {
    title: 'Parolni tiklash',
    subtitle:
      "Hisobingizga bog'langan telefon raqam yoki emailni kiriting — tasdiqlash kodi yuboramiz.",
    verifiedEmailOnly: 'Faqat tasdiqlangan email manzilga kod yuboriladi.',
    sendCode: 'Kod yuborish',
    sending: 'Yuborilmoqda...',
    codeTitle: 'Kodni kiriting',
    codeSubtitlePhone: '{identifier} raqamiga yuborilgan kodni kiriting.',
    codeSubtitleEmail: '{identifier} manziliga yuborilgan kodni kiriting.',
    demoHint: 'Yetkazish hali ulanmagan. Sinov kodi: {code} — bosing, o‘zi qo‘yiladi.',
    newPassword: 'Yangi parol',
    repeatPassword: 'Parolni takrorlang',
    submit: 'Parolni yangilash',
    submitting: 'Saqlanmoqda...',
    resend: 'Kodni qayta yuborish',
    resendFailed: "Kodni qayta yuborib bo'lmadi. Biroz kutib turing.",
    weakPassword: 'Yangi parol talablarga javob bermayapti.',
    mismatch: 'Parollar mos kelmadi.',
    doneTitle: 'Parol yangilandi',
    doneSubtitle: 'Endi yangi parolingiz bilan kirishingiz mumkin.',
    goToLogin: "Kirish sahifasiga o'tish",
  },

  changePassword: {
    titleChange: 'Parolni o‘zgartirish',
    titleSet: 'Parol qo‘yish',
    descChange:
      'Parolni bilgan har kim hisobingizga kira oladi — uni vaqti-vaqti bilan yangilab turing.',
    descSet:
      'Hisobingiz parolsiz ochilgan. Parol qo‘ysangiz, kod kutmasdan ham kirishingiz mumkin bo‘ladi.',
    actionChange: 'O‘zgartirish',
    actionSet: 'Parol qo‘yish',
    current: 'Joriy parol',
    new: 'Yangi parol',
    repeat: 'Yangi parolni takrorlang',
    done: 'Parol yangilandi.',
    weak: 'Yangi parol talablarga javob bermayapti.',
    mismatch: 'Parollar mos kelmadi.',
  },

  password: {
    rulesTitle: 'Parol qo‘yish qoidalari',
    minLength: 'Kamida 8 ta belgi',
    hasLetter: 'Kamida 1 ta harf (a-z yoki A-Z)',
    hasDigit: 'Kamida 1 ta raqam (0-9)',
    example: 'Misol: ',
    ariaLabel: 'Parol talablari',
  },
};

/**
 * `as const` ATAYLAB ishlatilmagan: u har bir qiymatni o'z matniga
 * bog'lab qo'yardi va ruscha nusxa AYNAN shu o'zbekcha matnlarni talab
 * qilardi. Bu yerda kerakligi — kalitlar tuzilmasi, matnning o'zi emas.
 */
export type Messages = typeof uz;
