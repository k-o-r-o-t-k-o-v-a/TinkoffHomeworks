/**
 * Задача повышенной сложности. На неё нет тестов, и ее выполнение
 * должно быть визуализировано.
 *
 * Напишите функцию makeRequests(urls, maxRequests), получающую
 * на вход массив ссылок urls и число maxRequests - максимальное
 * количество одновременных запросов. Условия:
 *
 * 1. Одновременно должно выполняться не более указанного
 *    числа запросов.
 * 2. Должен возвращаться promise, резолвящийся в массив результатов
 *    в той же последовательности, что и адреса запросов.
 * 3. Дублирующиеся урлы должны игнорироваться (при этом
 *    результат всё равно должен присутствовать в результате
 *    на нужной позиции).
 * 4. Массив результатов должен возвращаться вне зависимости
 *    от успешности выполнения запросов.
 * 5. В массиве результатов вместо "упавших" запросов должна быть строка "Error"
 *
 * Требования к визуализации:
 *
 * 1. Должен быть создан index.html
 * 2. В интерфейсе должна быть возможность задать любое количество url.
 *    (Можно сделать это добавлением/удалением полей, перечислить через запятую в одном текстовом поле
 *    или любой другой вариант, на который хватит фантазии)
 * 3. В интерфейсе должна быть возможность задать число -- ограничение на количество запросов
 * 4. В интерфейсе должна быть кнопка, по нажатию на которую должно начинаться выполнение запросов
 * 5. После запуска должен отображаться список url
 * 6. У каждого url должен отображаться актуальный статус
 *    (wait, in progress, resolved, rejected), доп информация (duplicate) и результат. Хорошо,
 *    если статус будет отображаться цветом
 * 7. После выполнения всех запросов на страницу нужно вывести результат
 *
 * @param  {string[]} urls      массив с адресами
 * @param  {number} maxRequests максимальное количество одновременных запросов
 * @return {Promise}
 */

async function getUrl(url) {
  const result = await fetch(url);

  if (!result.ok) { throw result.statusText; }

  return result.json();
}

function setStatus(index, text) {
  const el = document.querySelector(`#result .item:nth-child(${index}) .status span`);

  if (el) {
    el.innerText = text;
    switch (text) {
      case 'wait': el.className = 'wait'; break;
      case 'in progress': el.className = 'prog'; break;
      case 'resolved': el.className = 'res'; break;
      case 'rejected': el.className = 'rej'; break;
      // no default
    }
  }
}

function setContent(index, content, duplicate = false) {
  const el = document.querySelector(`#result .item:nth-child(${index}) .content span`);

  if (el) {
    if (content.name) {
      el.innerText = content.name;
    } else {
      el.innerText = content;
    }

    if (duplicate) { el.innerText += ' (duplicate)'; }
  }
}

export const makeRequests = async(urls, maxRequests) => new Promise((resolve, reject) => {
  try {
    const result = [];
    const duplicates = {};

    let index = 0;

    let current = 0;

    /* eslint-disable no-inner-declarations */
    /* eslint-disable max-statements */
    async function next() {
      current += 1;
      const tmp = index;

      index += 1;
      const origIndex = urls.indexOf(urls[tmp]);

      try {
        setStatus(tmp + 1, 'in progress');

        if (origIndex === tmp) {
          result[tmp] = await getUrl(urls[tmp]);
          setStatus(tmp + 1, 'resolved');
          setContent(tmp + 1, result[tmp]);
          /* eslint-disable max-depth */
          if (duplicates[tmp]) {
            for (const i of duplicates[tmp]) {
              result[i] = result[tmp];
              setStatus(i + 1, 'resolved');
              setContent(i + 1, result[tmp], true);
            }
          }
        } else if (result[origIndex]) {
          result[tmp] = result[origIndex];
          setStatus(tmp + 1, 'resolved');
          setContent(tmp + 1, result[tmp], true);
        } else if (duplicates[origIndex]) {
          duplicates[origIndex].push(tmp);
        } else {
          duplicates[origIndex] = [tmp];
        }
      } catch (err) {
        result[tmp] = 'Error';
        setStatus(tmp + 1, 'rejected');
        setContent(tmp + 1, result[tmp]);
      }
      current -= 1;

      if (index < urls.length) {
        next();
      } else if (!current) {
        resolve(await Promise.all(result));
      }
    }

    for (let i = 0; i < maxRequests && i < urls.length; i++) {
      next();
    }
  } catch (err) {
    reject(err);
  }
});
