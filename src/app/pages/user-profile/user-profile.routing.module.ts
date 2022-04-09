import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SamplePage } from './sample/sample.page';
import { AuthGuard } from '../../_guards/auth/auth.guard';

const routes: Routes = [
  { path: '', component: SamplePage, pathMatch: 'full', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
