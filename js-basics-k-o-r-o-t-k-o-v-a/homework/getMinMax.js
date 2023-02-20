/**
 * Напишите функцию getMinMax(input), принимающую строку input,
 * и ищущую в ней максимальное и минимальное числа.
 *
 * Числа в строке выделяются пробелами или знаками препинания.
 *
 * Пример:
 * getMinMax('1 и 6.45, -2, но 8, а затем 15, то есть 2.7 и -1028');
 * // { min: -1028, max: 15 }
 *
 * getMinMax('"To Infinity and beyond", - repeated Buzz Lightyear 4 times in a row')
 * { max: Infinity, min: 4 }
 *
 * Больше примеров в тестах.
 *
 * @param  {string} input входная строка
 * @return {{min: number, max: number}} объект с минимумом и максимумом
 */
export default function getMinMax(input) {
  let maximum;

  let minimum;
  const string = input.split(' ');

  for (let i = 0; i < string.length; i++) {
    const current = parseFloat(string[i]);

    if (!Number.isNaN(current)) {
      if (maximum === undefined || current > maximum) { maximum = current; }
      if (minimum === undefined || current < minimum) { minimum = current; }
    }
  }
  return { max: maximum, min: minimum };
}
