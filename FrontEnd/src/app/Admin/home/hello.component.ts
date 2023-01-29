import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'hello',
  template: '<h1 (click)="change()">Hello {{name}}</h1><h2 highlight="blue">My Count is : {{counter}}</h2>',
  styles: ['h1 {font-family:Lato}']
})
export class HelloComponent {
  @Input() name:string='';
  counter = 0;

  //#region HostBinding for property binding
  @HostBinding('style.color') color = 'black';
  change(){
    this.counter++;
    this.color = 'orange';
  }
  //#endregion
}

//Used for Dynamic Components
@Component({
  selector: 'hi',
  template: '<h1>Hi {{name}}</h1>',
  styles: ['h1 {font-family:Lato}']
})
export class HiComponent {
  @Input() name:string='';
}
