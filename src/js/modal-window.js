export class ModalWindow {
  constructor() {
    this.backdrop = document.querySelector('[data-modal]');
    this.closeBtn = document.querySelector('[data-modal-close]');
    this.isOpen = false;

    if (!this.backdrop) {
      console.error('Modal backdrop not found');
    }
    if (!this.closeBtn) {
      console.error('Modal close button not found');
    }

    this.bindEvents();
  }

  bindEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.backdrop) {
      this.backdrop.addEventListener('click', e => {
        if (e.target === this.backdrop) {
          this.close();
        }
      });
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  async open(exerciseData) {
    console.log('Opening modal with data:', exerciseData);
    this.isOpen = true;
    if (this.backdrop) {
      this.backdrop.classList.remove('is-hidden');
    }
    document.body.style.overflow = 'hidden';

    // Оновлюємо контент модального вікна
    await this.updateContent(exerciseData);
  }

  close() {
    this.isOpen = false;
    if (this.backdrop) {
      this.backdrop.classList.add('is-hidden');
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
}
