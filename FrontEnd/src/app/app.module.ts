import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import{MatSidenavModule} from '@angular/material/sidenav';
import{MatListModule} from '@angular/material/list';
import{MatIconModule} from '@angular/material/icon';
import{MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';




import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
 
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';

//Custom Components
import { ClientParentComponent } from './Client/client-parent/client-parent.component';

import { StudiesComponent } from './Admin/studies/studies.component';
import {HomeComponet  } from './Admin/home/home.component';
import { AdminComponent } from './Admin/admin/admin.component';
import { LoginComponent } from './Admin/login/login.component';
import { FooterComponent } from './Admin/footer/footer.component';
import { NavigationComponent } from './Client/navigation/navigation.component';
import { HeaderComponent } from './Client/header/header.component';
import { ClientFooterComponent } from './Client/client-footer/client-footer.component';
import { ErrorComponent } from './error/error.component';
import { ManagementComponent } from './Admin/management/management.component';
import { HostDirective} from './Directives/host.directive';
import {HighlightDirective} from "./Directives/highlight.directive";
import {ShowDirective} from "./Directives/show.directive";
import {AppendPipe, FilterPipe} from "./Pipes/custom.pipe";
import {SubjectService} from "./Services/subject.service";
import { FeedbackComponent } from './Admin/feedback/feedback.component';
import { ModulesSectionComponent } from './Admin/modules-section/modules-section.component';
import { SectionOneComponent } from './Client/client-parent/section-one/section-one.component';
import { SectionTwoComponent } from './Client/client-parent/section-two/section-two.component';
import { SectionThreeComponent } from './Client/client-parent/section-three/section-three.component';
import { SectionFourComponent } from './Client/client-parent/section-four/section-four.component';
import { AssignmentComponent } from './Admin/assignment/assignment.component';
import { ModuleResourcesComponent } from './Admin/studies/module-resources/module-resources.component';
import { AddAssignmentComponent } from './Admin/studies/add-assignment/add-assignment.component';
import { UserComponent } from './User/user/user.component';
import { UserDashboardComponent } from './User/user-dashboard/user-dashboard.component';
import { AssignmentSubmissionComponent } from './User/assignment-submission/assignment-submission.component';
import { RelaxationComponent } from './User/relaxation/relaxation.component';
import { PersonalFilesComponent } from './User/personal-files/personal-files.component';
import { ModulesComponent } from './User/modules/modules.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientParentComponent,
    AdminComponent,
    LoginComponent,
    FooterComponent,
    NavigationComponent,
    HeaderComponent,
    ClientFooterComponent,
    ErrorComponent,
    ManagementComponent,
    //TODO: Remove Following Test Components if not used
    StudiesComponent,
    HomeComponet,
    HostDirective,
    HighlightDirective,
    ShowDirective,
    AppendPipe,
    FilterPipe,
    FeedbackComponent,
    ModulesSectionComponent,
    SectionOneComponent,
    SectionTwoComponent,
    SectionThreeComponent,
    SectionFourComponent,
    AssignmentComponent,
    ModuleResourcesComponent,
    AddAssignmentComponent,
    UserComponent,
    UserDashboardComponent,
    AssignmentSubmissionComponent,
    RelaxationComponent,
    PersonalFilesComponent,
    ModulesComponent,
  ],
  imports: [
    BrowserModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    NgbModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    ToastrModule.forRoot({
      timeOut: 1000,
      progressBar: false,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-center'
    }),
  ],
    providers: [
    {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,

          provider: new GoogleLoginProvider(
           //todo:Add Google client id
           '680161083037-letvdsrrsefb5v7ltngpm2ttub1e7f5a.apps.googleusercontent.com'
          )
        },
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          //todo:Add Facebook client id
          provider: new FacebookLoginProvider('752653155349676')
        }
      ]
    } as SocialAuthServiceConfig,
  },
    //Todo: remove if no needed
    SubjectService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
