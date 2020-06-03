const CSSWhat = require('css-what')

/**
 * @param {string} selector
 * @param {HTMLElement} element
 */
function match (selector, element) {
  const selectors = CSSWhat.parse(selector)[0].reverse()
  return matchElement(element, selectors, 0, { descendant: false })
}

function matchElement (element, selectors, index, { descendant }) {
  if (element == null) return false
  else if (index >= selectors.length) return true

  const selector = selectors[index]

  function matchSelector (compare) {
    if (compare()) {
      return matchElement(element, selectors, index + 1, { descendant: false })
    }
    if (descendant) {
      return matchElement(element.parentElement, selectors, index, { descendant })
    }
    return false
  }

  if (selector.type === 'attribute') {
    return matchSelector(() => matchAttr(element, selector))
  } else if (selector.type === 'tag') {
    return matchSelector(() => selector.name.toLowerCase() === element.tagName.toLowerCase())
  } else if (selector.type === 'pseudo') {
    return matchSelector(() => matchPseudo(element, selector.name, selector.data))
  } else if (selector.type === 'child') {
    return matchElement(element.parentElement, selectors, index + 1, { descendant })
  } else if (selector.type === 'adjacent') {
    return matchElement(element.previousElementSibling, selectors, index + 1, { descendant })
  } else if (selector.type === 'descendant') {
    return matchElement(element.parentElement, selectors, index + 1, { descendant: true })
  }

  throw new Error('unsupported selector type: ' + selector.type)
}

function matchAttr (element, { action, name, value }) {
  const attrValue = element.getAttribute(name)
  if (attrValue == null) return false

  if (action === 'element') {
    const items = attrValue.split(' ')
    return items.includes(value)
  } else if (action === 'equals') {
    return attrValue === value
  } else if (action === 'start') {
    return attrValue.startsWith(value)
  } else if (action === 'end') {
    return attrValue.endsWith(value)
  }
  return true
}

function matchPseudo (element, name, data) {
  // 不支持 带 n 的 :nth-child

  if (name === 'nth-child') {
    return computeNthChild(element) == data
  } else if (name === 'nth-last-child') {
    return computeNthChild(element, true) == data
  } else if (name === 'first-child') {
    return computeNthChild(element) == 1
  } else if (name === 'last-child') {
    return computeNthChild(element, true) == 1
  }
  return false
}

function computeNthChild (element, reverse = false) {
  const children = [...element.parentElement.children]
  reverse && children.reverse()
  let nth = Symbol('not found')
  for (const index in children) {
    if (children[index] === element) {
      nth = index + 1
      break
    }
  }
  return nth
}

const selector = 'div #id.class1[attr~=aaa]:last-child'
const element = document.getElementById("id")
console.log(match(selector, element))
