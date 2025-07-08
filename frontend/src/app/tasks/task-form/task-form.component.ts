import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../tasks.service';
import { Task } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['pending', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.taskId = +params['id'];
        this.loadTask(this.taskId);
      }
    });
  }

  loadTask(id: number): void {
    this.tasksService.getById(id).subscribe({
      next: (task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          status: task.status
        });
      },
      error: (err) => {
        console.error('Error loading task', err);
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;

      if (this.isEditMode && this.taskId) {
        this.tasksService.update(this.taskId, taskData).subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: (err) => {
            console.error('Error updating task', err);
          }
        });
      } else {
        this.tasksService.create(taskData).subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: (err) => {
            console.error('Error creating task', err);
          }
        });
      }
    }
  }
}