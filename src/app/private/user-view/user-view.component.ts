import { Component, inject, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ProviderService } from '../../services/provider.service';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, RouterLink, MatIcon],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss'
})
export class UserViewComponent {
  // Define las columnas a mostrar en la tabla
displayedColumns: string[] = ['name', 'phone', 'rol'];

// Crea una instancia de MatTableDataSource que manejará los datos de la tabla
dataSource!: MatTableDataSource<any>;

// Inyección del servicio ProviderService para realizar solicitudes a la API
private _provider: ProviderService = inject(ProviderService);

// Referencia a los componentes de paginación y ordenación de la tabla
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

// Opciones de roles disponibles para los usuarios
roles = [
  { name: 'admin', value: 0 },
  { name: 'cajero', value: 1 },
  { name: 'cocinero', value: 2 },
  { name: 'cliente', value: 3 },
];

// Método asíncrono que se ejecuta después de que la vista se ha inicializado
async ngAfterViewInit() {
  // Solicita la lista de usuarios desde el servidor
  var users: any[] = await this._provider.request('GET', 'user/viewUsers');
  console.log(users);

  // Inicializa la fuente de datos de la tabla con los usuarios obtenidos
  this.dataSource = new MatTableDataSource(users);

  // Asocia el paginador y el ordenado con la fuente de datos
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

// Método para aplicar un filtro a los datos de la tabla
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  // Si hay paginador, vuelve a la primera página después de aplicar el filtro
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

// Método para mapear el valor del rol a su nombre correspondiente
mapRol(id: number) {
  return this.roles.find((rol: any) => rol.value == id)!.name;
}
}
