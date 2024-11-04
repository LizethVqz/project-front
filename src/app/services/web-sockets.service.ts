//Impotacion de modulos necesarios para el componente
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketsService {
  //Definicion de un variable publica inicializando el status del socket en falso
  public socketStatus = false;
  //Definicion de una variable privada guardando la ruta del socket
  private socket = io('http://localhost:3000/');

  //Funcion para la revision del socket y cambiando de estado la variable publica
  checkStatus(){
    this.socket.on('connect', () =>{
      console.log('conectado');
      this.socketStatus = true;
    });
    this.socket.on('disconnect', () =>{
      console.log('desconectado');
      this.socketStatus = false;
      
    })
  }
  //Funcion para escuchar lo que el socket esta emitiendo
  listen(evento: string): Observable<any>{
  // Retorna un nuevo Observable
    return new Observable ((observer) =>{
    // Suscribe al evento del socket, escuchando el evento especificado
      this.socket.on(evento, (message) =>{
      // Emite el mensaje recibido a los suscriptores del Observable
        observer.next(message);
      })
    })
  }

  //Inyeccion de la dependecia HTTPClient
  private _http: HttpClient = inject(HttpClient);

  //Funcion que crea y devuelve una promesa para la solicitud HTTP
  async request<T>(route: string, data?: any){
    return new Promise<T>((resolve, reject) =>
      this._http
         .request<any>('POST', 'http://localhost:3000/socket/'+route, {
            body: data,
         })
         .subscribe((response: any) => {
          resolve(response);
           /* console.log(response);
           
            // Resuelve la promesa con los datos de la respuesta si no hay errores
            if (!response) resolve(response);
            // Rechaza la promesa con el error si se encuentra un error en la respuesta
            else reject(response); */
         })
      );
}

}
