import {Component, OnInit, Output, EventEmitter} from '@angular/core';

//Toast Library
import { ToastrService } from 'ngx-toastr';

//Toast Class
import { Toast } from 'src/app/Classes/Toast';

//Model Library
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

//Modal Class
import { ModalBox } from 'src/app/Classes/ModalBox';

//Crypto Class
import { Cryptography } from 'src/app/Classes/Cryptography';

//API Service
import { APIService } from 'src/app/Services/api.service';

//HTTP Request Param
import { HttpParams } from '@angular/common/http';

//FormBuilder
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Form Builder Class
import { FormBuilderValidater } from 'src/app/Classes/FormBuilderValidater';

//Router
import { ActivatedRoute } from '@angular/router';

//API Paths
import { ApiPaths } from 'src/app/Enums/API_Paths';

//Pagination Class
import { Pagination } from 'src/app/Classes/Pagination';



@Component({
  selector: 'app-lecturer',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.css']
})
export class StudiesComponent implements OnInit {
  // Output the values to parent component
  
  @Output() passValue = new EventEmitter<string>();

  //#region Objects Initialize
  private toastObj: Toast = new Toast(this.toastr);
  private modalObj: ModalBox = new ModalBox(this.modalService);
  public paginationObj: Pagination = new Pagination();
  public formBuilderValidatorObj: FormBuilderValidater = new FormBuilderValidater();
  public cryptoObj: Cryptography = new Cryptography();

  //#endregion

  public state: string = 'module';
  public goTo(state: string) {
    this.state = state;
  }

  constructor(private toastr: ToastrService, private modalService: NgbModal, private apiService: APIService, private formBuilder: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit(): void {

  }

    

  

  //#region Modal Box
  public OpenModel(content: any) {
    this.modalObj.OpenModel(content, this.modalObj.Get_Medium());
  }

  //Do not call the function and call the inside algorithm
  private CloseModel(){
    this.modalObj.CloseModel();
  }
  //#endregion

  //#region Toast
  //Do not call the function and call the inside algorithm
  CreateToastWaiting() {
    let toastID = this.toastObj.ToastWait();
    // this.toastObj.ToastManualClose(toastID);TODO: CALL THIS WHEN NEED TO CLOSE THE TOAST
  }

  //Do not call the function and call the inside algorithm
  CreateSuccessToast(msg: string) {
    this.toastObj.ToastSuccess(msg);
  }

  //Do not call the function and call the inside algorithm
  CreateErrorToast(msg: string) {
    this.toastObj.ToastError(msg);
  }
  //#endregion

  }
