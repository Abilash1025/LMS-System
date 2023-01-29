import { Component, OnInit ,AfterViewInit} from '@angular/core';
import { ApiPaths } from 'src/app/Enums/API_Paths';
import { APIService } from 'src/app/Services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Toast } from 'src/app/Classes/Toast';
import { Storage } from 'src/app/Enums/Storage';

//Form Builder Class
import { FormBuilderValidater } from 'src/app/Classes/FormBuilderValidater';

class Form{
  public quotes:string;


  constructor(quotes:string) {
    this.quotes = quotes;

  } 
}

class feedback{
  public userName:any;
  public email:any;
  public feedback:any;


  constructor(userName:any,email:any,feedback:any) {
    this.userName = userName;
    this.email=email;
    this.feedback=feedback;

  } 
}


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements AfterViewInit {

  public feedbackForm:feedback=new feedback('','','');

  hourHandStyle :any; 
  minuteHandStyle :any; 
  secondHandStyle:any; 
  isRunning = true;
  timerId: any;

  date: Date | undefined;
  hour: number = 0;
  minute: number = 0;
  second: number = 0;

  public sampleForm!: FormGroup;
  public submitted = false;
  private toastObj: Toast = new Toast(this.toastr);
  public Quotes: Form[] = [];
  constructor(private apiService: APIService,private formBuilder: FormBuilder,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.GetQuotesAPI();
    this.InitializedFormBuilder();
  }
  InitializedFormBuilder(){
    this.sampleForm = this.formBuilder.group({
      Feedback: ['', Validators.required]
    });
  } 
  ResetForm(){
    this.sampleForm.reset();
    this.submitted = false;
  }


  get formControl() {
    return this.sampleForm.controls;
  }



  ngAfterViewInit() {
    this.timerId = this.getTime();
  }

  animateAnalogClock() {
    this.hourHandStyle = { transform: `translate3d(-50%, 0, 0) rotate(${(this.hour * 30) + (this.minute * 0.5) + (this.second * (0.5 / 60))}deg)` };
    
    this.minuteHandStyle = { transform: `translate3d(-50%, 0, 0) rotate(${(this.minute * 6) + (this.second * 0.1)}deg)` };
    
    this.secondHandStyle = { transform: `translate3d(-50%, 0, 0) rotate(${this.second * 6}deg)` };
  }

  getTime() {
    return setInterval(() => {
      this.date = new Date();
      this.hour = this.date.getHours();
      this.minute = this.date.getMinutes();
      this.second = this.date.getSeconds();

      this.animateAnalogClock();
    }, 1000);
  }

  format(num: number) {
    return (num + '').length === 1 ? '0' + num : num + '';
  }

  toggle() {
    if (this.isRunning) {
      clearInterval(this.timerId);
    } else { this.getTime(); }

    this.isRunning = !this.isRunning;
  }

  GetQuotesAPI() {
    this.apiService.GetRequest("" + ApiPaths.getQuotes).subscribe(response => {
      if (response.responseCode == 200) {
        console.log(response.data);
        this.Quotes = response.data;
      }
      else {
        console.log("Network error")
      }
    }, error => {
      console.log("Network error")
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.sampleForm.invalid) {
      return;
    }
    else {

      this.SubmitFormAPI();      
    }

  }
  SubmitFormAPI(){
    let toastID = this.toastObj.ToastWait();
    this.feedbackForm.userName=localStorage.getItem(Storage.BATCH);
    this.feedbackForm.email=localStorage.getItem(Storage.USERNAME);
    this.feedbackForm.feedback=this.sampleForm.value.Feedback;
  
  
    this.apiService.PostRequest("" + ApiPaths.addFeedback, this.feedbackForm).subscribe(response => {
      this.toastObj.ToastManualClose(toastID);
  
      if (response.responseCode == 200) {
        // reset form
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
