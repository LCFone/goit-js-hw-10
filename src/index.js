// імпортую необхідні залежності і бібліотеки
import SlimSelect from 'slim-select'; 
import 'slim-select/dist/slimselect.css'; 
import { fetchBreeds, fetchCatByBreed } from './cat-api.js'; 
import { Loading } from 'notiflix/build/notiflix-loading-aio'; 
import { Notify } from 'notiflix/build/notiflix-notify-aio'; 

// створюю посилання на DOM-елементи, які я буду використовувати
const refs = {
  select: document.querySelector('.breed-select'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
  catInfo: document.querySelector('.cat-info'),
};

// показую індикацію завантаження при запуску програми
Loading.hourglass('Loading...', {
  svgColor: '#f47a08',
  svgSize: '150px',
  messageFontSize: '40px',
});

// викликаю функцію для створення селекту з породами котів
createSelect();

// функція для створення селекту з породами котів
function createSelect(data) {
  // отримую список порід котів з сервера
  fetchBreeds(data)
    .then(data => {
      // при отриманні даних від сервера, приховую індикацію завантаження та відображаю селект
      refs.select.style.display = 'flex';
      refs.loader.style.display = 'none';

      // створюю опції для селекту і ініціалізю slim-select
      createMarkupOptions(data);
      new SlimSelect({
        select: refs.select,
      });
    })
    .catch(error => {
      // в разі помилки показую повідомлення про невдачу
      Notify.failure(refs.error.textContent);
    })
    .finally(result => {
      // після завершення операції (навіть при помилці), видаляю індикацію завантаження
      Loading.remove();
    });
}

// функція для створення опцій для селекту
function createMarkupOptions(arr) {
  return arr
    .map(({ id, name }) => {
      // генерую HTML-код опції для кожної породи кота
      const option = `<option value=${id}>${name}</option>`;
      // Ддодаю опцію до селекту
      refs.select.insertAdjacentHTML('beforeend', option);
    })
    .join('');
}

// додаю обробник події для селекту, який викликається при зміні вибору породи кота
refs.select.addEventListener('change', event => {
  const id = event.currentTarget.value;

  // показую індикацію завантаження
  Loading.hourglass('Loading...', {
    svgColor: '#f47a08',
    svgSize: '150px',
    messageFontSize: '40px',
  });

  // запит на сервер для отримання даних про кота за обраною породою
  fetchCatByBreed(id)
    .then(catData => {
      // при отриманні даних, відображаю контейнер з інформацією про кота
      refs.catInfo.style.display = 'flex';
      // викликаю функцію для створення картки кота
      createMarkupCards(catData);
    })
    .catch(error => {
      // в разі помилки показую повідомлення про невдачу
      Notify.failure(refs.error.textContent);
    })
    .finally(result => {
      // після завершення операції (навіть при помилці), видаляю індикацію завантаження
      Loading.remove();
    });
});

// функція для створення картки кота
function createMarkupCards(data) {
  const { breeds, url } = data[0];

  // генерую HTML-код картки кота з отриманими даними
  const card = `
      <img class="cat-img" src="${url}" alt="${breeds[0].name}"  >
      <div class="cat-right">
        <h1 class="name">${breeds[0].name}</h1>
        <p class="description">${breeds[0].description}</p>
        <p class="temperament"><span class="temperament-span">Temperament:</span> ${breeds[0].temperament}</p>
      </div>`;
  // вставляю HTML-код картки кота в контейнер для відображення інформації про кота
  refs.catInfo.innerHTML = card;
}
