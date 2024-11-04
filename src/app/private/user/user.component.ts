import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProviderService } from '../../services/provider.service';
import { PrivateComponent } from '../private.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebSocketsService } from '../../services/web-sockets.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {

private _formbuilder: FormBuilder = inject(FormBuilder);
private _provider: ProviderService = inject(ProviderService);
private _snackBar: MatSnackBar = inject(MatSnackBar);
private _wsService: WebSocketsService = inject(WebSocketsService);
private _router: Router = inject(Router);
private _activedRouter: ActivatedRoute = inject(ActivatedRoute);

id: string = '';

roles = [
  { name: 'admin', value: 0 },
  { name: 'cajero', value: 1 },
  { name: 'cocinero', value: 2 },
  { name: 'cliente', value: 3 },
];

formulario = this._formbuilder.group({
  idusers: [null],
  name: [null, [Validators.required]],
  password: [null, [Validators.required]],
  phone: [null],
  rol: [null, Validators.required],
});

async ngOnInit() {

  if (this._router.url.includes('edit')) {
    this._activedRouter.params.subscribe(async (params: Params) => {
      this.id = params['id'];
      console.log(this.id);    
      var user: any = (await this._provider.request('GET', 'user/viewUser', {idusers: this.id}) as any)[0];
      console.log(user);    
      this.formulario.patchValue(user);
    });
  }
}

async save() {
  console.log(this.formulario.value);


  if (this._router.url.includes('edit')) {
    if (this.formulario.valid && this._wsService.socketStatus) {
      var data = await this._provider.request('PUT', 'user/updateUser', this.formulario.value);
      
      if (data) {
        await this._wsService.request('usuarios', data);
        this._snackBar.open('Usuario Actualizado', '', {duration: 3000, verticalPosition: 'top'});
        this._router.navigate(['private/user-view']);
        this.formulario.reset();
      } else {
        this._snackBar.open('No es posible actualizar el usuario', '', {duration: 3000, verticalPosition: 'top'});
      }
    } else {
      this._snackBar.open('No es posible actualizar el usuario', '', {duration: 3000, verticalPosition: 'top'});
      document.querySelectorAll('.ng-invalid, .mat-mdc-radio-group.unselect').forEach((element: Element) => element.classList.add('invalid'));
    }
  } else {
    if (this.formulario.valid && this._wsService.socketStatus) {
      var data = await this._provider.request('POST', 'auth/signup', this.formulario.value);
      
      if (data) {
        await this._wsService.request('usuarios', data);
        this._snackBar.open('Usuario Creado', '', {duration: 3000, verticalPosition: 'top'});
        this._router.navigate(['private/user-view']);
        this.formulario.reset();
      } else {
        this._snackBar.open('No es posible crear el usuario', '', {duration: 3000, verticalPosition: 'top'});
      }
    } else {
      this._snackBar.open('No es posible crear el usuario', '', {duration: 3000, verticalPosition: 'top'});
      document.querySelectorAll('.ng-invalid, .mat-mdc-radio-group.unselect').forEach((element: Element) => element.classList.add('invalid'));
    }
  }
}

async deleteUser() {
  if (this._wsService.socketStatus) {
    var data = await this._provider.request('DELETE', 'user/deleteUser', {idusers: this.id});
    
    if (data) {
      await this._wsService.request('usuarios', data);
      this._snackBar.open('Usuario Eliminado', '', {duration: 3000, verticalPosition: 'top'});
      this._router.navigate(['private/user-view']);
      this.formulario.reset();
    } else {
      this._snackBar.open('No es posible eliminar el usuario', '', {duration: 3000, verticalPosition: 'top'});
    }
  } else {
    this._snackBar.open('No es posible eliminar el usuario', '', {duration: 3000, verticalPosition: 'top'});
    document.querySelectorAll('.ng-invalid, .mat-mdc-radio-group.unselect').forEach((element: Element) => element.classList.add('invalid'));
  }
}

}
