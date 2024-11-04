const images = [
    {
      preview:
        'https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820__480.jpg',
      original:
        'https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820_1280.jpg',
      description: 'Hokkaido Flower',
    },
    {
      preview:
        'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677__340.jpg',
      original:
        'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677_1280.jpg',
      description: 'Container Haulage Freight',
    },
    {
      preview:
        'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785__340.jpg',
      original:
        'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg',
      description: 'Aerial Beach View',
    },
    {
      preview:
        'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__340.jpg',
      original:
        'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg',
      description: 'Flower Blooms',
    },
    {
      preview:
        'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334__340.jpg',
      original:
        'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334_1280.jpg',
      description: 'Alpine Mountains',
    },
    {
      preview:
        'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571__340.jpg',
      original:
        'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571_1280.jpg',
      description: 'Mountain Lake Sailing',
    },
    {
      preview:
        'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272__340.jpg',
      original:
        'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272_1280.jpg',
      description: 'Alpine Spring Meadows',
    },
    {
      preview:
        'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__340.jpg',
      original:
        'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255_1280.jpg',
      description: 'Nature Landscape',
    },
    {
      preview:
        'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843__340.jpg',
      original:
        'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843_1280.jpg',
      description: 'Lighthouse Coast Sea',
    },
  ];
  
  const gallery = document.querySelector('.gallery');
  let markup = '';
  
  // Розмітку галереї
  images.forEach(image => {
    const { preview, original, description } = image;
  
    markup += `<li class="gallery-item">
        <a class="gallery-link" href="${original}">
          <img
            class="gallery-image"
            src="${preview}"
            data-source="${original}"
            alt="${description}"
          />
        </a>
      </li>`;
  });
  
  gallery.insertAdjacentHTML('afterbegin', markup);
  
  // Функція для обробки кліка
  function onImageClick(event) {
    event.preventDefault();
  
    if (event.target.nodeName !== 'IMG') {
      return;
    }
  
    const originalImage = event.target.dataset.source;
    let currentIndex = images.findIndex(image => image.original === originalImage);
    
    const instance = basicLightbox.create(`
      <div class="modal">
        <button class="nav-button prev" type="button">&larr;</button>
        <div class="modal-content">
          <img src="${images[currentIndex].original}" alt="${images[currentIndex].description}">
          <p class="description">${images[currentIndex].description}</p>
        </div>
        <button class="nav-button next" type="button">&rarr;</button>
      </div>
    `, {
      onShow: (instance) => {
        document.addEventListener('keydown', onKeyPress);
        
        // Добавляем обработчики для кнопок
        const prevButton = instance.element().querySelector('.prev');
        const nextButton = instance.element().querySelector('.next');
        
        prevButton.addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + images.length) % images.length;
          updateImage();
        });
        
        nextButton.addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % images.length;
          updateImage();
        });
      },
      onClose: () => {
        document.removeEventListener('keydown', onKeyPress);
      }
    });
  
    function updateImage() {
      const modalImg = instance.element().querySelector('img');
      const modalDesc = instance.element().querySelector('.description');
      modalImg.src = images[currentIndex].original;
      modalImg.alt = images[currentIndex].description;
      modalDesc.textContent = images[currentIndex].description;
    }
  
    function onKeyPress(event) {
      if (event.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage();
      } else if (event.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % images.length;
        updateImage();
      } else if (event.key === 'Escape') {
        instance.close();
      }
    }
  
    instance.show();
  }
  
  // Сухач подій ul.gallery
  gallery.addEventListener('click', onImageClick);
  