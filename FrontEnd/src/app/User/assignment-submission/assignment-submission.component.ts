import { Component, OnInit } from '@angular/core';
//Model Library
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

//Modal Class
import { ModalBox } from 'src/app/Classes/ModalBox';

//API Paths
import { ApiPaths } from 'src/app/Enums/API_Paths';
//Toast Library
import { ToastrService } from 'ngx-toastr';

//Toast Class
import { Toast } from 'src/app/Classes/Toast';

//API Service
import { APIService } from 'src/app/Services/api.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Local Storage
import { Storage } from 'src/app/Enums/Storage';


class Form{
  public assignmentId:any;
  public assigmentFileId:any;
  public topic: string;
  public module: string;
  public batch: string;
  public deadline: string;
  public briefDoc: string;
  public uploadType: string;
  public comment:string;
  public marks:string;
  public submittedTime:string;
  

  constructor(submittedTime:string,marks:string,assignmentId:any,assigmentFileId:any,topic: string, module: string, batch: string, deadline: string, briefDoc: string,uploadtype:string,comment:string) {
    this.assigmentFileId=assigmentFileId;
    this.topic = topic;
    this.module = module;
    this.batch = batch;
    this.deadline = deadline;
    this.briefDoc=briefDoc;
    this.uploadType=uploadtype;
    this.comment=comment;
    this.assignmentId=assignmentId;
    this.marks=marks;
    this.submittedTime=submittedTime;
  }
}

@Component({
  selector: 'app-assignment-submission',
  templateUrl: './assignment-submission.component.html',
  styleUrls: ['./assignment-submission.component.css']
})
export class AssignmentSubmissionComponent implements OnInit {

  private image: any;
  public uploadedFile:string = '';
  public form:Form = <Form> {};
  public assignementForm:Form=new Form('','','','','','','','','','','');
  private doc: any;
  public editImageSrc: string = '';
  public sampleForm!: FormGroup;
  public AssignmentResoruce: Form[] = [];
  public SubmittedAssignmentResoruce: Form[] = [];
  uploadtype: any;
  comment: any;
  deadline: any;
  private toastObj: Toast = new Toast(this.toastr);
  assignmentId: any;
  myDate = new Date();
  constructor(private toastr: ToastrService, private modalService: NgbModal, private apiService: APIService,private formBuilder: FormBuilder) { }
  
  //Model
  private modalObj: ModalBox = new ModalBox(this.modalService);
  ngOnInit(): void {
    this.GetAllAssignmentResourceAPI();
    this.GetAllSubmittedAssignmentResourceAPI();
    
  }

  InitializedFormBuilder(){
    this.sampleForm = this.formBuilder.group({
      Doc: ['', Validators.required],
      Topic: ['', Validators.required],
      Module: ['', Validators.required],
      Batch: ['', [Validators.required]],
      Deadline: ['', [Validators.required]],
      Comment: ['', [Validators.required]],
      Uploadtype: ['', [Validators.required]]
    });
  } 
  //#region Modal Box
  public OpenModel(uploadtype:any,comment:any,deadline:any,assignmentId:any,content: any) {
    this.uploadtype=uploadtype;
    this.comment=comment;
    this.deadline=deadline;
    this.assignmentId=assignmentId;
    this.modalObj.OpenModel(content, this.modalObj.Get_Extra_Large());
  }
 
  //Do not call the function and call the inside algorithm
  private CloseModel(){
    this.modalObj.CloseModel();
  }
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
  ResetForm(){
    this.sampleForm.reset();
    
  }
  GetAllAssignmentResourceAPI() {
    this.apiService.GetRequest(ApiPaths.getParticularAssignment + "/" + localStorage.getItem(Storage.BATCH)+"/"+localStorage.getItem(Storage.USERID)).subscribe(response => {
      if (response.responseCode == 200) {
        console.log( response.data);
        this.AssignmentResoruce = response.data;
      }
      else { 
        console.log("Network error")
      }
    }, error => {
      console.log("Network error")
    });
  }

  GetAllSubmittedAssignmentResourceAPI() {
    this.apiService.GetRequest(ApiPaths.submittedAssignment + "/" + localStorage.getItem(Storage.BATCH)+"/"+localStorage.getItem(Storage.USERID)).subscribe(response => {
      if (response.responseCode == 200) {
        console.log( response.data);
        this.SubmittedAssignmentResoruce = response.data;
      }
      else {
        console.log("Network error")
      }
    }, error => {
      console.log("Network error")
    });
  }

  
  SubmitAssigment(assigmentId:any){
    let toastID = this.toastObj.ToastWait();

var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

  let newdate = year + "/" + month + "/" + day;
    let dateTime = new Date()
    
    
 //   let stringData=JSON.stringify();
    let formdata: FormData = new FormData();
    formdata.append('id', assigmentId);
    formdata.append('date',newdate );
    formdata.append('file', this.doc);
    console.log(this.doc);

    console.log( JSON.stringify(this.assignementForm));
    this.apiService.PutRequest_Multipart("" + ApiPaths.submitAssignment,formdata).subscribe(response => {
     
      this.toastObj.ToastManualClose(toastID);

      if (response.responseCode == 200) {
        // reset form
        this.GetAllAssignmentResourceAPI();
        this.GetAllSubmittedAssignmentResourceAPI();
        window.location.reload();
        this.toastObj.ToastSuccess(response.successMessage);
        this.CloseModel();
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

}
