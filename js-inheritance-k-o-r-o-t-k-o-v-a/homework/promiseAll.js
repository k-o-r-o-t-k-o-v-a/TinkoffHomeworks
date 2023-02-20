/**
 * Напишите функцию promiseAll(promises), поведение
 * которой аналогично поведению Promise.all(promises).
 *
 * @param  {Promise[]} promises массив с исходными промисами
 * @return {Promise}
 */
export const promiseAll = promises => new Promise((resolve, reject) => {
  const output = [];

  for (let i = 0; i < promises.length; i++) {
    Promise.resolve(promises[i])
      .then(
        result => {
          output[i] = result;
          promises.length -= 1;
          if (!promises.length) {
            resolve(output);
          }
        }
      )
      .catch(
        error => {
          reject(error);
        }
      );
  }
});
