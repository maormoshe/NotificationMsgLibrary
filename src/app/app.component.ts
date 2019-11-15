import {Component} from '@angular/core';
import {NgxNotificationMsgService} from '../../projects/ngx-notification-msg/src/lib/ngx-notification-msg.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {
    header = 'Ops...';
    msg = 'Anyone with access can view your invited visitors.';

    constructor(private readonly ngxNotificationMsgService: NgxNotificationMsgService) {

    }

    open(status: any): void {
        this.ngxNotificationMsgService.open({
            status,
            header: this.header,
            msg: this.msg
        });
    }
}
