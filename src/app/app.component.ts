import {Component, OnInit} from '@angular/core';
import {NgxNotificationMsgService} from '../../projects/ngx-notification-msg/src/lib/ngx-notification-msg.service';
import {
    INgxNotificationMsgConfig,
    NgxNotificationDirection
} from '../../projects/ngx-notification-msg/src/lib/ngx-notification-msg.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    inputsConfig: INgxNotificationMsgConfig;
    directions: NgxNotificationDirection[] = [
        NgxNotificationDirection.TOP,
        NgxNotificationDirection.TOP_RIGHT,
        NgxNotificationDirection.BOTTOM_RIGHT,
        NgxNotificationDirection.BOTTOM,
        NgxNotificationDirection.BOTTOM_LEFT,
        NgxNotificationDirection.TOP_LEFT
    ];
    direction: NgxNotificationDirection = this.directions[0];
    message: string;

    constructor(private readonly ngxNotificationMsgService: NgxNotificationMsgService) {

    }

    ngOnInit(): void {
        this.inputsConfig = {
            header: 'Ops...',
            messages: ['Anyone with access can view your invited visitors.'],
            delay: 3000,
            displayIcon: true,
            displayProgressBar: true,
            closeable: true
        };
    }

    open(status: any): void {
        this.ngxNotificationMsgService.open({
            status,
            ...this.inputsConfig,
            direction: this.direction
        });
    }

    onDirectionChange(event: any): void {
        this.direction = event.target.value;
    }

    AddMessage(): void {
        this.inputsConfig.messages.push(this.message);
        this.message = '';
    }

    DeleteMessage(message): void {
        this.inputsConfig.messages = this.inputsConfig.messages.filter(_ => _ !== message);
    }
}
