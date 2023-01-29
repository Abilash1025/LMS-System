import {Component, OnChanges, OnDestroy, OnInit, ViewChild, ComponentFactoryResolver, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';

//Form Builder Class
import { FormBuilderValidater } from 'src/app/Classes/FormBuilderValidater';

//Toast Library
import { ToastrService } from 'ngx-toastr';

//Toast Class
import { Toast } from 'src/app/Classes/Toast';

//Model Library
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

//Modal Class
import { ModalBox } from 'src/app/Classes/ModalBox';

import { APIService } from 'src/app/Services/api.service';

import { ApiPaths } from 'src/app/Enums/API_Paths';


//Form 
class Form{
  public copyRight: string;
  public fbLink:string;
  public twitterLink: string;
  public phone: string;


  constructor(copyRight: string, fbLink: string, twitterLink: string, phone: string) {
    this.copyRight = copyRight;
    this.fbLink = fbLink;
    this.twitterLink = twitterLink;
    this.phone = phone;
  }
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponet implements OnInit{

  public sampleForm!: FormGroup;
  private doc: any;
  public editImageSrc: string = '';
  private toastObj: Toast = new Toast(this.toastr);
 

    //#region Form
  public form:Form = <Form> {};
  public uploadedFile:string = '';

      //#region FormBuilder
  public submitted = false;
  //#region Form
  private image: any;


  //#endregion
  constructor(private formBuilder: FormBuilder,private toastr: ToastrService, private modalService: NgbModal, private apiService: APIService){}
  ngOnInit(): void {
  this.InitializedFormBuilder();
  }

    //#region Form Functions
    InitializedFormBuilder(){
      this.sampleForm = this.formBuilder.group({
        CopyRight: ['', Validators.required],
        FbLink: ['', Validators.required],
        TwitterLink: ['', [Validators.required]],
        phone: ['', [Validators.required]],
      }
      );
    }

    get formControl() {
      return this.sampleForm.controls;
    }

    ResetForm(){
      this.sampleForm.reset();
      this.submitted = false;
    }

    AssignFormValues(){
      this.form = this.sampleForm.value;
   }

    ChangeDropDownValue(controlName: any, e: any){
      let value = e.target.value;
  
      if(value.includes(':')){
        let index = value.indexOf(':');
        value = value.substring(index + 2);
      }
  
      if(controlName){
        controlName.setValue(value, {
          onlySelf: true
        });
      }
    }

    
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.sampleForm.invalid) {
      return;
    }
    else {
      this.AssignFormValues();
    }
  }
  onFileChange(event: any) {
    this.doc = event.target.files[0];
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.editImageSrc = reader.result as string;
        this.sampleForm.patchValue({
          fileSource: reader.result
        });
      };
    }
  }

  EditFormAPI(){
    let toastID = this.toastObj.ToastWait();
 
    let formdata: FormData = new FormData();

    formdata.append('file', this.doc);
    console.log(this.doc);

    this.apiService.PutRequest_Multipart("" + ApiPaths.updateHomeBanner, formdata).subscribe(response => {
      this.toastObj.ToastManualClose(toastID);

      if (response.responseCode == 200) {
        // reset form
        this.toastObj.ToastSuccess(response.successMessage);
        this.ResetForm();
         }
      else{
        this.CreateErrorToast(response.errorMessage);
      }
    }, error => {
      this.toastObj.ToastManualClose(toastID);
      this.toastObj.ToastError(error);
    });
  }


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
}


