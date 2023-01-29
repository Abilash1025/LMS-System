import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Toast } from 'src/app/Classes/Toast';
import { APIService } from 'src/app/Services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalBox } from 'src/app/Classes/ModalBox';



//API Paths
import { ApiPaths } from 'src/app/Enums/API_Paths';
//Form 
class Form{
  public subjectId:any
  public batchNo:string;
  public code: string;
  public moduleName: string;


  constructor(batchNo: string, code: string, ModuleName: string,subjectId:any) {
    this.subjectId=subjectId
    this.batchNo = batchNo;
    this.code = code;
    this.moduleName = ModuleName;
 
  }
}

class BatchForm{
  public batchNo:string
  public startDate:string;
  public endDate: string;

  constructor(batchNo: string, startDate: string,endDate:string) {
    this.batchNo=batchNo
    this.startDate = startDate;
    this.endDate = endDate;

  }
}


@Component({
  selector: 'app-modules-section',
  templateUrl: './modules-section.component.html',
  styleUrls: ['./modules-section.component.css']
})

export class ModulesSectionComponent implements OnInit {

  
  public sampleForm!: FormGroup;
  public batchForm!: FormGroup;
 
  public Batch: any = ['B001', 'B002'];
    //#region Form
  public form:Form = <Form> {};
  public batchform:BatchForm = <BatchForm> {};
  public uploadedFile:string = '';
  public moduleForm:Form=new Form('','','','');
  public batchGetter:BatchForm=new BatchForm('','','');
  private toastObj: Toast = new Toast(this.toastr);
  private modalObj: ModalBox = new ModalBox(this.modalService);
  public ModuleResoruce: Form[] = [];
  public BatchResoruce: BatchForm[] = [];
  public MODULEID: any = '';
  public subjectId:any;

      //#region FormBuilder
  public submitted = false;
  public submittedd=false;

  constructor(private formBuilder: FormBuilder,private toastr: ToastrService,private apiService: APIService,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.InitializedFormBuilder();
    this.GetAllModuleResourceAPI();
    this.GetAllBatchResourceAPI();
    this.InitializedFormBuilderforBatch();
  }

  InitializedFormBuilder(){
    this.sampleForm = this.formBuilder.group({
      Batch: ['', Validators.required],
      ModuleCode: ['', [Validators.required]],
      ModuleName: ['', [Validators.required]]
    } 
    );
  }
  InitializedFormBuilderforBatch(){
    this.batchForm = this.formBuilder.group({
      BatchNo: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required]
    }
    );
  }

  get formControl() {
    return this.sampleForm.controls;
  }

  get formControlBatch() {
    return this.batchForm.controls;
  }
  get batch() {
    return this.sampleForm.get('batch');
  }
  ResetForm(){
    this.sampleForm.reset();
    this.submitted = false;
  }
  ResetFormBatch(){
    this.batchForm.reset();
    this.submittedd = false;
  }
  AssignFormValues(){
    this.form = this.sampleForm.value;
 }

 AssignFormValuesforBatch(){
  this.batchform = this.batchForm.value;
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
    this.SubmitFormAPI();
  }
}

onSubmitforBatch() {
  this.submittedd = true;


  if (this.batchForm.invalid) {
    return;
  }
  else {
    this.AssignFormValuesforBatch();
    this.SubmitBatchFormAPI();
  }
 
  
}
GetAllModuleResourceAPI() {
  this.apiService.GetRequest("" + ApiPaths.getModulel).subscribe(response => {
    if (response.responseCode == 200) {
      console.log( response.data);
      this.ModuleResoruce = response.data;
    }
    else {
      console.log("Network error")
    }
  }, error => {
    console.log("Network error")
  });
}

GetAllBatchResourceAPI() {
  this.apiService.GetRequest("" + ApiPaths.getBatch).subscribe(response => {
    if (response.responseCode == 200) {
      console.log( response.data); 
      this.BatchResoruce = response.data;
    }
    else {
      console.log("Network error")
    }
  }, error => {
    console.log("Network error")
  });
}

SubmitBatchFormAPI(){
  let toastID = this.toastObj.ToastWait();
  this.batchGetter.batchNo=this.batchForm.value.BatchNo;
  this.batchGetter.startDate=this.batchForm.value.StartDate;
  this.batchGetter.endDate=this.batchForm.value.EndDate;

  this.apiService.PostRequest("" + ApiPaths.addBatch, this.batchGetter).subscribe(response => {
    this.toastObj.ToastManualClose(toastID);

    if (response.responseCode == 200) {
      this.toastObj.ToastSuccess(response.successMessage);
      this.GetAllBatchResourceAPI();
      this.ResetFormBatch();
  
    }
    else{
      this.CreateErrorToast(response.errorMessage);
    }
  }, error => {
    this.toastObj.ToastManualClose(toastID);
    this.toastObj.ToastError(error);
  });
}

SubmitFormAPI(){
  let toastID = this.toastObj.ToastWait();
  this.moduleForm.batchNo=this.sampleForm.value.Batch.batchNo;
  this.moduleForm.code=this.sampleForm.value.ModuleCode;
  this.moduleForm.moduleName=this.sampleForm.value.ModuleName;

  console.log(this.moduleForm.batchNo)
  console.log(this.sampleForm.value.Batch.batchNo)
  let stringData=JSON.stringify(this.moduleForm);

 
  this.apiService.PostRequest("" + ApiPaths.addModulel, this.moduleForm).subscribe(response => {
    this.toastObj.ToastManualClose(toastID);

    if (response.responseCode == 200) {
      // reset form
      this.toastObj.ToastSuccess(response.successMessage);
      this.GetAllModuleResourceAPI();
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

DeleteModuleAPI(subjectId:any) {
  let toastID = this.toastObj.ToastWait();


  this.apiService.DeleteRequest(ApiPaths.deleteModulel + "/" + subjectId).subscribe(response => {
    this.toastObj.ToastManualClose(toastID);
    if (response.responseCode == 200) {
      this.toastObj.ToastSuccess(response.successMessage);
      this.GetAllModuleResourceAPI();
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

  public OpenModel(content: any) {
    this.modalObj.OpenModel(content, this.modalObj.Get_Medium());
  }
  public CloseModel(){
    this.modalObj.CloseModel();
  }

  GetObjectIndex(subjectId: any) {
    return this.ModuleResoruce.findIndex((obj: any) => obj.subjectId == subjectId);
  }

  DeleteModel(subjectId: any,content: any) {
    console.log(subjectId);
    let index = this.GetObjectIndex(subjectId);
    this.subjectId = this.ModuleResoruce[index].subjectId;
    this.modalObj.OpenModel(content, this.modalObj.Get_Medium());
  }

}
