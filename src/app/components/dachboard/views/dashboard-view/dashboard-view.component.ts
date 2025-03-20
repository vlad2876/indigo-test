import { Component, inject, computed, ChangeDetectionStrategy, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DashboardViewService, IWidget, WidgetType } from './dashboard-view.service';
import { ProjectService } from '@common/project/project.service';
import { ProgressWidgetComponent } from '../../components/widgets/progress-widget/progress-widget.component';
import { ProjectFormComponent } from '../../components/project-form/project-form.component';
import { IProject } from '@common/project/project.interface';
import { TimelineWidgetComponent } from '@components/dachboard/components/widgets/timeline-widget/timeline-widget.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDialogModule,
    ProgressWidgetComponent,
    TimelineWidgetComponent,
    DragDropModule,
  ],
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardViewComponent implements OnInit {
  private readonly _projectService = inject(ProjectService);
  private readonly _dashboardViewService = inject(DashboardViewService);
  private readonly _dialog = inject(MatDialog);
  private readonly _destroyRef = inject(DestroyRef);

  readonly projectWidgets = this._dashboardViewService.projectWidgets;
  readonly hasProjects = computed(() => this.projectWidgets().length > 0);

  ngOnInit(): void {
    this._projectService.loadProjects();
    this._dashboardViewService.loadWidgets();
  }

  openProjectDialog(project?: IProject): void {
    const dialogRef = this._dialog.open(ProjectFormComponent, {
      width: '600px',
      data: project,
      disableClose: false
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((projectData: Omit<IProject, 'id'> | undefined) => {
          if (!projectData) return;

          if (project) {
            this._projectService.updateProject({
              ...projectData,
              id: project.id,
            } as IProject);
          } else {
            this._projectService.createProject(projectData);
          }
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();
  }

  editProject(projectId: string): void {
    const project = this._projectService.projects().find(p => p.id === projectId);
    if (project) this.openProjectDialog(project);
  }

  deleteProject(projectId: string): void {
    this._projectService.deleteProject(projectId);
    this._dashboardViewService.removeWidgetsByProjectId(projectId);
  }

  addWidgetToProject(projectId: string, type: WidgetType): void {
    this._dashboardViewService.addWidgetToProject(projectId, type);
  }

  removeWidget(widgetId: string): void {
    this._dashboardViewService.removeWidget(widgetId);
  }

  hasWidgetOfType(widgets: IWidget[], type: WidgetType): boolean {
    return widgets.some(widget => widget.type === type);
  }

  onWidgetDrop(projectId: string, event: CdkDragDrop<IWidget[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    const projectGroup = this.projectWidgets().find(p => p.projectId === projectId);
    if (!projectGroup) return;

    const updatedWidgets = [...projectGroup.widgets];
    moveItemInArray(updatedWidgets, event.previousIndex, event.currentIndex);

    const updatedProjectWidgets = this.projectWidgets().map(group =>
      group.projectId === projectId
        ? { ...group, widgets: updatedWidgets }
        : group
    );

    const allWidgets = updatedProjectWidgets.flatMap(group => group.widgets);
    this._dashboardViewService.saveWidgets(allWidgets);
  }
}
