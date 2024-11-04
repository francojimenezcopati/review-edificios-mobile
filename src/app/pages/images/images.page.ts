import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonBackButton,
} from '@ionic/angular/standalone';
import { PhotoService } from 'src/app/services/photo.service';
import { Photo } from 'src/app/services/photo.interfaces';
import { ImageCardComponent } from 'src/app/components/image-card/image-card.component';
import { RouterLink } from '@angular/router';


@Component({
    selector: 'app-images',
    templateUrl: './images.page.html',
    styleUrls: ['./images.page.scss'],
    standalone: true,
    imports: [
        IonButtons,
        IonBackButton,
        IonHeader,
        IonTitle,
        IonToolbar,
        CommonModule,
        IonButton,
        FormsModule,
        ImageCardComponent,
		RouterLink
    ],
})
export class ImagesPage implements OnInit {
    photoService = inject(PhotoService);

    protected type: 'ugly' | 'nice' = localStorage.getItem('type') as
        | 'ugly'
        | 'nice';
    protected images: Photo[] = [];

    constructor() {}

    ngOnInit() {
        this.loadPhotos();

        this.vote = this.vote.bind(this);
        this.unvote = this.unvote.bind(this);
    }


    loadPhotos() {
        try {
            this.photoService.getPhotos(this.type).subscribe((images) => {
                this.images = images;
            });
        } catch (error) {
            console.error('Error loading photos:', error);
        }
    }

    async captureAndUpload() {
        try {
            const photoData = await this.photoService.takePhoto();
            const uploadedPhoto = await this.photoService.uploadPhoto(
                photoData,
                this.type
            );

            if (uploadedPhoto) {
                console.log('Photo uploaded successfully!');
                this.loadPhotos();
            } else {
                console.log('An error occured while uploading the photo');
            }
        } catch (error) {
            console.error('Error capturing/uploading photo:', error);
        }
    }

    async vote(photoId: string) {
        try {
            await this.photoService.votePhoto(photoId, this.type);
            console.log('Vote registered for:', photoId);
            this.loadPhotos();
        } catch (error) {
            console.error('Error voting for photo:', error);
        }
    }

    async unvote(photoId: string) {
        try {
            await this.photoService.unvotePhoto(photoId, this.type);
            console.log('Vote removed from:', photoId);
            this.loadPhotos();
        } catch (error) {
            console.error('Error unvoting for photo:', error);
        }
    }
}
