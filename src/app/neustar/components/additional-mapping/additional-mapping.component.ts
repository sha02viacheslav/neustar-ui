import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelect, MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-additional-mapping',
  templateUrl: './additional-mapping.component.html',
  styleUrls: ['./additional-mapping.component.scss'],
})
export class AdditionalMappingComponent {
  fields: { label: string; key: string }[] = [
    { label: 'Primary', key: 'primary' },
    { label: 'Secondary', key: 'secondary' },
  ];
  infoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdditionalMappingComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { headers: { label: string; value: string }[]; value: string; fieldLabel: string },
  ) {
    this.infoForm = this.fb.group({ primary: [''] }, { secondary: [''] });
    this.buildForm();
  }

  buildForm() {
    this.infoForm = new FormGroup({});
    const values = (this.data.value || '').split('+');
    this.fields.forEach((field, index) => {
      this.infoForm.addControl(field.key, this.fb.control(values[index] || null));
    });
  }

  submitForm() {
    const result = this.fields
      .map((field) => this.infoForm.value[field.key])
      .filter((item) => !!item)
      .join('+');
    this.dialogRef.close(result);
  }

  onEditableSelectChange(event: MatSelectChange, key: string) {
    const value = event.value;
    this.infoForm.get(key).setValue(value);
  }

  onFocusEditableSelect(selectElement: MatSelect, inputElement: HTMLInputElement) {
    selectElement.open();
    inputElement.selectionStart = inputElement.selectionEnd = inputElement.value.length;
  }
}
