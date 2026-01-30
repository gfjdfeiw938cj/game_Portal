let newGamesSlider;
let originalCards = [];

// Инициализация фильтра
document.addEventListener('DOMContentLoaded', () => {
  // Собираем оригинальные карточки
  updateOriginalCards();

  newGamesSlider = new Slider('#gamesSlider');
  initGenreFilter();
});

function updateOriginalCards() {
  // Собираем карточки игры из DOM
  originalCards = Array.from(document.querySelectorAll('.game-card'));
}

function initGenreFilter() {
  const genreButtons = document.querySelectorAll('.genre-buttons button');
  
  genreButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedGenre = button.getAttribute('data-genre');
      // Активная кнопка
      genreButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      filterGamesByGenre(selectedGenre);
    });
  });
}

function filterGamesByGenre(genre) {
  // 1) Обновляем видимость карточек
  originalCards.forEach(card => {
    const cardGenre = card.getAttribute('data-genre');
    card.dataset.visible = (genre === 'all' || cardGenre === genre) ? 'true' : 'false';
  });

  // 2) Перестраиваем слайды с учётом новых данных
  rebuildSliderSlides();
}

function rebuildSliderSlides() {
  const sliderTrack = document.querySelector('.slider-track');
  
  // 1) Выбираем видимые карточки
  const visibleCards = originalCards.filter(card => card.dataset.visible === 'true');

  // 2) Очищаем слайды (не удаляем оригиналы)
  sliderTrack.innerHTML = '';

  const slidesPerView = 3;

  // 3) Создаём новые слайды на основе видимых карточек
  for (let i = 0; i < visibleCards.length; i += slidesPerView) {
    const slide = document.createElement('div');
    slide.className = 'slide';

    for (let j = 0; j < slidesPerView; j++) {
      const cardIndex = i + j;
      if (cardIndex < visibleCards.length) {
        const clonedCard = visibleCards[cardIndex].cloneNode(true);
        // возможно, чтобы клики не дублировались, можно оставить как есть
        slide.append(clonedCard);
      }
    }

    sliderTrack.append(slide);
  }

  // 4) Обновляем slider: если инстанс есть — обновить
  if (newGamesSlider) {
    newGamesSlider.destroy?.(); // опционально: попробуйте очистить старый инстанс
  }
  newGamesSlider = new Slider('#gamesSlider');
  newGamesSlider.resetToStart();
}
//                        Слайдер для игр
class Slider {
  constructor(selector) {
    this.container = document.querySelector(selector);
    this.container.__sliderInstance = this;
    this.track = this.container.querySelector('.slider-track');
    this.initialSlideHTML = this.track.innerHTML;
    this.slides = Array.from(this.track.querySelectorAll('.slide'));
    this.slideCount = this.slides.length;
    this.prevBtn = this.container.querySelector('.slider-prev');
    this.nextBtn = this.container.querySelector('.slider-next');
    this.paginationContainer = this.container.querySelector('.slider-pagination');
    this.slideWidth = 100; // percent, one view
    this.currentIndex = 0;
    this.isTransitioning = false;

    this.init();
  }

  init() {
    this.createNumericPagination();
    this.updatePosition();
    this.addEventListeners();
  }

  createNumericPagination() {
    if (!this.paginationContainer) return;
    this.paginationContainer.innerHTML = '';

    for (let i = 0; i < this.slideCount; i++) {
      const page = document.createElement('span');
      page.className = 'pagination-page';
      page.textContent = (i + 1);
      page.setAttribute('data-index', i);
      if (i === this.currentIndex) page.classList.add('active');
      page.addEventListener('click', () => this.goToSlide(i));
      this.paginationContainer.appendChild(page);
    }
  }

  updatePosition() {
    const offset = this.currentIndex * this.slideWidth;
    this.track.style.transform = `translateX(-${offset}%)`;
    // обновляем пагинацию
    if (this.paginationContainer) {
      this.paginationContainer.querySelectorAll('.pagination-page').forEach((page, index) => {
        page.classList.toggle('active', index === this.currentIndex);
      });
    }
  }

  addEventListeners() {
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });
  }

  goToSlide(index) {
    if (this.isTransitioning) return;
    this.currentIndex = Math.max(0, Math.min(index, this.slideCount - 1));
    this.updatePosition();
  }

  prevSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
    this.updatePosition();

    setTimeout(() => { this.isTransitioning = false; }, 500);
  }

  nextSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.currentIndex = (this.currentIndex + 1) % this.slideCount;
    this.updatePosition();

    setTimeout(() => { this.isTransitioning = false; }, 500);
  }

  resetToStart() {
    // вспомогательная функция чтобы вернуть к первому слайду
    this.currentIndex = 0;
    this.updatePosition();
  }

  // Очищаем инстанс, если требуется перестроить
  destroy() {
    // опционально: удаляем все слушатели, сбрасываем состояние
    if (this.prevBtn) this.prevBtn.replaceWith(this.prevBtn.cloneNode(true));
    if (this.nextBtn) this.nextBtn.replaceWith(this.nextBtn.cloneNode(true));
  }
}




