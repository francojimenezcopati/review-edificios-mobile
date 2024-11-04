import { Component, inject, Input, OnInit } from '@angular/core';
import { Photo } from 'src/app/services/photo.interfaces';

import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';

import { addIcons } from 'ionicons';
import {
    heart,
    heartOutline,
    thumbsDown,
    thumbsDownOutline,
} from 'ionicons/icons';

@Component({
    selector: 'app-image-card',
    standalone: true,
    templateUrl: './image-card.component.html',
    styleUrls: ['./image-card.component.scss'],
    imports: [IonButton, IonIcon],
})
export class ImageCardComponent {
    authService = inject(AuthService);

    protected type: 'ugly' | 'nice' = localStorage.getItem('type') as
        | 'ugly'
        | 'nice';

    @Input() image!: Photo;
    @Input() vote!: any;
    @Input() unvote!: any;

    constructor() {
        addIcons({ heart, heartOutline, thumbsDown, thumbsDownOutline });
    }
}
