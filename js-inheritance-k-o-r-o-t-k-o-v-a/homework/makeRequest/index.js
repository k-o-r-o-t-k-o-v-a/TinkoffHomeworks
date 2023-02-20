/* eslint-disable import/extensions */
import { makeRequests } from './makeRequests.js';

document.addEventListener('DOMContentLoaded', () => {
  const urls = document.querySelector('#urls');
  const count = document.querySelector('#count');
  const button = document.querySelector('#button');
  const list = document.querySelector('#list');
  const result = document.querySelector('#result');

  button.addEventListener('click', async() => {
    button.disabled = true;

    const urlList = urls.value.split(/\s*\n\s*/);
    const countMax = Number(count.value);

    list.innerHTML = '';
    result.innerHTML = '';
    for (const url of urlList) {
      const p = document.createElement('p');

      p.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
      list.append(p);

      const div = document.createElement('div');

      div.className = 'item';
      div.innerHTML = `
        <p class="link">Ссылка: <a href="${url}" target="_blank">${url}</a></p>
        <p class="status">Статус: <span class="wait">wait</span></p>
        <p class="content">Содержимое: <span></span></p>
        `;
      result.append(div);
    }

    const data = await makeRequests(urlList, countMax);

    /* eslint-disable no-console */
    console.log(data);
    button.disabled = false;
  });
});
