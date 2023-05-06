import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-search-modal',
  templateUrl: './user-search-modal.component.html',
  styleUrls: ['./user-search-modal.component.css']
})
export class UserSearchModalComponent {

  constructor(private UserService: UserService) {

  };

  public searchFormGroup: FormGroup = new FormGroup({
    sexCheckMarkControlM: new FormControl(''),
    sexCheckMarkControlF: new FormControl(''),
    sexCheckMarkControlX: new FormControl(''),
    birthDateStartControl: new FormControl(''),
    birthDateEndControl: new FormControl(''),
    aliasControl: new FormControl(''),
  });

  search(): void {
    console.log(this.searchFormGroup.value)
  };
};
