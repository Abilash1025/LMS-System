import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-footer',
  templateUrl: './client-footer.component.html',
  styleUrls: ['./client-footer.component.css']
})
export class ClientFooterComponent implements OnInit {


  public copyRights: string = "All copyrights reserved by Abilash Software Solutions";

  constructor() { }

  ngOnInit(): void {
  }

  GetCurrentYear(){
    var dateObj = new Date();
    return dateObj.getFullYear();
  }
}
