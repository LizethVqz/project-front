import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LocalstorageService } from './localstorage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  //Inyeccion de dependencias necesarias
  private _http: HttpClient = inject(HttpClient);
  private _localstorage: LocalstorageService = inject(LocalstorageService);
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  
  //Lista de excepciones para los errores
  excep: any = {
    '001': 'Método de petición incorrecto',
    '002': 'Clase incorrecta',
    '003': 'Método inexistente',
    '006': 'Token no enviado',
    '007': 'Parámetros vacíos',
    // Login
    '004': 'El usuario no existe',
    '005': 'Credenciales inválidas',
  };
  //Metodo para realizar las solicitudes HTTP y devuelve una promesa que se resuelve o se rechaza
  //Como parametro se requiere un metodo (POST,GET,PUT,DELETE)
  //Un endpoint específico al que se enviará la solicitud, que se añade a la URL base.
  //Data, la informacion que se requiere para realizar la accion
  async request<T>(method: string, action: string, data?: any) {
    //Detecta el protocolo (http o https) en entornos del navegador. Si se ejecuta fuera del navegador (e.g., en Node.js), asigna 'http:' por defecto.
    const PROTOCOL = typeof window !== 'undefined' ? window.location.protocol : 'http:'; 
    //Detecta el dominio o hostname en entornos del navegador. Si se ejecuta fuera del navegador, asigna 'localhost' por defecto.
    const DOMINIO = typeof window !== 'undefined' ? window.location.hostname : 'localhost'; 
    //Puerto del servidor
    const ACCESS = '3000';
    //Define el servicio web específico. (No lo uso en este caso)
    //const WSERVICE = 'comandas/public';
    //Construye la URL base concatenando el protocolo, dominio y puerto
    let url = PROTOCOL + '//' + DOMINIO + ':' + ACCESS + '/';
    //console.log(url);
    //Retorna una nueva promesa
    return new Promise<T>((resolve, reject) =>
      this._http
        .request<any>(method, url + action, {
          body: method != 'GET' ? data : null,
          headers: this.headers(),
          params: method !== 'POST' ? this.params(data) : {},
        })
        .subscribe((response: any) => {
          // Resuelve la promesa con los datos de la respuesta si no hay errores
          if (!response.error) resolve(response.msg);
          // Rechaza la promesa con el error si se encuentra un error en la respuesta
          else {
            this._snackBar.open(this.excep[response.error_code], '', {duration: 3000});
            reject(response.msg);
          }
        })
    );
  }
  //Se definen los header el simple es estático y el authorization necesita un token
  headers() {
    return new HttpHeaders().set('simple','bb1557a2774351913c8557251ec2cbb4').set('authorization',this._localstorage.getItem('user') == null ? '':this._localstorage.getItem('user').token);
  }
  //Se convierten los parametros en formato JSON antes de ser incluidos en el solicitud
  params(params: any) {
    return new HttpParams().set('params', JSON.stringify(params));
  }
}
