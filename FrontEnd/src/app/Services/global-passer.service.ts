import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalPasserService {

  constructor() { }

  //Navigation============
  private navigationID = new BehaviorSubject(0);
  currentnavigationID = this.navigationID.asObservable();

  ChangeNavigationID(newID: number) {
    this.navigationID.next(newID);
  }
  //=======================
}
