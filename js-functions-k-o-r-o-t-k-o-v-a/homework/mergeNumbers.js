/**
 * Напишите функцию mergeNumbers(number), складывающую
 * все цифры числа number до тех пор, пока не получится
 * однозначный результат.
 *
 * Пример:
 * mergeNumbers(1) === 1
 * mergeNumbers(10001) === 2
 * mergeNumbers(15334232) === 5
 * mergeNumbers(50349814743854) === 2
 *
 * @param number
 */

export function mergeNumbers(number) {
  if (number < 10) {
    return number;
  }
  return mergeNumbers(number.toString().split('').reduce((res, digit) => res + Number(digit), 0));
}
