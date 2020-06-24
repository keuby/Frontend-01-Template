import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { BoxStatus, PanelComponent } from './panel/panel.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {
  map: string[]
  boxes: HTMLCollection

  next: () => Promise<void> | Promise<void> | void
  resolve: () => void

  storageTypes = [BFS, DFS, HeuristicallySearch]
  storageType: number = 2
  message: string

  @ViewChild(PanelComponent) panel: PanelComponent

  ngAfterViewInit () {
    window['app'] = this
    const wrapper = this.panel.wrapper.nativeElement as HTMLElement
    this.boxes = wrapper.children

    this.resume()
  }

  async findPath (start: Point, end: Point) {
    this.panel.handleInit()
    this.message = ''
    const startTime = new Date()

    const getIndex = ([x, y]: Point) => x * 100 + y

    const mark = (p: Point, status: BoxStatus) => {
      const i = getIndex(p)
      this.boxes[i].className = status
    }

    const insert = (p: Point, pre: Point) => {
      if (!canAccess(p)) return
      storage.insert(p)
      map[p[0] * 100 + p[1]] = pre
    }

    const canAccess = ([x, y]: Point) => {
      const index = getIndex([x, y])
      return x >= 0 &&
        y >= 0 &&
        x < 100 &&
        y < 100 &&
        map[index] == BoxStatus.Empty
    }

    const distance = ([x, y]: Point, p2 = end) => {
      return (x - p2[0]) ** 2 + (y - p2[1]) ** 2
    }

    const storage = new this.storageTypes[this.storageType]([start])
    const map: Array<Point | string> = this.map.slice()

    mark(start, BoxStatus.Start)
    mark(end, BoxStatus.End)

    while (storage.length > 0) {
      let current = storage.take()
      if (equal(current, end)) {
        const path = []
        const endTime = new Date()

        let pre = map[getIndex(current)] as Point
        let length = 0
        while (!equal(pre, start)) {
          mark(pre, BoxStatus.Found)

          path.push(pre)
          current = pre
          pre = map[getIndex(current)] as Point
          length += Math.sqrt(distance(pre, current))

          await this.next()
        }

        this.message = `路径长度: ${length.toFixed(2)}, 耗时: ${(endTime.getTime() - startTime.getTime()) / 1000}s`
        return path
      }

      mark(current, BoxStatus.Access)

      const [x, y] = current
      insert([x, y + 1, distance([x, y + 1])], current)
      insert([x + 1, y + 1, distance([x + 1, y + 1])], current)
      insert([x + 1, y, distance([x + 1, y])], current)
      insert([x + 1, y - 1, distance([x + 1, y - 1])], current)
      insert([x, y - 1, distance([x, y - 1])], current)
      insert([x - 1, y - 1, distance([x - 1, y - 1])], current)
      insert([x - 1, y, distance([x - 1, y])], current)
      insert([x - 1, y + 1, distance([x - 1, y + 1])], current)

      await this.next()
    }

    return null
  }

  stop () {
    const stopIns = new Promise<void>(resolve => {
      this.resolve = resolve
    })
    this.next = () => stopIns
  }

  close () {
    this.next = () => {}
  }

  resume () {
    if (this.resolve != null) {
      this.resolve && this.resolve()
      this.resolve = null
    }

    this.next = () => {
      return new Promise(resolve => {
        setTimeout(resolve, 10)
      })
    }
  }
}

type Point = [number, number] | [number, number, number]

function equal (p1: Point, p2: Point) {
  return p1[0] === p2[0] && p1[1] === p2[1]
}

abstract class SearchStorage<T> {
  constructor (protected data: T[]) {}

  abstract insert (data: T): void;
  abstract take (): T;

  get length () {
    return this.data.length
  }
}

class BFS<T> extends SearchStorage<T> {

  insert(data: T): void {
    this.data.push(data)
  }

  take(): T {
    return this.data.shift()
  }
}

class DFS<T> extends SearchStorage<T> {
  insert(data: T): void {
    this.data.push(data)
  }

  take(): T {
    return this.data.pop()
  }
}

class HeuristicallySearch<T> extends SearchStorage<T> {

  insert (p: T) {
    this.data.push(p)
  }

  take (): T {
    if (this.data.length <= 1) return this.data.pop()

    let minIndex = 0
    for (let i = 1; i< this.data.length; i++) {
      if (this.data[i][2] < this.data[minIndex][2]) {
        minIndex = i
      }
    }
    const maxValue = this.data[minIndex]
    this.data[minIndex] = this.data[this.data.length - 1]
    this.data.pop()
    return maxValue
  }
}
