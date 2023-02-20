/**
 * Напишите функцию rle(input), реализующую примитивное RLE-сжатие входящей строки input.
 * Подробнее об RLE: https://ru.wikipedia.org/wiki/Кодирование_длин_серий
 *
 * Входящая строка сооттветствует regex паттерну /^[A-Z]+$/
 *
 * Пример:
 * rle('AAAB') === 'A3B'
 * rle('BCCDDDEEEE') === 'BC2D3E4'
 *
 * Больше примеров в тестах.
 *
 * @param  {string} input
 * @return {string}
 */
export default function rle(input) {
  let result = '';

  if (input.length > 0) {
    let count = 1;

    let char = input[0];

    for (let i = 1; i < input.length; ++i) {
      const entry = input[i];

      if (entry === char) {
        count += 1;
      } else {
        result += (char + (count > 1 ? count.toString() : ''));
        count = 1;
        char = entry;
      }
    }
    result += (input[input.length - 1] + (count > 1 ? count.toString() : ''));
  }
  return result;
}
