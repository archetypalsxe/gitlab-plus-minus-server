import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TokenInterceptor } from './token.interceptor';
import { AppComponent } from './app.component';
import { TokenStorage } from './token.storage';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {
           provide: HTTP_INTERCEPTORS,
           useClass: TokenInterceptor,
           multi: true
    },
    {
           provide: TokenStorage,
           useClass: TokenStorage,
           multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
