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
import { stringify } from '@angular/compiler/src/util';

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
  public moduleId:any;
  public topic: string;
  public module:string;
  public batch: string;
  public type: string;
  public doc:string;

  constructor(moduleId:any,topic: string, module: string, batch: string, type: string, doc: string) {
    this.moduleId= moduleId;
    this.topic = topic;
    this.module = module;
    this.batch = batch;
    this.type = type;
    this.doc=doc;
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
  selector: 'app-module-resources',
  templateUrl: './module-resources.component.html',
  styleUrls: ['./module-resources.component.css']
})
export class ModuleResourcesComponent implements OnInit {

  
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
  private doc: any;
  public form:Form = <Form> {};
  public moduleForm:Form=new Form('','','','','','');
  public uploadedFile:string = '';
  public fieldTextType: boolean = false;
  public confirmPasswordType:boolean = false;
  public ModuleResoruce: Form[] = [];
  //#endregion

  //#region FormBuilder
  public sampleForm!: FormGroup;
  public editForm!: FormGroup;
  public submitted = false;
  public Module_Name: any = ['Web', 'Mobile', 'POS'];
  public Type_Name: any = ['Notes','Exam'];
  public Batch_Name: any = ['Batch 1','Batch 2', 'Batch 3'];
  public ComboBoxResoruceBatch: ComboBoxForm[] = [];
  public ComboBoxResoruceModule: ComboBoxForm[] = [];
  //#endregion

  //#region Search
  public isDisplaySearchSection: boolean = false;
  public searchState: number = 0;
  public searchBodyText: string = "";
  public searchKeyWord: string = "";
  public editImageSrc: string = '';
  public MODULEID: any = '';
  public moduleId:any;
  //#endregion

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
     this.InitializedFormBuilder();
    this.InitializedEditFormBuilder();
    this.GetAllModuleResourceAPI();
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
      Type: ['', [Validators.required]],
      
    });
  } 
  InitializedEditFormBuilder(){
    this.editForm = this.formBuilder.group({
      Topic: ['', Validators.required],
      Module: ['', Validators.required],
      Batch: ['', [Validators.required]],
      Type: ['', [Validators.required]]
    });
 //   this.ModuleInitAPI();
  } 

  BindEditFormBuilder(form:any){
    this.editForm.setValue({
      Topic: form.topic,
      Module: form.module,
      Batch: form.batch,
      Type:form.type
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
  get Type() {
    return this.sampleForm.get('Type');
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
      this.AssignFormValues();
      this.SubmitFormAPI();
    }
  }

  editSubmit(moduleId:any) {
    this.submitted = true;
    console.log(moduleId)
    // stop here if form is invalid
    if (this.editForm.invalid) {
      return;
    }
    else {
      this.AssignEditFormValues();
      this.EdiFormAPI(moduleId);
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


  GetURLParam(){
    //Change "yourParameterName" like mentioned in app-routing.modules.ts
    this.route.params.subscribe(parameter => {
      let param = "" + parameter.yourParameterName;
    });
  }
  //#endregion

  //#region Api Calls
  GetAllModuleResourceAPI() {
    this.apiService.GetRequest("" + ApiPaths.getModuleModel).subscribe(response => {
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

  GetModuleDetails(userId:any) {

  return this.MODULEID(userId);
  }

  ModuleInitAPI(moduleid:any) {
    this.GetModuleDetails;
    console.log(this.MODULEID)

    this.apiService.GetRequest(ApiPaths.getOneModuleModel + "/" + moduleid).subscribe(response => {
      if (response.responseCode == 200) {
        console.log(response.data)
        this.form.topic = response.data[0].topic;
        this.form.module = response.data[0].module;
        this.form.batch = response.data[0].batch;
        this.form.type = response.data[0].type;

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

 
  SubmitFormAPI(){
    console.log(this.sampleForm.value.Module)
    console.log(this.sampleForm.value.Batch)
    let toastID = this.toastObj.ToastWait();
    this.moduleForm.topic=this.sampleForm.value.Topic;
    this.moduleForm.batch=this.sampleForm.value.Batch.batchNo;
    this.moduleForm.module=this.sampleForm.value.Module.moduleName;
    this.moduleForm.type=this.sampleForm.value.Type;

 
   
    let stringData=JSON.stringify(this.moduleForm);
  
    let formdata: FormData = new FormData();
    formdata.append('data', stringData);
    formdata.append('file', this.doc);
    console.log(this.doc);

    console.log( JSON.stringify(this.moduleForm));

    this.apiService.PostRequest_Multipart("" + ApiPaths.addModuleModel, formdata).subscribe(response => {
      this.toastObj.ToastManualClose(toastID);

      if (response.responseCode == 200) {
        // reset form
        this.toastObj.ToastSuccess(response.successMessage);
        this.ResetForm();
        this.GetAllModuleResourceAPI();
      }
      else{
        this.CreateErrorToast(response.errorMessage);
      }
    }, error => {
      this.toastObj.ToastManualClose(toastID);
      this.toastObj.ToastError(error);
    });
  }

  EdiFormAPI(moduleid:any){
    console.log(moduleid)
    let toastID = this.toastObj.ToastWait();
    this.moduleForm.topic=this.editForm.value.Topic;
    this.moduleForm.batch=this.editForm.value.Batch.batchNo;
    this.moduleForm.module=this.editForm.value.Module.moduleName;
    this.moduleForm.type=this.editForm.value.Type;
    this.moduleForm.moduleId=moduleid;

    this.apiService.PutRequest("" + ApiPaths.editModuleModel,JSON.stringify(this.moduleForm)).subscribe(response => {
      this.toastObj.ToastManualClose(toastID);

      if (response.responseCode == 200) {
        // reset form
        this.toastObj.ToastSuccess(response.successMessage);
        this.ResetForm();
        this.GetAllModuleResourceAPI();
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
  
  DeleteUserAPI(moduleId:any) {
    let toastID = this.toastObj.ToastWait();
    console.log(moduleId)

    this.apiService.DeleteRequest(ApiPaths.deleteModuleModel + "/" + moduleId).subscribe(response => {
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
        this.ComboBoxResoruceBatch = response.data;
      }
      else {
        console.log("Network error")
      }
    }, error => {
      console.log("Network error")
    });
  }

  //#region Pagination

  //#endregion

  //#region Modal Box
  public OpenModel(content: any) {
    this.modalObj.OpenModel(content, this.modalObj.Get_Medium());
  }

  GetObjectIndex(moduleId: any) {
    return this.ModuleResoruce.findIndex((obj: any) => obj.moduleId == moduleId);
  }

  DeleteModel(moduleId: any,content: any) {
    console.log(moduleId);
    let index = this.GetObjectIndex(moduleId);
    this.moduleId = this.ModuleResoruce[index].moduleId;
    this.modalObj.OpenModel(content, this.modalObj.Get_Medium());
  }
  public OpenModelForEdit(moduleId: any,content: any) {
   // this.ModuleInitAPI();

   let index = this.GetObjectIndex(moduleId);
   
   this.moduleId = this.ModuleResoruce[index].moduleId;
    this.modalObj.OpenModel(content, this.modalObj.Get_Large());
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
