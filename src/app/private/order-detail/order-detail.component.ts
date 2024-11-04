import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProviderService } from '../../services/provider.service';
import { Router } from '@angular/router';
import { WebSocketsService } from '../../services/web-sockets.service';
import { LocalstorageService } from '../../services/localstorage.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
private _data = inject(MAT_DIALOG_DATA)
private _provider: ProviderService = inject(ProviderService)
public _router: Router = inject(Router)
private _wsService: WebSocketsService = inject(WebSocketsService)
private _localStorage: LocalstorageService = inject(LocalstorageService)
private _snackBar: MatSnackBar = inject(MatSnackBar)
orderDetails: any = [];
async ngOnInit() {
  console.log(this._data); 

  this.orderDetails = await this._provider.request('GET', 'order/viewOrder', { idorder: this._data.idorder });
  console.log(this.orderDetails)
}
async updateStatus() {
  await this._provider.request('PUT', 'order/updateStatus', { "status": 2, "idorder": this._data.idorder, "users_idusers": this._localStorage.getItem('user').idusers });

  this._snackBar.open("Pedido actualizado a orden lista", "", { duration: 3000, verticalPosition: 'top' });

  console.log(this._data); 

  let nStatus: object = {
    "idorder": this._data.idorder,
    "client": this._data.client,
    "total": this._data.total,
    "mes": this.orderDetails[0].mes,
    "comments": this._data.comments,
    "status": 2,
    "users_idusers": this._localStorage.getItem('user').idusers
  };
  console.log(nStatus); 

  await this._wsService.request('comandas', nStatus);
}

}
