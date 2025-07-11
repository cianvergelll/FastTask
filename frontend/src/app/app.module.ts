import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { AuthService } from './auth/auth.service';
import { TasksService } from './tasks/tasks.service';
import { AuthGuard } from './guards/auth.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { TimerComponent } from './timer/timer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    TaskListComponent,
    TaskFormComponent,
    TimerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
      { path: 'tasks/new', component: TaskFormComponent, canActivate: [AuthGuard] },
      { path: 'tasks/edit/:id', component: TaskFormComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: '/tasks', pathMatch: 'full' },
      { path: '**', redirectTo: '/tasks' }
    ])
  ],
  providers: [
    AuthService,
    TasksService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }