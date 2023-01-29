import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpParams } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSidenav } from "@angular/material/sidenav";
import { GlobalPasserService } from "../../Services/global-passer.service";
import { ToastrService } from "ngx-toastr";
import { APIService } from "../../Services/api.service";

//API Paths
import { ApiPaths } from 'src/app/Enums/API_Paths';

//Local Storage
import { Storage } from 'src/app/Enums/Storage';

//Toast Class
import { Toast } from 'src/app/Classes/Toast';

//Modal Class
import { ModalBox } from 'src/app/Classes/ModalBox';

//Form Builder Class
import { FormBuilderValidater } from 'src/app/Classes/FormBuilderValidater';

//Crypto Class
import { Cryptography } from 'src/app/Classes/Cryptography';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SubjectService } from "../../Services/subject.service";
import { stringify } from '@angular/compiler/src/util';

class Profile {
  public userId: any;
  public fullName: string;
  public gender: string;
  public address: string;
  public telephoneNumber: string;
  public image: any;

  constructor(userId: any, fullName: string, gender: string, address: string, telephoneNumber: string, image: any) {
    this.userId = userId;
    this.fullName = fullName;
    this.gender = gender;
    this.address = address;
    this.telephoneNumber = telephoneNumber;
    this.image = image;
  }
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  //Side Navigation
  @ViewChild('sidenav') sidenav: MatSidenav | undefined;
  @ViewChild('myInput') myInputVariable: ElementRef | undefined;
  @Output() loginStatus = new EventEmitter<boolean>();

  public navigationID: any;

  //#region Profile User Details
  public userRole: any = '';
  public userId: any = '';
  public userName: any = '';
  public imageSrc: string = '';
  public editImageSrc: string = '';
  private image: any;
  public profileHeader: string = "Edit Profile";
  public isProfile: boolean = true;
  public isPassword: boolean = false;
  public Gender: any = ['Male', 'Female', 'Prefer not to say'];
  public proPic:string='';
  public name:string='';
  //#endregion

  //#region FormBuilder
  private profile: Profile = <Profile>{};
  public profileEditForm!: FormGroup;
  public passwordEditForm!: FormGroup;
  public submitted = false;
  public fieldTextType: boolean = false;
  public confirmPasswordType: boolean = false;
  public isExpanded: boolean = true;
  public showSubmenu: boolean = false;
  public isShowing: boolean = false;
  public showSubSubMenu: boolean = false;
  //#endregion

  //#region Services
  private toastObj: Toast = new Toast(this.toastr);
  private modalObj: ModalBox = new ModalBox(this.modalService);
  public formBuilderValidatorObj: FormBuilderValidater = new FormBuilderValidater();
  public cryptoObj: Cryptography = new Cryptography();
  //#endregion

  //#region Subject(Observable)
  public fromTest2Sub = 0;
  public fromTest2BehObs = 0;
  public fromTest2ReplayObs = 0;
  //#endregion

  constructor(private modalService: NgbModal, private router: Router, private route: ActivatedRoute, private globalPasser: GlobalPasserService, private formBuilder: FormBuilder, private toastr: ToastrService, private apiService: APIService, private subService: SubjectService) {
    //Todo: Remove once project finished
    //Prefer use Subject as Observable than Subject

    //#region Service Subject
    this.subService.sub.subscribe(x => {
      console.log('From admin Top bar component sub', x)
      this.fromTest2Sub = x
    })
    //#endregion

    //#region Service Subject as Observable
    this.subService.obs$.subscribe(x => {
      console.log('From admin Top bar component obs', x)
      this.fromTest2Sub = x
    })
    //#endregion

    //#region Service Behavioural Observable
    this.subService.behObs$.subscribe(x => {
      console.log('From admin Top bar component behavioural Observable', x)
      this.fromTest2BehObs = x
    })
    //#endregion

    //#region Service Replay Observable
    this.subService.replayObs$.subscribe(x => {
      console.log('From admin Top bar component Replay Observable', x)
      this.fromTest2ReplayObs = x
    })
    //#endregion
  }

  ngOnInit(): void {
     this.ProfileInitAPI();

    this.globalPasser.currentnavigationID.subscribe(response => {
      this.navigationID = response;
    }, error => {
      this.navigationID = 0;
    });

    // this.router.navigate(
    //   [{ outlets: { user_dashboard_menu: ['dashboard'] } }],
    //   { relativeTo: this.route }
    // );

  }

  //#region Profile Edit Form
  InitializeProfileFormBuilder() {
    this.profileEditForm = this.formBuilder.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      image: ['']
    }, {
      validator: [
        this.formBuilderValidatorObj.SpaceValidation('name'),
        this.formBuilderValidatorObj.PhoneNumberValidation('phone')
      ]
    });

    this.ProfileInitAPI();
  }

  BindProfileForm(profile: any) {
    this.profileEditForm.setValue(
      {
        name: profile.fullName,
        gender: profile.gender,
        phone: profile.telephoneNumber,
        address: profile.address,
        image: ''
      }
    )
  }

  imageCloseClick() {
    let imgEl = this.profileEditForm.get('image');
    if (imgEl) {
      imgEl.reset();
      this.editImageSrc = '';
    }
  }

  get profileFormControl() {
    return this.profileEditForm.controls;
  }

  get gender() {
    return this.profileEditForm.get('gender');
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
  //#endregion

  //#region Password Change Form
  InitializePasswordFormBuilder() {
    this.passwordEditForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: [
          this.formBuilderValidatorObj.MustMatch('password', 'confirmPassword')
        ]
      });
  }

  get passwordFormControl() {
    return this.passwordEditForm.controls;
  }
  //#endregion

  //#region Function
  GetProfileDetails() {
    this.userRole = localStorage.getItem(Storage.ROLE);
    this.userId = localStorage.getItem(Storage.USERID);
    this.userName = localStorage.getItem(Storage.USERNAME)
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleConfirmPasswordType() {
    this.confirmPasswordType = !this.confirmPasswordType;
  }

  onFileChange(event: any) {
    this.image = event.target.files[0];
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {

        this.editImageSrc = reader.result as string;

        this.profileEditForm.patchValue({
          fileSource: reader.result
        });

      };

    }
  }

  onProfileSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileEditForm.invalid) {
      return;
    }
    else {
      this.ProfileEditAPI();
    }
  }

  onPasswordSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.passwordEditForm.invalid) {
      return;
    }
    else {
      this.PasswordEditAPI()
    }
  }
  GetNavigationDetails(image:any,name:any){

    this.proPic=image;
    this.name=name;
  }
  Signout() {
    localStorage.removeItem(Storage.USERID);
    localStorage.removeItem(Storage.ROLE);
    localStorage.removeItem(Storage.USERNAME);
    localStorage.removeItem(Storage.BATCH);
    this.modalObj.CloseModel();

    this.loginStatus.emit(false);
    location.reload();
  }

  Profile() {
    this.profileHeader = "Edit Profile"
    this.submitted = false;
    this.isPassword = false;
    this.isProfile = true;
  }

  Password() {
    this.profileHeader = "Edit Password"
    this.submitted = false;
    this.isPassword = true;
    this.isProfile = false;
  }
  //#endregion

  //#region APIs
  ProfileInitAPI() {
    this.GetProfileDetails();

    this.apiService.GetRequest(ApiPaths.getParticularUser + "/" + this.userId).subscribe(response => {
      if (response.responseCode == 200) {
        this.GetNavigationDetails(response.data[0].image,response.data[0].fullName)

        if (this.profileEditForm != undefined) {
          this.BindProfileForm(response.data[0]);
        }
      }
      else {
        console.log("Network error")
      }
    }, error => {
      console.log("Network error")
    });
  }

  ProfileEditAPI() {
    this.profile.userId = localStorage.getItem(Storage.USERID);
    this.profile.gender = this.profileEditForm.value.gender;
    this.profile.fullName = this.profileEditForm.value.name;
    this.profile.telephoneNumber = this.profileEditForm.value.phone;
    this.profile.address = this.profileEditForm.value.address;
    let toastID = this.toastObj.ToastWait();

    let formdata: FormData = new FormData();
    let stringData = JSON.stringify(this.profile);

    formdata.append('data', stringData);
    if (this.image) { formdata.append('file', this.image) };

    this.apiService.PutRequest_Multipart("" + ApiPaths.profileUpdateUser, formdata).subscribe(response => {
      this.toastObj.ToastManualClose(toastID);

      if (response.responseCode == 200) {

        this.toastObj.ToastSuccess(response.successMessage);
        this.modalObj.CloseModel();
        window.location.reload();
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

  PasswordEditAPI() {
    let toastID = this.toastObj.ToastWait();
    let formdata: FormData = new FormData();
    this.GetProfileDetails();
    
    formdata.append('username', this.userName);
    formdata.append('password', this.passwordEditForm.value.password);
  

    this.apiService.PutRequest_Multipart(ApiPaths.updateUserPassword, formdata).subscribe(response => {
      this.toastObj.ToastManualClose(toastID);
      if (response.responseCode == 200) {
        this.submitted = false;
        this.passwordEditForm.reset();
        this.toastObj.ToastSuccess(response.successMessage);
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
  //#endregion

  //#region Modal box
  profileEditModal(content: any) {
    this.InitializeProfileFormBuilder();
    this.InitializePasswordFormBuilder();
    this.editImageSrc = this.imageSrc;
    this.modalObj.OpenModel(content, this.modalObj.Get_Medium());
  }

  SignOutModal(content: any) {
    this.modalObj.OpenModel(content, this.modalObj.Get_Medium());
  }
  //#endregion
}

