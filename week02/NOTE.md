# Week02 总结

## 本周作业

1. 写一个正则表达式 匹配所有 Number 直接量

    [check-js-number.js](./check-js-number.js)

1. 写一个 UTF-8 Encoding 的函数

    [utf8-encode.js](./utf8-encode.js)

1. 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

    [check-js-string.js](./check-js-string.js)

## BNF 产生式

    ```plain
    <Number> = "0" | "1" | "2" | ..... | "9"

    <DecimalNumber> = "0" | (("1" | "2" | ..... | "9") <Number>* )

    <PrimaryExpression> = <DecimalNumber> |
        "(" <LogicalExpression> ")"

    <MultiplicativeExpression> = <PrimaryExpression> | 
        <MultiplicativeExpression> "*" <PrimaryExpression>| 
        <MultiplicativeExpression> "/" <PrimaryExpression>

    <AdditiveExpression> = <MultiplicativeExpression> | 
        <AdditiveExpression> "+" <MultiplicativeExpression>| 
        <AdditiveExpression> "-" <MultiplicativeExpression>

    <LogicalExpression> = <AdditiveExpression> | 
        <LogicalExpression> "||" <AdditiveExpression> | 
        <LogicalExpression> "&&" <AdditiveExpression>
    ```

    > 小任务：使用正则表达式解析上述语法

    - 0型 无限制文法

        ? ::= ?

    - 1型 上下文无关文法

        ? <A> ? ::= ? <B> ?

        "a" <A> "b" = "a" (<B> "+" <C> ) "b"

        例如，下面的语法就是上下文相关文法：
        ```
        {
            get age () { return 18 }
            get: 18
        }
        ```

    - 2型 上下文无关文法

        只允许左递归

    - 3型 正则文法

        <A> ::= <A> ?
        <A> ::= ? <A> 错误，不允许右递归

## 图灵完备性

- 命令式 - 图灵机

    - goto

    - if、while

- 声明式 - lambda

    - 递归

## 类型系统

- 动态类型系统与静态类型系统

- 强类型与弱类型

    带有类型隐式转换

- 复合系统

    结构体、函数签名

- 子类型

    逆变、协变

## 一般命令式编程语言的组成

### Atom (原子)

> InputElement

#### WhiteSpace

#### LineTerminator

#### Comment

#### Token

- Punctuator

- IdentifierName

  - 变量名部分 （不能跟关键字重回）

  - 属性部分 （可以跟关键字重合）

  在程序开始扫描时，会把他们都识别成 `IdentifierName`，在语法解析的时候才会去尝试把他们解析成 `Identifier` 或者 `Keywords`

  - Keywords 关键字

  - Identifier 标识符

  - Future Reversed Keywords: eumn

  有一些不是关键字，却有关键字的作用，例如:

  ```js
  var get = 5;
  var obj = {
      get prop() {
          return 5
      }
  }
  // get 即是变量名，却又有关键字的作用
  ```

  IdentifierName 是必须是标记了 ID_START 的 Unicode 字符开头

- Literal

  - NumberLiteral

  - StringLiteral

  - RegularExpressionLiteral

  - BooleanLiteral

  - NullLiteral

### Expression (表达式)

- Atom

- Operator

- Punctuator

### Statement (语句)

- Expression

- Keyword

- Punctuator

### Structure (结构化)

- Function

- Class

- Process

- Namespace

- ...

### Program

- Program

- Module

- Package

- Libaray