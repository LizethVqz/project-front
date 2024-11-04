import { Component, inject } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CurrencyPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ContentObserver } from '@angular/cdk/observers';
import { ProviderService } from '../../services/provider.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { WebSocketsService } from '../../services/web-sockets.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { LocalstorageService } from '../../services/localstorage.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order-view',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatFormFieldModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './order-view.component.html',
  styleUrl: './order-view.component.scss',
})
export class OrderViewComponent {

private _provider: ProviderService = inject(ProviderService);
private _router: Router = inject(Router);
public _order: OrderService = inject(OrderService);
private _wsService: WebSocketsService = inject(WebSocketsService);
private _snackBar: MatSnackBar = inject(MatSnackBar);
private _localStorage: LocalstorageService = inject(LocalstorageService);

async ngOnInit() {

}

filterExtras(item: any, type: 0 | 1) {
  return item.not_ingredient.filter(
    (ingredient: any) => ingredient.type == type
  );
}

totalProducts() {
  return this.eachProduct()
    .value.map((product: any) => product.unit_price)
    .reduce((previous: number, current: number) => previous + current, 0);
}

totalExtras() {
  return this.eachProduct()
    .value.map((product: any) =>
      product.not_ingredient
        .map((ingredient: any) => ingredient.price)
        .reduce((previous: number, current: number) => previous + current, 0)
    )
    .reduce((previous: number, current: number) => previous + current, 0);
}

totalOrder() {
  this._order.formOrder.controls['total'].patchValue(this.totalProducts() + this.totalExtras());
  return this.totalProducts() + this.totalExtras();
}

radioForm() {
  return this._order.formOrder.controls['order_details'] as FormGroup;
}

eachProduct() {
  return this._order.formOrder.controls['order_details'] as FormArray;
}

selected(event: MatRadioChange) {
  this.eachProduct().controls.forEach((product: AbstractControl) => {
    const productAux: FormGroup = product as FormGroup;
    productAux.controls['order_type'].patchValue(event.value);
  });
}

async placeOrder() {
  console.log(this._order.formOrder.value);
  

  this._order.formOrder.controls['users_idusers'].patchValue(this._localStorage.getItem('user').idusers);


  if (this._order.formOrder.valid && this._wsService.socketStatus) {
    var data = await this._provider.request('POST', 'order/createOrder', this._order.formOrder.value);
    
    if (data) {
    
      await this._wsService.request('comandas', data);
      
    
      this._snackBar.open("Orden realizada", "", { duration: 3000, verticalPosition: 'top' });
      
    
      this._router.navigate(['private/orders-view']);
      
    
      this._order.formOrder.reset();
      while (this.orderDetailsArray().length !== 0) {
        this.orderDetailsArray().removeAt(0);
      }
    } else {
    
      this._snackBar.open("No se realizó la orden", "", { duration: 3000, verticalPosition: 'top' });
    }
  } else {
  
    this._snackBar.open("No es posible realizar la orden", "", { duration: 3000, verticalPosition: 'top' });
    
  
    document.querySelectorAll('.ng-invalid, .mat-mdc-radio-group.unselect').forEach((element: Element) => element.classList.add('invalid'));
  }
}

orderDetailsArray() {
  return this._order.formOrder.controls['order_details'] as FormArray;
}

deleteProduct(index: number) {
  this.eachProduct().removeAt(index);
}

}
