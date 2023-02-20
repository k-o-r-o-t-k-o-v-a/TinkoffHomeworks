import { debounce } from '../node_modules/debounce/index.js';
/* eslint-disable max-statements */
document.addEventListener('DOMContentLoaded', () => {
  const constKey = '98d3ce03';
  const constSearchForm = document.querySelector('.main__form');
  const constSearchField = document.querySelector('.form__inp');
  const constHints = document.querySelector('.form__hints');
  const constNotFound = document.querySelector('.no-results');
  const constFilmContainer = document.querySelector('#filmContainer');
  const constFilmContainerTitle = document.querySelector('.result__title');
  const constFilmContainerCards = document.querySelector('.result__container');
  const constLoader = document.querySelector('.loader');

  let result = {};

  let store = new Map();

  let tagsArray = [];

  constSearchForm.addEventListener('submit', event => event.preventDefault());
  function clearElements() {
    constSearchForm.classList.remove('search_live');
    constSearchForm.classList.remove('search_more_history');
    constNotFound.classList.remove('search_not_found');
    constFilmContainer.classList.remove('search_live');
    constFilmContainerCards.innerHTML = '';
    constFilmContainerTitle.innerHTML = '';
  }
  function renderfilmCard(data) {
    return `
    <div class="result__poster poster">
        <a href="#"><img src=${
          data.Poster === "N/A" ? "img/poster-other.png" : data.Poster
        } alt="Click to see more about film" class="poster__img"></a>
        <div class="poster__info">
            <div class="poster__value">👍 ${
              data.imdbRating === "N/A" ? "Нет данных" : data.imdbRating
            }</div>
            <h3 class="poster__title">${data.Title}</h3>
            <div class="poster__sub">
                <span class="poster__sub-genre">${data.Genre}</span>
                <span class="poster__sub-year">${data.Year}</span>
            </div>
        </div>
    </div>
    `;
  }

  function renderStoreValues(data) {
    clearElements();
    constFilmContainerTitle.innerHTML = `Нашли ${data.result} фильмов`;
    for (const film of data.filmArray) {
      constFilmContainerCards.innerHTML += renderfilmCard(film);
    }
    constSearchForm.classList.add('search_live');
    constSearchForm.classList.add('search_more_history');
    constLoader.classList.add('in-active');
    constFilmContainer.classList.add('search_live');
  }
  async function getFilms(value) {
    const response = await fetch(
      `http://www.omdbapi.com/?s=${value}&apikey=${constKey}`
    );
    /* eslint-disable no-return-await */

    return await response.json();
  }

  async function getFilmData(id) {
    const response = await fetch(
      `http://www.omdbapi.com/?i=${id}&apikey=${constKey}`
    );

    return await response.json();
  }

  function renderError(error) {
    if (error === 'Movie not found!') {
      constLoader.classList.add('in-active');
      constNotFound.classList.add('search_not_found');
    } else {
      constLoader.classList.add('in-active');
      constFilmContainerCards.innerHTML =
        '<p class="error-msg">К сожалению, произошла ошибка.</p>';
      constFilmContainer.classList.add('search_live');
    }
  }
  /* eslint-disable no-await-in-loop */
  async function renderFilms(filmArray, results) {
    try {
      constFilmContainerTitle.innerHTML = `Нашли ${results} фильмов`;
      const storeObj = store.get(constSearchField.value);

      for (const film of filmArray) {
        const data = await getFilmData(film.imdbID);
        storeObj.filmArray.push(data);
        constFilmContainerCards.innerHTML += `
            <div class="result__poster poster">
                <a href="#"><img src=${
                  data.Poster === "N/A" ? "img/poster-other.png" : data.Poster
                } alt="Click to see more about film" class="poster__img"></a>
                <div class="poster__info">
                    <div class="poster__value">👍 ${
                      data.imdbRating === "N/A" ? "Нет данных" : data.imdbRating
                    }</div>
                    <h3 class="poster__title">${data.Title}</h3>
                    <div class="poster__sub">
                        <span class="poster__sub-genre">${data.Genre}</span>
                        <span class="poster__sub-year">${data.Year}</span>
                    </div>
                </div>
            </div>
            `;
      }
      tagsArray.unshift(constSearchField.value);
      constLoader.classList.add('in-active');
      constFilmContainer.classList.add('search_live');
    } catch (e) {
      constFilmContainerCards.innerHTML = '';
      renderError('');
    }
  }

  function renderTag(text) {
    return `<div class="form__hint">${text}</div>`;
  }

  /* eslint-disable no-use-before-define */
  function renderTags() {
    constHints.innerHTML = '';
    tagsArray.forEach(tag => {
      constHints.innerHTML += renderTag(tag);
    });
    const tags = document.querySelectorAll('.form__hint');

    for (let i = 0; i < tags.length; i++) {
      let timeoutID;
      /* eslint-disable no-loop-func */

      tags[i].addEventListener('click', () => {
        timeoutID = setTimeout(() => {
          const data = store.get(tags[i].innerHTML.split('<')[0]);
          renderStoreValues(data);
          renderTags();
        }, 200);
      });
      tags[i].addEventListener('dblclick', () => {
        clearTimeout(timeoutID);
        clearTimeout(timeoutID - 1);
        clearSearch(tags[i].innerHTML.split('<')[0]);
      });
    }
  }

  function clearSearch(text) {
    const tagIndex = tagsArray.indexOf(text);

    tagsArray.splice(tagIndex, 1);
    if (text === constSearchField.value) {
      store.delete(text);
      clearElements();
    } else {
      store.delete(text);
      clearElements();
      renderStoreValues(store.get(constSearchField.value));
      renderTags();
    }
  }

  /* eslint-disable max-depth */
  async function searchFunction() {
    try {
      clearElements();
      if (constSearchField.value) {
        if (store.has(constSearchField.value)) {
          renderStoreValues(store.get(constSearchField.value));
        } else {
          constLoader.classList.remove('in-active');
          result = await getFilms(constSearchField.value.toLowerCase());
          if (result.Response === 'True') {
            store.set(constSearchField.value, { result: '', filmArray: [] });
            const storeObj = store.get(constSearchField.value);

            storeObj.result = result.totalResults;
            await renderFilms(result.Search, result.totalResults);
            constSearchForm.classList.add('search_live');
            constSearchForm.classList.add('search_more_history');
            renderTags();
          } else if (result.Response === 'False') {
            renderError(result.Error);
          }
        }
      }
    } catch (e) {
      renderError('');
    }
  }

  constSearchField.addEventListener(
    'keyup',
    debounce.debounce(searchFunction, 800)
  );

  window.onload = async function onload() {
    store = new Map(JSON.parse(localStorage.getItem('data')));
    if (JSON.parse(localStorage.getItem('tags'))) {
      tagsArray = JSON.parse(localStorage.getItem('tags'));
    } else {
      tagsArray = [];
    }
    const searchValue = localStorage.getItem('searchValue');

    constSearchField.value = searchValue;
    const data = store.get(searchValue);
    renderStoreValues(data);
    renderTags();
  };

  window.onbeforeunload = function onbeforeunload() {
    localStorage.setItem('data', JSON.stringify(Array.from(store.entries())));
    if (constSearchField.value) {
      localStorage.setItem('searchValue', constSearchField.value);
    }
    localStorage.setItem('tags', JSON.stringify(tagsArray));
  };
});