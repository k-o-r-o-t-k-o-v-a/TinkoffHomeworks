/**
 * Напишите функцию anagram(first, second), определяющую,
 * являются ли переданные строки first и second анаграммами.
 *
 * Пример:
 * anagram('просветитель', 'терпеливость') === true
 *
 * Больше примеров в тестах.
 *
 * @param  {string} first первая строка
 * @param  {string} second вторая строка
 * @return {boolean}
 */
function sort(string) {
  return string.replace(/\s+/g, '').toLowerCase().split('').sort()
    .join('');
}
export function anagram(first, second) {
  if (first.trim() === second.trim()) {
    return false;
  }

  return sort(first) === sort(second);
}
