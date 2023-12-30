const { createApp } = Vue;

const InputField = {
  props: {
    id: String,
    label: String,
    type: { type: String, default: "text" },
    value: String, // value используется с v-model
    rows: { type: Number, default: 3 },
    maxlength: Number,
    required: Boolean,
    error: Boolean,
    errorMessage: String,
    largeTextarea: Boolean,
    isSubmitAttempted: Boolean,
    sectionName: String,
  },
  data() {
    return {
      userHasInput: false,
      inputValue: this.value || "",
    };
  },
  mounted() {
    console.log(this.props);
  },
  computed: {
    charsLeft() {
      return this.maxlength - this.inputValue.length;
    },
    inputClass() {
      return this.largeTextarea ? "large-textarea-wrapper" : "";
    },
    effectiveErrorMessage() {
      return this.errorMessage || "Введите текст";
    },
    shouldShowError() {
      return (
        this.error &&
        (this.isSubmitAttempted || this.userHasInput) &&
        this.inputValue === "" // Использование this.value вместо this.inputValue
      );
    },
  },
  methods: {
    handleInput() {
      this.userHasInput = true;
      console.log("handleInput:", this.sectionName, this.id, this.inputValue);

      this.$emit("input-section", {
        sectionName: this.sectionName,
        inputData: { id: this.id, value: this.inputValue },
      });
    },
  },
  watch: {
    value(newValue) {
      console.log(newValue);
      this.inputValue = newValue;
    },
  },
  template: `
  <div class="input-wrapper">
      <label :for="id" :class="{ 'required-label': required }">{{ label }}</label>
      <div class="input-and-error">
        <input v-if="type !== 'textarea'" :type="type" :id="id" :class="{ 'error-border': shouldShowError }"  v-model="inputValue" :maxlength="maxlength"
            @input="handleInput" />
        <textarea v-else :id="id" v-model="inputValue" :class="{ 'error-border': shouldShowError }"   :maxlength="maxlength" :rows="rows"
            @input="handleInput"></textarea>
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
      imageData: this.initialImageData || (this.singlePhoto ? null : []),
      draggingIndex: -1,
      placeholderIndex: null, // Новое свойство
      draggedItem: null,
      hiddenIndex: null,
    };
  },
  props: {
    label: String,
    isAvatar: Boolean,
    sectionId: String,
    singlePhoto: {
      type: Boolean,
      default: true,
    },
    initialImageData: {
      type: [String, Array],
      default: () => [],
    },
  },
  computed: {
    imagesWithPlaceholder() {
      let imageDataWithPlaceholder = [...this.imageData];
      if (this.placeholderIndex !== null) {
        imageDataWithPlaceholder.splice(
          this.placeholderIndex,
          0,
          "placeholder"
        );
      }
      return imageDataWithPlaceholder;
    },
  },
  mounted() {
    if (this.initialImageData && this.initialImageData.length > 0) {
      this.$emit("image-uploaded", {
        imageData: this.imageData,
        sectionId: this.sectionId,
      });
    }
  },
  methods: {
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    handleFileSelected(event) {
      const files = event.target.files;
      if (!this.singlePhoto) {
        console.log(this.imageData.length);
        const maxImages = 20; // Максимальное количество изображений
        const currentImageCount = this.imageData.length;
        const availableSlots = maxImages - currentImageCount;
        const filesToAdd = Array.from(files).slice(0, availableSlots);

        filesToAdd.forEach((file) => this.previewImage(file, true));
      } else {
        this.previewImage(files[0], false);
      }
    },
    dragStart(index, event) {
      this.draggingIndex = index;
      this.displayData = [...this.imageData];
      event.dataTransfer.setData("text/plain", "");
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

    dragLeave(index) {
      if (this.draggingIndex === index) {
        this.draggingIndex = -1;
      }
    },

    removeImage(index) {
      this.imageData.splice(index, 1);
      this.$emit("image-uploaded", {
        imageData: this.imageData,
        sectionId: this.sectionId,
      });
    },
    previewImage(file, isMultiple) {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const image = new Image();
          image.onload = () => {
            let width, height, startX, startY;
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (this.sectionId === "mainInfo") {
              width = 1600;
              height = 550;
              startX = 0;
              startY = (image.height - (image.width / width) * height) / 2;
            } else {
              const max_width = 500;
              const scaleRatio = max_width / image.width;
              width = max_width;
              height = image.height * scaleRatio;
              startX = 0;
              startY = 0;
            }

            canvas.width = width;
            canvas.height = height;

            if (this.sectionId === "mainInfo") {
              // Обрезаем изображение по центру
              ctx.drawImage(
                image,
                startX,
                startY,
                image.width,
                (image.width / width) * height, // sWidth и sHeight для mainInfo
                0,
                0,
                width,
                height
              );
            } else {
              // Уменьшаем изображение
              ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            }

            canvas.toBlob(
              (blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  let imageDataUpdate;
                  const dataUrl = reader.result;

                  if (isMultiple) {
                    this.imageData.push(dataUrl);
                    imageDataUpdate = [...this.imageData];
                  } else {
                    this.imageData = dataUrl;
                    imageDataUpdate = this.imageData;
                  }

                  this.$emit("image-uploaded", {
                    imageData: imageDataUpdate,
                    sectionId: this.sectionId,
                  });
                };
                reader.readAsDataURL(blob);
              },
              "image/jpeg",
              0.6 // Adjust the quality parameter between 0 and 1 as needed
            );
          };
          image.src = e.target.result;
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
      const files = event.dataTransfer.files;
      if (!this.singlePhoto && files.length > 0) {
        Array.from(files).forEach((file) => this.previewImage(file, true));
      } else if (this.singlePhoto && files.length > 0) {
        this.previewImage(files[0], false);
      }
      event.currentTarget.classList.remove("dragover");
    },
  },
  watch: {
    imageData(newImages) {
      this.$emit("image-uploaded", {
        imageData: newImages,
        sectionId: this.sectionId,
      });
    },
  },
  template: `
  <div class="photo-upload-area">
    <label class="photo-label">{{ label }}</label>
    <div :class="{ 'avatar-mode': isAvatar }">
      <!-- Обработка нескольких изображений -->
      <div v-if="!singlePhoto" class="multiple-images">
        <div v-for="(item, index) in imagesWithPlaceholder" :key="index" class="image-container">
          <div v-if="item === 'placeholder'" class="placeholder"></div>
          <div v-else :draggable="true" :class="{ dragging: index === draggingIndex }"
          @dragstart="dragStart(index, $event)"
          @dragover.prevent
          @dragenter="dragEnter(index)"
          @dragleave="dragLeave()"
          @drop="drop()">
          <img :src="item" class="photo-preview" />
          <img src="delete.svg" @click="removeImage(index)" class="delete-button" />
        </div>    
      </div>
    </div>
      <!-- Обработка одного изображения -->
     <div v-if="singlePhoto && imageData" class="single-image" :class="{ 'avatar-preview': isAvatar }">
      <img v-if="imageData" :src="imageData" class="photo-preview" />
    </div>

    <!-- Зона загрузки, общая для обоих вариантов -->
      <div v-if="(!singlePhoto && imageData.length < 20) || (singlePhoto)" class="upload-area"
      @click="triggerUpload"
      @dragover="dragOverHandler"
      @dragleave="dragLeaveHandler"
      @drop="dropHandler">
      <img src="upload-icon.svg" alt="Upload" class="upload-icon" />
      <span class="upload-text">Загрузить фото</span>
    </div>
  </div>
    <input type="file" ref="fileInput" @change="handleFileSelected" class="upload-input" :multiple="!singlePhoto" />
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
          inputs: [
            {
              id: "displayedTitle",
              label: "Описание клуба (например 'Клуб настольного тенниса') ",
              type: "text",
              value: "",
              maxlength: 70,
              required: true,
              charsLeft: 70,
              error: false,
              errorMessage: "Введите отображаемый заголовок",
            },
            {
              id: "clubName",
              label: "Название клуба",
              type: "text",
              value: "",
              maxlength: 100,
              required: true,
              charsLeft: 100,
              error: false,
              errorMessage: "Название клуба обязательно к заполнению",
            },
            {
              id: "logo",
              label: "Логотип",
              type: "text",
              value: "",
              maxlength: 200,
              required: true,
              charsLeft: 200,
              error: false,
              errorMessage: "Ссылка на логотип обязательна к заполнению",
            },
          ],
          imageData: null,
        },
        aboutClub: {
          title: "О клубе",
          inputs: [
            {
              id: "displayedTitle",
              label: "Заголовок",
              type: "text",
              value: "",
              maxlength: 30,
              required: true,
              charsLeft: 30,
              error: false,
              errorMessage: "Введите отображаемый заголовок",
            },
            {
              id: "description",
              label: "Краткое описание",
              type: "textarea",
              value: "",
              maxlength: 1000,
              required: true,
              largeTextarea: true,
              charsLeft: 1000,
              error: false,
              errorMessage: "Введите краткое описание",
            },
          ],
          imageData: [],
        },
        news: {
          title: "Новости и акции",
          editable: true,
          inputs: [
            {
              id: "newsTitle",
              label: "Заголовок",
              type: "text",
              value: "",
              maxlength: 50,
              required: true,
              charsLeft: 50,
              error: false,
              errorMessage: "Введите заголовок раздела",
            },
          ],
        },
        activities: {
          title: "Турниры и тренировки",
          editable: true,
          inputs: [
            {
              id: "activitiesTitle",
              label: "Заголовок",
              type: "text",
              value: "",
              maxlength: 50,
              required: true,
              charsLeft: 50,
              error: false,
              errorMessage: "Введите заголовок раздела",
            },
          ],
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
              id: 1,
              type: "training",
              day: "Понедельник",
              startTime: "19:30",
              endTime: "21:30",
              name: "Боковые подачи и их прием",
              moreDetails: "Смирнов А.",
            },
            {
              id: 2,
              type: "tournament",
              day: "Пятница",
              startTime: "14:00",
              endTime: "16:00",
              name: "Турнир высшей лиги",
              moreDetails: "< 312",
            },
            {
              id: 3,
              type: "training",
              day: "Воскресенье",
              startTime: "21:30",
              endTime: "22:30",
              name: "Топ-спин справа со всего стола",
              moreDetails: "Петров В.",
            },
            {
              id: 4,
              type: "tournament",
              day: "Вторник",
              startTime: "20:30",
              endTime: "23:00",
              name: "Весенний чемпионат",
              moreDetails: "< 911",
            },
            {
              id: 5,
              type: "training",
              day: "Понедельник",
              startTime: "08:30",
              endTime: "10:30",
              name: "Защитная тактика",
              moreDetails: "Иванов Б.",
            },
            {
              id: 6,
              type: "tournament",
              day: "Понедельник",
              startTime: "12:00",
              endTime: "15:00",
              name: "Летние игры",
              moreDetails: "< 675",
            },
            {
              id: 7,
              type: "training",
              day: "Пятница",
              startTime: "20:00",
              endTime: "21:00",
              name: "Работа ног",
              moreDetails: "Иванов Б.",
            },
            {
              id: 8,
              type: "tournament",
              day: "Понедельник",
              startTime: "20:30",
              endTime: "22:30",
              name: "Кубок вызова",
              moreDetails: "< 970",
            },
            {
              id: 9,
              type: "training",
              day: "Среда",
              startTime: "13:00",
              endTime: "14:00",
              name: "Топ-спин справа со всего стола",
              moreDetails: "Петров В.",
            },
            {
              id: 10,
              type: "tournament",
              day: "Понедельник",
              startTime: "11:30",
              endTime: "14:30",
              name: "Чемпионат области",
              moreDetails: "< 638",
            },
            {
              id: 11,
              type: "training",
              day: "Четверг",
              startTime: "12:00",
              endTime: "13:00",
              name: "Атакующие удары",
              moreDetails: "Петров В.",
            },
            {
              id: 12,
              type: "tournament",
              day: "Четверг",
              startTime: "15:30",
              endTime: "18:30",
              name: "Турнир высшей лиги",
              moreDetails: "< 198",
            },
            {
              id: 13,
              type: "training",
              day: "Четверг",
              startTime: "10:00",
              endTime: "12:00",
              name: "Стратегия игры на сетке",
              moreDetails: "Иванов Б.",
            },
            {
              id: 14,
              type: "tournament",
              day: "Четверг",
              startTime: "18:00",
              endTime: "20:00",
              name: "Весенний чемпионат",
              moreDetails: "< 101",
            },
            {
              id: 15,
              type: "training",
              day: "Четверг",
              startTime: "20:00",
              endTime: "21:00",
              name: "Топ-спин справа со всего стола",
              moreDetails: "Смирнов А.",
            },
          ],
          currentDay: "Понедельник",
        },
        coaches: {
          title: "Тренеры клуба",
          editable: true,
          inputs: [
            {
              id: "coachesTitle",
              label: "Заголовок",
              type: "text",
              value: "",
              maxlength: 50,
              required: true,
              charsLeft: 50,
              error: false,
              errorMessage: "Введите заголовок раздела",
            },
          ],
          coachesList: [
            {
              id: "1",
              name: "Анна Вознесенская",
              rating: 4.9,
              reviewsCount: "105",
              info: "Мастер спорта России. Многократный чемпион Москвы. Призёр ТОП-12 и ТОП-24 сильнейших спортсменов России.",
              playingExperience: "2019-04",
              coachingExperience: "2022-02",
              price: "2500",
              profileLink: "https://rttf.ru/players/anna-voznesenskaya",
              photo: "../images/trainer-1.jpg",
            },
            {
              id: "2",
              name: "Антон Булдак",
              rating: 4.9,
              reviewsCount: "105",
              info: "Магистр физической культуры, тренерский стаж более 9 лет, имеет многолетний опыт тренерской работы и подготовки спортсменов разного уровня.",
              playingExperience: "2012-02",
              coachingExperience: "2021-02",
              price: "2500",
              profileLink: "https://rttf.ru/players/anton-buldak",
              photo: "../images/trainer-2.jpg",
            },
            {
              id: "3",
              name: "Никита Курильчик",
              rating: 4.9,
              reviewsCount: "105",
              info: "Мастер спорта по настольному теннису. Мастер спорта Республики Беларусь.",
              playingExperience: "2012-05",
              coachingExperience: "2020-05",
              price: "2500",
              profileLink: "https://rttf.ru/players/nikita-kurilchik",
              photo: "../images/trainer-3.jpg",
            },
          ],
        },
        prices: {
          title: "Цены",
          editable: true,
          inputs: [
            {
              id: "pricesTitle",
              label: "Заголовок",
              type: "text",
              value: "",
              maxlength: 50,
              required: true,
              charsLeft: 50,
              error: false,
              errorMessage: "Введите заголовок раздела",
            },
          ],
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
                {
                  text: "БКМ (большое количество мячей - 50 шт)",
                  price: "300 ₽",
                },
              ],
            },
          ],
        },
        contacts: {
          title: "Контакты",
          inputs: [
            {
              id: "address",
              label: "Адрес",
              type: "text",
              value: "",
              maxlength: 200,
              required: true,
              charsLeft: 200,
              error: false,
              errorMessage: "Адрес обязателен к заполнению",
            },
            // {
            //   id: "metroLineColor",
            //   label: "Цвет линии метро",
            //   type: "text",
            //   value: "",
            //   maxlength: 20,
            //   required: false,
            //   charsLeft: 20,
            //   error: false,
            //   errorMessage: "",
            // },
            {
              id: "metroStation",
              label: "Станция метро",
              type: "text",
              value: "",
              maxlength: 50,
              required: false,
              charsLeft: 50,
              error: false,
              errorMessage: "",
            },
            {
              id: "workingHoursWeekdays",
              label: "Рабочие часы (Пн-Пт)",
              type: "text",
              value: "",
              maxlength: 30,
              required: true,
              charsLeft: 30,
              error: false,
              errorMessage: "Рабочие часы обязательны к заполнению",
            },
            {
              id: "workingHoursWeekend",
              label: "Рабочие часы (Сб-Вс)",
              type: "text",
              value: "",
              maxlength: 30,
              required: true,
              charsLeft: 30,
              error: false,
              errorMessage: "Рабочие часы обязательны к заполнению",
            },
            {
              id: "whatsapp",
              label: "WhatsApp",
              type: "text",
              value: "",
              maxlength: 50,
              required: false,
              charsLeft: 50,
              error: false,
              errorMessage: "",
            },
            {
              id: "telegram",
              label: "Telegram",
              type: "text",
              value: "",
              maxlength: 50,
              required: false,
              charsLeft: 50,
              error: false,
              errorMessage: "",
            },
            {
              id: "phone",
              label: "Телефон",
              type: "text",
              value: "",
              maxlength: 20,
              required: true,
              charsLeft: 20,
              error: false,
              errorMessage: "Телефон обязателен к заполнению",
            },
            {
              id: "email",
              label: "Email",
              type: "text",
              value: "",
              maxlength: 100,
              required: true,
              charsLeft: 100,
              error: false,
              errorMessage: "Email обязателен к заполнению",
            },
            {
              id: "socialVk",
              label: "ВК",
              type: "text",
              value: "",
              maxlength: 100,
              required: false,
              charsLeft: 100,
              error: false,
              errorMessage: "",
            },
            {
              id: "socialTelegram",
              label: "Telegram канал",
              type: "text",
              value: "",
              maxlength: 100,
              required: false,
              charsLeft: 100,
              error: false,
              errorMessage: "",
            },
            {
              id: "socialInstagram",
              label: "Instagram",
              type: "text",
              value: "",
              maxlength: 100,
              required: false,
              charsLeft: 100,
              error: false,
              errorMessage: "",
            },
            {
              id: "socialOdnoklassniki",
              label: "Одноклассники",
              type: "text",
              value: "",
              maxlength: 100,
              required: false,
              charsLeft: 100,
              error: false,
              errorMessage: "",
            },
            {
              id: "rttfURL",
              label: "Страница на RTTF",
              type: "text",
              value: "",
              maxlength: 100,
              required: false,
              charsLeft: 100,
              error: false,
              errorMessage: "",
            },
          ],
        },
      },

      activeTab: "coaches",
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
    };
  },
  created() {
    // this.$on("input-section", this.handleInputSection);
    this.loadFromLocalStorage();
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
    saveEvent(index) {
      // Сбрасываем индекс редактирования для возвращения к режиму просмотра
      this.editingEventIndex = null;
    },

    handleInput(data) {},
    handleInputSection(event) {
      // console.log(event);
      const { sectionName, inputData } = event;

      const section = this.sections[sectionName];
      if (section && section.inputs) {
        const input = section.inputs.find((i) => i.id === inputData.id);
        if (input) {
          input.value = inputData.value;
        }
      }
    },
    updateEventData(index, key, eventPayload) {
      // console.log("updateEventData:", index, key, eventPayload);

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
      if (this.sections && data.sectionId in this.sections) {
        this.sections[data.sectionId].imageData = data.imageData;
      } else {
        console.error(`Section with id ${data.sectionId} does not exist.`);
      }
    },
    loadFromLocalStorage() {
      const storedData = localStorage.getItem("sections");
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
      console.log("kek");
      this.saveSuccessful = true;
      console.log(this.saveSuccessful);

      setTimeout(() => {
        this.saveSuccessful = false;
        console.log(this.saveSuccessful);
      }, 2000);
    },
    addCategory() {
      this.sections.prices.menu.push({ title: "", items: [], deleted: false });
    },

    removeCategory(index) {
      this.$set(this.sections.prices.menu[index], "deleted", true);
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
      this.$set(this.sections.prices.menu[index], "deleted", false);
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
      console.log("validating");
      if (section.editable === undefined || section.editable) {
        let isValid = true;
        let firstErrorElementId = null;

        // Валидация полей ввода
        if (section.inputs) {
          section.inputs.forEach((input) => {
            if (input.required && !input.value) {
              input.error = true;
              isValid = false;
              console.log(input.value, "empty?");
              if (!firstErrorElementId) {
                firstErrorElementId = input.id;
              }
            } else {
              input.error = false;
            }
          });
        }

        if (sectionId === "prices" && section.menu) {
          section.menu = section.menu.filter((category) => !category.deleted);
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

// Монтирование приложения
app.mount("#vue-app");
