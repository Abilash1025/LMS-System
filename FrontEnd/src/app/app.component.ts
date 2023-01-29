import {Component, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

import { Cryptography } from 'src/app/Classes/Cryptography';
import { Storage } from 'src/app/Enums/Storage';
import {ModalBox} from "./Classes/ModalBox";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Learning-System';

  @ViewChild('content') expiryModel:any;

  public cryptoObj: Cryptography = new Cryptography();
  private modalObj: ModalBox = new ModalBox(this.modalService);

  //1000 * 60 = 1 minute
  private expiryTime: number = 43200000;//1000 * 60 * 60 * 12 = 12 hours

  private isModelOpen: boolean = false;

  constructor(private modalService: NgbModal){}

  ngOnInit(): void {
  }

  ngDoCheck() {
    
  }



  CloseExpiryModel(){
    localStorage.clear();
    this.modalObj.CloseModel();
    location.reload();
  }
}
