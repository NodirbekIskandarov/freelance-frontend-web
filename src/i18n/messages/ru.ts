import type { Messages } from './uz';

/**
 * Ruscha matnlar.
 *
 * Tuzilma `uz.ts` dan olinadi va tip mosligini TypeScript tekshiradi:
 * yangi kalit qo'shilib, bu yerda unutilsa build yiqiladi. Tarjimasiz
 * qolgan matn saytda o'zbekcha bo'lib chiqib qolmasligi uchun.
 */
export const ru: Messages = {
  seo: {
    materials: {
      title: 'Готовые материалы — задания по университетам',
      description:
        'Готовые задания, самостоятельные и лабораторные работы по университетам Узбекистана. Ищите по предмету и курсу и скачивайте сразу.',
    },
    universityNotFound: {
      title: 'Университет не найден',
      description: 'Запрошенный университет отсутствует в каталоге.',
    },
    university: {
      title: 'Задания {name} — {count} предметов',
      description:
        'Готовые задания для «{fullName}»: самостоятельные, практические и лабораторные работы по {count} предметам.',
    },
    subjectTitle: '{subject} — задания {university}',
    subjectDescription:
      '{university}, {subject}.{course} {count} заданий: готовые решения для самостоятельных, практических и лабораторных работ.',
    courseSuffix: ' {course} курс.',
    subjectNotFound: {
      title: 'Предмет не найден',
      description: 'Запрошенный предмет отсутствует в каталоге.',
    },
    assignmentTitle: '{title} — {subject}',
    assignmentDescription:
      '{university}, предмет «{subject}»: готовые решения для задания «{title}».',
    assignmentNotFound: {
      title: 'Задание не найдено',
      description: 'Запрошенное задание отсутствует в каталоге.',
    },
    login: {
      title: 'Вход',
      description: 'Войдите в аккаунт Yopamiz.uz и управляйте своими заданиями.',
    },
    register: {
      title: 'Регистрация',
      description:
        'Создайте аккаунт на Yopamiz.uz — готовые материалы, фрилансеры и задания в одном месте.',
    },
    forgot: {
      title: 'Восстановление пароля',
      description:
        'Получите код подтверждения по номеру телефона или email и обновите пароль аккаунта Yopamiz.uz.',
    },
  },

  common: {
    loading: 'Загрузка…',
    save: 'Сохранить',
    saving: 'Сохранение…',
    cancel: 'Отмена',
    close: 'Закрыть',
    back: 'Назад',
    next: 'Далее',
    search: 'Поиск',
    retry: 'Повторить',
    delete: 'Удалить',
    edit: 'Изменить',
    confirm: 'Подтвердить',
    all: 'Все',
    none: '—',
    yes: 'Да',
    no: 'Нет',
    more: 'Подробнее',
    showAll: 'Показать все',
    empty: 'Пока нет данных',
    error: 'Произошла ошибка',
    comingSoon: 'Скоро',
  },

  locale: {
    switcherLabel: 'Язык сайта',
    ariaSwitch: 'Переключить с {from} на {to}',
  },

  assignmentTypes: {
    independent: 'Самостоятельные работы',
    practical: 'Практические работы',
    laboratory: 'Лабораторные работы',
    course_work: 'Курсовые работы',
    other: 'Другое',
  },

  tasks: {
    searchPlaceholder: 'Поиск...',
    filter: 'Фильтр',
    notFound: 'Задание не найдено',
    sectionEmpty: 'В этом разделе пока пусто',
    changeSearch: 'Измените запрос или фильтр.',
    beFirst: 'Загрузите задание первым.',
    variantCount: '{count} вариантов',
    noVariants: 'Без вариантов',
    hasSolution: 'Есть решение',
    hasDemand: 'Есть спрос',
    noSolution: 'Решения нет',
    nothingSelected: 'Задание не выбрано',
    pickFromList: 'Выберите из списка слева или загрузите новое задание.',
  },

  materials: {
    breadcrumbHome: 'Главная',
    breadcrumbMaterials: 'Готовые материалы',
    heading: 'Готовые материалы',
    lead: '{institutes} вузов и {subjects} предметов. Выберите вуз, предмет и задание — и получите готовое решение.',
    itemListName: 'Готовые материалы Yopamiz.uz',
    subjectCount: '{count} предметов',
    subjectsOf: 'Предметы {name}',
    assignmentsOf: 'Задания: {name}',
    course: '{course} курс',
    taskCount: '{count} заданий',
  },

  nav: {
    home: 'Главная',
    notes: 'Конспекты',
    materials: 'Готовые материалы',
    freelancers: 'Фрилансеры',
    help: 'Помощь',
    mainMenu: 'Основное меню',
    menu: 'Меню',
  },

  header: {
    login: 'Войти',
    register: 'Регистрация',
    cabinet: 'Кабинет',
    logout: 'Выйти',
  },

  footer: {
    tagline: 'Все услуги для студентов в одном месте. Качественно, быстро и надёжно.',
    platform: 'Платформа',
    home: 'Главная',
    assignments: 'Задания',
    notes: 'Конспекты',
    drawing: 'Черчение',
    diploma: 'Дипломные работы',
    freelancers: 'Фрилансеры',
    becomeFreelancer: 'Стать фрилансером',
    findFreelancer: 'Найти фрилансера',
    exchange: 'Биржа',
    help: 'Помощь',
    faq: 'FAQ',
    rules: 'Правила',
    about: 'О нас',
    appeals: 'Обращения',
    contact: 'Контакты',
    rights: '© {year} Yopamiz.uz — Все права защищены',
    madeFor: 'Создано для Узбекистана',
  },

  auth: {
    loginTitle: 'Вход',
    loginSubtitle: 'Войдите через Google, номер телефона или email.',
    registerTitle: 'Регистрация',
    phone: 'Номер телефона',
    email: 'Email',
    emailPlaceholder: 'imya@example.com',
    password: 'Пароль',
    passwordPlaceholder: '••••••••',
    forgot: 'Забыли пароль?',
    submitLogin: 'Войти',
    submittingLogin: 'Выполняется вход...',
    noAccount: 'Нет аккаунта?',
    goRegister: 'Зарегистрируйтесь',
    haveAccount: 'Вспомнили пароль?',
    goLogin: 'Войти',
    or: 'или',
    methodPhone: 'Телефон',
    methodEmail: 'Email',
    methodTabsLabel: 'Способ входа',
    emailComingSoon:
      'Чтобы входить по email, привяжите его в разделе «Способы входа» вашего профиля.',
    emailIncomplete: 'Введите email полностью.',
    phoneIncomplete: 'Номер телефона неполный. Например: 90 123 45 67',
    termsLink: 'Условия использования и политика конфиденциальности',
  },

  register: {
    title: 'Регистрация',
    subtitle: 'Введите свой номер — мы отправим код подтверждения.',
    sendCode: 'Отправить код',
    sending: 'Отправка...',
    codeTitle: 'Подтвердите номер',
    codeSubtitle: 'Введите код, отправленный на номер +998 {phone}.',
    codeLength: 'Код должен состоять из {length} цифр',
    demoHint: 'SMS ещё не подключено. Тестовый код: {code} — нажмите, он подставится сам.',
    verify: 'Подтвердить',
    verifying: 'Проверка...',
    changePhone: 'Изменить номер',
    resend: 'Отправить код повторно',
    resendFailed: 'Не удалось отправить код повторно',
    profileTitle: 'Заполните данные',
    profileSubtitle: 'Номер подтверждён. Теперь укажите имя и пароль.',
    fullName: 'Имя и фамилия',
    fullNamePlaceholder: 'Дилноза Каримова',
    fullNameRequired: 'Укажите имя и фамилию',
    finish: 'Завершить',
    haveAccount: 'Уже есть аккаунт?',
    goLogin: 'Войдите',
  },

  forgot: {
    title: 'Восстановление пароля',
    subtitle:
      'Введите номер телефона или email, привязанный к аккаунту, — мы отправим код подтверждения.',
    verifiedEmailOnly: 'Код отправляется только на подтверждённый email.',
    sendCode: 'Отправить код',
    sending: 'Отправка...',
    codeTitle: 'Введите код',
    codeSubtitlePhone: 'Введите код, отправленный на номер {identifier}.',
    codeSubtitleEmail: 'Введите код, отправленный на адрес {identifier}.',
    demoHint: 'Доставка ещё не подключена. Тестовый код: {code} — нажмите, он подставится сам.',
    newPassword: 'Новый пароль',
    repeatPassword: 'Повторите пароль',
    submit: 'Обновить пароль',
    submitting: 'Сохранение...',
    resend: 'Отправить код повторно',
    resendFailed: 'Не удалось отправить код повторно. Подождите немного.',
    weakPassword: 'Новый пароль не соответствует требованиям.',
    mismatch: 'Пароли не совпадают.',
    doneTitle: 'Пароль обновлён',
    doneSubtitle: 'Теперь вы можете войти с новым паролем.',
    goToLogin: 'Перейти ко входу',
  },

  changePassword: {
    titleChange: 'Смена пароля',
    titleSet: 'Установка пароля',
    descChange: 'Любой, кто знает пароль, войдёт в ваш аккаунт — обновляйте его время от времени.',
    descSet:
      'Ваш аккаунт создан без пароля. Установите его — и сможете входить, не дожидаясь кода.',
    actionChange: 'Изменить',
    actionSet: 'Установить пароль',
    current: 'Текущий пароль',
    new: 'Новый пароль',
    repeat: 'Повторите новый пароль',
    done: 'Пароль обновлён.',
    weak: 'Новый пароль не соответствует требованиям.',
    mismatch: 'Пароли не совпадают.',
  },

  password: {
    rulesTitle: 'Требования к паролю',
    minLength: 'Минимум 8 символов',
    hasLetter: 'Минимум 1 буква (a-z или A-Z)',
    hasDigit: 'Минимум 1 цифра (0-9)',
    example: 'Пример: ',
    ariaLabel: 'Требования к паролю',
  },
};
