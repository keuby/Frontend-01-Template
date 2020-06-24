import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusService {
  public next = new EventEmitter<void>()
}
