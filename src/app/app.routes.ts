import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'products',
        loadChildren: () => import('./features/financial-products/financial-products.routes')
            .then(m => m.FINANCIAL_PRODUCTS_ROUTES)
    },
    {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'products'
    }
];
