import { Routes } from "@angular/router";
import { ListPageComponent } from "./presentation/pages/list-page/list-page.component";
import { UpsertPageComponent } from "./presentation/pages/upsert-page/upsert-page.component";

export const FINANCIAL_PRODUCTS_ROUTES: Routes = [
    {
        path: '',
        component: ListPageComponent
    },
    {
        path: 'add',
        component: UpsertPageComponent
    },
    {
        path: 'edit/:id',
        component: UpsertPageComponent
    }
];