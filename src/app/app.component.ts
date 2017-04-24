import { Component, OnInit, OnChanges } from '@angular/core';
import { ApiService } from '../shared/services/app.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges {
  title: string = 'YOUR SHOPPING BAG';
  total_qty: number;
  box: any;
  mydata: Array<any> = [];
  opened: boolean = false;
  directional: boolean = false;
  itemPrice: number = 0;
  totalItems: number = 0;

  total: Array<any> = [
    { title: "SUBTOTAL", value: 0, subText: "" },
    { title: "PROMOTION CODE JF10 APPLIED", value: 0, subText: "" },
    { title: "ESTIMATED SHIPPING*", value: 'FREE', subText: "You qualify for free shipping beacuse your order is over $50*" },
    { title: "ESTIMATED TOTAL", value: 0, subText: "Tax will be applied during checkout" }
  ];

  itemheader: Array<any> = [{
    items: 'ITEMS', size: 'SIZE', quantity: 'QTY', price: 'PRICE'
  }];

  constructor(private _apiService: ApiService) { }

  ngOnInit() {
    var localStoreData = localStorage.getItem("data");
    if (localStoreData !== undefined) {
      this.mydata = JSON.parse(localStoreData);
    } else {
      this.getDatafromUrl();
    }
    this.updateItems();
    // needs to update quantity on refresh
  }

  ngOnChanges() {
  }

  getDatafromUrl() {
    this._apiService.getData().subscribe(res => {
      this.mydata = res;
      for (var i = 0; i < res.length; i++) {
        res[i]['image'] = 'T' + (i + 1) + '.jpg';
      }
      this.totalPrice(res);
      localStorage.setItem("data", JSON.stringify(res)); 
    });
  }

  totalPrice(data) {
    let sub_total: number = 0;
    this.itemsPrice(data);
    sub_total = sub_total + this.itemPrice;
    this.total[0].value = sub_total.toFixed(2);
    this.total[3].value = sub_total.toFixed(2);
  }

  itemsPrice(data) {
    for (let i = 0; i < data.length; i++) {
      data[i].p_price = parseInt(data[i].p_price);
      this.itemPrice += data[i].p_price;
    }
    return this.itemPrice;
  }

  // modal functionality needs to be implemented
  modal() {
    this.opened = !this.opened;
  }

  editItem(item) {
    //needs to implement    
    //console.log(item);
  }

  remove(item) {
    this.mydata = this.mydata.filter((obj, index) => {
      if (obj.p_id !== item.p_id) {
        return obj;
      }
    });
    localStorage.setItem("data", JSON.stringify(this.mydata));
    this.updateItems();
  }

  updateItems() {
    var totalQuantity = 0;
    var totalprice = 0;
    var totalitemprice;
    this.totalItems = this.mydata.length;
    for (let i = 0; i < this.mydata.length; i++) {
      let totalquantity = parseInt(this.mydata[i].p_quantity);
      totalitemprice = parseInt(this.mydata[i].p_price);
      totalQuantity += totalquantity;
      if (totalquantity !== undefined)
        totalprice += totalquantity * totalitemprice;
    }
    this.total_qty = totalQuantity;
    this.total[0].value = totalprice.toFixed(2);
    this.total[3].value = totalprice.toFixed(2);
  }

  promoApply(promocode) {
    if (promocode === "JF10") {
      var curr_total: number = parseInt(this.total[0].value);
      if (this.total_qty === 3) {
        let discount: number = (curr_total * 5) / 100;
        let update_total: number = curr_total - discount;
        this.total[1].value = discount;
        this.total[3].value = update_total;
      }
      else if (this.total_qty > 3 && this.total_qty <= 6) {
        let discount: number = (curr_total * 10) / 100;
        let update_total: number = curr_total - discount;
        this.total[1].value = discount;
        this.total[3].value = update_total;
      }
      else if (this.total_qty > 10) {
        let discount: number = (curr_total * 25) / 100;
        let update_total: number = curr_total - discount;
        this.total[1].value = discount;
        this.total[3].value = update_total;
      }
    } else {
      alert("Entered code is invalid");
    }
  }
}
