import { NgModule } from '@angular/core';
import {MetaModule} from './meta/meta.module';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { DetailViewComponent } from './detail-view/detail-view.component';




const routes: Routes = [

    {path:'', component:MetaModule},
    
    {path:'details', component:DetailViewComponent},
    
];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { } 
export const routingComponents = [DetailViewComponent, MetaModule];