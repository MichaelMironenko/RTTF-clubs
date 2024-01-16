const { createApp } = Vue;

const InputField = {
  props: {
    id: String,
    label: String,
    type: { type: String, default: "text" },
    // value: String,
    rows: { type: Number, default: 3 },
    maxlength: Number,
    required: Boolean,
    error: Boolean,
    errorMessage: String,
    isSubmitAttempted: Boolean,
    sectionName: String,
    placeholder: String,
    modelValue: String,
  },

  computed: {
    charsLeft() {
      return this.maxlength - this.modelValue.length;
    },
    effectiveErrorMessage() {
      return this.errorMessage || "Введите текст";
    },
    shouldShowError() {
      return (
        this.required &&
        !this.modelValue &&
        (this.isSubmitAttempted || this.modelValue !== "")
      );
    },
  },
  methods: {
    updateValue(event) {
      this.$emit("update:modelValue", event.target.value);
    },
  },

  template: `
  <div class="input-wrapper">
      <label :for="id" :class="{ 'required-label': required }">{{ label }}</label>
      <div class="input-and-error">
        <input v-if="type !== 'textarea'" :type="type" :placeholder="placeholder" :id="id" :class="{ 'error-border': shouldShowError }" :value="modelValue" :maxlength="maxlength"
            @input="updateValue"/>
        <textarea v-else :id="id" :value="modelValue" :placeholder="placeholder" :class="{ 'error-border': shouldShowError }"   :maxlength="maxlength" :rows="rows"
            @input="updateValue"></textarea>
        <div class="input-feedback"> 
          <div class="error-message" v-if="shouldShowError">{{ effectiveErrorMessage }}</div>
          <div class="character-count" v-if="charsLeft <= 10">{{ charsLeft }}</div>
        </div>
      </div>
    </div>`,
};

const PhotoUpload = {
  data() {
    return {
      imageData: null,
    };
  },
  props: {
    label: String,
    modelValue: String,
    isAvatar: Boolean,
    sectionId: String,
  },
  methods: {
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    handleFileSelected(event) {
      const file = event.target.files[0];
      this.previewImage(file);
    },
    previewImage(file) {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Определение длинной стороны и коэффициента масштабирования
            const isWidthLonger = img.width >= img.height;
            const scaleFactor = isWidthLonger
              ? 600 / img.width
              : 600 / img.height;

            // Установка размеров канваса
            canvas.width = isWidthLonger ? 600 : img.width * scaleFactor;
            canvas.height = isWidthLonger ? img.height * scaleFactor : 600;

            // Рисование и компрессия изображения
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedImage = canvas.toDataURL("image/webp", 0.8); // Использование формата WebP

            this.$emit("update:modelValue", compressedImage);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    dragOverHandler(event) {
      event.preventDefault();
      event.currentTarget.classList.add("dragover");
    },
    dragLeaveHandler(event) {
      event.currentTarget.classList.remove("dragover");
    },
    dropHandler(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      this.previewImage(file);
      event.currentTarget.classList.remove("dragover");
    },
  },
  template: `
   <div class="avatar-upload-area" >
      <label class="avatar-label">{{ label }}</label>
      <div class="upload-container">
        <div  :class="{ 'avatar-container': isAvatar }" >
          <img v-if="modelValue" :src="modelValue" :alt="label + ' preview'" class="avatar-placeholder" />
          <img v-else src="user-photo.svg" alt="label + ' placeholder'" class="avatar-placeholder" />
        </div>
        <div class="upload-area" @click="triggerUpload" @dragover="dragOverHandler" 
             @dragleave="dragLeaveHandler" @drop="dropHandler">
          <img src="upload-icon.svg" alt="Upload" class="upload-icon" />
          <span class="upload-text">Загрузить фото</span>
        </div>
        <input type="file" ref="fileInput" @change="handleFileSelected" class="upload-input" />
      </div>
    </div>
  `,
};

const MultiplePhotoUpload = {
  data() {
    return {
      imageData: [],
      draggingIndex: -1,
      placeholderIndex: null,
      hiddenIndex: null,
    };
  },
  props: {
    label: String,
    sectionId: String,
    maxImages: {
      type: Number,
      default: 20,
    },
    initialImageData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    imagesWithPlaceholder() {
      let images = [...this.imageData];
      if (this.placeholderIndex !== null) {
        images.splice(this.placeholderIndex, 0, "placeholder");
      }
      return images;
    },
  },
  mounted() {
    if (this.initialImageData.length > 0) {
      this.imageData = [...this.initialImageData];
    }
    this.setupTouchListeners();
  },
  methods: {
    setupTouchListeners() {
      const container = this.$el.querySelector(".gallery-images");
      if (container) {
        container.addEventListener("touchstart", this.touchStart, {
          passive: false,
        });
        container.addEventListener("touchmove", this.touchMove, {
          passive: false,
        });
        container.addEventListener("touchend", this.touchEnd, {
          passive: false,
        });
      }
    },
    touchStart(index, event) {
      this.dragStart(index);
      event.preventDefault();
    },
    touchMove(event) {
      if (this.draggingIndex !== -1) {
        const touchLocation = event.targetTouches[0];
        const targetElement = document.elementFromPoint(
          touchLocation.clientX,
          touchLocation.clientY
        );
        const targetIndex = this.getElementIndex(targetElement);
        if (targetIndex !== -1) {
          this.dragEnter(targetIndex);
        }
      }
      event.preventDefault();
    },
    touchEnd(event) {
      this.drop();
      event.preventDefault();
    },
    getElementIndex(element) {
      return element && element.parentNode
        ? Array.prototype.indexOf.call(element.parentNode.children, element)
        : -1;
    },
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    handleFileSelected(event) {
      const files = Array.from(event.target.files).slice(
        0,
        this.maxImages - this.imageData.length
      );
      files.forEach((file) => this.previewImage(file));
    },
    dragStart(index) {
      this.draggingIndex = index;
      this.displayData = [...this.imageData];
    },
    dragEnter(index) {
      if (this.draggingIndex !== index) {
        let temp = this.displayData[this.draggingIndex];
        this.displayData.splice(this.draggingIndex, 1);
        this.displayData.splice(index, 0, temp);
        this.draggingIndex = index;
      }
    },
    drop() {
      this.imageData = [...this.displayData];
      this.draggingIndex = -1;
      this.displayData = [];
    },
    removeImage(index) {
      this.imageData.splice(index, 1);
    },
    previewImage(file) {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Calculate the scaling factor to resize the image to 600px width
            const scaleFactor = 600 / img.width;
            const resizedHeight = img.height * scaleFactor;

            canvas.width = 600; // Set canvas width to 600px
            canvas.height = resizedHeight; // Set canvas height to maintain aspect ratio

            // Draw the image on the canvas with the new dimensions
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Convert the canvas content to a data URL (base64 encoded image)
            const dataUrl = canvas.toDataURL("image/jpeg", 0.6); // Adjust the quality as needed

            // Push the resized image to imageData array with isNew flag and original file reference
            this.imageData.push({ src: dataUrl, isNew: true, file: file });
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    async sendNewPhotos() {
      for (let i = 0; i < this.imageData.length; i++) {
        let photo = this.imageData[i];
        if (photo.isNew) {
          try {
            let formData = new FormData();
            const pwdMatch = document.cookie.match(/user_pass=([^;]+)/);
            const pwd = pwdMatch ? pwdMatch[1] : "";
            console.log(this.clubName);
            this.clubName = "rubin";

            formData.append("club", this.clubName);
            formData.append("pwd", pwd);
            formData.append("photo", photo.file);
            for (let [key, value] of formData.entries()) {
              console.log(key, value);
            }
            let response = await fetch("/php/photoLoad.php", {
              method: "POST",
              body: formData,
            });

            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            let result = await response.json();
            console.log(result);
            if (result.err.length > 0) {
              throw new Error(result.err);
            }

            const photoPath = `/photos/${this.clubName}/${result.newName}`;

            // Update the imageData with the new name from the server
            this.imageData[i] = {
              src: photoPath,
              isNew: false,
              file: null,
            };
          } catch (error) {
            console.error("Error uploading photo:", error.message);
          }
        }
      }
    },
    dragOverHandler(event) {
      event.preventDefault();
      event.currentTarget.classList.add("dragover");
    },
    dragLeaveHandler(event) {
      event.currentTarget.classList.remove("dragover");
    },
    dropHandler(event) {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files).slice(
        0,
        this.maxImages - this.imageData.length
      );
      files.forEach((file) => this.previewImage(file));
      event.currentTarget.classList.remove("dragover");
    },
  },
  beforeDestroy() {
    const container = this.$el.querySelector(".gallery-images");
    if (container) {
      container.removeEventListener("touchstart", this.touchStart);
      container.removeEventListener("touchmove", this.touchMove);
      container.removeEventListener("touchend", this.touchEnd);
    }
  },
  template: `
 <div class="gallery-upload-area">
  <label class="photo-label">{{ label }}</label>
  <div class="multiple-images">
    <div v-for="(item, index) in imagesWithPlaceholder" :key="index" class="image-container">
      <div v-if="item === 'placeholder'" class="placeholder"></div>
      <div v-else :draggable="true" :class="{ dragging: index === draggingIndex }" 
           @dragstart="dragStart(index, $event)" 
           @dragover.prevent 
           @dragenter="dragEnter(index)" 
           @dragleave="dragLeave()" 
           @drop="drop()">
        <img :src="item.src" class="photo-preview" />
        <img src="delete.svg" @click="removeImage(index)" class="delete-button" />
      </div>
    </div>
    <div v-if="imageData.length < maxImages" class="upload-area" 
         @click="triggerUpload" 
         @dragover="dragOverHandler" 
         @dragleave="dragLeaveHandler" 
         @drop="dropHandler">
      <img src="upload-icon.svg" alt="Upload" class="upload-icon" />
      <span class="upload-text">Добавить фото</span>
    </div>
  </div>
  <input type="file" ref="fileInput" @change="handleFileSelected" class="upload-input" multiple />
          <div class="button-container">
                <button @click="sendNewPhotos">Сохранить фотки</button>
              </div>
</div>
  `,
};

const App = {
  el: "#vue-app",
  data() {
    return {
      sections: {
        mainInfo: {
          title: "Основная информация",
          displayedTitle: "Клуб настольного тенниса",
          clubName: "",
          logo: null,
          background: null,
        },
        aboutClub: {
          title: "О клубе",
          displayedTitle: "О клубе",
          description: "",
          imageData: [],
        },
        news: {
          title: "Новости и акции",
          showBlock: true,
          displayedTitle: "Новости и акции",
        },
        activities: {
          title: "Турниры и тренировки",
          showBlock: true,
          displayedTitle: "Турниры и тренировки",
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
            // {
            //   id: 1,
            //   type: "training",
            //   day: "Понедельник",
            //   startTime: "19:30",
            //   endTime: "21:30",
            //   name: "Боковые подачи и их прием",
            //   moreDetails: "Смирнов А.",
            // },
            // {
            //   id: 2,
            //   type: "tournament",
            //   day: "Пятница",
            //   startTime: "14:00",
            //   endTime: "16:00",
            //   name: "Турнир высшей лиги",
            //   moreDetails: "< 312",
            // },
            // {
            //   id: 3,
            //   type: "training",
            //   day: "Воскресенье",
            //   startTime: "21:30",
            //   endTime: "22:30",
            //   name: "Топ-спин справа со всего стола",
            //   moreDetails: "Петров В.",
            // },
            // {
            //   id: 4,
            //   type: "tournament",
            //   day: "Вторник",
            //   startTime: "20:30",
            //   endTime: "23:00",
            //   name: "Весенний чемпионат",
            //   moreDetails: "< 911",
            // },
            // {
            //   id: 5,
            //   type: "training",
            //   day: "Понедельник",
            //   startTime: "08:30",
            //   endTime: "10:30",
            //   name: "Защитная тактика",
            //   moreDetails: "Иванов Б.",
            // },
            // {
            //   id: 6,
            //   type: "tournament",
            //   day: "Понедельник",
            //   startTime: "12:00",
            //   endTime: "15:00",
            //   name: "Летние игры",
            //   moreDetails: "< 675",
            // },
            // {
            //   id: 7,
            //   type: "training",
            //   day: "Пятница",
            //   startTime: "20:00",
            //   endTime: "21:00",
            //   name: "Работа ног",
            //   moreDetails: "Иванов Б.",
            // },
            // {
            //   id: 8,
            //   type: "tournament",
            //   day: "Понедельник",
            //   startTime: "20:30",
            //   endTime: "22:30",
            //   name: "Кубок вызова",
            //   moreDetails: "< 970",
            // },
            // {
            //   id: 9,
            //   type: "training",
            //   day: "Среда",
            //   startTime: "13:00",
            //   endTime: "14:00",
            //   name: "Топ-спин справа со всего стола",
            //   moreDetails: "Петров В.",
            // },
            // {
            //   id: 10,
            //   type: "tournament",
            //   day: "Понедельник",
            //   startTime: "11:30",
            //   endTime: "14:30",
            //   name: "Чемпионат области",
            //   moreDetails: "< 638",
            // },
            // {
            //   id: 11,
            //   type: "training",
            //   day: "Четверг",
            //   startTime: "12:00",
            //   endTime: "13:00",
            //   name: "Атакующие удары",
            //   moreDetails: "Петров В.",
            // },
            // {
            //   id: 12,
            //   type: "tournament",
            //   day: "Четверг",
            //   startTime: "15:30",
            //   endTime: "18:30",
            //   name: "Турнир высшей лиги",
            //   moreDetails: "< 198",
            // },
            // {
            //   id: 13,
            //   type: "training",
            //   day: "Четверг",
            //   startTime: "10:00",
            //   endTime: "12:00",
            //   name: "Стратегия игры на сетке",
            //   moreDetails: "Иванов Б.",
            // },
            // {
            //   id: 14,
            //   type: "tournament",
            //   day: "Четверг",
            //   startTime: "18:00",
            //   endTime: "20:00",
            //   name: "Весенний чемпионат",
            //   moreDetails: "< 101",
            // },
            // {
            //   id: 15,
            //   type: "training",
            //   day: "Четверг",
            //   startTime: "20:00",
            //   endTime: "21:00",
            //   name: "Топ-спин справа со всего стола",
            //   moreDetails: "Смирнов А.",
            // },
          ],
          currentDay: "Понедельник",
        },
        coaches: {
          title: "Тренеры клуба",
          showBlock: true,
          displayedTitle: "Тренеры клуба",
          coachesList: [
            //   {
            //     id: "1",
            //     name: "Анна Вознесенская",
            //     rating: 4.9,
            //     reviewsCount: "105",
            //     info: "Мастер спорта России. Многократный чемпион Москвы. Призёр ТОП-12 и ТОП-24 сильнейших спортсменов России.",
            //     playingExperience: "2019-04",
            //     coachingExperience: "2022-02",
            //     price: "2500",
            //     profileLink: "https://rttf.ru/players/anna-voznesenskaya",
            //     photo: "../images/trainer-1.jpg",
            //   },
            //   {
            //     id: "2",
            //     name: "Антон Булдак",
            //     rating: 4.9,
            //     reviewsCount: "105",
            //     info: "Магистр физической культуры, тренерский стаж более 9 лет, имеет многолетний опыт тренерской работы и подготовки спортсменов разного уровня.",
            //     playingExperience: "2012-02",
            //     coachingExperience: "2021-02",
            //     price: "2500",
            //     profileLink: "https://rttf.ru/players/anton-buldak",
            //     photo: "../images/trainer-2.jpg",
            //   },
            //   {
            //     id: "3",
            //     name: "Никита Курильчик",
            //     rating: 4.9,
            //     reviewsCount: "105",
            //     info: "Мастер спорта по настольному теннису. Мастер спорта Республики Беларусь.",
            //     playingExperience: "2012-05",
            //     coachingExperience: "2020-05",
            //     price: "2500",
            //     profileLink: "https://rttf.ru/players/nikita-kurilchik",
            //     photo: "../images/trainer-3.jpg",
            //   },
          ],
        },
        prices: {
          title: "Цены",
          showBlock: true,
          displayedTitle: "Цены",
          menu: [
            // {
            //   title: "Аренда стола (55 минут)",
            //   items: [
            //     { text: "Будни c 7:00 до 18:00", price: "600 ₽" },
            //     {
            //       text: "Будни c 18:00 до 23:00, выходные и праздничные дни",
            //       price: "700 ₽",
            //     },
            //     { text: "Робот «Robo-Pong» + стол", price: "1000 ₽" },
            //   ],
            // },
            // {
            //   title: "Абонементы на аренду стола (10 часов)",
            //   items: [
            //     { text: "Будни c 7:00 до 18:00", price: "5000 ₽" },
            //     {
            //       text: "Будни c 18:00 до 23:00, выходные и праздничные дни",
            //       price: "6000 ₽",
            //     },
            //   ],
            // },
            // {
            //   title: "Аренда инвентаря",
            //   items: [
            //     { text: "Ракетка", price: "100 ₽" },
            //     { text: "Ракетка + мячи (2-4 шт)", price: "100 ₽" },
            //     {
            //       text: "БКМ (большое количество мячей - 50 шт)",
            //       price: "300 ₽",
            //     },
            //   ],
            // },
          ],
        },
        reviews: {
          title: "Отзывы",
          showBlock: true,
          displayedTitle: "Отзывы",
        },
        contacts: {
          title: "Контакты",
          address: "",
          metroStation: "",
          workingHoursWeekdays: "",
          workingHoursWeekend: "",
          whatsapp: "",
          telegram: "",
          phone: "",
          email: "",
          socialVk: "",
          socialTelegram: "",
          socialInstagram: "",
          socialOdnoklassniki: "",
          rttfURL: "",
        },
      },

      activeTab: "mainInfo",
      isSubmitAttempted: false,
      saveSuccessful: false,
      isValid: false,
      newEvent: {
        type: "",
        day: "",
        startTime: "",
        endTime: "",
        name: "",
        moreDetails: "",
      },

      editingEventId: null,
      nextEventId: 0,
      tempEvents: [],
      requiredFields: {
        mainInfo: ["displayedTitle", "clubName"],
        aboutClub: ["displayedTitle", "description"],
        news: ["displayedTitle"],
        activities: ["displayedTitle"],
        coaches: ["displayedTitle"],
        prices: ["displayedTitle"],
        reviews: ["displayedTitle"],
        contacts: [
          "address",
          "workingHoursWeekdays",
          "workingHoursWeekend",
          "phone",
          "email",
        ],
      },
    };
  },
  created() {
    // this.loadFromLocalStorage();
    this.loadfromJSON();
    // this.loadData();
  },

  computed: {
    shortDays() {
      const shortNames = {
        Понедельник: "Пн",
        Вторник: "Вт",
        Среда: "Ср",
        Четверг: "Чт",
        Пятница: "Пт",
        Суббота: "Сб",
        Воскресенье: "Вс",
      };

      return this.sections.activities.days.map((day) => shortNames[day] || day);
    },
    filteredEvents() {
      if (!this.sections.activities.events) {
        return []; // Возвращаем пустой массив, если events не определены
      }
      return this.sections.activities.events.filter(
        (event) => event.day === this.sections.activities.currentDay
      );
    },
  },
  mounted() {
    this.$nextTick(() => {
      const element = this.$el.querySelector(".some-class");
      if (element) {
        this.scrollToActiveTab();
      }
    });
  },
  filters: {
    eventType(value) {
      const types = {
        training: "Тренировка",
        tournament: "Турнир",
        other: "Другое",
      };
      return types[value] || value;
    },
  },
  methods: {
    async loadfromJSON() {
      try {
        const subdomain = window.location.hostname.split(".")[0];
        // this.clubName = subdomain;
        this.clubName = "rubin";
        console.log(this.clubName);
        const dataUrl = `/json/${subdomain}.json?timestamp=${new Date().getTime()}`;
        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        this.sections = jsonData.sections;
      } catch (e) {
        this.loadFromLocalStorage();
        console.error("Ошибка при загрузке данных:", e);
      }
    },
    saveEvent(index) {
      this.editingEventIndex = null;
    },

    updateEventData(index, key, eventPayload) {
      const actualValue = eventPayload.inputData.value;
      if (index !== null && index < this.sections.activities.events.length) {
        Vue.set(this.sections.activities.events[index], key, actualValue);
      }
    },
    handlePhotoUpload(data, coachId) {
      const coach = this.sections.coaches.coachesList.find(
        (c) => c.id === coachId
      );
      if (coach) {
        coach.photo = data.imageData;
      }
    },

    handleImageUpload(data) {
      if (!this.sections || !(data.sectionId in this.sections)) {
        console.error(`Section with id ${data.sectionId} does not exist.`);
        return;
      }

      if (data.sectionId === "mainInfo") {
        if (data.label === "Логотип") {
          this.sections.mainInfo.logo = data.imageData;
        } else if (data.label === "Фоновое фото для главного блока") {
          this.sections.mainInfo.background = data.imageData;
        } else {
          this.sections[data.sectionId].imageData = data.imageData;
        }
      } else {
        this.sections[data.sectionId].imageData = data.imageData;
      }
    },
    loadFromLocalStorage() {
      const storedData = localStorage.getItem("sections");
      console.log(storedData);
      if (storedData) {
        this.sections = JSON.parse(storedData);
      }
    },
    eventType(value) {
      const types = {
        training: "Тренировка",
        tournament: "Турнир",
        other: "Другое",
      };
      return types[value] || value;
    },
    saveToLocalStorage() {
      console.log("Saving sections to localStorage", this.sections);

      localStorage.setItem("sections", JSON.stringify(this.sections));

      this.saveSuccessful = true;

      setTimeout(() => {
        this.saveSuccessful = false;
      }, 2000);
    },
    addCategory() {
      this.sections.prices.menu.push({ title: "", items: [], deleted: false });
    },

    removeCategory(index) {
      if (this.sections.prices.menu[index]) {
        this.sections.prices.menu[index].deleted = true;
      }
    },
    selectDay(day) {
      this.sections.activities.currentDay = day;
    },

    addItem(categoryIndex) {
      this.sections.prices.menu[categoryIndex].items.push({
        text: "",
        price: "",
      });
    },

    removeItem(categoryIndex, itemIndex) {
      this.sections.prices.menu[categoryIndex].items.splice(itemIndex, 1);
    },

    restoreCategory(index) {
      if (this.sections.prices.menu[index]) {
        this.sections.prices.menu[index].deleted = false;
      }
    },

    addCoach() {
      const newCoach = {
        id: this.generateUniqueId(),
        name: "",
        info: "",
        playingExperience: "",
        coachingExperience: "",
        price: "",
        profileLink: "",
        photo: "",
      };
      this.sections.coaches.coachesList.push(newCoach);
    },

    removeCoach(coachId) {
      const coach = this.sections.coaches.coachesList.find(
        (c) => c.id === coachId
      );
      if (coach) {
        coach.isDeleted = true;
      }
    },

    restoreCoach(coachId) {
      const coach = this.sections.coaches.coachesList.find(
        (c) => c.id === coachId
      );
      if (coach) {
        coach.isDeleted = false;
      }
    },

    generateUniqueId() {
      return "uniqueId-" + Date.now();
    },

    addEvent() {
      const newEvent = {
        ...this.newEvent,
        id: this.nextEventId++,
        day: this.sections.activities.currentDay,
      };
      this.sections.activities.events.push(newEvent);
      this.editingEventId = newEvent.id;
      // Сброс this.newEvent
    },
    saveEvent(eventId) {
      this.sections.activities.events = this.sections.activities.events.filter(
        (event) => {
          return (
            event.name ||
            event.type ||
            event.startTime ||
            event.endTime ||
            event.moreDetails
          );
        }
      );

      // Сбрасываем индекс редактирования для возвращения к режиму просмотра
      this.editingEventId = null;

      // Сортировка событий по времени начала
      this.sections.activities.events.sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
    },
    deleteEvent(event) {
      const index = this.sections.activities.events.indexOf(event);
      if (index > -1) {
        this.sections.activities.events.splice(index, 1);
      }
    },

    validateAndSubmit(sectionId) {
      this.isSubmitAttempted = true;
      const section = this.sections[sectionId];
      const requiredFields = this.requiredFields[sectionId] || [];

      if (section.showBlock === undefined || section.showBlock) {
        console.log("start validating");
        let isValid = true;
        let firstErrorElementId = null;

        requiredFields.forEach((fieldId) => {
          if (!section[fieldId]) {
            isValid = false;
          }
        });

        if (sectionId === "prices" && section.menu) {
          section.menu = section.menu.filter((category) => !category.deleted);
        }

        if (sectionId === "coaches") {
          this.sections.coaches.coachesList =
            this.sections.coaches.coachesList.filter((coach) => {
              return (
                coach.name ||
                coach.info ||
                coach.playingExperience ||
                coach.coachingExperience ||
                coach.profileLink ||
                coach.price
              );
            });
          this.sections.coaches.coachesList =
            this.sections.coaches.coachesList.filter(
              (coach) => !coach.isDeleted
            );
        }

        if (isValid) {
          this.saveToLocalStorage();
          this.isSubmitAttempted = false;
        } else if (firstErrorElementId) {
          this.$nextTick(() => {
            this.scrollToElement(firstErrorElementId);
          });
        }
      } else {
        // Если editable определен и равен false, сохраняем без валидации
        this.saveToLocalStorage();
      }
    },

    selectTab(tabId) {
      this.activeTab = tabId;
      this.$nextTick(() => {
        this.scrollToActiveTab();
      });
    },
    scrollToActiveTab() {
      const activeTab = this.$el.querySelector(".tablinks.active");
      if (activeTab) {
        const scrollContainer = this.$el.querySelector(".tab");
        const scrollAmount = activeTab.offsetLeft - scrollContainer.offsetLeft;
        scrollContainer.scrollLeft =
          scrollAmount -
          (scrollContainer.offsetWidth / 2 - activeTab.offsetWidth / 2);
      }
    },
    scrollToElement(elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
  },
};

const app = createApp(App);
app.component("input-field", InputField);
app.component("photo-upload", PhotoUpload);
app.component("multiple-photo-upload", MultiplePhotoUpload);

// Монтирование приложения
app.mount("#vue-app");
