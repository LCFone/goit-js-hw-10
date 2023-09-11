// задаю URL і ключ API для отримання даних про котів
const URL = 'https://api.thecatapi.com/v1';
const API_KEY =
  'live_PIKO1MJV704js2hAajRTD1Mg66VFyBemTTvk82FxSLBXSXVkgAlIaYh8mYC3AutH';

// функція для отримання списку порід котів
export function fetchBreeds() {
  // виконую запит на сервер за списком порід котів і використовую ключ API
  return fetch(`${URL}/breeds?api_key=${API_KEY}`).then(response => {
    // перевіряю, чи був отриманий коректний відгук від сервера
    if (!response.ok) {
      // якщо відгук не був коректним (наприклад, 404 - не знайдено), виводжу помилку зі статусом відгука
      throw new Error(response.status);
    }
    // повертаю дані у форматі JSON для подальшого використання
    return response.json();
  });
}

// функція для отримання випадкового кота за обраною породою
export function fetchCatByBreed(breedId) {
  // виконую запит на сервер за випадковим котом, задаючи параметр "breed_ids" для конкретної породи та використовую ключ API
  return fetch(
    `${URL}/images/search?api_key=${API_KEY}&breed_ids=${breedId}`
  ).then(response => {
    // перевіряю, чи був отриманий коректний відгук від сервера
    if (!response.ok) {
      // Якщо відгук не був коректним, виводжу помилку зі статусом відгука
      throw new Error(response.status);
    }
    // Повертаємо дані у форматі JSON для подальшого використання
    return response.json();
  });
}
