import { Component, ViewChild, ElementRef, HostListener, Output, EventEmitter, OnInit } from '@angular/core';
import { BusService } from '../bus.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.less']
})
export class PanelComponent implements OnInit {
  @Output() change = new EventEmitter<string[]>()

  source: string[]
  current: string[]

  drawing = false
  cleaning = false

  @ViewChild('wrapper', {
    read: ElementRef,
    static: true,
  })
  public wrapper: ElementRef;

  @HostListener('window:mouseup')
  mouseup () {
    this.drawing = false
    this.cleaning = false
  }

  @HostListener('window:mousedown', ['$event'])
  mousedown (event: MouseEvent) {
    if (event.ctrlKey || event.metaKey) {
      this.drawing = false
      this.cleaning = true
    } else {
      this.drawing = true
      this.cleaning = false
    }
  }

  ngOnInit () {
    this.source = localRead()
    this.current = [...this.source]
    this.change.emit(this.current)
  }

  handle (event: MouseEvent, index: number) {
    const status = this.current[index]
    const target = event.target as HTMLDivElement
    if (this.drawing) {
      target.className = BoxStatus.Filled
      this.current[index] = BoxStatus.Filled
      localSave(this.current)
    } else if (this.cleaning) {
      target.className = BoxStatus.Empty
      this.current[index] = BoxStatus.Empty
      localSave(this.current)
    }
  }

  handleReset () {
    this.current = new Array(10000).fill(BoxStatus.Empty)
    localSave(this.current)
    const wrapper = this.wrapper.nativeElement as HTMLElement
    Array.from(wrapper.children, (child: HTMLElement) => {
      child.className = BoxStatus.Empty
    })
  }

  handlePrint(i: number) {
    const x = Math.floor(i / 100)
    const y = i % 100
    console.log(x, y)
  }

  handleInit () {
    const wrapper = this.wrapper.nativeElement as HTMLElement
    const children = wrapper.children
    for (let i = 0; i < children.length; i++) {
      children[i].className = this.current[i]
    }
  }
}

const StorageKey = 'panel-status'

export enum BoxStatus {
  Empty = 'none',
  Filled = 'filled',
  Access = 'accessed',
  Start = 'start',
  End = 'end',
  Found = 'found',
}

function localRead () {
  let data = localStorage.getItem(StorageKey)
  if (data == null) {
    const newData = new Array(10000).fill(BoxStatus.Empty)
    localSave(newData)
    return newData
  }
  return JSON.parse(data)
}

function localSave (panelStatus: string[]) {
  const data = JSON.stringify(panelStatus)
  localStorage.setItem(StorageKey, data)
}
