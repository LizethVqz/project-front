import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  //Funcion para asignar en el localstorage una llave y su valor mediante data y convirtiendo esta data en formato JSON
  public async setItem(key:string, data:any){
      localStorage.setItem(key,JSON.stringify(data));
  }
  //Funcion para tomar valores del localstorage mediante una llave
  public getItem(key: string){
    return JSON.parse(localStorage.getItem(key) || 'null');
  }
  //Funcion para borrar el localstorage
  public clear(){
    localStorage.clear();
  }
}
