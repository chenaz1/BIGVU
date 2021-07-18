import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {FrameComponent} from './frame/frame.component';
import {PageNotFoundComponent} from "../../../BIGVU/src/app/error-routing/not-found/not-found.component";

@NgModule({
  declarations: [
    AppComponent,
    FrameComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: '', redirectTo: '/white', pathMatch: 'full'
        // component: FrameComponent
      },
      {
        path: 'white',
        component: FrameComponent
      },
      {
        path: 'blue',
        component: FrameComponent
      },
      {
        path: '**',
        component: PageNotFoundComponent
      },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
