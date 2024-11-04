import { Component, inject, OnInit } from '@angular/core';
import {
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonBackButton,
} from '@ionic/angular/standalone';
import { Chart } from 'chart.js/auto';
import { BaseChartDirective } from 'ng2-charts';
import { Photo } from 'src/app/services/photo.interfaces';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
    selector: 'app-graphic',
    templateUrl: './graphic.page.html',
    styleUrls: ['./graphic.page.scss'],
    standalone: true,
    imports: [
        IonHeader,
        IonTitle,
        IonToolbar,
        IonButtons,
        IonButton,
        IonBackButton,
        BaseChartDirective,
    ],
})
export class GraphicPage implements OnInit {
    private photoService = inject(PhotoService);

    protected type: 'ugly' | 'nice' = localStorage.getItem('type') as
        | 'ugly'
        | 'nice';

    protected images: Photo[] = [];

    constructor() {}

    ngOnInit() {
        this.photoService.getPhotos(this.type).subscribe((images) => {
            const data = images.filter((image) => image.votes > 0);

            new Chart(
                document.getElementById('graphic')! as HTMLCanvasElement,
                {
                    type: this.type === 'ugly' ? 'bar' : 'pie',
                    options: {
                        scales:
                            this.type === 'ugly'
                                ? {
                                      y: {
                                          beginAtZero: true,
                                          ticks: {
                                              // Muestra solo números enteros en la escala Y
                                              callback: function (value) {
                                                  return Number.isInteger(value)
                                                      ? value
                                                      : '';
                                              },
                                              stepSize: 1,
                                          },
                                      },
                                      x: {
                                          ticks: {
                                              display: false, // Desactivar el texto del eje X
                                          },
                                      },
                                  }
                                : {},
                        plugins: {
                            legend: {
                                display: false,
                            },
                        },
                    },
                    data: {
                        labels: data.map(
                            (image) =>
                                image.username +
                                ` el ${image.createdAt.getDate()}/${
                                    image.createdAt.getMonth() + 1
                                }/${image.createdAt.getFullYear()}`
                        ),
                        datasets: [
                            {
                                label:
                                    this.type === 'ugly' ? 'Dislikes' : 'Likes',
                                data: data.map((image) => image.votes),
                            },
                        ],
                    },
                }
            );
        });
    }
}
