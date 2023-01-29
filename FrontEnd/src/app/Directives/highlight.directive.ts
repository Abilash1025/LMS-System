import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[highlight]'
})
export class HighlightDirective {
  //Attribute Directive
  @Input('highlight') highLightColor:any;

  constructor(public eleRef:ElementRef){}

  @HostListener('mouseover')
  mouseOn(){
    console.log(this.eleRef)
   this.eleRef.nativeElement.style.color = this.highLightColor;
  }

  @HostListener('mouseleave')
  mouseOff(){
    this.eleRef.nativeElement.style.color = 'black';
  }
}
