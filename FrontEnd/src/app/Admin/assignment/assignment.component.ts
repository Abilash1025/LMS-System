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
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

//Form Builder Class
import { FormBuilderValidater } from 'src/app/Classes/FormBuilderValidater';

//Router
import { ActivatedRoute } from '@angular/router';

//API Paths
import { ApiPaths } from 'src/app/Enums/API_Paths';

//Pagination Class


class Form{
  public assigmentFileId:any;
  public topic: string;
  public module: string;
  public batch: string;
  public deadline: string;
  public doc: string;
  public uploadtype: string;
  public comment:string;
  public studentId:string;
  public submittedDoc:string;
  public submittedTime:string;
  public studentName:String;
  public assignmentId:String;
  public marks:string;

  constructor(marks:string,assignmentId:String,submittedTime:string,studentName:string,submittedDoc:string,studentId:string,assigmentFileId:any,topic: string, module: string, batch: string, deadline: string, doc: string,uploadtype:string,comment:string) {
    this.assigmentFileId=assigmentFileId;
    this.topic = topic;
    this.module = module;
    this.batch = batch;
    this.deadline = deadline;
    this.doc=doc;
    this.uploadtype=uploadtype;
    this.comment=comment;
    this.studentId=studentId;
    this.submittedDoc=submittedDoc;
    this.studentName=studentName;
    this.submittedTime=submittedTime;
    this.assignmentId=assignmentId;
    this.marks=marks;
  }
}





@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {

  public AssignmentResoruce: Form[] = []; 
  public SubmittedAssignments: Form[] = []; 
  public GradedAssignments: Form[] = []; 
  public assignment!:FormGroup;
  private toastObj: Toast = new Toast(this.toastr);


  constructor(private toastr: ToastrService, private modalService: NgbModal, private apiService: APIService, private formBuilder: FormBuilder) { }
  
  private modalObj: ModalBox = new ModalBox(this.modalService);


  ngOnInit(): void {

    this.GetAllAssignmentResourceAPI();
    this.assignment =this.formBuilder.group( {
      Comment: new FormControl(),
      Grade:new FormControl()
    })
  }


  
  GetAllAssignmentResourceAPI() {
    this.apiService.GetRequest("" + ApiPaths.getAssignmentModel).subscribe(response => {
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

  GetAllSubmittedAssignmentResourceAPI(assigmentFileId:any) {
    this.apiService.GetRequest("" + ApiPaths.getSubmittedAssignments+ "/" + assigmentFileId).subscribe(response => {
      if (response.responseCode == 200) {
        console.log( response.data);
        this.SubmittedAssignments = response.data;
      }
      else {
        console.log("Network error")
      }
    }, error => {
      console.log("Network error")
    });
  }

  GetAllGradedAssignmentResourceAPI(assigmentFileId:any) {
    this.apiService.GetRequest("" + ApiPaths.getGradedParticularAssignment+ "/" + assigmentFileId).subscribe(response => {
      if (response.responseCode == 200) {
        console.log( response.data);
        this.SubmittedAssignments = response.data;
      }
      else {
        console.log("Network error")
      }
    }, error => {
      console.log("Network error")
    });
  }

  SubmitAssigment(assignmentId:any){
    let toastID = this.toastObj.ToastWait();

    let formdata: FormData = new FormData();
    formdata.append('id', assignmentId);
    formdata.append('comment',this.assignment.value.Comment );
    formdata.append('grade',this.assignment.value.Grade );


    this.apiService.PutRequest_Multipart("" + ApiPaths.gradeAssignment,formdata).subscribe(response => {
     
      this.toastObj.ToastManualClose(toastID);

      if (response.responseCode == 200) {
        // reset form
        this.toastObj.ToastSuccess(response.successMessage);
        
        this.ResetForm();
        this.CloseModel();
      }
      else{
        this.CreateErrorToast(response.errorMessage);
      }
    }, error => {
      this.toastObj.ToastManualClose(toastID);
      this.toastObj.ToastError(error);
    });
  }

  

  public OpenModel(assigmentFileId:any,content: any) {
    this.GetAllSubmittedAssignmentResourceAPI(assigmentFileId);
    this.modalObj.OpenModel(content, this.modalObj.Get_Extra_Large());
  }
  public OpenModelGraded(assigmentFileId:any,content: any) {
    this.GetAllGradedAssignmentResourceAPI(assigmentFileId);
    this.modalObj.OpenModel(content, this.modalObj.Get_Extra_Large());
  }

  //Do not call the function and call the inside algorithm
  public CloseModel(){
    this.modalObj.CloseModel();
  }
 

  ResetForm(){
    this.assignment.reset();

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

}
