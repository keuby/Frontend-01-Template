<template>
  <div id="app">
    <div class="chessboard">
      <div
        :key="`${item}`"
        v-for="(item, index) in pieces"
        @click="handleClick(index)"
      >{{piece[item.status] || ''}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    pieces: new Array(9).fill(-1).map((s, i) => new Piece(i, s)),
    piece: ['O', 'X'],
    who: 0
  }),
  methods: {
    handleClick (index) {
      if (this.pieces[index].status !== -1) return
      const person = this.who++ % 2
      this.pieces[index].status = person
      if (!this.isFinished(person)) {
        const opposite = (this.who++) % 2
        const bestChoice = this.computeBestChoice(opposite)
        this.pieces[bestChoice.index].status = opposite
        this.isFinished(opposite)
      }
    },
    check (who) {
      for (const winStatus of allWinStatus) {
        const isWin = winStatus.every(index => {
          return this.pieces[index].status === who
        })
        if (isWin) return true
      }
      return false
    },
    isFinished (who) {
      if (this.check(who)) {
        setTimeout(() => {
          alert(this.piece[who] + ' 赢了')
        }, 300)
        return true
      } else if (!this.pieces.some(p => p.status === -1)) {
        setTimeout(() => {
          alert('平手')
        }, 300)
        return true
      }
      return false
    },
    willWin (who) {
      const emptyPieces = this.pieces.filter(p => p.status === -1)
      for (const piece of emptyPieces) {
        piece.status = who
        const isWillWin = this.check(who)
        piece.status = -1

        if (isWillWin) return piece.index
      }
      return -1
    },
    computeBestChoice (who) {
      {
        const index = this.willWin(who)
        if (index >= 0) {
          return { index, result: 1 }
        }
      }

      const opposite = (who + 1) % 2
      const [index, result] = this.pieces.filter(p => {
        return p.status === -1
      }).reduce((result, piece) => {
        piece.status = who
        const { result: oppRes } = this.computeBestChoice(opposite)
        piece.status = -1
        if (-oppRes >= result[1]) {
          return [piece.index, -oppRes]
        }
        return result
      }, [-1, -1])

      return {
        index,
        result: index < 0 ? 0 : result
      }
    }
  }
}

class Piece {
  constructor (index, status) {
    this.index = index
    this.status = status
  }

  toString () {
    return `${this.index}:${this.status}`
  }
}

const allWinStatus = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
</script>

<style lang="less">
.chessboard {
  display: flex;
  width: 156px;
  flex-flow: row wrap;

  > div {
    text-align: center;
    line-height: 50px;
    font-size: 50px;
    width: 50px;
    height: 50px;
    margin: 1px;
    background-color: green;
  }
}
</style>
