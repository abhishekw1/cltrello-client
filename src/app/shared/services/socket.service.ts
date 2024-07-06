import { Injectable } from '@angular/core';
import { CurrentUserInterface } from '../../auth/types/currentUser.interface';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  socket: Socket | undefined;

  setupSocketConnection(currentUser: CurrentUserInterface): void {
    this.socket = io(environment.socketUrl, {
      auth: {
        token: currentUser.token,
      },
    });
  }

  disconnect(): void {
    if (!this.socket) {
      throw new Error('Socket connection is not established');
    }
    this.socket?.disconnect();
  }

  emit(eventName: string, message: any) {
    if (!this.socket) {
      throw new Error('Socket connection is not established');
    }
    this.socket.emit(eventName, message);
  }

  listen<T>(eventName: string): Observable<T> {
    if (!this.socket) {
      throw new Error('Socket connection is not established');
    }
    return new Observable((subscriber) => {
      this.socket?.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }
}
