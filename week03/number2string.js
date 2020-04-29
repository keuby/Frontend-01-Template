const ZERO_CHAR_CODE = 48

export function number2string (number, scale = 10) {
  if (number === 0) return 0

  let integer = Math.floor(number)
  let fractional = number - integer
  let resultString = ''

  while (integer > 0) {
    const remainder = integer % scale
    resultString = String.fromCharCode(ZERO_CHAR_CODE + remainder) + resultString
    integer = Math.floor(integer / scale)
  }

  if (fractional < Number.EPSILON) {
    return resultString
  } else {
    resultString += '.'
  }

  while (fractional > 0) {
    fractional = fractional * scale
    let carry = Math.floor(fractional)
    fractional -= carry
    if (fractional > 0.95) {
      carry += 1
      resultString += String.fromCharCode(ZERO_CHAR_CODE + carry)
      break
    } else if (fractional < 0.05) {
      resultString += String.fromCharCode(ZERO_CHAR_CODE + carry)
      break
    }
    resultString += String.fromCharCode(ZERO_CHAR_CODE + carry)
  }
  return resultString
}
