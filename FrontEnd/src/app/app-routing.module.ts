import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientParentComponent } from 'src/app/Client/client-parent/client-parent.component';
import { StudiesComponent } from './Admin/studies/studies.component';
import {HomeComponet  } from './Admin/home/home.component';
import { ManagementComponent } from './Admin/management/management.component';
import { ModulesSectionComponent } from './Admin/modules-section/modules-section.component';
import { AssignmentComponent } from './Admin/assignment/assignment.component';
 
import { AuthGuard } from 'src/app/Classes/auth_guard';
import { AuthGuardAdmin } from 'src/app/Classes/auth_guardAdmin';
import { LoginComponent } from './Admin/login/login.component';
import { AdminComponent } from './Admin/admin/admin.component';
import { ErrorComponent } from "./error/error.component";
import { FeedbackComponent } from './Admin/feedback/feedback.component';


import { UserComponent } from './User/user/user.component';
import { UserDashboardComponent } from './User/user-dashboard/user-dashboard.component';
import { AssignmentSubmissionComponent } from './User/assignment-submission/assignment-submission.component';
import { RelaxationComponent } from './User/relaxation/relaxation.component';
import { PersonalFilesComponent } from './User/personal-files/personal-files.component';
import { ModulesComponent } from './User/modules/modules.component';

const routes: Routes = [
  //Client View
  { path: 'User', canActivate: [AuthGuard],component: UserComponent,
  children: [
    { path: 'dashboard', component: UserDashboardComponent, outlet: 'user_dashboard_menu' },
    { path: 'assignment_submission', component: AssignmentSubmissionComponent, outlet: 'user_dashboard_menu' },
    { path: 'relaxation', component: RelaxationComponent, outlet: 'user_dashboard_menu' },
    { path: 'personal_files', component: PersonalFilesComponent, outlet: 'user_dashboard_menu' },
    { path: 'modules', component: ModulesComponent, outlet: 'user_dashboard_menu' },
    { path: '', component: UserDashboardComponent, outlet: 'user_dashboard_menu' }
  ]}, 

  //Admin View  
  {
    path: 'dashboard', canActivate: [AuthGuardAdmin],component: AdminComponent,
    children: [
      { path: 'module', component: ModulesSectionComponent,  outlet: 'dashboard_menu' },
      { path: 'studies', component: StudiesComponent, outlet: 'dashboard_menu' },
      { path: 'Feedback', component: FeedbackComponent, outlet: 'dashboard_menu' },
      { path: 'Home-section', component: HomeComponet, outlet: 'dashboard_menu' },
      { path: 'management', component: ManagementComponent,  outlet: 'dashboard_menu' },
      { path: 'assignment', component: AssignmentComponent,  outlet: 'dashboard_menu' },
      { path: '', component: ModulesSectionComponent, outlet: 'dashboard_menu' }
    ]
  },
  { path: '', component: ClientParentComponent },
  { path: 'dashboard/login', component: LoginComponent },
  { path: 'error', component: ErrorComponent },


  { path: '**', redirectTo: '/error' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  //Call the Component Name
  ClientParentComponent,
  ModulesSectionComponent,
  StudiesComponent,
  HomeComponet,
  UserDashboardComponent,
  ManagementComponent,
  LoginComponent,
  ErrorComponent
]
