//Model Library
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

export class ModalBox{
    
    private modal_small: string = "sm";
    private modal_medium: string = "md";
    private modal_large: string = "lg";
    private modal_extra_large: string = "xl";

    constructor(private modalService: NgbModal){}

    public OpenModel(content: any, modelSize: string) {
        let closeResult: string = "";
    
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: modelSize }).result.then((result) => {
          closeResult = `Closed with: ${result}`;
        }, (reason) => {
          closeResult = `Dismissed ${this.GetDismissReason(reason)}`;
        });
    }

    public CloseModel(){
        this.modalService.dismissAll();
    }
    
    private GetDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) return 'By pressing ESC';
        else if (reason === ModalDismissReasons.BACKDROP_CLICK) return 'By clicking on a backdrop';
        else return `with: ${reason}`;
    }

    public Get_Small(){
        return this.modal_small;
    }

    public Get_Medium(){
        return this.modal_medium;
    }

    public Get_Large(){
        return this.modal_large;
    }

    public Get_Extra_Large(){
        return this.modal_extra_large;
    }
}