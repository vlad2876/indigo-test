import { Injectable, inject, signal, computed } from '@angular/core';
import { IProject } from './project.interface';
import { StorageService } from '../storage/storage.service';

const PROJECT_STORAGE_KEY = 'dashboard_projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly _storageService = inject(StorageService);
  private readonly _state = signal<IProject[]>([]);

  readonly projects = computed(() => this._state());

  loadProjects(): void {
    this._state.set(this._storageService.getItem<IProject[]>(PROJECT_STORAGE_KEY) || []);
  }

  createProject(projectData: Omit<IProject, 'id'>): IProject {
    const newProject: IProject = {
      ...projectData,
      id: crypto.randomUUID()
    };

    this._saveProjects([...this.projects(), newProject]);
    return newProject;
  }

  updateProject(updatedProject: IProject): IProject {
    const updatedProjects = this.projects().map(project =>
      project.id === updatedProject.id ? updatedProject : project
    );

    this._saveProjects(updatedProjects);
    return updatedProject;
  }

  deleteProject(id: string): void {
    this._saveProjects(this.projects().filter(project => project.id !== id));
  }

  private _saveProjects(projects: IProject[]): void {
    this._state.set(projects);
    this._storageService.setItem(PROJECT_STORAGE_KEY, projects);
  }
}
