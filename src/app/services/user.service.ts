import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = 'http://localhost:8081/home/users';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any>(this.api).pipe(
      map((response: any) => {
        console.log('Raw backend response:', response, 'Type:', typeof response);

        // Handle array directly
        if (Array.isArray(response)) {
          return response;
        }
        // Handle wrapped in object
        if (response?.data && Array.isArray(response.data)) {
          return response.data;
        }
        if (response?.users && Array.isArray(response.users)) {
          return response.users;
        }

        console.warn('Response is not an array:', response);
        return [];
      })
    );
  }
}
