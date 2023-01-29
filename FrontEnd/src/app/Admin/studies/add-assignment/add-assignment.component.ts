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

//Class Declaration
class SampleClass {
  public variable1: string;
  public variable2: number;

  constructor(variable1: string, variable2: number) {
    this.variable1 = variable1;
    this.variable2 = variable2;
  }
}

//Enum Declaration
enum Search {
  API_CALL_IN_PROCESS,
  NO_CONTENT,
  HAVE_CONTENT
}

//Form
class Form{
  public assigmentFileId:any;
  public topic: string;
  public module: string;
  public batch: string;
  public deadline: string;
  public doc: string;
  public uploadtype: string;
  public comment:string

  constructor(assigmentFileId:any,topic: string, module: string, batch: string, deadline: string, doc: string,uploadtype:string,comment:string) {
    this.assigmentFileId=assigmentFileId;
    this.topic = topic;
    this.module = module;
    this.batch = batch;
    this.deadline = deadline;
    this.doc=doc;
    this.uploadtype=uploadtype;
    this.comment=comment;
  }
}
class ComboBoxForm{
  public batchNo:any;
  public moduleName:any;


  constructor(batchNo: any,moduleName:any ) {
    this.batchNo=batchNo
    this.moduleName=moduleName;

  }
}




@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})
export class AddAssignmentComponent implements OnInit {

 
  @Output() passValue = new EventEmitter<string>();

  //#region Samples
  public sampleClass: SampleClass = <SampleClass>{};
  public sampleArray: SampleClass[] = [
    {variable1: 'sample1', variable2: 5},
    {variable1: 'sample2', variable2: 15},
    {variable1: 'sample3', variable2: 20}
  ];
  public dataArray: String[] = ["A", "B"];
  //#endregion

  //#region Form
  private image: any;
  public form:Form = <Form> {};
  public assignementForm:Form=new Form('','','','','','','','');
  public uploadedFile:string = '';
  public fieldTextType: boolean = false;
  public confirmPasswordType:boolean = false;
  public AssignmentResoruce: Form[] = []; 
  private doc: any;
  public editImageSrc: string = '';
  //#endregion

  //#region FormBuilder
  public sampleForm!: FormGroup;
  public editForm!: FormGroup;
  public submitted = false;
  public Module_Name: any = ['Web', 'Mobile', 'POS'];
  public Batch_Name: any = ['Batch 1','Batch 2', 'Batch 3'];
  public Upload_Type: any = ['PDF','Docx', 'PPT'];
  public ComboBoxResoruceBatch: ComboBoxForm[] = [];
  public ComboBoxResoruceModule: ComboBoxForm[] = [];
  //#endregion

  //#region Search
  public isDisplaySearchSection: boolean = false;
  public searchState: number = 0;
  public searchBodyText: string = "";
  public searchKeyWord: string = "";
  //#endregion

  //#region Objects Initialize
  private toastObj: Toast = new Toast(this.toastr);
  private modalObj: ModalBox = new ModalBox(this.modalService);
  public paginationObj: Pagination = new Pagination();
  public formBuilderValidatorObj: FormBuilderValidater = new FormBuilderValidater();
  public cryptoObj: Cryptography = new Cryptography();
  public assigmentFileId:any;
 
  //#endregion

  public state: string = 'module';
  public goTo(state: string) {
    this.state = state;
  }

  constructor(private toastr: ToastrService, private modalService: NgbModal, private apiService: APIService, private formBuilder: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.InitializedFormBuilder();
    this.InitializedEditFormBuilder();
    this.GetAllAssignmentResourceAPI();
    // this.GetModuleResourceAPI();
    this.GetAllBatchResourceAPI();
  }

    

  //#region Form Functions
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
  InitializedEditFormBuilder(){
    this.editForm = this.formBuilder.group({
      Topic: ['', Validators.required],
      Module: ['', Validators.required],
      Batch: ['', [Validators.required]],
      Deadline: ['', [Validators.required]],
      Comment: ['', [Validators.required]],
      Uploadtype: ['', [Validators.required]]
    });
  }  
  BindEditFormBuilder(form:any){
    this.editForm.setValue({
      Topic:form.topic,
      Module: form.module,
      Batch:form.batch,
      Deadline: form.deadline,
      Comment: form.comment,
      Uploadtype:form.uploadtype
    });
  }  
  get formControl() {
    return this.sampleForm.controls;
  }
  get EditformControl() {
    return this.editForm.controls;
  }
  get Module() {
    return this.sampleForm.get('module');
  }

  get Batch() {
    return this.sampleForm.get('batch');
  }
  get Uploadtype() {
    return this.sampleForm.get('Uploadtype');
  }
  ResetForm(){
    this.sampleForm.reset();
    this.submitted = false;
  }

  AssignFormValues(){
    this.form = this.sampleForm.value;
 //   this.form.image = "";
  }
  AssignEditFormValues(){
    this.form = this.editForm.value;

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
      this.AssignEditFormValues();
      this.SubmitFormAPI();
    }
  }

  editSubmit(assigmentFileId:any) {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editForm.invalid) {
      return;
    }
    else {
      this.AssignEditFormValues();
      this.EditFormAPI(assigmentFileId);
    }
  }
  //#endregion

  //#region Other Functions
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleConfirmPasswordType() {
    this.confirmPasswordType = !this.confirmPasswordType;
  }

  Search() {
    if (this.searchKeyWord == "" || this.searchKeyWord.trim().length == 0) {
      this.isDisplaySearchSection = false;
      return;
    }

    this.searchState = Search.API_CALL_IN_PROCESS;
    this.isDisplaySearchSection = true;

    this.SearchApi();
  }



  PassValueToParentComponent(value:string){
    this.passValue.emit(value);
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

  SearchApi() {
    this.apiService.GetRequest(ApiPaths.testAPI + '/' + this.searchKeyWord).subscribe(response => {
      if (response.responseCode == 200) {

        if (this.dataArray.length === 0) {
          this.searchBodyText = 'SORRY! NO PRODUCTS AVAILABLE WITHIN YOUR SEARCHING AREA';
          this.searchState = Search.NO_CONTENT;

          setTimeout(() => {
            this.isDisplaySearchSection = false;
          }, 3000);
        }
        else {
          //Add stuffs here when API got a success response and returns data

          this.searchState = Search.HAVE_CONTENT;
        }
      }
      else {
        this.searchBodyText = "SORRY! SOMETHING WENT WRONG!";
        this.searchState = Search.NO_CONTENT;

        setTimeout(() => {
          this.isDisplaySearchSection = false;
        }, 3000);
      }
    }, error => {
      this.searchBodyText = "SORRY! SOMETHING WENT WRONG!";
      this.searchState = Search.NO_CONTENT;

      setTimeout(() => {
        this.isDisplaySearchSection = false;
      }, 3000);
    });
  }

  EditFormAPI(assigmentFileId:any){
    let toastID = this.toastObj.ToastWait();
    this.assignementForm.topic=this.editForm.value.Topic;
    this.assignementForm.batch=this.editForm.value.Batch.batchNo;
    this.assignementForm.module=this.editForm.value.Module.moduleName;
    this.assignementForm.deadline=this.editForm.value.Deadline;
    this.assignementForm.uploadtype=this.editForm.value.Uploadtype;
    this.assignementForm.comment=this.editForm.value.Comment;
    this.assignementForm.assigmentFileId=assigmentFileId;

    let stringData=JSON.stringify(this.assignementForm);
  
    let formdata: FormData = new FormData();
    formdata.append('data', stringData);
    formdata.append('file', this.doc);
    console.log(this.doc);

    console.log( JSON.stringify(this.assignementForm));
    this.apiService.PutRequest("" + ApiPaths.editAssignmentModel,JSON.stringify(this.assignementForm)).subscribe(response => {
     
      this.toastObj.ToastManualClose(toastID);

      if (response.responseCode == 200) {
        // reset form
        this.toastObj.ToastSuccess(response.successMessage);
        this.GetAllAssignmentResourceAPI();
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

  SubmitFormAPI(){
    let toastID = this.toastObj.ToastWait();
    this.assignementForm.topic=this.sampleForm.value.Topic;
    this.assignementForm.batch=this.sampleForm.value.Batch.batchNo;
    this.assignementForm.module=this.sampleForm.value.Module.moduleName;
    this.assignementForm.deadline=this.sampleForm.value.Deadline;
    this.assignementForm.uploadtype=this.sampleForm.value.Uploadtype;
    this.assignementForm.comment=this.sampleForm.value.Comment;

    let stringData=JSON.stringify(this.assignementForm); 
  
    let formdata: FormData = new FormData();
    formdata.append('data', stringData);
    formdata.append('file', this.doc);
    console.log(this.doc);

    console.log( JSON.stringify(this.assignementForm));

    this.apiService.PostRequest_Multipart("" + ApiPaths.addAssignmentModel, formdata).subscribe(response => {
      this.toastObj.ToastManualClose(toastID);
      this.toastObj.ToastManualClose(toastID);

      if (response.responseCode == 200) {
        // reset form
        this.toastObj.ToastSuccess(response.successMessage);
        this.ResetForm();
        this.GetAllAssignmentResourceAPI();
      }
      else{
        this.CreateErrorToast(response.errorMessage);
      }
    }, error => {
      this.toastObj.ToastManualClose(toastID);
      this.toastObj.ToastError(error);
    });
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

  AssignmentInitAPI(assignmentId:any) {


    this.apiService.GetRequest(ApiPaths.getOneAssignmentModel + "/" + assignmentId).subscribe(response => {
      if (response.responseCode == 200) {
        console.log(response.data)
        this.form.topic = response.data[0].topic;
        this.form.module = response.data[0].module;
        this.form.batch = response.data[0].batch;
        this.form.deadline = response.data[0].deadline;
        this.form.comment=response.data[0].comment;
        this.form.uploadtype=response.data[0].uploadtype;

        if (this.editForm != undefined) {
          this.BindEditFormBuilder(response.data[0]);
        }
      }
      else {
        console.log("Network error")
      }
    }, error => {
      console.log("Network error")
    });
  }
 
  DeleteUserAPI(assigmentFileId:any) {
    let toastID = this.toastObj.ToastWait();
    console.log(assigmentFileId)

    this.apiService.DeleteRequest(ApiPaths.deleteAssignmentModel + "/" + assigmentFileId).subscribe(response => {
      this.toastObj.ToastManualClose(toastID);
      if (response.responseCode == 200) {
        this.toastObj.ToastSuccess(response.successMessage);
        this.GetAllAssignmentResourceAPI();
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



  GetModuleResourceAPI() {
    this.sampleForm.controls['Module'].reset()
    this.apiService.GetRequest("" + ApiPaths.getParticularModel+"/"+ this.sampleForm.value.Batch.batchNo).subscribe(response => {
      if (response.responseCode == 200) {
        console.log( response.data);
        this.ComboBoxResoruceModule = response.data;
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
        this.ComboBoxResoruceBatch = response.data;
      }
      else {
        console.log("Network error")
      }
    }, error => {
      console.log("Network error")
    });
  }
  //#endregion


  GetObjectIndex(assigmentFileId: any) {
    return this.AssignmentResoruce.findIndex((obj: any) => obj.assigmentFileId == assigmentFileId);
  }


  //#region Modal Box
  public OpenModel(content: any) {
    this.modalObj.OpenModel(content, this.modalObj.Get_Medium());
  }
  public OpenModelForEdit(assigmentFileId: any,content: any) {
    let index = this.GetObjectIndex(assigmentFileId);
    this.assigmentFileId = this.AssignmentResoruce[index].assigmentFileId;
    this.modalObj.OpenModel(content, this.modalObj.Get_Large());
  }

  public OpenModelForDelete(assigmentFileId: any,content: any) {
    let index = this.GetObjectIndex(assigmentFileId);
    this.assigmentFileId = this.AssignmentResoruce[index].assigmentFileId;
    this.modalObj.OpenModel(content, this.modalObj.Get_Medium());
  }
  //Do not call the function and call the inside algorithm
  public CloseModel(){
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
