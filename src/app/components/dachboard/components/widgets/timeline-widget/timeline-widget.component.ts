import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BaseWidgetComponent } from '../base-widget.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-timeline-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressBarModule],
  templateUrl: './timeline-widget.component.html',
  styleUrls: ['./timeline-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineWidgetComponent extends BaseWidgetComponent {
  protected formatDate(date?: string | Date): string {
    if (!date) return '—';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(dateObj);
  }

  readonly remainingDays = computed(() => {
    const project = this._project();
    if (!project?.startDate || !project?.endDate) return 0;

    const endDate = new Date(project.endDate).getTime();
    const currentDate = new Date().getTime();

    if (currentDate >= endDate) return 0;

    const diffTime = Math.abs(endDate - currentDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  });

  readonly progressPercent = computed(() => {
    const project = this._project();
    if (!project || !project?.startDate || !project?.endDate) return 0;

    const startDate = new Date(project.startDate).getTime();
    const endDate = new Date(project.endDate).getTime();
    const currentDate = new Date().getTime();

    if (currentDate <= startDate) return 0;
    if (currentDate >= endDate) return 100;

    const totalTime = endDate - startDate;
    const elapsedTime = currentDate - startDate;

    return Math.round((elapsedTime / totalTime) * 100);
  });
}
