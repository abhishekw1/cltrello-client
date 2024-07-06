import { NgStyle } from '@angular/common';
import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `<h1
    class="d-flex justify-content-center cl-icon caveat-font"
    [style.color]="colorInput()"
  >
    Cltrello
  </h1>`,
  imports: [NgStyle],
})
export class LogoComponent {
  colorInput = input('#0d6efd');
}
