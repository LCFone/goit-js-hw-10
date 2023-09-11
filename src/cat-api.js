import axios from 'axios';

// встановлюю заголовок "x-api-key" з моїм ключем
const URL = 'https://api.thecatapi.com/v1/';
const API_KEY =
  'live_PIKO1MJV704js2hAajRTD1Mg66VFyBemTTvk82FxSLBXSXVkgAlIaYh8mYC3AutH';
axios.defaults.headers.common['x-api-key'] = API_KEY;

// функція для отримання колекції порід котів
function fetchBreeds() {
  const BREEDS_URL = `${URL}breeds`;
  return axios.get(BREEDS_URL).then(res => {
    // перевірка статусу відповіді сервера
    if (res.status !== 200) {
      throw new Error(res.status); // викликаю помилку, якщо статус не є 200
    }
    return res.data; // повертаю масив порід котів з відповіді
  });
}

// функція для отримання випадкового зображення кота за породою (breedId)
function fetchCatByBreed(breedId) {
  const IMAGES_URL = `${URL}images/search`;
  const params = new URLSearchParams({
    breed_ids: breedId, // встановлюю параметр "breed_ids" з переданим breedId
  });
  return axios.get(`${IMAGES_URL}?${params}`).then(res => {
    // перевірка статусу відповіді сервера
    if (res.status !== 200) {
      throw new Error(res.status); // викликаю помилку, якщо статус не є 200
    }
    return res.data[0]; // повертаю перше зображення з відповіді
  });
}

// експортую функції, щоб вони могли бути використані в інших частинах програми
export { fetchBreeds, fetchCatByBreed };
