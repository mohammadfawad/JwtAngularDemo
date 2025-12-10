import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { JsonPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [JsonPipe, CommonModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class Users implements OnInit, OnDestroy {
  userId!: string;
  userName!: string;
  userEmail!: string;

  noUsers: boolean = false;
  users: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.userService.getAll().subscribe({
      next: (res: any) => {
        this.users = res || [];
        console.log('Users loaded', this.users);
      },
      error: (err: any) => {
        console.error('Error loading users', err);
        this.users = [];
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
