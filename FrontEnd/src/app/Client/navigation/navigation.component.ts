import { Component, EventEmitter, OnInit , Output} from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  private navInit: boolean = true;

  @Output() hrefID = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {
    var btnEl = document.getElementById('btn');
    if(btnEl){
      btnEl.addEventListener('click', function() {
        if (this.className == 'displayCollapse on') this.classList.remove('on');
        else this.classList.add('on');
      });
    }

    window.addEventListener("scroll", function() {
      var header = document.getElementById('nav');
      
      if(header){
        if(window.scrollY > 50){
          header.classList.remove('navBg')
          header.classList.add('sticky')
        }
        else{
          header.classList.remove('sticky')
          header.classList.add('navBg')
        }
      }
    })
  }

  OpenMobileNavigation() {
    this.navInit = !this.navInit;

    var collapseEl = document.getElementById('collapseBtn');
    if(collapseEl){
      //Close Side Nav Scroll
      if(this.navInit){
        collapseEl.classList.remove('hideElement', 'rotateToClose');
        collapseEl.classList.add('navInitAnim', 'rotateToOpen');
      }
      //Open Side Nav Scroll
      else{
        collapseEl.classList.remove('navInitAnim', 'rotateToOpen', 'hide-minus');
        collapseEl.classList.add('hideElement', 'rotateToClose', 'hide-bar');
      }
    }
  }

  SelectNavigation(href: string){
    this.hrefID.emit(href);
  }
}
