import {Component, OnInit} from '@angular/core';
import {NgxNotificationMsgService} from '../../projects/ngx-notification-msg/src/lib/ngx-notification-msg.service';
import {INgxNotificationMsgConfig} from '../../projects/ngx-notification-msg/src/lib/ngx-notification-msg.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    inputsConfig: INgxNotificationMsgConfig;

    constructor(private readonly ngxNotificationMsgService: NgxNotificationMsgService) {

    }

    ngOnInit(): void {
        this.inputsConfig = {
            header: 'Ops...',
            msg: 'Anyone with access can view your invited visitors.',
            delay: 3000,
            closeable: true
        };
    }

    open(status: any): void {
        this.ngxNotificationMsgService.open({
            status,
            ...this.inputsConfig
        });
    }
}
