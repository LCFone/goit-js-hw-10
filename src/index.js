// імпортуєю необхідні модулі та стилі зовнішнього вигляду:
import SlimSelect from 'slim-select'; // імпорт модуля SlimSelect для створення красивого випадаючого списку
import 'slim-select/dist/slimselect.css'; // імпорт стилів SlimSelect
import { fetchBreeds, fetchCatByBreed } from './cat-api.js'; // імпорт функцій для завантаження списку порід кішок та отримання інформації про кота
import { Loading } from 'notiflix/build/notiflix-loading-aio'; // імпорт модуля для відображення анімаційного завантаження
import { Notify } from 'notiflix/build/notiflix-notify-aio'; // імпорт модуля для відображення сповіщень

// створюю посилання на HTML-елементи, який ми буду змінювати
const refs = {
  select: document.querySelector('.breed-select'), // вибір породи кота
  loader: document.querySelector('.loader'), // анімація завантаження
  err: document.querySelector('.error'), // повідомлення про помилку
  catCard: document.querySelector('.cat-info'), // інформація про кота
};

// приховую елементи на сторінці, щоб показати їх пізніше, коли буде потрібно:
refs.loader.style.display = 'none'; // приховую анімацію завантаження
refs.err.style.display = 'none'; // приховую повідомлення про помилку
refs.select.style.display = 'none'; // приховую вибір породи кота
refs.catCard.style.display = 'none'; // приховую інформацію про кота

// налаштовую анімацію завантаження:
Loading.dots({
    svgColor: '#5897fb',
    svgSize: '130px',
    messageFontSize: '30px',
  });

// завантажую список порід котів і створюємо випадаючий список:
fetchBreeds()
  .then(data => {
    refs.select.style.display = 'flex'; // показую вибір породи кота
    refs.loader.style.display = 'none'; // приховую анімацію завантаження

    createMarkupOptions(data); // створюю варіанти вибору породи кота
    new SlimSelect({
      select: refs.select, // вказую HTML-елемент для створення випадаючого списку
    });
  })
  .catch(err => {
    Notify.failure(refs.err.textContent); // показую повідомлення про помилку, якщо завантаження не вдалося
  })
  .finally(result => Loading.remove()); // завершую анімацію завантаження

// створюємо функцію createMarkupOptions, яка створює варіанти вибору породи кота:
function createMarkupOptions(arr) {
    return arr
      .map(({ id, name }) => {
        console.log({ id, name });
  
        const option = `<option value=${id}>${name}</option>`;
        refs.select.insertAdjacentHTML('beforeend', option); // додаю варіант вибору до випадаючого списку
      })
      .join('');
  }
  

// додаємо слухача подій для вибору породи кота:
refs.select.addEventListener('change', e => {
    const id = e.target.value; // отримуємо значення вибраної породи кота
  
    Loading.dots({
      svgColor: '#5897fb',
      svgSize: '130px',
      messageFontSize: '30px',
    });
  
    fetchCatByBreed(id) // завантажую інформацію про кота обраної породи
      .then(catInfo => {
        refs.catCard.style.display = 'flex'; // виводжу інформацію про кота
        createMarkupCards(catInfo); // створюю вигляд для інформації про кота
      })
      .catch(err => {
        Notify.failure(refs.err.textContent); // виводжу повідомлення про помилку, якщо завантаження не вдалося
      })
      .finally(result => Loading.remove()); // Ззавершую анімацію завантаження
  });
  
// створюємо функцію createMarkupCards, яка створює вигляд для інформації про кота:
function createMarkupCards(data) {
    const {
      breeds: { name, description, temperament },
      url,
    } = data;
  
    const card = ` 
        <img class="cat-img" src="${url}" alt="${name}"  >
         <div class="cat-right">
        <h1 class="name">${name}</h1>
        <p class="description">${description}</p>
        <p class="temperament"><span class="temperament-span">Temperament:</span> ${temperament}</p>    
        </div>`;
  
    refs.catCard.innerHTML = card; // вставляємо інформацію про кота у відповідний блок
  }
  