import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnInit,
  DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IProject } from '@common/project/project.interface';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule
  ],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFormComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _dialogRef = inject(MatDialogRef);
  private readonly _destroyRef = inject(DestroyRef);

  readonly project = inject<IProject | undefined>(MAT_DIALOG_DATA);

  readonly isEdit = !!this.project;
  readonly form = this._fb.group({
    name: [
      this.project?.name ?? '',
      [Validators.required, Validators.minLength(3)],
    ],
    startDate: [this.project?.startDate ?? new Date(), Validators.required],
    endDate: [
      this.project?.endDate ??
        new Date(new Date().setMonth(new Date().getMonth() + 1)),
        Validators.required
    ],
    tasksCompleted: [
      this.project?.tasksCompleted ?? 0,
      [Validators.required, Validators.min(0)],
    ],
    tasksTotal: [
      this.project?.tasksTotal ?? 0,
      [Validators.required, Validators.min(0)],
    ],
  });

  readonly nameControl = this.form.get('name')!;
  readonly startDateControl = this.form.get('startDate')!;
  readonly endDateControl = this.form.get('endDate')!;
  readonly tasksCompletedControl = this.form.get('tasksCompleted')!;
  readonly tasksTotalControl = this.form.get('tasksTotal')!;

  ngOnInit() {
    this.endDateControl.valueChanges
      .pipe(
        tap(() => {
          this.endDateControl.setValidators([
            Validators.required,
            this.minDateValidator(this.startDateControl.value!),
          ]);
          this.endDateControl.updateValueAndValidity();
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();
  }

  minDateValidator(minDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (new Date(control.value) < new Date(minDate)) {
        return { minDate: true };
      }
      return null;
    };
  }

  onSubmit(): void {
    this._dialogRef.close(this.form.value);
  }

  onCancel(): void {
    this._dialogRef.close();
  }
}
