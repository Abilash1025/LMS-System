import { Component, OnInit } from '@angular/core';
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

import { Storage } from 'src/app/Enums/Storage';

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

//Class Declaration


//Enum Declaration

//Form
class Form{
  public personalId:string;
  public userName:string;
  public topic: string;
  public description:string;
  public type: string;
  public doc:string;

  constructor(userName:string,personalId:string,topic: string,  description: string, type: string, doc: string) {
    this.topic = topic;
    this.description = description;
    this.type = type;
    this.doc=doc;
    this.personalId=personalId;
    this.userName=userName;
  }
}


@Component({
  selector: 'app-personal-files',
  templateUrl: './personal-files.component.html',
  styleUrls: ['./personal-files.component.css']
})
export class PersonalFilesComponent implements OnInit {

    //#region Form
    private image: any;
    public form:Form = <Form> {};
    public uploadedFile:string = '';
    public fieldTextType: boolean = false;
    public confirmPasswordType:boolean = false;
    public personal:Form=new Form('','','','','','');
    public PersonalResoruce: Form[] = [];
    //#endregion
  
    //#region FormBuilder
    public sampleForm!: FormGroup;
    public submitted = false;

      //#region Objects Initialize
    private toastObj: Toast = new Toast(this.toastr);
    private modalObj: ModalBox = new ModalBox(this.modalService);
    public formBuilderValidatorObj: FormBuilderValidater = new FormBuilderValidater();
    private doc: any;
    public editImageSrc: string = '';
    public personalId: any;


  constructor(private toastr: ToastrService, private modalService: NgbModal, private apiService: APIService, private formBuilder: FormBuilder, private route: ActivatedRoute) {}
  
 
  ngOnInit(): void {
    this.InitializedFormBuilder();
    this.GetAllPersonaolResourceAPI();
  }

    

  //#region Form Functions
  InitializedFormBuilder(){
    this.sampleForm = this.formBuilder.group({
      Doc: ['', Validators.required],
      Topic: ['', Validators.required],
      Description: ['', Validators.required],
      Type: ['', [Validators.required]]
    });
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
 //   this.form.image = "";
  }



  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.sampleForm.invalid) {
      return;
    }
    else {
      this.AssignFormValues();
      this.SubmitFormAPI();
    }
  }
  //#endregion

 

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


  SubmitFormAPI(){
    let toastID = this.toastObj.ToastWait();

    this.personal.topic=this.sampleForm.value.Topic;
    this.personal.description=this.sampleForm.value.Description;
    this.personal.type=this.sampleForm.value.Type;
  
    let stringData=JSON.stringify(this.personal);

    let formdata: FormData = new FormData();
    formdata.append('data', stringData);
    formdata.append('user', ""+localStorage.getItem(Storage.USERNAME));
    formdata.append('file', this.doc);

    this.apiService.PostRequest_Multipart("" + ApiPaths.addPersonal, formdata).subscribe(response => {
      this.toastObj.ToastManualClose(toastID);

      if (response.responseCode == 200) {
        // reset form
        this.GetAllPersonaolResourceAPI();
        this.CloseModel();
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

  GetAllPersonaolResourceAPI() {
    this.apiService.GetRequest("" + ApiPaths.getPersonal+ "/" + localStorage.getItem(Storage.USERNAME)).subscribe(response => {
      if (response.responseCode == 200) {
        console.log( response.data);
        this.PersonalResoruce = response.data;
      }
      else {
        console.log("Network error")
      }
    }, error => {
      console.log("Network error")
    });
  }

  DeleteUserAPI(personalId:any) {
    let toastID = this.toastObj.ToastWait();
 

    this.apiService.DeleteRequest(ApiPaths.deletePersonal + "/" + personalId).subscribe(response => {
      this.toastObj.ToastManualClose(toastID);
      if (response.responseCode == 200) {
        this.toastObj.ToastSuccess(response.successMessage);
        this.GetAllPersonaolResourceAPI();
        this.modalObj.CloseModel();

      }
      else {
        this.toastObj.ToastError(response.errorMessage);
      }
    }, error => {
      this.submitted = false;
      this.toastObj.ToastManualClose(toastID);
      this.toastObj.ToastError(error);
    });
  }

  GetObjectIndex(personalId: any) {
    return this.PersonalResoruce.findIndex((obj: any) => obj.personalId == personalId);
  }

  //#region Modal Box
  public OpenModel(personalId:any,content: any) {
    let index = this.GetObjectIndex(personalId);
    this.personalId = this.PersonalResoruce[index].personalId;
    this.modalObj.OpenModel(content, this.modalObj.Get_Medium());
  }

  //Do not call the function and call the inside algorithm
  public CloseModel(){
    this.modalObj.CloseModel();
  }
  Cancel(){
    this.CloseModel();
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
