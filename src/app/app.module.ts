import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {NgxNotificationMsgModule} from '../../projects/ngx-notification-msg/src/lib/ngx-notification-msg.module';
import {NgxNotificationMsgComponent} from '../../projects/ngx-notification-msg/src/lib/ngx-notification-msg.component';

@NgModule({
  entryComponents: [
    NgxNotificationMsgComponent
  ],
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxNotificationMsgModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
