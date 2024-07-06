import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-inline-form',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './inline-form.component.html',
  styleUrl: './inline-form.component.scss',
})
export class InlineFormComponent {
  @Input() title: string = '';
  @Input() defaultText: string = 'Not defined';
  @Input() hasButton: boolean = false;
  @Input() buttonText: string = 'Submit';
  @Input() inputPlaceholder: string = '';
  @Input() inputType: string = 'input';

  @Output() handleSubmit = new EventEmitter<string>();

  isEditing: boolean = false;
  form = this.fb.group({
    title: [''],
  });

  constructor(private fb: FormBuilder) {}

  activeEditing(): void {
    if (this.title) {
      this.form.patchValue({ title: this.title });
    }
    this.isEditing = true;
  }

  onSubmit(): void {
    if (this.form.value.title) {
      this.handleSubmit.emit(this.form.value.title);
    }
    this.isEditing = false;
    this.form.reset();
  }
}
