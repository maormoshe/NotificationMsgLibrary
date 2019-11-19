import {NgModule} from '@angular/core';
import {NgxNotificationMsgComponent} from './ngx-notification-msg.component';
import {CommonModule} from '@angular/common';

@NgModule({
    entryComponents: [NgxNotificationMsgComponent],
    declarations: [NgxNotificationMsgComponent],
    imports: [CommonModule],
    exports: [NgxNotificationMsgComponent]
})
export class NgxNotificationMsgModule {
}
