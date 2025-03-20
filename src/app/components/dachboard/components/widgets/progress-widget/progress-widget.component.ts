import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { BaseWidgetComponent } from '../base-widget.component';

@Component({
  selector: 'app-progress-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatCardModule
  ],
  templateUrl: './progress-widget.component.html',
  styleUrls: ['./progress-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressWidgetComponent extends BaseWidgetComponent {
  readonly progressPercent = computed(() => {
    const project = this._project();
    if (!project || !project.tasksTotal) return 0;

    return Math.round((project.tasksCompleted / project.tasksTotal) * 100);
  });
}
