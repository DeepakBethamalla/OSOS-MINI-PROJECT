import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { FormControl, FormGroup,Validators } from '@angular/forms'
import { CookieService } from 'ngx-cookie-service'
 


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  tabledata:any = []
  viewtype:number =0
  selectedData:any={}
  AddForm:any= FormGroup
  constructor(private http_Service:HttpClient,
  private cookie_Service:  CookieService) { }

  ngOnInit(): void {
    this.AddForm = new FormGroup({
      title: new FormControl(null,[Validators.required]),
      body: new FormControl(null,[Validators.required])
    })
    if(this.cookie_Service.check('tabledata')){
      this.tabledata =JSON.parse(this.cookie_Service.get('tabledata')) 
      if (this.tabledata.length > 0) {
        this.onSelect(1, this.tabledata[0])
      }
    }else {
      this.getTableData()
    }
   
   
    console.log(this.tabledata[this.tabledata.length -1])
  }
  getTableData() {
  this.http_Service.get('https://jsonplaceholder.typicode.com/posts').subscribe((data:any)=>{
    let datareceived = data
    let latestData = datareceived.slice(0,8)
   this.cookie_Service.set("tabledata",JSON.stringify(latestData))
  //  if(this.cookie_Service.check('tabledata')){
  //   this.tabledata = JSON.parse(this.cookie_Service.get('tabledata'))
  //  }
  
  
  })
}
  onSelect(type: number, data?: any) {

    this.viewtype = type
    if (type == 1) {
      this.selectedData = data;
    }

  }

  onDelete(selectedData: any) {
    const position = this.tabledata.findIndex((data: any) => data.id == selectedData.id)
    this.tabledata.splice(position, 1)
    this.selectedData = this.tabledata[0]
    console.log(this.tabledata)
  }
  onCancel() {
    this.AddForm.reset()
    this.viewtype = 1
  }
  onAddData() {
    if(this.AddForm.valid){
      let body = {
        id:this.tabledata[this.tabledata.length -1].id+1,
         title:this.AddForm.value.title,
         body:this.AddForm.value.body,
         Imageurl:''
       }
       this.tabledata.push(body)
       this.cookie_Service.set("tabledata", JSON.stringify(this.tabledata) )
       this.onCancel()
    }
    

  }

  
 
}
