export class Pagination{
    private maximumItemsPerPage: number = 10;

    private pageNumbersArray: any;
    private pageActiveID: number = 1;
    private currentPage: number = 1;
    private maxPages: number = 0;

    constructor(){}

    public ChangePage(value: number) {
        //Change Current Page number
        this.currentPage += value;
        this.currentPage = this.currentPage > this.maxPages ? this.maxPages : this.currentPage;
        this.currentPage = this.currentPage < 1 ? 1 : this.currentPage;
    
        //Change current page color position
        if (!((this.pageActiveID == 1 && value == -1) || (this.pageActiveID == this.pageNumbersArray.length && value == 1))) {
          this.pageActiveID += value;
          this.pageActiveID = this.pageActiveID > this.pageNumbersArray.length ? this.pageNumbersArray.length : this.pageActiveID;
          this.pageActiveID = this.pageActiveID < 1 ? 1 : this.pageActiveID;
        }
        //Change pagination numbers array
        else {
          for (let i = 0; i < this.pageNumbersArray.length; i++) {
            this.pageNumbersArray[i] = this.pageNumbersArray[i] + value;
          }
        }
    }
    
    public SelectPage(value: number, activeIndex: any) {
        this.currentPage = value;
        this.pageActiveID = activeIndex;
    }
    
    public AdjustPageCountToDisplay() {
        if (this.maxPages >= 4) this.pageNumbersArray = [1, 2, 3, 4];
        else if (this.maxPages == 3) this.pageNumbersArray = [1, 2, 3];
        else if (this.maxPages == 2) this.pageNumbersArray = [1, 2];
        else if (this.maxPages == 1) this.pageNumbersArray = [1];
        else if (this.maxPages == 0) this.pageNumbersArray = [];
    }

    public CheckPageBoundryCondition(value: number){
        if ((this.currentPage == 1 && value == -1) || (this.currentPage == this.maxPages && value == 1)) return false;
        else return true;
    }

    public Set_MaxPages(maxPages: number){
        this.maxPages = maxPages;
    }

    public Get_MaxPages(){
        return this.maxPages;
    }

    public Get_PageActiveID(){
        return this.pageActiveID;
    }

    public Get_PageNumbersArray(){
        return this.pageNumbersArray;
    }

    public Get_CurrentPage(){
        return this.currentPage;
    }

    public Get_MaximumItemsPerPage(){
        return this.maximumItemsPerPage;
    }
}