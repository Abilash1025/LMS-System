import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Toast } from 'src/app/Classes/Toast';
import { APIService } from 'src/app/Services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalBox } from 'src/app/Classes/ModalBox';
//Local Storage
import { Storage } from 'src/app/Enums/Storage';


//API Paths
import { ApiPaths } from 'src/app/Enums/API_Paths';

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

class subject{
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

 
@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {

  public ModuleResoruce: Form[] = [];
  public SubjectResoruce: subject[] = [];
  module: any;

  constructor(private toastr: ToastrService,private apiService: APIService,private modalService: NgbModal) { }
  private modalObj: ModalBox = new ModalBox(this.modalService);
  ngOnInit(): void {
    this.GetAllModuleResourceAPI();
  }
  //#region Modal Box
  public OpenModel(module:any,content: any) { 
    this.module=module;
    this.GetAllSUbjectResourceAPI(module);
    this.modalObj.OpenModel(content, this.modalObj.Get_Extra_Large());
  }

  //Do not call the function and call the inside algorithm
  public CloseModel(){
    this.modalObj.CloseModel();
  }

  GetAllModuleResourceAPI() {
    this.apiService.GetRequest("" + ApiPaths.getParticularModel + "/" + localStorage.getItem(Storage.BATCH)).subscribe(response => {
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
  GetAllSUbjectResourceAPI(modulee:any) {
    this.apiService.GetRequest("" + ApiPaths.getParticularModuleSubjectModel + "/" + localStorage.getItem(Storage.BATCH)+"/"+modulee).subscribe(response => {
      if (response.responseCode == 200) {
        console.log( response.data);
        this.SubjectResoruce = response.data;
    
      }
      else {
        console.log("Network error")
      }
    }, error => {
      console.log("Network error")
    });
  }
}
