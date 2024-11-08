export class ModalWindow {
  static instance = null;

  constructor() {
    if (ModalWindow.instance) {
      return ModalWindow.instance;
    }

    this.backdrop = document.querySelector('[data-modal]');
    this.closeBtn = document.querySelector('[data-modal-close]');
    this.isOpen = false;
    this.isFavorite = false;

    if (!this.backdrop) {
      console.error('Modal backdrop not found');
    }
    if (!this.closeBtn) {
      console.error('Modal close button not found');
    }

    this.ratingBackdrop = document.querySelector('[data-rating-modal]');
    this.ratingCloseBtn = document.querySelector('[data-rating-close]');
    this.ratingForm = document.querySelector('.rating-form');

    this.bindEvents();
    ModalWindow.instance = this;
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

    if (this.backdrop) {
      const favBtn = this.backdrop.querySelector('.modal-favorites-btn');
      if (favBtn) {
        favBtn.addEventListener('click', () => this.toggleFavorite());
      }
    }

    const ratingBtn = this.backdrop.querySelector('.modal-rating-btn');
    if (ratingBtn) {
      ratingBtn.addEventListener('click', () => this.openRatingModal());
    }

    if (this.ratingCloseBtn) {
      this.ratingCloseBtn.addEventListener('click', () =>
        this.closeRatingModal()
      );
    }

    if (this.ratingBackdrop) {
      this.ratingBackdrop.addEventListener('click', e => {
        if (e.target === this.ratingBackdrop) {
          this.closeRatingModal();
        }
      });
    }

    if (this.ratingForm) {
      this.ratingForm.addEventListener('submit', e =>
        this.handleRatingSubmit(e)
      );
    }
  }

  async open(exerciseData) {
    this.isOpen = true;
    if (this.backdrop) {
      this.backdrop.classList.remove('is-hidden');
    }
    document.body.style.overflow = 'hidden';

    await this.updateContent(exerciseData);
  }

  close() {
    this.isOpen = false;

    if (this.backdrop) {
      this.backdrop.classList.add('is-hidden');
    }
    if (this.ratingBackdrop) {
      this.ratingBackdrop.classList.add('is-hidden');
      if (this.ratingForm) {
        this.ratingForm.reset();
      }
    }

    document.onkeydown = this.originalEscapeHandler;

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

    const titleElement = this.backdrop.querySelector('.modal-title');
    if (titleElement) {
      titleElement.textContent = name;
    }

    const mediaContainer = this.backdrop.querySelector(
      '.modal-media-container'
    );
    if (mediaContainer && gifUrl) {
      mediaContainer.innerHTML = `<img src="${gifUrl}" alt="${name}" />`;
    }

    const parameters = {
      Target: target,
      'Body Part': bodyPart,
      Equipment: equipment,
      Popular: popularity,
      'Burned Calories': `${burnedCalories} / ${time} min`,
    };

    const parametersContainer =
      this.backdrop.querySelector('.modal-parameters');
    if (parametersContainer) {
      parametersContainer.innerHTML = '';

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

    const descriptionElement =
      this.backdrop.querySelector('.modal-description');
    if (descriptionElement) {
      descriptionElement.textContent = description;
    }

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

  openRatingModal() {
    if (this.ratingBackdrop && this.backdrop) {
      this.backdrop.classList.add('is-hidden');
      this.ratingBackdrop.classList.remove('is-hidden');
      this.originalEscapeHandler = document.onkeydown;
      document.onkeydown = e => {
        if (e.key === 'Escape') {
          this.closeRatingModal();
        }
      };
    }
  }

  closeRatingModal() {
    if (this.ratingBackdrop && this.backdrop) {
      this.ratingBackdrop.classList.add('is-hidden');
      this.backdrop.classList.remove('is-hidden');
      if (this.ratingForm) {
        this.ratingForm.reset();
      }
      document.onkeydown = this.originalEscapeHandler;
    }
  }

  async handleRatingSubmit(e) {
    e.preventDefault();

    const email = this.ratingForm.querySelector('#rating-email').value.trim();
    const comment = this.ratingForm
      .querySelector('#rating-comment')
      .value.trim();

    if (!email || !comment) {
      console.log('Please fill in all fields');
      return;
    }

    this.closeRatingModal();
  }
}

let modalWindowInstance = null;
document.addEventListener('DOMContentLoaded', () => {
  if (!modalWindowInstance) {
    try {
      modalWindowInstance = new ModalWindow();
    } catch (error) {
      console.error('Error initializing modal:', error);
    }
  }
});
