const { createApp } = Vue;

const App = {
  el: "#app",
  data() {
    return {
      isNavOpen: false,
      selectedCoachName: "",
      isContactFormVisible: false,
      currentSlide: 0,
      startX: 0,
      currentX: 0,
      cachedCarouselWidth: 0,
      isDragging: false,
      selectedDay: null,
      isLoading: true,
      selectedNews: null,
    };
  },

  mounted() {
    this.loadData();
  },
  // created: function () {
  //   this.times = this.generateTimes(7, 23);
  // },
  methods: {
    async loadData() {
      this.isLoading = true;
      // Начало загрузки данных
      try {
        const response = await fetch("edit/data.json");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        this.mainInfo = data.sections.mainInfo;
        this.aboutClub = data.sections.aboutClub;
        this.news = data.sections.news;
        this.activities = data.sections.activities;
        this.prices = data.sections.prices;
        this.coaches = data.sections.coaches;
        this.reviews = data.sections.reviews;
        this.contacts = data.sections.contacts;

        // Загрузка других данных...
      } catch (e) {
        console.error("Ошибка при загрузке данных: ", e);
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.updateCarouselWidth();
          this.applyTransform();
          window.addEventListener("resize", this.updateCarouselWidth);
          if (this.activities && this.activities.days) {
            this.selectDay(this.activities.days[0]);
          }
        });
      }
    },

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
      ymaps.geocode(this.contacts.address, { results: 1 }).then((res) => {
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
    addCategory() {
      this.prices.menu.push({
        title: "",
        items: [],
      });
    },

    deleteCategory(category) {
      this.prices.menu.splice(this.prices.menu.indexOf(category), 1);
    },

    addItem(category) {
      category.items.push({
        text: "",
        price: "",
      });
    },

    deleteItem(category, item) {
      category.items.splice(category.items.indexOf(item), 1);
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
    calculateExperience(yearsString) {
      const startDate = new Date(yearsString);
      const currentDate = new Date();

      let years = currentDate.getFullYear() - startDate.getFullYear();
      const monthDifference = currentDate.getMonth() - startDate.getMonth();

      // Уменьшаем количество лет, если текущий месяц еще не наступил
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && currentDate.getDate() < startDate.getDate())
      ) {
        years--;
      }

      return years;
    },
    toggleComment(index) {
      this.expandedComment = this.expandedComment === index ? null : index;
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
      if (this.currentSlide < this.aboutClub.imageData.length - 1) {
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
    navLinks() {
      let links = [
        { id: "about", text: "О клубе", href: "#about", show: true }, // Всегда показываем
        {
          id: "news",
          text: "Новости и акции",
          href: "#news",
          show: this.news.showBlock,
        },
        {
          id: "activities",
          text: "Турниры и тренировки",
          href: "#activities",
          show: this.activities.showBlock,
        },
        {
          id: "prices",
          text: "Цены",
          href: "#prices",
          show: this.prices.showBlock,
        },
        {
          id: "coaches",
          text: "Тренеры",
          href: "#coaches",
          show: this.coaches.showBlock,
        },
        {
          id: "reviews",
          text: "Отзывы",
          href: "#reviews",
          show: this.reviews.showBlock,
        },
        { id: "contacts", text: "Контакты", href: "#contacts", show: true }, // Всегда показываем
      ];
      return links.filter((link) => link.show);
    },
    isCommentLong() {
      return (comment) => comment.length > 150;
    },
    filteredEvents() {
      let times = {};
      this.activities.events.forEach((event) => {
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
        const filteredEvents = this.activities.events.filter(
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
      const total = this.aboutClub.imageData.length;
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
};
const app = createApp(App);

app.mount("#app");
