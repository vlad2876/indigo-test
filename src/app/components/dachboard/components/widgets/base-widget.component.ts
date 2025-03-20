import { input, inject, computed, Directive } from '@angular/core';
import { ProjectService } from '@common/project/project.service';

@Directive()
export abstract class BaseWidgetComponent {
  projectId = input.required<string>();

  private readonly _projectService = inject(ProjectService);

  protected readonly _project = computed(() => {
    return this._projectService.projects().find(p => p.id === this.projectId());
  });
}
