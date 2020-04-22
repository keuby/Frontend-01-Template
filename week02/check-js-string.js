const LF = '\u000A'
const CR = '\u000D'
const LS = '\u2028'
const PS = '\u2029'

const LineTerminatorSequence = `(?:[${LF}]|[${CR}](?![${LF}])|[${LS}]|[${PS}]|[${CR}][${LF}])`

const Hex4Digit = '[0-9a-fA-F]'
const DecimalDigit = '[0-9]'
const Hex4Digits = '[0-9a-fA-F]{4}'
const SingleEscapeCharacter = '\'"\\\\bfnrtv'
const CodePoint = `(?:${Hex4Digit}{1,5}|10${Hex4Digit}{4})`
const HexEscapeSequence = `x${Hex4Digit}{2}`
const UnicodeEscapeSequence = `(?:u${Hex4Digits}|u{${CodePoint}})`
const EscapeCharacter = `[${SingleEscapeCharacter}xu0-9]`
const NonEscapeCharacter = `[^${SingleEscapeCharacter}xu0-9]`
const CharacterEscapeSequence = `(?:[${SingleEscapeCharacter}]|${NonEscapeCharacter})`


const EscapeSequence =
  `(?:${CharacterEscapeSequence}` +
  `|0(?!${DecimalDigit})` +
  `|${HexEscapeSequence}` +
  `|${UnicodeEscapeSequence})`

const LineContinuation = `\\\\${LineTerminatorSequence}`

const SingleStringCharacters = `([^\\\\'\\n${LF}${CR}]|\\\\${EscapeSequence}|${LineContinuation})+`

const DoubleStringCharacters = `([^\\\\"\\n${LF}${CR}]|\\\\${EscapeSequence}|${LineContinuation})+`

const StringLiteral = `^(?:'${SingleStringCharacters}'|"${DoubleStringCharacters}")$`

const StringLiteralRegExp = new RegExp(StringLiteral)

export function checkString (str) {
  const matched  = StringLiteralRegExp.exec(str)
  if (matched === null) {
    return 'Invalid'
  } else if (matched[1]) {
    return 'SingleString'
  } else if (matched[2]) {
    return 'DoubleString'
  }
}
