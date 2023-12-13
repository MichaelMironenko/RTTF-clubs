new Vue({
  el: "#app",
  data: {
    mainSection: {
      heading: "Клуб настольного тенниса Лу.Центр",
      subheading: "г. Москва, Старокирочный переулок д.2",
      image: "images/main-section-bg.webp",
    },
    aboutClub: {
      heading: "О клубе",
      text: "Клуб открылся в 2015 году. С тех пор мы держим планку качества и неустанно развиваемся, чтобы сделать клуб удобным, безопасным, доступным.",
      features: [
        "Комфортные раздевалки с санузлом, душевыми и запираемыми шкафчиками",
        "9 профессиональных столов Stiga Expert Roller",
        "Стол с роботом Butterfly Amicus professional",
        "Спортивный линолеум Tarkett толщиной 6,5 мм",
        "Высота потолков 5 метров",
      ],
      galleryImages: [
        "images/image-32.png",
        "images/group-training.jpg",
        "images/news-1.jpg",
        "images/group-training.jpg",
        "images/news-1.jpg",
        "images/image-32.png",
        "images/group-training.jpg",
        "images/image-32.png",
        "images/group-training.jpg",
        "images/news-1.jpg",
        "images/group-training.jpg",
        "images/news-1.jpg",
        "images/image-32.png",
        "images/group-training.jpg",
        "images/image-32.png",
        "images/group-training.jpg",
        "images/news-1.jpg",
        "images/group-training.jpg",
        "images/news-1.jpg",
        "images/image-32.png",
      ],
    },

    news: [
      {
        id: 1,
        date: "2023-10-22",
        title: "Утренние тренировки",
        text: `Мы рады объявить о запуске новых утренних групп для начинающих, которые будут проходить с 9:00 до 10:30 каждый понедельник и среду. Эти занятия созданы специально для тех, кто хочет начать свой день с заряда энергии и позитива, развивая при этом новые навыки и улучшая физическую форму.

Утренние часы — это идеальное время для тренировок, которые помогут установить тон для всего остального дня. В нашей новой программе, разработанной опытными тренерами, вы найдете уникальное сочетание базовых упражнений и техник, которые помогут вам не только освоить основы настольного тенниса, но и научат вас правильной технике и стратегии игры.

Занятия начнутся уже эту среду, и мы приглашаем всех, кто хочет присоединиться к утренним группам. Нет лучшего способа сделать ваше утро продуктивным, чем динамичная игра в настольный теннис. Записаться на занятия можно уже сейчас, позвонив по номеру, указанному на нашем сайте, или оставив заявку в ресепшн нашего клуба.`,
        image: "",
        link: "https://www.rttf.ru/news1.html",
      },
      {
        id: 2,
        date: "2023-09-15",
        title: "Турнир выходного дня",
        text: "Приглашаем всех желающих на еженедельные турниры по настольному теннису каждую субботу.",
        image: "images/news-2.jpg",
        link: "https://www.rttf.ru/news2.html",
      },
      {
        id: 3,
        date: "2023-08-30",
        title: "Обучающие семинары",
        text: "Присоединяйтесь к нашим семинарам по тактике игры в настольный теннис каждую пятницу вечером. Присоединяйтесь к нашим семинарам по тактике игры в настольный теннис каждую пятницу вечером Присоединяйтесь к нашим семинарам по тактике игры в настольный теннис каждую пятницу вечером",
        image: "images/news-4.jpg",
        link: "https://www.rttf.ru/news2.html",
      },
      {
        id: 4,
        date: "2023-07-12",
        title: "Летние скидки на абонементы",
        text: "Специальное летнее предложение - скидки на абонементы для новых клиентов на июль и август.",
        image: "images/news-4.jpg",
        link: "https://www.rttf.ru/news3.html",
      },
      {
        id: 5,
        date: "2023-06-20",
        title: "Детские группы",
        text: "Запись в детские группы по настольному теннису открыта! Тренировки проводятся по вторникам и четвергам.",
        image: "images/news-5.jpg",
        link: "https://www.rttf.ru/news4.html",
      },
    ],
    selectedNews: null,
    days: [
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
      "Воскресенье",
    ],
    events: [
      {
        type: "training",
        day: "Понедельник",
        startTime: "19:30",
        endTime: "21:30",
        name: "Боковые подачи и их прием",
        moreDetails: "Смирнов А.",
      },
      {
        type: "tournament",
        day: "Пятница",
        startTime: "14:00",
        endTime: "16:00",
        name: "Турнир высшей лиги",
        moreDetails: "< 312",
      },
      {
        type: "training",
        day: "Воскресенье",
        startTime: "21:30",
        endTime: "22:30",
        name: "Топ-спин справа со всего стола",
        moreDetails: "Петров В.",
      },
      {
        type: "tournament",
        day: "Вторник",
        startTime: "20:30",
        endTime: "23:00",
        name: "Весенний чемпионат",
        moreDetails: "< 911",
      },
      {
        type: "training",
        day: "Понедельник",
        startTime: "08:30",
        endTime: "10:30",
        name: "Защитная тактика",
        moreDetails: "Иванов Б.",
      },
      {
        type: "tournament",
        day: "Понедельник",
        startTime: "12:00",
        endTime: "15:00",
        name: "Летние игры",
        moreDetails: "< 675",
      },
      {
        type: "training",
        day: "Пятница",
        startTime: "20:00",
        endTime: "21:00",
        name: "Работа ног",
        moreDetails: "Иванов Б.",
      },
      {
        type: "tournament",
        day: "Понедельник",
        startTime: "20:30",
        endTime: "22:30",
        name: "Кубок вызова",
        moreDetails: "< 970",
      },
      {
        type: "training",
        day: "Среда",
        startTime: "13:00",
        endTime: "14:00",
        name: "Топ-спин справа со всего стола",
        moreDetails: "Петров В.",
      },
      {
        type: "tournament",
        day: "Понедельник",
        startTime: "11:30",
        endTime: "14:30",
        name: "Чемпионат области",
        moreDetails: "< 638",
      },
      {
        type: "training",
        day: "Четверг",
        startTime: "12:00",
        endTime: "13:00",
        name: "Атакующие удары",
        moreDetails: "Петров В.",
      },
      {
        type: "tournament",
        day: "Четверг",
        startTime: "15:30",
        endTime: "18:30",
        name: "Турнир высшей лиги",
        moreDetails: "< 198",
      },
      {
        type: "training",
        day: "Четверг",
        startTime: "10:00",
        endTime: "12:00",
        name: "Стратегия игры на сетке",
        moreDetails: "Иванов Б.",
      },
      {
        type: "tournament",
        day: "Четверг",
        startTime: "18:00",
        endTime: "20:00",
        name: "Весенний чемпионат",
        moreDetails: "< 101",
      },
      {
        type: "training",
        day: "Четверг",
        startTime: "20:00",
        endTime: "21:00",
        name: "Топ-спин справа со всего стола",
        moreDetails: "Смирнов А.",
      },
    ],
    selectedDay: null,
    coaches: [
      {
        id: "1",
        name: "Анна Вознесенская",
        rating: 4.9,
        reviewsCount: "105",
        info: "Мастер спорта России. Многократный чемпион Москвы. Призёр ТОП-12 и ТОП-24 сильнейших спортсменов России.",
        playingExperience: "13",
        coachingExperience: "7",
        price: "2500",
        profileLink: "https://rttf.ru/players/anna-voznesenskaya",
        photo: "images/trainer-1.jpg",
      },
      {
        id: "2",
        name: "Антон Булдак",
        rating: 4.9,
        reviewsCount: "105",
        info: "Магистр физической культуры, тренерский стаж более 9 лет, имеет многолетний опыт тренерской работы и подготовки спортсменов разного уровня.",
        playingExperience: "11",
        coachingExperience: "6",
        price: "2500",
        profileLink: "https://rttf.ru/players/anton-buldak",
        photo: "images/trainer-2.jpg",
      },
      {
        id: "3",
        name: "Никита Курильчик",
        rating: 4.9,
        reviewsCount: "105",
        info: "Мастер спорта по настольному теннису. Мастер спорта Республики Беларусь.",
        playingExperience: "8",
        coachingExperience: "2",
        price: "2500",
        profileLink: "https://rttf.ru/players/nikita-kurilchik",
        photo: "images/trainer-3.jpg",
      },
    ],
    selectedCoach: null,
    prices: {
      title: "Цены",
      menu: [
        {
          title: "Аренда стола (55 минут)",
          items: [
            { text: "Будни c 7:00 до 18:00", price: "600 ₽" },
            {
              text: "Будни c 18:00 до 23:00, выходные и праздничные дни",
              price: "700 ₽",
            },
            { text: "Робот «Robo-Pong» + стол", price: "1000 ₽" },
          ],
        },
        {
          title: "Абонементы на аренду стола (10 часов)",
          items: [
            { text: "Будни c 7:00 до 18:00", price: "5000 ₽" },
            {
              text: "Будни c 18:00 до 23:00, выходные и праздничные дни",
              price: "6000 ₽",
            },
          ],
        },
        {
          title: "Аренда инвентаря",
          items: [
            { text: "Ракетка", price: "100 ₽" },
            { text: "Ракетка + мячи (2-4 шт)", price: "100 ₽" },
            { text: "БКМ (большое количество мячей - 50 шт)", price: "300 ₽" },
          ],
        },
      ],
    },
    expandedComment: null,
    reviews: {
      title: "Отзывы с сайта RTTF",
      averageRating: 4.8,
      reviewData: [
        {
          name: "Александр Семёнов",
          rating: 5,
          gameRating: 950,
          comment:
            "Великолепные условия для игры! Столы отличного качества, а освещение идеально подходит для тренировок.",
          date: "24 июня 2023 г.",
          avatar: "images/user1.jpg",
        },
        {
          name: "Дмитрий Смирнов",
          rating: 4,
          gameRating: 870,
          comment:
            "Хорошая обстановка и дружелюбный персонал. Немного тесно в часы пик, но в остальное время - отлично.",
          date: "15 июля 2023 г.",
          avatar: "images/user2.jpg",
        },
        {
          name: "Игорь Николаев",
          rating: 5,
          gameRating: 820,
          comment:
            "Превосходные тренеры, которые действительно помогают улучшить технику игры. Отлично подходит для всех уровней подготовки.",
          date: "10 августа 2023 г.",
          avatar: "images/user3.jpg",
        },
        {
          name: "Елена Петрова",
          rating: 5,
          gameRating: 910,
          comment:
            "Клуб предлагает разнообразные турниры и соревнования, что очень мотивирует. Также здесь прекрасная атмосфера.",
          date: "21 августа 2023 г.",
          avatar: "images/user4.jpg",
        },
        {
          name: "Мария Иванова",
          rating: 5,
          gameRating: 780,
          comment:
            "Мой любимый клуб. Хожу сюда уже больше года. Отличный персонал, всегда помогут и подскажут. Хорошее освещение, много места вокруг столов. Комфортные раздевалки, есть места для парковки рядом со зданием. Всё отлично.Мой любимый клуб. Хожу сюда уже больше года. Отличный персонал, всегда помогут и подскажут. Хорошее освещение, много места вокруг столов. Комфортные раздевалки, есть места для парковки рядом со зданием. Всё отлично.",
          date: "2 сентября 2023 г.",
          avatar: "images/user5.jpg",
        },
      ],
    },

    contacts: {
      title: "Контакты",
      clubName: "Лу.Центр",
      logo: "images/sitelogo.png",
      location: {
        address: "г. Москва, Старокирочный переулок д.2",
        metroLineColor: "blue",
        metroStation: "Бауманская",
      },
      workingHours: [
        {
          title: "Пн-Пт:",
          hours: "07:00 - 23:00",
        },
        {
          title: "Сб-Вс:",
          hours: "09:00 - 00:00",
        },
      ],
      whatsapp: "https://wa.me/79253697082",
      telegram: "https://t.me/club",
      phone: "+7 (925) 369 70 82",
      email: "vlttc@mail.ru",
      social: {
        vk: "https://vk.com",
        telegram: "https://t.me",
        instagram: "https://instagram.com",
        odnoklassniki: "https://ok.ru",
      },
      rttfURL: "https://rttf.ru",
    },
    isNavOpen: false,
    selectedCoachName: "",
    isContactFormVisible: false,
    currentSlide: 0,
    startX: 0,
    currentX: 0,
    cachedCarouselWidth: 0,
    isDragging: false,
  },

  mounted() {
    this.setupMenu();
    setTimeout(this.loadMapScript, 4000);
    this.updateCarouselWidth();
    window.addEventListener("resize", this.updateCarouselWidth); // Обновление ширины карусели при изменении размера окна
    this.applyTransform();
    this.selectDay(this.days[0]);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateCarouselWidth); // Удаление обработчика при уничтожении компонента
  },
  // created: function () {
  //   this.times = this.generateTimes(7, 23);
  // },
  methods: {
    formatDate(dateString) {
      const months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
      ];
      const date = new Date(dateString);
      const day = date.getDate();
      const month = months[date.getMonth()];
      let formattedDate = `${day} ${month}`;
      if (date.getFullYear() !== new Date().getFullYear()) {
        formattedDate += ` ${date.getFullYear()} г.`;
      }
      return formattedDate;
    },
    loadMapScript() {
      // Создаем тег script для загрузки Yandex карты
      const script = document.createElement("script");
      script.src =
        "https://api-maps.yandex.ru/2.1/?apikey=b8881559-3564-4ced-9428-3763a582d14d&lang=ru_RU";
      script.type = "text/javascript";
      document.body.appendChild(script);

      // Инициализация карты после загрузки скрипта
      script.onload = () => {
        ymaps.ready(this.initMap);
      };
    },
    initMap() {
      ymaps
        .geocode(this.contacts.location.address, { results: 1 })
        .then((res) => {
          const firstGeoObject = res.geoObjects.get(0);
          const coords = firstGeoObject.geometry.getCoordinates();
          const bounds = firstGeoObject.properties.get("boundedBy");

          this.myMap = new ymaps.Map("yandex-map", {
            center: coords,
            zoom: 17,
          });

          const placemark = new ymaps.Placemark(
            coords,
            {},
            {
              preset: "islands#darkOrangeDotIcon", // Выбор стандартного стиля для иконки
            }
          );

          this.myMap.geoObjects.add(placemark);
          this.myMap.setBounds(bounds, {
            checkZoomRange: true,
          });
        });
    },

    // Метод для перехода к событию
    navigateTo(url) {
      window.location.href = url;
    },
    getYearsWord(years) {
      if (years % 10 === 1 && years % 100 !== 11) {
        return "год";
      } else if (
        years % 10 >= 2 &&
        years % 10 <= 4 &&
        (years % 100 < 10 || years % 100 >= 20)
      ) {
        return "года";
      } else {
        return "лет";
      }
    },
    getEventType(type) {
      return type === "training" ? "Тренировка" : "Турнир";
    },
    selectDay(day) {
      this.selectedDay = day;
    },
    formatDay(day) {
      const dayMap = {
        Понедельник: "Пн",
        Вторник: "Вт",
        Среда: "Ср",
        Четверг: "Чт",
        Пятница: "Пт",
        Суббота: "Сб",
        Воскресенье: "Вс",
      };
      return dayMap[day] || day;
    },
    openModal(newsItem) {
      this.selectedNews = newsItem;
    },
    closeModal() {
      this.selectedNews = null;
    },

    formatText(text) {
      return text
        .split("\n")
        .map((paragraph) => `<p>${paragraph}</p>`)
        .join("");
    },
    openCoachModal(coach) {
      this.selectedCoachName = coach.name;
      this.isContactFormVisible = true;
    },
    closeCoachModal() {
      this.isContactFormVisible = false;
    },
    toggleComment(index) {
      this.expandedComment = this.expandedComment === index ? null : index;
    },
    setupMenu() {
      var hamburger = this.$el.querySelector(".nav-hamburger");
      var navLinks = this.$el.querySelector(".nav-links");
      var navClose = this.$el.querySelector(".nav-close");

      if (hamburger && navLinks && navClose) {
        hamburger.addEventListener("click", () => {
          navLinks.classList.add("active");
          navClose.classList.add("active");
          hamburger.classList.add("active");
        });

        navClose.addEventListener("click", () => {
          navLinks.classList.remove("active");
          navClose.classList.remove("active");
          hamburger.classList.remove("active");
        });
      } else {
        if (!hamburger)
          console.error("The hamburger element is not found in the DOM.");
        if (!navLinks)
          console.error("The nav-links element is not found in the DOM.");
        if (!navClose)
          console.error("The nav-close element is not found in the DOM.");
      }
    },

    getStarImage(rating, index) {
      const fullStarIndex = Math.floor(rating);
      const halfStarIndex = fullStarIndex + (rating % 1 > 0 ? 1 : 0);

      if (index <= fullStarIndex) {
        return "images/full-star.svg";
      } else if (index === halfStarIndex) {
        return "images/half-star.svg"; // Путь к изображению полупустой звезды
      } else {
        return "images/empty-star.svg";
      }
    },

    toggleNav() {
      this.isNavOpen = !this.isNavOpen;
    },
    handleNavLinkClick(section) {
      // Прокрутка к нужному разделу
      const element = document.querySelector(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }

      // Закрытие навигационного меню
      this.closeNav();
    },
    closeNav() {
      this.isNavOpen = false;
    },
    handleTouchStart(event) {
      this.startX = event.touches[0].clientX;
      this.currentX = -this.currentSlide * this.cachedCarouselWidth;
      this.isDragging = true;
    },
    handleTouchMove(event) {
      event.preventDefault(); // Отключение прокрутки страницы
      if (!this.isDragging) return;
      let touchX = event.touches[0].clientX;
      let diffX = touchX - this.startX;

      // Обновление currentX для непосредственного отслеживания движения пальца
      this.currentX = diffX + -this.currentSlide * this.cachedCarouselWidth;
      this.applyTransform();
    },
    handleTouchEnd(event) {
      this.isDragging = false;
      let endX = event.changedTouches[0].clientX;
      let diffX = endX - this.startX;

      if (Math.abs(diffX) > this.cachedCarouselWidth / 3) {
        diffX > 0 ? this.prevSlide() : this.nextSlide();
      } else {
        this.currentX = -this.currentSlide * this.cachedCarouselWidth; // Возврат на текущий слайд
        this.applyTransform();
      }
    },
    applyTransform() {
      this.$refs.carouselInner.style.transform = `translateX(${this.currentX}px)`;
    },
    nextSlide() {
      if (this.currentSlide < this.aboutClub.galleryImages.length - 1) {
        this.currentSlide++;
        this.currentX = -this.currentSlide * this.cachedCarouselWidth;
        this.applyTransform();
      } else {
        this.snapBack();
      }
    },
    prevSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--;
        this.currentX = -this.currentSlide * this.cachedCarouselWidth;
        this.applyTransform();
      } else {
        this.snapBack();
      }
    },
    snapBack() {
      this.currentX = -this.currentSlide * this.cachedCarouselWidth; // Возврат на текущий слайд
      this.applyTransform();
    },
    updateCarouselWidth() {
      this.cachedCarouselWidth = this.$refs.carousel.offsetWidth;
    },
  },
  computed: {
    isCommentLong() {
      return (comment) => comment.length > 150;
    },
    filteredEvents() {
      let times = {};
      this.events.forEach((event) => {
        // Используйте startTime для создания ключей в объекте times
        const eventTimeKey = event.startTime.replace(":", "");
        if (!times[eventTimeKey]) {
          times[eventTimeKey] = { time: event.startTime, events: {} };
        }
        times[eventTimeKey].events[event.day] = event;
      });
      // Сортировка по времени начала события
      const sortedTimes = Object.values(times).sort((a, b) => {
        return (
          parseInt(a.time.replace(":", ""), 10) -
          parseInt(b.time.replace(":", ""), 10)
        );
      });
      return sortedTimes;
    },
    eventsForSelectedDay() {
      if (this.selectedDay) {
        // Фильтруем события для выбранного дня
        const filteredEvents = this.events.filter(
          (event) => event.day === this.selectedDay
        );

        // Сортируем отфильтрованные события по времени начала
        return filteredEvents.sort((a, b) => {
          const startTimeA = a.startTime
            .split(":")
            .map((num) => parseInt(num, 10));
          const startTimeB = b.startTime
            .split(":")
            .map((num) => parseInt(num, 10));
          return startTimeA[0] - startTimeB[0] || startTimeA[1] - startTimeB[1];
        });
      }
      return [];
    },
    carouselWidth() {
      return this.cachedCarouselWidth; // Использование кэшированного значения
    },
    displayIndicators() {
      const total = this.aboutClub.galleryImages.length;
      let indicators = [];

      // Если 10 или меньше фото, показываем индикаторы для всех
      if (total <= 30) {
        for (let i = 0; i < total; i++) {
          indicators.push(i);
        }
      } else {
        // Создаем массив с 5 элементами для индикаторов
        indicators = new Array(5).fill(null);

        // Сценарий для начала карусели
        if (this.currentSlide < 2) {
          for (let i = 0; i <= 4; i++) {
            indicators[i] = i;
          }
        }
        // Сценарий для конца карусели
        else if (this.currentSlide > total - 3) {
          for (let i = 0; i <= 4; i++) {
            indicators[i] = total - 5 + i;
          }
        }
        // Сценарий для середины карусели
        else {
          indicators[0] = 0; // Первый индикатор
          indicators[1] = this.currentSlide - 1; // Один перед текущим
          indicators[2] = this.currentSlide; // Текущий
          indicators[3] = this.currentSlide + 1; // Один после текущего
          indicators[4] = total - 1; // Последний индикатор
        }
      }

      return indicators;
    },
  },
});
