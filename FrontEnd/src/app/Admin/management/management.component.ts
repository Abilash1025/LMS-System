import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormBuilderValidater } from "../../Classes/FormBuilderValidater";
import { ApiPaths } from "../../Enums/API_Paths";
import { Toast } from "../../Classes/Toast";
import { ToastrService } from "ngx-toastr";
import { APIService } from "../../Services/api.service";
import { ModalBox } from "../../Classes/ModalBox";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Storage } from "../../Enums/Storage";
import { Cryptography } from "../../Classes/Cryptography";

class Profile {
  public userId:any;
  public fullName: string;
  public telephoneNumber: string;
  public email: string;
  public gender: string;
  public password: string;
  public batch: string;
  public address: string;

  constructor(userId:any,fullName: string,batch: string,address:string, telephoneNumber: string, email: string, gender: string,  password: string) {
    this.userId=userId;
    this.fullName = fullName;
    this.telephoneNumber = telephoneNumber;
    this.email = email;
    this.gender = gender;
    this.password = password;
    this.batch=batch;
    this.address=address;
  }
}
class Admin {
  public adminId:any;
  public fullName: string;
  public telephoneNumber: string;
  public email: string;
  public gender: string;
  public password: string;
  public address: string;

  constructor(adminId:any, fullName: string,address:string, telephoneNumber: string, email: string, gender: string, password: string) {
    this.fullName = fullName;
    this.telephoneNumber = telephoneNumber;
    this.email = email;
    this.gender = gender;
    this.password = password;
    this.address=address;
    this.adminId=adminId;
  }
}

class ComboBoxForm{
  public batchNo:any;

  constructor(batchNo: any ) {
    this.batchNo=batchNo

  }
}
enum Search {
  API_CALL_IN_PROCESS,
  NO_CONTENT,
  HAVE_CONTENT
}
@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {
  //#region Services
  public cryptoObj: Cryptography = new Cryptography();
  private modalObj: ModalBox = new ModalBox(this.modalService);
  public formBuilderValidatorObj: FormBuilderValidater = new FormBuilderValidater();
  private toastObj: Toast = new Toast(this.toastr);
  //#endregion

  //#region Profile
  private profile: Profile = new Profile('','','','','','','','');
  private admin: Admin = new Admin('','', '', '', '','','');
  public profileCreateForm!: FormGroup;
  private image: any;
  public editImageSrc: string = '';
  public fieldTextType: boolean = false;
  public confirmPasswordType: boolean = false;
  public submitted = false;
  public submittedd = false;
  public Gender: any = ['Male', 'Female', 'Prefer not to say'];
  public Role: any = ['ADMIN', 'MANAGER'];
  public Batch: any = ['B001', 'B002'];
  public User: Profile[] = [];
  public Lecturer: Admin[] = [];
  public currentUserID: any = '';
  public adminId:any;
  public ComboBoxResoruceBatch: ComboBoxForm[] = [];
 
  //#endregion

  //#region User Details
  public userRole: any = '';
  public userId: any = '';
  public userName: any = '';
  //#endregion

  
  //#region Search
  public isDisplaySearchSection: boolean = false;
  public searchState: number = 0;
  public searchBodyText: string = "";
  public searchKeyWord: string = "";
  //#endregion
  public dataArray: String[] = ["A", "B"];
  fullName: any;
  email: any;
  address: any;
  password: any;
  telephoneNumber: any;
  genderr: any;
  batchforUser:any;
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private toastr: ToastrService, private apiService: APIService) { }

  ngOnInit(): void {
     this.GetAllLectureAPI();
     this.GetAllUserAPI();
    // this.GetProfileDetails();
    this.GetAllBatchResourceAPI();
  }

  //#region Formbuilder
  InitializeProfileFormBuilder() {
    this.profileCreateForm = this.formBuilder.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      Batch: ['', ],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      image:['',Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: [
        this.formBuilderValidatorObj.SpaceValidation('name'),
        this.formBuilderValidatorObj.PhoneNumberValidation('phone'),
        this.formBuilderValidatorObj.MustMatch('password', 'confirmPassword')
      ]
    });
  }
  get profileFormControl() {
    return this.profileCreateForm.controls;
  }
  get gender() {
    return this.profileCreateForm.get('gender');
  }
  get role() {
    return this.profileCreateForm.get('role');
  }
  get batch() {
    return this.profileCreateForm.get('batch');
  }
  //#endregion

  //#region User
  GetProfileDetails() {
    this.userId = this.cryptoObj.DecryptData(localStorage.getItem(Storage.USERID));
    this.userRole = this.cryptoObj.DecryptData(localStorage.getItem(Storage.ROLE));
    this.userName = this.cryptoObj.DecryptData(localStorage.getItem(Storage.USERNAME));
  }

  GetSingleUser(userID: any) {
    let index = this.User.findIndex((obj: any) => obj.adminId == userID);
    return this.User[index];
  }

  CreateUser() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileCreateForm.invalid) {
      return;
    }
    else {
      this.ProfileCreateAPIUser();
    }
  }
  
  CreateAdmin() {
    this.submittedd = true;

    if (this.profileCreateForm.invalid) {
      return;
    }
    else {
      this.ProfileCreateAPIAdmin();
    }
  }
  //#endregion

  //#region Sub function
  onFileChange(event: any) {
    this.image = event.target.files[0];
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.editImageSrc = reader.result as string;
        this.profileCreateForm.patchValue({
          fileSource: reader.result
        });
      };
    }
  }

  ChangeDropDownValue(controlName: any, e: any) {
    let value = e.target.value;

    if (value.includes(':')) {
      let index = value.indexOf(':');
      value = value.substring(index + 2);
    }

    if (controlName) {
      controlName.setValue(value, {
        onlySelf: true
      });
    }
  }

  imageCloseClick() {
    let imgEl = this.profileCreateForm.get('image');
    if (imgEl) {
      imgEl.reset();
      this.editImageSrc = '';
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleConfirmPasswordType() {
    this.confirmPasswordType = !this.confirmPasswordType;
  }

  
  //#endregion
  ResetForm(){
    this.profileCreateForm.reset();
    this.submitted = false;
  }
  //#region API
  ProfileCreateAPIAdmin() {
    this.admin.fullName = this.profileCreateForm.value.name;
    this.admin.telephoneNumber = this.profileCreateForm.value.phone;
    this.admin.email = this.profileCreateForm.value.email;
    this.admin.gender = this.profileCreateForm.value.gender;
    this.admin.address = this.profileCreateForm.value.address;
    this.admin.password = this.profileCreateForm.value.password;

    let toastID = this.toastObj.ToastWait();
    let formdata: FormData = new FormData();

    let stringData=JSON.stringify(this.admin);
  

    formdata.append('data', stringData);
    formdata.append('file', this.image);

    this.apiService.PostRequest_Multipart("" + ApiPaths.profileCreateApiAdmin, formdata).subscribe(response => {
      this.toastObj.ToastManualClose(toastID);
      if (response.responseCode == 200) {
        console.log(response.responseCode)
        this.toastObj.ToastSuccess(response.successMessage);
        this.ResetForm();
        this.GetAllLectureAPI();
        this.modalObj.CloseModel();
      }
      else {
        this.toastObj.ToastError(response.errorMessage);
      }
    }, error => {
      this.submitted = false;
      this.toastObj.ToastManualClose(toastID);
      this.toastObj.ToastError("Email is already existed");
    });
  }

    //#region API
    ProfileCreateAPIUser() {
      this.profile.fullName = this.profileCreateForm.value.name;
      this.profile.telephoneNumber = this.profileCreateForm.value.phone;
      this.profile.email = this.profileCreateForm.value.email;
      this.profile.gender = this.profileCreateForm.value.gender;
      this.profile.address = this.profileCreateForm.value.address;
      this.profile.password = this.profileCreateForm.value.password;
      this.profile.batch = this.profileCreateForm.value.Batch.batchNo;
  
      let toastID = this.toastObj.ToastWait();
      let formdata: FormData = new FormData();
  
      let stringData=JSON.stringify(this.profile);
    
  
      formdata.append('data', stringData);
      formdata.append('file', this.image);
  
      this.apiService.PostRequest_Multipart("" + ApiPaths.profileCreateApiUser, formdata).subscribe(response => {
        this.toastObj.ToastManualClose(toastID);
        if (response.responseCode == 200) {
  
          this.toastObj.ToastSuccess(response.successMessage);
          this.ResetForm();
          this.GetAllUserAPI();
          this.modalObj.CloseModel();
        }
        else {
          this.toastObj.ToastError(response.errorMessage);
        }
      }, error => {
        this.submitted = false;
        this.toastObj.ToastManualClose(toastID);
        this.toastObj.ToastError("Email is already existed");
      });
    }
  

  GetAllLectureAPI() {
    this.apiService.GetRequest("" + ApiPaths.getAllAdminAPI).subscribe(response => {
      if (response.responseCode == 200) {
        console.log( response.data);
        this.Lecturer = response.data;
      }
      else {
        console.log("Network error")
      }
    }, error => {
      console.log("Network error")
    });
  }

  GetAllUserAPI() {
    this.apiService.GetRequest("" + ApiPaths.getAllUsersAPI).subscribe(response => {
      if (response.responseCode == 200) {
        console.log( response.data);
        this.User = response.data;
      }
      else {
        console.log("Network error")
      }
    }, error => {
      console.log("Network error")
    });
  }

  DeleteAdminAPI(adminId:any) {
    let toastID = this.toastObj.ToastWait();

    this.apiService.DeleteRequest(ApiPaths.deleteAdminAPI + "/" + adminId).subscribe(response => {
      this.toastObj.ToastManualClose(toastID);
      if (response.responseCode == 200) {
        this.toastObj.ToastSuccess(response.successMessage);
        this.GetAllLectureAPI();
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

  DeleteUserAPI(userId:any) {
    let toastID = this.toastObj.ToastWait();

    this.apiService.DeleteRequest(ApiPaths.deleteUserAPI + "/" + userId).subscribe(response => {
      this.toastObj.ToastManualClose(toastID);
      if (response.responseCode == 200) {
        this.toastObj.ToastSuccess(response.successMessage);
        this.GetAllUserAPI();
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
  //#endregion

  //#region Modal Box
  CreateUserModal(content: any) {
    this.submitted = false;
    this.editImageSrc = "";
    this.InitializeProfileFormBuilder();
    this.modalObj.OpenModel(content, this.modalObj.Get_Large());
  }

  //#endregion

  Search() {
    if (this.searchKeyWord == "" || this.searchKeyWord.trim().length == 0) {
      this.isDisplaySearchSection = false;
      return;
    }

    this.searchState = Search.API_CALL_IN_PROCESS;
    this.isDisplaySearchSection = true;

    this.SearchApi();
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


  GetObjectIndexAdmin(adminId: any) {
    return this.Lecturer.findIndex((obj: any) => obj.adminId == adminId);
  }
  DeleteModelAdmin(adminId: any,content: any) {

    let index = this.GetObjectIndexAdmin(adminId);
    this.adminId = this.Lecturer[index].adminId;
    this.modalObj.OpenModel(content, this.modalObj.Get_Medium());
  }

  GetObjectIndexUser(userId: any) {
    return this.User.findIndex((obj: any) => obj.userId == userId);
  }

  DeleteModelUser(userId: any,content: any) {
  
    let index = this.GetObjectIndexUser(userId);
    this.userId = this.User[index].userId;
    this.modalObj.OpenModel(content, this.modalObj.Get_Medium());
  }
  public OpenModel(fullName:any,email:any,genderr:any,address:any,password:any,telephoneNumber:any,content: any) {
    this.fullName=fullName;
    this.email=email;
    this.genderr=genderr;
    this.address=address;
    this.password=password;
    this.telephoneNumber=telephoneNumber;
    this.modalObj.OpenModel(content, this.modalObj.Get_Medium());
  }

  public OpenModelForUser(fullName:any,email:any,genderr:any,address:any,password:any,telephoneNumber:any,batchforUser:any,content: any) {
    this.fullName=fullName;
    this.email=email;
    this.genderr=genderr;
    this.address=address;
    this.password=password;
    this.telephoneNumber=telephoneNumber;
    this.batchforUser=batchforUser;
    this.modalObj.OpenModel(content, this.modalObj.Get_Medium());
  }
}

