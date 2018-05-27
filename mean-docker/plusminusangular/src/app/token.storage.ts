import { Injectable } from '@angular/core';

@Injectable()
export class TokenStorage {

  public getToken(): string {
    return this.token;
  }

  public setToken(token: string) {
    return localStorage.setItem('token', token);
  }
}
