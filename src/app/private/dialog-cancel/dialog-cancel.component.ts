import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProviderService } from '../../services/provider.service';
import { WebSocketsService } from '../../services/web-sockets.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-dialog-cancel',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './dialog-cancel.component.html',
  styleUrl: './dialog-cancel.component.scss'
})
export class DialogCancelComponent {
private dialog: MatDialog = inject(MatDialog);
private _data = inject(MAT_DIALOG_DATA);
private _provider: ProviderService = inject(ProviderService);
private _wsService: WebSocketsService = inject(WebSocketsService);
private _snackBar: MatSnackBar = inject(MatSnackBar);
private _localStorage: LocalstorageService = inject(LocalstorageService);
async ngOnInit() {

  console.log(this._data);
}
async updateStatus() {
  if (this._wsService.socketStatus) {

    this.dialog.afterAllClosed.subscribe(
      await this._provider.request('PUT', 'order/updateStatus', {
        "status": 4,
        "idorder": this._data.idorder,
        "users_idusers": this._localStorage.getItem('user').idusers
      })
    );


    this._snackBar.open("Pedido actualizado a cancelada", "", {duration: 3000, verticalPosition: 'top'});


    let nStatus: object = {
      "idorder": this._data.idorder,
      "client": this._data.client,
      "total": this._data.total,
      "mes": this._data.mes,
      "comments": this._data.comments,
      "status": 4,
      "users_idusers": this._localStorage.getItem('user').iduser
    };

    console.log(nStatus);


    this._wsService.request('comandas', nStatus);
  }
}

}
