import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[show]'
})
export class ShowDirective {
  //Structural Directive
  rendered = false;
  @Input() set show(value:any){
    if(value && !this.rendered){
      this.container.createEmbeddedView(this.template)
      this.rendered = true;
    }else if(!value && this.rendered){
      this.container.clear();
      this.rendered = false;
    }
  }

  constructor(public template:TemplateRef<any>, public container:ViewContainerRef){}
}
