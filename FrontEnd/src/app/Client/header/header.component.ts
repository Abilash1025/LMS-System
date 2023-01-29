import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { ApiPaths } from 'src/app/Enums/API_Paths';
import { APIService } from 'src/app/Services/api.service';

class Form{
  public image:any;


  constructor(image:string) {
    this.image=image;
    
  }
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() hrefID = new EventEmitter<string>();
  public Banner: Form[] = [];

  constructor(private apiService: APIService) { }
 
  ngOnInit(): void {
    this.GetAllBannerAPI();
  }

  getNavEmit(href:any){
    this.hrefID.emit(href);
  }

  GetAllBannerAPI() {
    this.apiService.GetRequest(ApiPaths.getHomeBanner).subscribe(response => {
      if (response.responseCode == 200) {
        console.log( response.data);
        this.Banner = response.data;
      }
      else { 
        console.log("Network error")
      }
    }, error => {
      console.log("Network error")
    });
  }
}
