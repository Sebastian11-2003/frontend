import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../shared/services/api'; // pastikan path sesuai

interface Todo {
  id: number;
  task: string;
  status: number; // backend pakai angka (0 / 1)
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  todos: Todo[] = [];
  newTask = '';
  currentFilter: 'all' | 'completed' | 'pending' = 'all';

  constructor(private api: Api) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  // 🔹 Ambil semua todo
  loadTodos(): void {
    this.api.getTodo({}).subscribe({
      next: (res: any) => {
        if (res.message === 'Success') {
          this.todos = res.val;
        } else {
          this.todos = [];
        }
      },
      error: (err) => {
        console.error('Error loading todos:', err);
      },
    });
  }

  // 🔹 Tambahkan todo baru
  addTodo(): void {
    const task = this.newTask.trim();
    if (!task) return alert('Please enter a task!');

    this.api.addTodo({ task }).subscribe({
      next: (res: any) => {
        if (res.message === 'Success') {
          this.newTask = '';
          this.loadTodos();
        }
      },
      error: (err) => {
        console.error('Error adding task:', err);
        alert('Error adding task');
      },
    });
  }

  // 🔹 Ubah status (toggle completed/pending)
  toggleStatus(todo: Todo): void {
    const newStatus = todo.status === 1 ? 0 : 1;
    this.api.editTodo({ id: todo.id, status: newStatus }).subscribe({
      next: (res: any) => {
        if (res.message === 'Status updated') {
          this.loadTodos();
        }
      },
      error: (err) => {
        console.error('Error updating status:', err);
        alert('Error updating status');
      },
    });
  }

  // 🔹 Edit teks todo
  editTodo(todo: Todo): void {
    const newText = prompt('Edit task:', todo.task);
    if (!newText || newText.trim() === todo.task) return;

    this.api.editTodo({ id: todo.id, task: newText.trim() }).subscribe({
      next: (res: any) => {
        if (res.message === 'Status updated' || res.message === 'Success') {
          this.loadTodos();
        }
      },
      error: (err) => {
        console.error('Error updating task:', err);
        alert('Error updating task');
      },
    });
  }

  // 🔹 Hapus todo
  deleteTodo(todo: Todo): void {
    if (!confirm('Delete this task?')) return;

    this.api.deleteTodo({ id: todo.id }).subscribe({
      next: (res: any) => {
        if (res.message === 'Todo deleted' || res.message === 'Success') {
          this.loadTodos();
        }
      },
      error: (err) => {
        console.error('Error deleting task:', err);
        alert('Error deleting task');
      },
    });
  }

  // 🔹 Filter tampilan todo
  get filteredTodos(): Todo[] {
    switch (this.currentFilter) {
      case 'completed':
        return this.todos.filter((todo) => todo.status === 1);
      case 'pending':
        return this.todos.filter((todo) => todo.status === 0);
      default:
        return this.todos;
    }
  }

  setFilter(filter: 'all' | 'completed' | 'pending') {
    this.currentFilter = filter;
  }
}
