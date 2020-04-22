const DecimalDigits = `(?:[0-9]+)`
const DecimalIntegerLiteral = `(?:0|[1-9]${DecimalDigits}?)`
const SignedInteger =
  `(?:${DecimalDigits}` +
  `|\\+${DecimalDigits}` +
  `|-${DecimalDigits})`
const ExponentPart = `(?:[eE]${SignedInteger})`

const DecimalLiteral =
  `(${DecimalIntegerLiteral}\\.${DecimalDigits}?${ExponentPart}?` +
  `|\\.${DecimalDigits}${ExponentPart}?` +
  `|${DecimalIntegerLiteral}${ExponentPart}?)`

const BinaryIntegerLiteral = `(0b[01]+|0B[01]+)`

const OctalIntegerLiteral = `(0o[0-7]+|0O[0-7]+)`

const HexIntegerLiteral = `(0x[0-9a-fA-F]+|0X[0-9a-fA-F]+)`

const NumericLiteral =
  `(?:${DecimalLiteral}` +
  `|${BinaryIntegerLiteral}` +
  `|${OctalIntegerLiteral}` +
  `|${HexIntegerLiteral})$`

const NumericLiteralRegExp = new RegExp(`^[+-]?${NumericLiteral}$`)

export function checkNumber (num) {
  const matched = NumericLiteralRegExp.exec(num)
  if (matched === null) {
    return 'NaN'
  } else if (matched[1]) {
    return 'Decimal'
  } else if (matched[2]) {
    return 'Binary'
  } else if (matched[3]) {
    return 'Octal'
  } else if (matched[4]) {
    return 'Hex'
  }
}
