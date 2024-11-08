export class ModalWindow {
  static instance = null;

  constructor() {
    if (ModalWindow.instance) {
      return ModalWindow.instance;
    }

    console.log('ModalWindow constructor called');
    this.backdrop = document.querySelector('[data-modal]');
    this.closeBtn = document.querySelector('[data-modal-close]');
    this.modalBtn = document.querySelector('.modal-btn');
    this.isOpen = false;
    this.isFavorite = false;

    console.log('Backdrop element:', this.backdrop);
    console.log('Close button element:', this.closeBtn);
    console.log('Modal button element:', this.modalBtn);

    if (!this.backdrop) {
      console.error('Modal backdrop not found');
    }
    if (!this.closeBtn) {
      console.error('Modal close button not found');
    }
    if (!this.modalBtn) {
      console.error('Modal button not found');
    }

    this.bindEvents();
    this.init();

    ModalWindow.instance = this;
  }

  init() {
    if (this.modalBtn) {
      console.log('Adding click listener to modal button');
      this.modalBtn.addEventListener('click', () => {
        console.log('Modal button clicked');
        const testData = {
          _id: '64f389465ae26083f39b17a4',
          bodyPart: 'waist',
          equipment: 'body weight',
          gifUrl: 'https://ftp.goit.study/img/power-pulse/gifs/0003.gif',
          name: 'air bike',
          target: 'abs',
          description:
            "This refers to your core muscles, which include the rectus abdominis, obliques, and transverse abdominis. They're essential for maintaining posture, stability, and generating force in many movements. Exercises that target the abs include crunches, leg raises, and planks.",
          rating: 3,
          burnedCalories: 312,
          time: 3,
          popularity: 1,
        };
        this.open(testData);
      });
    }
  }

  bindEvents() {
    console.log('Binding events');
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        console.log('Close button clicked');
        this.close();
      });
    }
    if (this.backdrop) {
      this.backdrop.addEventListener('click', e => {
        if (e.target === this.backdrop) {
          console.log('Backdrop clicked');
          this.close();
        }
      });
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) {
        console.log('Escape pressed');
        this.close();
      }
    });

    if (this.backdrop) {
      const favBtn = this.backdrop.querySelector('.modal-favorites-btn');
      if (favBtn) {
        favBtn.addEventListener('click', () => this.toggleFavorite());
      }
    }
  }

  async open(exerciseData) {
    console.log('Opening modal with data:', exerciseData);
    this.isOpen = true;
    if (this.backdrop) {
      this.backdrop.classList.remove('is-hidden');
      console.log('Removed is-hidden class');
    }
    document.body.style.overflow = 'hidden';

    await this.updateContent(exerciseData);
  }

  close() {
    console.log('Closing modal');
    this.isOpen = false;
    if (this.backdrop) {
      this.backdrop.classList.add('is-hidden');
      console.log('Added is-hidden class');
    }
    document.body.style.overflow = '';
  }

  async updateContent(data) {
    const {
      name,
      rating,
      target,
      bodyPart,
      equipment,
      popularity,
      burnedCalories,
      description,
      gifUrl,
      time = 3,
    } = data;

    // Оновлюємо заголовок
    const titleElement = this.backdrop.querySelector('.modal-title');
    if (titleElement) {
      titleElement.textContent = name;
    }

    // Оновлюємо медіа контент
    const mediaContainer = this.backdrop.querySelector(
      '.modal-media-container'
    );
    if (mediaContainer && gifUrl) {
      mediaContainer.innerHTML = `<img src="${gifUrl}" alt="${name}" />`;
    }

    // Створюємо об'єкт з параметрами відповідно до API
    const parameters = {
      Target: target,
      'Body Part': bodyPart,
      Equipment: equipment,
      Popular: popularity,
      'Burned Calories': `${burnedCalories} / ${time} min`,
    };

    // Оновлюємо параметри
    const parametersContainer =
      this.backdrop.querySelector('.modal-parameters');
    if (parametersContainer) {
      parametersContainer.innerHTML = ''; // Очищаємо контейнер

      // Створюємо новий елемент для кожного параметра
      Object.entries(parameters).forEach(([label, value]) => {
        const parameterItem = document.createElement('li');
        parameterItem.className = 'parameter-item';
        parameterItem.innerHTML = `
          <p class="modal-parameter-label">${label}</p>
          <p class="modal-parameter-value">${value}</p>
        `;
        parametersContainer.appendChild(parameterItem);
      });
    }

    // Оновлюємо опис
    const descriptionElement =
      this.backdrop.querySelector('.modal-description');
    if (descriptionElement) {
      descriptionElement.textContent = description;
    }

    // Оновлюємо рейтинг
    const ratingElement = this.backdrop.querySelector('.rating-value');
    if (ratingElement) {
      ratingElement.textContent = rating;
    }
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    const favBtn = this.backdrop.querySelector('.modal-favorites-btn');
    const ratingElement = this.backdrop.querySelector('.rating-value');

    if (this.isFavorite) {
      favBtn.innerHTML = `
        Remove from favorites
        <svg class="modal-icon-heart">
          <use href="./img/sprite.svg#icon-delete"></use>
        </svg>
      `;
      favBtn.classList.add('is-favorite');

      if (ratingElement) {
        const currentRating = parseFloat(ratingElement.textContent);
        ratingElement.textContent = (currentRating + 0.1).toFixed(1);
      }
    } else {
      favBtn.innerHTML = `
        Add to favorites
        <svg class="modal-icon-heart">
          <use href="./img/sprite.svg#icon-heart"></use>
        </svg>
      `;
      favBtn.classList.remove('is-favorite');

      if (ratingElement) {
        const currentRating = parseFloat(ratingElement.textContent);
        ratingElement.textContent = (currentRating - 0.1).toFixed(1);
      }
    }

    const newIcon = favBtn.querySelector('.modal-icon-heart');
    if (newIcon) {
      newIcon.style.stroke = this.isFavorite ? '#f4f4f4' : '#242424';
    }

    favBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      favBtn.style.transform = 'scale(1)';
    }, 200);
  }
}

// Ініціалізуємо модальне вікно після завантаження DOM
let modalWindowInstance = null;
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing modal window');
  if (!modalWindowInstance) {
    try {
      modalWindowInstance = new ModalWindow();
    } catch (error) {
      console.error('Error initializing modal:', error);
    }
  }
});
