import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InputService {
  private inputState: WritableSignal<[boolean, string]> = signal([false, '']);

  setInputState(value: [boolean, string]) {
    this.inputState.set(value);
  }

  getInputState(): WritableSignal<[boolean, string]> {
    return this.inputState;
  }
}
