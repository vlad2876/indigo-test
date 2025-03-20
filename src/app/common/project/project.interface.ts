export interface IProject {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  tasksCompleted: number;
  tasksTotal: number;
}