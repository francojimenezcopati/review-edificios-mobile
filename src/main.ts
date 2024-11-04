import { bootstrapApplication } from '@angular/platform-browser';
import {
    RouteReuseStrategy,
    provideRouter,
    withPreloading,
    PreloadAllModules,
} from '@angular/router';
import {
    IonicRouteStrategy,
    provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from './environments/environment';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

defineCustomElements(window);

bootstrapApplication(AppComponent, {
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideRouter(routes, withPreloading(PreloadAllModules)),

        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage()),

        { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },

        provideCharts(withDefaultRegisterables()),
    ],
});
