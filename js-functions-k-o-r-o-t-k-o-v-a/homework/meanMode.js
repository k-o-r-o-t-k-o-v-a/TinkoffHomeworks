/**
 * Напишите функцию meanMode(numbers), принимающую массив чисел numbers
 * и возвращающую true, если среднее значение числового ряда равно
 * числу (или любому из чисел), встречающемуся чаще остальных. Иначе
 * вернуть false.
 *
 * Если есть несколько чисел, встречающихся одинаковое количество раз,
 * и чаще всех остальных, считать входящий массив невалидным и
 * возвращать false.
 *
 * Пример:
 * meanMode([1]) === true
 * meanMode([4, 4, 4, 6, 2]) === true
 * meanMode([1, 2, 3]) === false
 * meanMode([1, 1, 1, 2, 5]) === false
 * meanMode([]) === false
 *
 * Больше примеров в тестах.
 *
 * @param  {number[]} numbers массив целых положительных чисел.
 * @return {boolean}
 */
export function meanMode(numbers) {
  let result = '';

  let max = 0;

  if (numbers.length === 0) {
    return false;
  }

  const mean = numbers.reduce((a, b) => (a + b)) / numbers.length;

  for (let i = 0; i < numbers.length; i++) {
    const isChecked = {};

    let count = 0;


    if (isChecked[numbers[i]] !== true) {
      for (let j = i; j < numbers.length; j++) {
        if (numbers[i] === numbers[j]) {
          count += 1;
        }
      }

      if (count > max) {
        max = count;
        result = numbers[i];
      }
      count = 0;
    }
    isChecked[numbers[i]] = true;
  }
  return result === mean;
}
