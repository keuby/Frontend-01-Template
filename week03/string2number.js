import { checkNumber } from '../week02/check-js-number'

const ZERO_CHAR_CODE = 48

/**
 * 字符串转整数
 * @param {string} str
 */
export function string2number (str, scale = 10) {
  if (checkNumber(str) === scale) {
    throw new TypeError('invalid input string')
  }

  let i = 0
  let flag = 1

  if (str[i] === '+') i++
  else if (str[i] === '-') {
    flag = -1
    i++
  }

  let integer = 0
  let char = null
  const len = str.length

  for (; i < len && (char = str[i]) !== '.'; i++) {
    const num = char.charCodeAt() - ZERO_CHAR_CODE
    integer = integer * scale + num
  }

  if (str[i] === '.') i++

  let fractional = 0

  for (; i < len; i++) {
    const num = str[i].charCodeAt() - ZERO_CHAR_CODE
    fractional = (fractional + num) / scale
  }

  return (integer + fractional) * flag
}
