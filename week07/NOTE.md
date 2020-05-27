# 本周总结及作业

## 本周作业

### 思维导图

![](./css.jpg)

### 排版&绘制

```js
// layout
function getStyle (element) {
  const style = element.style || (element.style = {})
  const computedStyle = element.computedStyle

  for (const prop in computedStyle) {
    const value = computedStyle[prop].value
    style[prop] = value

    if (value.toString().match(/px$/)) {
      style[prop] = parseInt(value)
    } else if (value.toString().match(/^[0-9\.]+$/)) {
      style[prop] = parseInt(value)
    }
  }

  return style
}

function setDefault (style, prop, defaultValue) {
  if (!style[prop] || style[prop] === 'auto') {
    style[prop] = defaultValue
  }
}

module.exports.layout = function (element) {
  if (!element || !element.computedStyle) return

  const computedStyle = element.computedStyle
  if (computedStyle.display !== 'flex') return

  var style = getStyle(element)
  const children = element.children.filter(e => e.type === 'element')

  ;['width', 'height'].forEach(prop => {
    if (['', 'auto'].includes(stype[prop])) {
      stype[prop] = null
    }
  })

  setDefault(style, 'flexDirection', 'row')
  setDefault(style, 'alignItems', 'stretch')
  setDefault(style, 'justifyContent', 'flext-start')
  setDefault(style, 'flexWrap', 'nowrap')
  setDefault(style, 'aliginContent', 'stretch')

  let mainSize, mainStart, mainEnd, mainSign, mainBase
  let crossSize, crossStart, crossEnd, crossSign, crossBase

  if (style.flexDirection === 'row') {
    mainSize = 'width'
    mainStart = 'left'
    mainEnd = 'right'
    mainSign = +1
    mainBase = 0

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  } else if (style.flexDirection === 'row-reverse') {
    mainSize = 'width'
    mainStart = 'right'
    mainEnd = 'left'
    mainSign = -1
    mainBase = style.width

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  } else if (style.flexDirection === 'column') {
    mainSize = 'height'
    mainStart = 'top'
    mainEnd = 'bottom'
    mainSign = +1
    mainBase = 0

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  } else if (style.flexDirection === 'column-reverse') {
    mainSize = 'height'
    mainStart = 'bottom'
    mainEnd = 'top'
    mainSign = -1
    mainBase = style.height

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  } else {
    return
  }

  if (style.flexWrap === 'wrap-reverse') {
    const temp = crossStart
    crossStart = crossEnd
    crossEnd = temp
    crossSign = -1
  } else {
    crossBase = 0
    crossSign = 1
  }

  let isAutoMainSize = false
  if (!style[mainSize]) {
    style[mainSize] = children.reduce((prev, next) => {
      const size = next[mainSize] || 0
      return prev + size
    }, 0)
    isAutoMainSize = true
  }

  const flexLine = []
  const flexLines = [flexLine]

  let mainSpace = style[mainSize]
  let crossSpace = 0

  for (const child of children) {
    const childStyle = getStyle(child)
    if (childStyle[mainSize] == null) {
      childStyle[mainSize] = 0
    }

    if (childStyle.flex != null) {
      flexLine.push(child)
    } else if (child.flexWrap === 'nowrap' && isAutoMainSize) {
      mainSpace -= childStyle[mainSize]
      if (childStyle[crossSize] != null) {
        crossSpace = Math.max(crossSpace, childStyle[crossSize])
      }
      flexLine.push(child)
    } else {
      if (childStyle[mainSize] > style[mainSize]) {
        childStyle[mainSize] = style[mainSize]
      }

      if (mainSpace < childStyle[mainSize]) {
        flexLine.mainSpace = mainSpace
        flexLine.crossSpace = crossSpace
        flexLine = [child]
        flexLines.push(flexLine)
        mainSpace = style[mainSize]
        crossSpace = 0
      } else {
        flexLine.push(child)
      }

      if (childStyle[crossSize] != null) {
        crossSpace = Math.max(crossSpace, childStyle[crossSize])
      }
      mainSpace -= childStyle[mainSize]
    }
  }
  flexLine.mainSpace = mainSpace

  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = style[crossSize] == null ? crossSpace : style[crossSize]
  } else {
    flexLine.crossSpace = crossSpace
  }

  if (mainSpace < 0) {
    const scale = style[mainSize] / (style[mainSize] - mainSpace)
    const currentMain = mainBase
    for (const child of children) {
      const childStyle = getStyle(child)
      if (childStyle.flex) {
        childStyle[mainSize] = 0
      }

      childStyle[mainSize] = childStyle[mainSize] * scale
      childStyle[mainStart] = currentMain
      childStyle[mainEnd] = childStyle[mainStart] + mainSign * childStyle[mainSize]
      currentMain = childStyle[mainEnd]
    }
  } else {
    flexLines.forEach(flexLine => {
      const mainSpace = flexLine.mainSpace
      let flexTotal = 0
      for (const child of flexLine) {
        const childStyle = getStyle(child)
        if (childStyle.flex != null) {
          flexTotal += childStyle.flex
        }
      }

      if (flexTotal > 0) {
        const currentMain = mainBase
        for (const child of flexLine) {
          const childStyle = getStyle(child)
          if (childStyle.flex) {
            childStyle[mainSize] = mainSpace / flexTotal * childStyle.flex
          }

          childStyle[mainStart] = currentMain
          childStyle[mainEnd] = childStyle[mainStart] + mainSign * childStyle[mainSize]
          currentMain = childStyle[mainEnd]
        }
      } else {
        if (style.justifyContent === 'flex-start') {
          var currentMain = mainBase
          var step = 0
        } else if (style.justifyContent === 'flex-end') {
          var currentMain = mainSpace * mainSign + mainBase
          var step = 0
        } else if (style.justifyContent === 'center') {
          var currentMain = mainSpace / 2 * mainSign + mainBase
          var step = 0
        } else if (style.justifyContent === 'space-between') {
          var step = flexLine.length > 1 ? mainSpace / (flexLine.length - 1) : mainSpace
          var currentMain = mainBase
        }
      }
    })
  }
}
```

