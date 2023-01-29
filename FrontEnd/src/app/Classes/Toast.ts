//Toast Library
import { ToastrService } from 'ngx-toastr';

export class Toast{
    private submitMessage: string = "Submitting! Please wait for a while";

    constructor(private toastr: ToastrService){}
    
    public ToastWait() {
        let toast = this.toastr.info('', this.submitMessage, {
          disableTimeOut: true
        });
    
        return toast.toastId;
    }

    public ToastManualClose(toastID: number) {
        this.toastr.remove(toastID);
    }
    
    public ToastSuccess(msg: string) {
        this.toastr.success('', msg);
    }
    
    public ToastError(msg: string) {
        this.toastr.error('', msg);
    }
}