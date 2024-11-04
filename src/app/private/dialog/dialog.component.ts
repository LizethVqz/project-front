import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { ProviderService } from '../../services/provider.service';
import { WebSocketsService } from '../../services/web-sockets.service';
import { LocalstorageService } from '../../services/localstorage.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
private dialog: MatDialog = inject(MatDialog);
private _data = inject(MAT_DIALOG_DATA);
private _provider: ProviderService = inject(ProviderService);
private _wsService: WebSocketsService = inject(WebSocketsService);
private _localStorage: LocalstorageService = inject(LocalstorageService);
private _snackBar: MatSnackBar = inject(MatSnackBar);
async openOrderDetails() {
  this.dialog.afterAllClosed.subscribe(
    await this._provider.request('PUT', 'order/updateStatus', {
      "status": 1,
      "idorder": this._data.idorder,
      "users_idusers": this._localStorage.getItem('user').idusers
    })
  );

  this._snackBar.open("Pedido actualizado a en proceso", "", {duration: 3000, verticalPosition: 'top'});

  this.dialog.open(OrderDetailComponent, {data: this._data});

  let nStatus: object = {
    "idorder": this._data.idorder,
    "client": this._data.client,
    "total": this._data.total,
    "mes": this._data.mes,
    "comments": this._data.comments,
    "status": 1,
    "users_idusers": this._localStorage.getItem('user').idusers
  };
  console.error(nStatus);
  

  await this._wsService.request('comandas', nStatus);
}

  
}
