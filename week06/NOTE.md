# 本周总结

## 本周作业

```js
const css = require('css')

class CSSHandler {
  constructor(stack) {
    this.rules = []
    this.stack = stack
  }

  addCSSRules(content) {
    const ast = css.parse(content)
    this.rules.push(...ast.stylesheet.rules)
  }

  computeCSS(element) {
    const elements = this.stack.slice().reverse()
    const computedStyle = element.computedStyle
      || (element.computedStyle = {})

    let match = false

    for (let rule of this.rules) {
      const selectorParts = rule.selectors[0].split(' ').reverse()
      if (!match(element, selectorParts[0])) {
        continue
      }

      for (let i = 0, j = 1; i < elements.length; i++) {
        let element = elements[i]
        let selectorPart = selectorParts[j]
        if (match(element, selectorPart)) j++
      }

      if (j >= selectorParts.length) {
        match = true
      }

      if (match) {
        console.log('Element', element, 'match rule', rule)
      }
    }
  }
}
```

```js
const EOF = Symbol('EOF')

function isLetter (c) {
  return /^[a-zA-Z]$/.test(c)
}

function(c) isSpace {
  return '\t\n\f '.includes(c)
}

class HTMLStateMachine {
  constructor (emit = () => {}) {
    this.tagToken = null
    this.commentToken = null
    this.returnState = null
    this.emit = emit
  }

  createAttribute (token, c) {
    const attribute = { name: c || '', value: '' }
    if (token.attributes) {
      token.attributes.push(attribute)
    } else {
      token.attributes = [attribute]
    }
    return attribute
  }

  appendAttributeName (token, c) {
    const lastIdx = token.attributes.length - 1
    const attribute = token.attributes[lastIdx]
    attribute.name += c
  }

  appendAttributeValue (token, c) {
    const lastIdx = token.attributes.length - 1
    const attribute = token.attributes[lastIdx]
    attribute.value += c
  }

  data (c) {
    if (c === EOF) {
      this.emit({ type: 'EOF' })
    } else if (c === '<') {
      return this.tagOpen
    } else {
      this.emit({ type: 'character', char: c })
      return this.data
    }
  }

  tagOpen (c) {
    if (c === EOF) {
      this.emit({ type: 'character', char: '<' })
      this.emit({ type: 'EOF' })
    } else if (c === '/') {
      return this.endTagOpen
    } else if (isLetter(c)) {
      this.tagToken = { type: 'startTag', tagName: '' }
      return this.tagName(c)
    } else {
      this.emit({ type: 'character', char: '<' })
      return this.data(c)
    }
  }

  endTagOpen (c) {
    if (c === EOF) {
      this.emit({ type: 'character', char: '<' })
      this.emit({ type: 'character', char: '/' })
      this.emit({ type: 'EOF' })
      return this.endTagOpen
    } else if (isLetter(c)) {
      this.tagToken = { type: 'endTag', tagName: '' }
      return this.tagName(c)
    } else if (c === '>') {
      return this.data
    } else {
      this.commentToken = { type: 'comment', data: '' }
      return this.bogusComment(c)
    }
  }

  tagName (c) {
    if (c === EOF) {
      this.emit({ type: 'EOF' })
      return this.tagName
    } else if (isSpace(c)) {
      return this.beforeAttributeName
    } else if (c === '/') {
      return this.selfClosingStartTag
    } else if (c === '>') {
      this.emit(this.tagToken)
      return this.data
    } else if (isLetter(c)) {
      this.tagToken.tagName += c.toLowerCase()
      return this.tagName
    } else {
      this.tagToken.tagName += c
      return this.tagName
    }
  }

  beforeAttributeName (c) {
    if (isSpace(c)) {
      return this.beforeAttributeName
    } else if (c === EOF || '/>'.includes(c)) {
      return this.afterAttributeName(c)
    } else if (c === '=') {
      this.createAttribute(this.tagToken, c)
      return this.attributeName
    } else {
      this.createAttribute(this.tagToken)
      return this.attributeName(c)
    }
  }

  afterAttributeName (c) {
    if (c === EOF) {
      this.emit({ type: 'EOF' })
      return this.afterAttributeName
    } else if (isSpace(c)) {
      return this.afterAttributeName
    } else if (c === '/') {
      return this.selfClosingStartTag
    } else if (c === '=') {
      return this.beforeAttributeValue
    } else if (c === '>') {
      this.emit(this.tagToken)
      return this.data
    } else {
      this.createAttribute(this.tagToken)
      return this.attributeName
    }
  }

  beforeAttributeValue (c) {
    if (c === EOF || isSpace(c)) {
      return this.beforeAttributeValue
    } else if (c === '"') {
      return this.attributeValueDoubleQuoted
    } else if (c === '\'') {
      return this.attributeValueSingleQuoted
    } else if (c === '>') {
      this.emit(this.tagToken)
      return this.data
    } else {
      return this.attributeValueUnquoted(c)
    }
  }

  attributeValueDoubleQuoted (c) {
    if (c === EOF) {
      this.emit({ type: 'EOF' })
      return this.attributeValueDoubleQuoted
    } if (c === '"') {
      return this.afterAttributeValueQuoted
    } else if (c === '&') {
      this.returnState = this.attributeValueDoubleQuoted
      return this.characterReference
    } else {
      this.appendAttributeValue(this.tagToken, c)
      return this.attributeValueDoubleQuoted
    }
  }

  attributeValueSingleQuoted (c) {
    if (c === EOF) {
      this.emit({ type: 'EOF' })
      return this.attributeValueSingleQuoted
    } if (c === '\'') {
      return this.afterAttributeValueQuoted
    } else if (c === '&') {
      this.returnState = this.attributeValueSingleQuoted
      return this.characterReference
    } else {
      this.appendAttributeValue(this.tagToken, c)
      return this.attributeValueSingleQuoted
    }
  }

  attributeValueUnquoted (c) {
    if (c === EOF) {
      this.emit({ type: 'EOF' })
      return this.attributeValueUnquoted
    } else if (isSpace(c)) {
      return this.beforeAttributeName
    } else if (c === '&') {
      this.returnState = this.attributeValueUnquoted
      return this.characterReference
    } else if (c === '>') {
      return this.data
    } else if ('"\'<=`'.includes(c)) {
      this.appendAttributeValue(this.tagToken, c)
      return this.attributeValueUnquoted
    } else {
      this.appendAttributeValue(this.tagToken, c)
      return this.attributeValueUnquoted
    }
  }

  afterAttributeValueQuoted (c) {
    if (c === EOF) {
      this.emit({ type: 'EOF' })
      return this.afterAttributeValueQuoted
    } else if (isSpace(c)) {
      return this.beforeAttributeName
    } else if (c === '/') {
      return this.selfClosingStartTag
    } else if (c === '>') {
      this.emit(this.tagToken)
      return this.data
    } else {
      return this.beforeAttributeName(c)
    }
  }

  attributeName (c) {
    if (isSpace(c) || c === EOF || '/>'.includes(c)) {
      return this.afterAttributeName(c)
    } else if (c === '=') {
      return this.beforeAttributeValue
    } else if (isLetter(c)) {
      this.appendAttributeName(this.tagToken, c.toLowerCase())
      return this.attributeName
    } else if ('"\'<'.includes(c)) {
      this.appendAttributeName(this.tagToken, c)
      return this.attributeName
    } else {
      this.appendAttributeName(this.tagToken, c)
      return this.attributeName
    }
  }

  selfClosingStartTag (c) {
    if (c === '>') {
      this.tagToken.isSelfClosing = true
      this.emit(this.tagToken)
      return this.data
    } else if (c === EOF) {
      this.emit({ type: 'EOF' })
      return this.selfClosingStartTag
    } else {
      return this.beforeAttributeName
    }
  }

  bogusComment (c) {
    if (c === EOF) {
      this.emit({ type: 'EOF' })
      return this.bogusComment
    } else if (c === '\u0000') {
      this.commentToken.data += '\ufffd'
      return this.bogusComment
    } else if (c === '>') {
      this.emit(this.commentToken)
      return this.data
    } else {
      this.commentToken.data += c
      return this.bogusComment
    }
  }
}
```

```js
class HtmlParser {
  constructor () {
    this.currentTextNode = null
    this.stack = [{ type: 'document', children: [] }]
  }

  parseHTML (html) {
    this.currentTextNode = null
    this.stack = [{ type: 'document', children: [] }]

    const cssHandler = new CSSHandler(this.stack)
    const stateMachine = new HTMLStateMachine(token => {
      this.emit(token, cssHandler)
    })

    let state = stateMachine.data
    for (const c of html) {
      state = state.call(stateMachine, c)
    }
    state.call(stateMachine, EOF)
    return this.stack[0]
  }

  emit (token, cssHandler) {
    const top = this.stack[this.stack.length - 1]

    if (token.type === 'startTag') {
      const element = {
        type: 'element',
        tagName: token.tagName,
        children: [],
        attribute: token.attributes || [],
        parent: top
      }

      cssHandler.computeCSS(element)

      top.children.push(element)
      if (!token.isSelfClosing) {
        this.stack.push(element)
      }
      this.currentTextNode = null
    } else if (token.type === 'endTag') {
      if (token.tagName !== top.tagName) {
        throw new Error('element is not matched')
      } else {
        if (token.tagName === 'style') {
          cssHandler.addCSSRules(top.children[0].content)
        }
        this.stack.pop()
      }
      this.currentTextNode = null
    } else if (token.type === 'character') {
      if (this.currentTextNode) {
        this.currentTextNode.content += token.char
      } else {
        this.currentTextNode = {
          type: 'text',
          content: token.char
        }
        top.children.push(this.currentTextNode)
      }
    }
  }
}

module.exports.parseHTML = function (body) {
  const parser = new HtmlParser()
  return parser.parseHTML(body)
}
```

## 有限状态机

## DOM

## CSS

### 收集 CSS 规则

### 计算 CSS 

- 当创建元素之后，立即计算 CSS

    > 子元素的样式会受父元素样式的影响

- 理论上，当分析 CSS 的时候，所有 CSS 规则已经收集完毕

- 当执行 CSS Computing 时，必须知道当前元素的所有父元素才能知道 CSS 规则与当前元素是否匹配

- 因为首先获取的是当前元素，所以我们获得和计算父元素的匹配的顺序是从内向外的

> NOTE：在实际项目中，尽可能吧 style 写在所有 dom 元素之前，如果写在后面，则会引发 CSS 重新计算，进而引发重排(reflow)和重绘(redraw)，可能会出现闪动
