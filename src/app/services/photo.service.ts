import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Timestamp } from '@angular/fire/firestore';

import { Photo, PhotoFromFirestore } from './photo.interfaces';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class PhotoService {
    private firestore = inject(AngularFirestore);
    private storage = inject(AngularFireStorage);
    private authService = inject(AuthService);

    constructor() {}

    async takePhoto(): Promise<string> {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera,
        });
        return `data:image/jpeg;base64,${image.base64String}`;
    }

    async uploadPhoto(
        photoData: string,
        type: 'nice' | 'ugly'
    ): Promise<boolean> {
        const user = this.authService.currentUserSig();
        if (!user) {
            throw new Error('User not logged in');
        }
        try {
            const fileName = `${new Date().getTime()}_${user.displayName}.jpg`;
            const filePath = `photos/${type}/${fileName}`;
            const fileRef = this.storage.ref(filePath);

            // Convert base64 to blob
            const response = await fetch(photoData);
            const blob = await response.blob();

            // Upload the photo to Firebase Storage
            await this.storage.upload(filePath, blob);

            // Get the download URL
            const url = await fileRef.getDownloadURL().toPromise();

            // Create the photo object
            const newPhoto: PhotoFromFirestore = {
                id: this.firestore.createId(),
                url: url,
                type: type,
                username: user.displayName!,
                votes: 0,
                usersVoted: [],
                createdAt: Timestamp.now(),
            };

            // Add the photo to Firestore
            await this.firestore
                .collection<PhotoFromFirestore>(`photos-${type}`)
                .doc(newPhoto.id)
                .set(newPhoto);

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public getPhotos(type: 'nice' | 'ugly') {
        return this.firestore
            .collection(`photos-${type}`)
            .get()
            .pipe(
                map((photosFromDB) => {
                    const photos = photosFromDB.docs.map((photo) => {
                        const photoObj = photo.data() as PhotoFromFirestore;
                        return {
                            ...photoObj,
                            createdAt: photoObj.createdAt.toDate(),
                        } as Photo;
                    });

                    return photos.sort(
                        (m, m2) =>
                            m2.createdAt.getTime() - m.createdAt.getTime()
                    );
                })
            );
    }

    async votePhoto(photoId: string, type: 'ugly' | 'nice'): Promise<void> {
        const photoRef = this.firestore
            .collection(`photos-${type}`)
            .doc(photoId);

        await this.firestore.firestore.runTransaction(async (transaction) => {
            const photoDoc = await transaction.get(photoRef.ref);
            if (!photoDoc.exists) {
                throw new Error('Document does not exist!');
            }
            const photo = photoDoc.data() as PhotoFromFirestore;

            if (
                photo.usersVoted.includes(
                    this.authService.currentUserSig()?.uid!
                )
            ) {
                throw new Error('You already liked this photo');
            }

            const newVotes = photo.votes + 1;
            const newUserVoted: string[] = photo.usersVoted;

            newUserVoted.push(this.authService.currentUserSig()?.uid!);
            transaction.update(photoRef.ref, {
                votes: newVotes,
                usersVoted: newUserVoted,
            });
        });
    }

    async unvotePhoto(photoId: string, type: 'ugly' | 'nice'): Promise<void> {
        const photoRef = this.firestore
            .collection(`photos-${type}`)
            .doc(photoId);

        await this.firestore.firestore.runTransaction(async (transaction) => {
            const photoDoc = await transaction.get(photoRef.ref);
            if (!photoDoc.exists) {
                throw new Error('Document does not exist!');
            }
            const photo = photoDoc.data() as PhotoFromFirestore;

            if (
                !photo.usersVoted.includes(
                    this.authService.currentUserSig()?.uid!
                )
            ) {
                throw new Error('You did not liked this photo yet');
            }

            const newVotes = photo.votes - 1;
            const newUserVoted: string[] = photo.usersVoted.filter(
                (uid) => uid !== this.authService.currentUserSig()?.uid!
            );

            transaction.update(photoRef.ref, {
                votes: newVotes,
                usersVoted: newUserVoted,
            });
        });
    }
}
