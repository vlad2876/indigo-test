export default [
  {
    path: '',
    loadComponent: () => import('./components/dachboard/views/dashboard-view/dashboard-view.component')
      .then(c => c.DashboardViewComponent),
    title: 'Панель управления проектами'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
