# 本周总结

## 选择器语法

### 简单选择器

- 通配符选择器 universal (*)

- 标签选择器 type (div svg|a)

- 类选择器 class (.cls)

- id选择器 hash (#id)

- 属性选择器 attrib ([attr=val])

    - [attr] 存在 attr 属性

    - [attr=val] attr属性的值为val

    - [attr^=val] attr属性的值以val开头

    - [attr$=val] attr属性的值以val结尾

    - [attr*=val] attr属性的值包含val

    - [attr|=val] attr属性的值以 - 分隔，其中包含 val

    - [attr~=val] attr属性的值以空格分隔，其中包含 val

- 伪类选择器 pseudo (:hover)

- 伪元素选择器 pseudo-element (::before)

### 复合选择器

- <[简单选择器](#简单选择器)><[简单选择器](#简单选择器)><[简单选择器](#简单选择器)>
- `*`或者`div`必须写在最前面

### 复杂选择器

- <[复合选择器](#复合选择器)><空格><[复合选择器](#复合选择器)> 后代选择器
- <[复合选择器](#复合选择器)>">"<[复合选择器](#复合选择器)> 子选择器
- <[复合选择器](#复合选择器)>"~"<[复合选择器](#复合选择器)> 通用兄弟选择器
- <[复合选择器](#复合选择器)>"+"<[复合选择器](#复合选择器)> 相邻兄弟选择器
- <[复合选择器](#复合选择器)>"||"<[复合选择器](#复合选择器)> x

## 简单选择器计数

选择器的`specificity`被描述为一个计量选择器个数四元组[0, 0, 0, 0]，分别为

1. `id选择器`的数量
1. `类选择器`的数量
1. `属性选择器`的数量
1. `标签选择器`的数量

比较优先级的时候，从高位往低位依次比较，高位大则优先级高，否则优先级根据低位的大小决定

> 1. 通配符选择器不影响优先级
> 1. 伪类伪元素不影响优先级
> 1. :not 不影响优先级
> 1. 简单选择器顺序不影响优先级

## 伪类

### 链接、行为

- :any-link
- :link :visited
- :hover
- :active
- :focus
- :target

### 树结构

- :empty
- :nth-child
- :nth-last-child
- :first-child :last-child :only-child

### 逻辑

- :where :has
- :not

## 伪元素

- ::after
- ::before
- ::first-line
- ::first-letter

### 示意代码

```html
<!-- ::after ::before 示意代码 -->
<div>
    <::beofre />
    content
    <::after />
</div>
```

```html
<!-- ::first-letter 示意代码 -->
<div>
    <::first-letter>c</::first-letter>ontent content content
    content content content
    content content content
</div>
```

```html
<!-- ::first-line 示意代码 -->
<div>
    <::first-line>content content content</::first-line>
    content content content
    content content content
</div>
```

### 可用属性

- ::after 支持所有属性

- ::before 支持所有属性

- ::first-line

    - font 系列
    - color 系列
    - background 系列
    - word-spacing
    - letter-spacing
    - text-decoration
    - text-transform
    - line-height


- ::first-letter

    - font 系列
    - color 系列
    - background 系列
    - word-spacing
    - letter-spacing
    - text-decoration
    - text-transform
    - line-height
    - float
    - vertical-align
    - margin、padding、border、box-sizing

> 思考：为什么 `::firts-letter` 可以设置 `float` 之类的属性，而 `::first-line` 不行？   
`::first-line` 设置 `float` 之后脱离文档流，就会产生新的 first-line，这个和 first-line 矛盾

> 思考：为什么 `::firts-letter` 可以加字体，`word-spacing` 等影响行宽的属性？   
字的属性不是作用在盒上的，而是作用在文字上的，在排版的时候，会一个一个的文字往第一行放，并把文字的样式设置到文字上，当第一行排不下之后，再排下一行，之后的文字就不设置 `::firts-letter` 的文字样式了

## 排版

> IFC：inline formatting context  
> BFC：block formatting context  

- 大家请记住下面这个表现原则：如果一个元素具有 BFC，内部子元素再怎么翻江倒海、翻云覆雨，都不会影响外部的元素。所以，BFC 元素是不可能发生 margin 重叠的，因为 margin 重叠是会影响外部的元素的；BFC 元素也可以用来清除浮动的影响，因为如果不清除，子元素浮动则父元素高度塌陷，必然会影响后面元素布局和定位，这显然有违 BFC 元素的子元素不会影响外部元素的设定。

- block-level 表示可以被放入 bfc

- block-container 表示可以容纳 bfc

- block-box = block-level + block-container

- block-box 如果 overflow 是 visible， 那么就跟父 bfc 合并
