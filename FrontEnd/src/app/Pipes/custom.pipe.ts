import {Pipe, PipeTransform} from '@angular/core';

// Pure pipe triggers only when data changes
@Pipe({
  name: 'append'
})
export class AppendPipe implements  PipeTransform{
  transform(value: any, appendText:any) {
    return 'Hello ' + appendText + value;
  }
}

@Pipe({
  name: 'filter',
  //This is used for impure pipe
   /*pure: false*/
})
export class FilterPipe implements  PipeTransform{
  transform(value: any[],field:string, filterValue:string) {
    if(value && value.length > 0){
      return value.filter(x => x[field] == filterValue);
    }
    else{
      return [];
    }

  }
}




