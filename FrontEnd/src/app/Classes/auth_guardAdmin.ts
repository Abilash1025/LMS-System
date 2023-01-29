import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Storage } from 'src/app/Enums/Storage';

@Injectable({ providedIn: 'root' })
export class AuthGuardAdmin implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        if (localStorage.getItem(Storage.ROLE) == "ADMIN" ) return true;
        this.router.navigate(['/dashboard/login']);
        return false;
    }
}
