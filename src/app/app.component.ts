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
  public messages: any[] = ['Anyone with access can view your invited visitors.','Sample Message'];
  public message: string;
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

    constructor(private readonly ngxNotificationMsgService: NgxNotificationMsgService) {

    }

    ngOnInit(): void {
        this.inputsConfig = {
          header: 'Ops...',
          msg: this.messages,
            delay: 3000,
            displayIcon: true,
            displayProgressBar: true,
            closeable: true
        };
    }

  open(status: any): void {
    this.inputsConfig.msg = this.messages.length <= 1 ? this.messages[0].toString() : this.messages;
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
    this.messages.push(this.message);
    this.message = null;
  }
  DeleteMessage(message): void {
    this.messages = this.messages.filter(x => x !== message);
  }
}
