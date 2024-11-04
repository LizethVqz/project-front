import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import {MatTable, MatTableModule} from '@angular/material/table';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogModule,
} from '@angular/material/dialog';
import { ProviderService } from '../../services/provider.service';
import { DialogComponent } from '../dialog/dialog.component';
import { WebSocketsService } from '../../services/web-sockets.service';
import { MatDrawer } from '@angular/material/sidenav';
import { LocalstorageService } from '../../services/localstorage.service';
import { OrderDetailComponent } from '../order-detail/order-detail.component';

@Component({
  selector: 'app-chef-order-view',
  standalone: true,
  imports: [MatTableModule, MatDialogModule],
  templateUrl: './chef-order-view.component.html',
  styleUrl: './chef-order-view.component.scss'
})
export class ChefOrderViewComponent {
private _provider: ProviderService = inject(ProviderService);
private dialog: MatDialog = inject(MatDialog);
private _wsService: WebSocketsService = inject(WebSocketsService);
private _localStorage: LocalstorageService = inject(LocalstorageService);
@ViewChild('chefTable') chefTable!: MatTable<any>;
displayedColumns: string[] = ['client', 'comments', 'function'];
order: any[] = [];
eachOrderDetails = [];
orderExist: any[] = [];
async ngOnInit() {
  this.listenSocket();
  this.order = await this._provider.request('GET', 'order/viewOrders');
  
  this.orderExist = await this._provider.request('GET', 'order/lastOrder', {"iduser": this._localStorage.getItem('user').idusers});
  this._localStorage.setItem('lastOrder', this.orderExist[0]);
  
  console.log(this.orderExist); 
  if (this.orderExist?.[0]?.idorder) {
    this.dialog.open(OrderDetailComponent, {data: this._localStorage.getItem('lastOrder')});
  }
}
filterByStatus() { 
  return this.order.filter((eachOrder: any) => eachOrder.status == 0);
}
openConfirmDialog(data: string) {
  this.dialog.open(DialogComponent, {data: data});
}
listenSocket() {  
  this._wsService.listen('comanda').subscribe((data) => {
    console.log(data.idorder);     

    this.order = this.order.filter((item) => item.idorder != data.idorder);

    this.order.unshift(data);

    this.filterByStatus();
  });
}

}

