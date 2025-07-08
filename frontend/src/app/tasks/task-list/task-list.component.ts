import { Component, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';
import { Task } from '../../interfaces/task.interface';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  statusFilter: string = 'all';
  searchTerm: string = '';

  constructor(
    private tasksService: TasksService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasksService.getAll().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filterTasks();
      },
      error: (err) => {
        console.error('Error loading tasks', err);
      }
    });
  }

  filterTasks(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesStatus = this.statusFilter === 'all' || task.status === this.statusFilter;
      const matchesSearch = task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }

  onStatusChange(): void {
    this.filterTasks();
  }

  onSearch(): void {
    this.filterTasks();
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasksService.delete(id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(task => task.id !== id);
          this.filterTasks();
        },
        error: (err) => {
          console.error('Error deleting task', err);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}