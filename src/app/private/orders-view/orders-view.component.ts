import { Component, inject } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { ProviderService } from '../../services/provider.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogComponent } from '../dialog/dialog.component';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { DialogCompleteComponent } from '../dialog-complete/dialog-complete.component';
import { DialogCancelComponent } from '../dialog-cancel/dialog-cancel.component';
import { WebSocketsService } from '../../services/web-sockets.service';

@Component({
  selector: 'app-orders-view',
  standalone: true,
  imports: [MatTabsModule, MatDialogModule, MatTableModule],
  templateUrl: './orders-view.component.html',
  styleUrl: './orders-view.component.scss'
})
export class OrdersViewComponent {

private _provider: ProviderService = inject(ProviderService);
private dialog: MatDialog = inject(MatDialog);
private _wsService: WebSocketsService = inject(WebSocketsService);

order: any[] = []; 

status = [
  { name: "Activas", value: 0 },
  { name: "En proceso", value: 1 },
  { name: "Ordenes Listas", value: 2 },
  { name: "Completadas", value: 3 },
  { name: "Canceladas", value: 4 }
];

displayedColumns = ['client', 'total', 'comments', 'function'];

async ngOnInit() {

  this.order = await this._provider.request('GET', 'order/viewOrders');
  

  this.listenSocket();
}

filterByStatus(status: number) {
  return this.order.filter((eachOrder: any) => eachOrder.status == status);
}

openOrderDetailDialog(idorder: string) {
  this.dialog.open(OrderDetailComponent, { data: idorder });
}

openConfirmDialog(data: string) {
  this.dialog.open(DialogCompleteComponent, { data: data });
  console.log(data);
}

openCancelDialog(data: any) {
  this.dialog.open(DialogCancelComponent, { data: data });
}

listenSocket() {
  this._wsService.listen('comanda').subscribe((data) => {
    console.log(data);
    
  
    this.order = this.order.filter((item) => item.idorder != data.idorder);
    this.order.unshift(data);
    
  
    this.filterByStatus(data.status);
  });
}

}
