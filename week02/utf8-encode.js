function getBitCount (len) {
  if (len <= 7) {
    return 1
  } else if (len <= 11) {
    return 2
  } else if (len <= 16) {
    return 3
  } else if (len <= 21) {
    return 4
  } else if (len <= 26) {
    return 5
  } else if (len <= 31) {
    return 6
  }
  throw new TypeError('Unsupported charactor')
}

function encodeSingleCharactor (c) {
  const codePoint = c.codePointAt().toString(2)
  const bitCount = getBitCount(codePoint.length)
  if (bitCount === 1) {
    return parseInt(codePoint, 2)
  }
  let encoded = []
  for (let p = codePoint.length; p >= 6; p -= 6) {
    let bits = codePoint.slice(p - 6, p)
    num = parseInt(`10${bits}`, 2)
    encoded.unshift(num)
  }
  let bits = codePoint.slice(0, codePoint.length % 6)
  let numBit = new Array(bitCount + 1).join('1') + '0' + new Array(7 - bitCount - bits.length).join('0') + bits
  encoded.unshift(parseInt(numBit, 2))
  return encoded
}

export function utf8Encode (str) {
  let buffer = []
  for (let c of str) {
    let encoded = encodeSingleCharactor(c)
    buffer = buffer.concat(encoded)
  }
  return Uint8Array.from(buffer)
}
