import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () =>
            import('./pages/home/home.page').then((m) => m.HomePage),
    },
    {
        path: 'images',
        children: [
            {
                path: 'nice',
                loadComponent: () =>
                    import('./pages/images/images.page').then(
                        (m) => m.ImagesPage
                    ),
            },
            {
                path: 'ugly',
                loadComponent: () =>
                    import('./pages/images/images.page').then(
                        (m) => m.ImagesPage
                    ),
            },
        ],
    },
    {
        path: 'graphic',
        loadComponent: () =>
            import('./pages/graphic/graphic.page').then((m) => m.GraphicPage),
    },
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        loadComponent: () =>
            import('./pages/auth/auth.page').then((m) => m.AuthPage),
    },
    {
        path: 'images',
        loadComponent: () =>
            import('./pages/images/images.page').then((m) => m.ImagesPage),
    },
    {
        path: 'graphic',
        loadComponent: () =>
            import('./pages/graphic/graphic.page').then((m) => m.GraphicPage),
    },
];
