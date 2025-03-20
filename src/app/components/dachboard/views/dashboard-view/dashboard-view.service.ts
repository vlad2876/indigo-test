import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from '@common/storage/storage.service';
import { ProjectService } from '@common/project/project.service';

const WIDGETS_STORAGE_KEY = 'dashboard_widgets';

export type WidgetType = 'progress' | 'dates';

export interface IWidget {
  id: string;
  type: WidgetType;
  projectId: string;
}

export interface ProjectWidgets {
  projectId: string;
  projectName: string;
  widgets: IWidget[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardViewService {
  private readonly _storageService = inject(StorageService);
  private readonly _projectService = inject(ProjectService);

  private readonly _state = signal<IWidget[]>([]);

  readonly widgets = computed(() => this._state());

  readonly projectWidgets = computed(() => {
    const widgets = this.widgets();
    const projects = this._projectService.projects();

    const groupedWidgets = new Map<string, IWidget[]>();

    widgets.forEach(widget => {
      const projectWidgets = groupedWidgets.get(widget.projectId) || [];
      projectWidgets.push(widget);
      groupedWidgets.set(widget.projectId, projectWidgets);
    });

    return projects.map(project => ({
      projectId: project.id,
      projectName: project.name,
      widgets: groupedWidgets.get(project.id) || []
    }));
  });

  loadWidgets(): void {
    this._state.set(this._storageService.getItem<IWidget[]>(WIDGETS_STORAGE_KEY) || []);
  }

  addWidgetToProject(projectId: string, type: WidgetType): void {
    this.saveWidgets([...this.widgets(), {
      id: crypto.randomUUID(),
      type,
      projectId
    }]);
  }

  removeWidget(widgetId: string): void {
    this.saveWidgets(this.widgets().filter(w => w.id !== widgetId));
  }

  removeWidgetsByProjectId(projectId: string): void {
    this.saveWidgets(this.widgets().filter(w => w.projectId !== projectId));
  }

  saveWidgets(widgets: IWidget[]): void {
    this._state.set(widgets);
    this._storageService.setItem(WIDGETS_STORAGE_KEY, widgets);
  }
}
