import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'ngx-notification-msg',
    templateUrl: './ngx-notification-msg.html',
    styleUrls: ['./ngx-notification-msg.less']
})
export class NgxNotificationMsgComponent implements OnInit, AfterViewInit {
    private static readonly DELAY_ON_CLICK = 400;

    @Input() status: NgxNotificationStatusMsg = NgxNotificationStatusMsg.NONE;
    @Input() header: string;
    @Input() msg: string;
    @Input() delay = 3000;
    @Input() closeable = true;

    @Output() destroy: EventEmitter<any> = new EventEmitter();

    componentState: NgxNotificationMsgComponentState = NgxNotificationMsgComponentState.CLOSE;
    componentStates = NgxNotificationMsgComponentState;
    statuses = NgxNotificationStatusMsg;

    constructor(private readonly cd: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.autoSelfDestroy();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.componentState = NgxNotificationMsgComponentState.OPEN;
            this.cd.markForCheck();
        });
    }

    close(): void {
        this.componentState = NgxNotificationMsgComponentState.CLOSE;

        setTimeout(() => {
            this.destroy.emit();
        }, NgxNotificationMsgComponent.DELAY_ON_CLICK);
    }

    private autoSelfDestroy(): void {
        setTimeout(() => {
            this.componentState = NgxNotificationMsgComponentState.CLOSE;
            this.cd.markForCheck();
        }, this.delay);

        setTimeout(() => {
            this.destroy.emit();
        }, this.delay + NgxNotificationMsgComponent.DELAY_ON_CLICK);
    }
}

export enum NgxNotificationMsgComponentState {
    CLOSE = 'CLOSE',
    OPEN = 'OPEN'
}

export enum NgxNotificationStatusMsg {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    INFO = 'INFO',
    NONE = 'NONE'
}

export interface INgxNotificationMsgConfig {
    status?: NgxNotificationStatusMsg;
    header?: string;
    msg: string;
    delay?: number;
    closeable?: boolean;
}

