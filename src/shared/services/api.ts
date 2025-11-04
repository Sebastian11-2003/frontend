import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Api {
  apiNode = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {}

  getTodo(vData: any) {
    return this.httpClient.post(this.apiNode + '/todo/get', vData, {
      responseType: 'json',
    });
  }

  addTodo(vData: any) {
    return this.httpClient.post(this.apiNode + '/todo/add', vData, {
      responseType: 'json',
    });
  }

  editTodo(vData: any) {
    return this.httpClient.post(this.apiNode + '/todo/edit', vData, {
      responseType: 'json',
    });
  }

  deleteTodo(vData: any) {
    return this.httpClient.post(this.apiNode + '/todo/delete', vData, {
      responseType: 'json',
    });
  }
}