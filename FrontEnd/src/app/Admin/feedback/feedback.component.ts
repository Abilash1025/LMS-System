import { Component, OnInit } from '@angular/core';

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
  public feedbackId:any;
  public userName: string;
  public feedback: string;
  public email: string;


  constructor(userName: string, feedback: string, email: string,feedbackId:any) {
    this.feedbackId=feedbackId;
    this.userName = userName;
    this.feedback = feedback;
    this.email = email;
  }
}

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  private toastObj: Toast = new Toast(this.toastr);
  private modalObj: ModalBox = new ModalBox(this.modalService);
  public FeedbackResoruce: Form[] = [];
  public feedbackId:any;

  constructor(private toastr: ToastrService, private modalService: NgbModal,private apiService: APIService) { }
    //#region Objects Initialize
   

  ngOnInit(): void {

    this.GetAllFeedbackAPI();
  }

  GetAllFeedbackAPI() {
    this.apiService.GetRequest("" + ApiPaths.getFeedback).subscribe(response => {
      if (response.responseCode == 200) {
        this.FeedbackResoruce = response.data;
      }
      else {
        console.log("Network error")
      }
    }, error => {
      console.log("Network error")
    });
  }

  DeleteModuleAPI(feedbackId:any) {
    let toastID = this.toastObj.ToastWait();
  
  
    this.apiService.DeleteRequest(ApiPaths.deleteFeedback + "/" + feedbackId).subscribe(response => {
      this.toastObj.ToastManualClose(toastID);
      if (response.responseCode == 200) {
        this.toastObj.ToastSuccess(response.successMessage);
        this.GetAllFeedbackAPI();
        this.modalObj.CloseModel();
  
      }
      else {
        this.toastObj.ToastError(response.errorMessage);
      }
    }, error => {
      this.toastObj.ToastManualClose(toastID);
      this.toastObj.ToastError(error);
    });
  }
  




 //#region Modal Box
 public OpenModel(content: any) {
  this.modalObj.OpenModel(content, this.modalObj.Get_Medium());
}


GetObjectIndex(feedbackId: any) {
  return this.FeedbackResoruce.findIndex((obj: any) => obj.feedbackId == feedbackId);
}

public DeleteModel(feedbackId: any,content: any) {

  let index = this.GetObjectIndex(feedbackId);
  this.feedbackId = this.FeedbackResoruce[index].feedbackId;
  this.modalObj.OpenModel(content, this.modalObj.Get_Medium());
}

//Do not call the function and call the inside algorithm
public CloseModel(){
  this.modalObj.CloseModel();
}
//#endregion
}
