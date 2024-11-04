import { Component, ViewChild, inject } from '@angular/core';
import { ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ProviderService } from '../../services/provider.service';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { WebSocketsService } from '../../services/web-sockets.service';


@Component({
  selector: 'app-dash-admin',
  standalone: true,
  imports: [BaseChartDirective, MatCardModule, MatButtonModule,MatListModule, MatDividerModule],
  templateUrl: './dash-admin.component.html',
  styleUrl: './dash-admin.component.scss'
})
export class DashAdminComponent {
private _provider: ProviderService = inject(ProviderService);
private _wsService: WebSocketsService = inject(WebSocketsService);
products: any = [];
clients: any = [];
avg: any = [];
total: any = [];
sales: any = [];
dataSales!: ChartData<'bar'>;
dataProduct!: ChartData<'bar'>;
dataClient!: ChartData<'bar'>;
totalSum: number = 0;
@ViewChild(BaseChartDirective) chartSales!: BaseChartDirective;
async ngOnInit() {
  this.Sales();
  this.bestSeller();
  this.bestClient();
  this.total = await this._provider.request('GET', 'graphics/totalSales');
  this.avg = await this._provider.request('GET', 'graphics/avgTime');
  this.listenGraphics();
}
async listenGraphics() {
  this._wsService.listen('grafica').subscribe((data) => {
    let btotal: number = parseInt(data.total ?? 0);
    let atotal: number = this.dataSales.datasets[0].data[data.mes - 1] as number ?? 0;
    this.dataSales.datasets[0].data[data.mes - 1] = btotal + atotal;
    this.total.total = parseInt(this.total.total) + data.total;
    console.log(data);
    
    this.chartSales.update();
  });
}
async Sales() {
  this.sales = await this._provider.request('GET', 'graphics/sales');
  this.dataSales = {
    labels: this.sales.labels,
    datasets: [
      {
        data: this.sales.data, 
        label: 'Total', 
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
      }
    ]
  };
}
async bestSeller() {
  this.products = await this._provider.request('GET', 'graphics/bestSeller', { mes: 5 });
  this.dataProduct = {
    labels: this.products.labels,
    datasets: [
      {
        data: this.products.data, 
        label: 'Cantidad', 
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)'
        ],
      }
    ]
  };
}
async bestClient() {
  this.clients = await this._provider.request('GET', 'graphics/bestClient');
  this.dataClient = {
    labels: this.clients.labels,
    datasets: [
      {
        data: this.clients.data, 
        label: 'No. de compras', 
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)'
        ],
      }
    ]
  };
}

}
