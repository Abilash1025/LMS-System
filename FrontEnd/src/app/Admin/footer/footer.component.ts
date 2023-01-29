import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {


  public copyRights: string = "All copyrights reserved by Learning System";

  constructor() { }

  ngOnInit(): void {
  }

  GetCurrentYear(){
    var dateObj = new Date();
    return dateObj.getFullYear();
  }
}

