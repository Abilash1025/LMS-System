import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-parent',
  templateUrl: './client-parent.component.html',
  styleUrls: ['./client-parent.component.css']
})
export class ClientParentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  ScrollToSelectedPosition(href: string){
    var hrefQS = document.querySelector(href);
    if(hrefQS){
      hrefQS.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }
}

