import { Service } from '@angular/core';
import { CrudService } from '../../../core/crud-service';
import { ChangePasswordRequest, User, UserRequest, UserUpdateRequest } from '../models/user';
import { Observable } from 'rxjs';

@Service()
export class UserService extends CrudService<User, UserRequest, UserUpdateRequest> {
  constructor() {
    super('user');
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.url()}/change-password`, request);
  }
}
