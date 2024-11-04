import { Injectable, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  //Dependencias necesarias en los modulos
  private _form_builder: FormBuilder = inject(FormBuilder);
  private _localstorage: LocalstorageService = inject(LocalstorageService);
  //Creacion de un formulario para las ordenes con los parametros necesarios, validamos los requeridos y tomamos valores del localstorage
  formOrder: FormGroup = this._form_builder.group({
    idorder: new FormControl(null),
    date: new FormControl(null),
    total: new FormControl(null, [Validators.required]),
    status: new FormControl(null),
    origin: new FormControl(null),
    comments: new FormControl(null),
    client: new FormControl(null, [Validators.required]),
    users_idusers: new FormControl(this._localstorage.getItem('user').idusers , [Validators.required]),
    order_details: new FormArray([], [Validators.required]),
    start_order: new FormControl(null),
    finish_order: new FormControl(null)
  });
  //Funcion para agregar los detalles de la orden dentro del formulario principal de la orden, con los parametros necesarios
  orderDetails(products_idproducts: string, price: number, name: string, name_category: string){
    const amount = this.formOrder.controls['order_details'].value.filter((product: any)=>product.products_idproducts==products_idproducts).length
    return this._form_builder.group({
      idorderdetail: new FormControl(null),
      name: new FormControl(name, [Validators.required]),
      amount: new FormControl(amount+1, [Validators.required]),
      unit_price: new FormControl(price, [Validators.required]),
      order_type: new FormControl(null, [Validators.required]),
      comments: new FormControl(null),
      order_idorder: new FormControl(null),
      products_idproducts: new FormControl(products_idproducts, [Validators.required]),
      not_ingredient: new FormArray([]),
      name_category: new FormControl(name_category, [Validators.required])
    })
  }
  //Funcion para agregar los ingredientes extras o las excepciones dentro del formulario de los detalles de la orden
  notIngredients(id_ingredient: string, type: 0 | 1, name:string, price:number){
      return this._form_builder.group({
      ingredients_idingredients: new FormControl(id_ingredient, [Validators.required]),
      order_details_idorderdetail: new FormControl(null),
      name: new FormControl(name, [Validators.required]),
      price: new FormControl(price, [Validators.required]),
      type: new FormControl(type, [Validators.required])
    })
  }
}
