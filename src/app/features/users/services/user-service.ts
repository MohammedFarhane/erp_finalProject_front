import { Service } from '@angular/core';
import { CrudService } from '../../../core/crud-service';
import { User, UserRequest } from '../models/user';

@Service()
export class UserService extends CrudService<User, UserRequest>{
  constructor() {
    super('user');
  }
}
