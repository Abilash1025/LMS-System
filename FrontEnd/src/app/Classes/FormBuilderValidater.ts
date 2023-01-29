//FormBuilder
import {FormGroup} from '@angular/forms';

export class FormBuilderValidater{

    constructor(){}

    public SpaceValidation(controlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
    
            // return if another validator has already found an error on the matchingControl
            if (control.errors && !control.errors.emptySpace) return;
    
            if (control.value.trim().length == 0) control.setErrors({ emptySpace: true });
            else control.setErrors(null);
        }
    }

    public PhoneNumberValidation(controlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
    
            // return if another validator has already found an error on the matchingControl
            if (control.errors && !control.errors.mustMatchPattern) return;
    
            const pattern = /^(0|94|\+94|0094)[0-9]{9}$/;
    
            if (!pattern.test(control.value)) control.setErrors({ mustMatchPattern: true });
            else control.setErrors(null);
        }
    }

    public MustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
    
            // return if another validator has already found an error on the matchingControl
            if (matchingControl.errors && !matchingControl.errors.mustMatch) return;
    
            if (control.value !== matchingControl.value) matchingControl.setErrors({ mustMatch: true });
            else matchingControl.setErrors(null);
        }
    }
}