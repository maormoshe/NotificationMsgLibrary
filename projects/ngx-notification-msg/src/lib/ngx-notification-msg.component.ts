import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'ngx-notification-msg',
    templateUrl: './ngx-notification-msg.html',
    styleUrls: ['./ngx-notification-msg.less']
})
export class NgxNotificationMsgComponent implements OnInit, AfterViewInit {
    private static readonly DELAY_ON_CLICK = 400;

    @Input() status: NgxNotificationStatusMsg = NgxNotificationStatusMsg.NONE;
    @Input() direction: NgxNotificationDirection = NgxNotificationDirection.TOP;
    @Input() header: string;
    @Input() msg: string;
    @Input() delay = 3000;
    @Input() closeable = true;
    @Input() index: number;

    @Output() destroy: EventEmitter<any> = new EventEmitter();

    componentState: NgxNotificationMsgComponentState = NgxNotificationMsgComponentState.CLOSE;
    componentStates = NgxNotificationMsgComponentState;
    statusToClass = {
        [NgxNotificationStatusMsg.NONE]: 'ngx_notification-none-strip',
        [NgxNotificationStatusMsg.INFO]: 'ngx_notification-info-strip',
        [NgxNotificationStatusMsg.FAILURE]: 'ngx_notification-failure-strip',
        [NgxNotificationStatusMsg.SUCCESS]: 'ngx_notification-success-strip'
    };

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

    getPosition(): INgxNotificationPosition {
        return {
            ...this.getDefaultPosition(),
            ...(this.componentState === this.componentStates.OPEN && this.getDynamicPosition())
        };
    }

    private getDefaultPosition(): INgxNotificationPosition {
        switch (this.direction) {
            case NgxNotificationDirection.TOP:
                return {top: '0', right: '50%', transform: `translate(50%, -100%)`};
            case NgxNotificationDirection.TOP_RIGHT:
                return {top: '0', right: '20px', transform: `translateY(-100%)`};
            case NgxNotificationDirection.TOP_LEFT:
                return {top: '0', left: '20px', transform: `translateY(-100%)`};
            case NgxNotificationDirection.BOTTOM:
                return {bottom: '0', right: '50%', transform: `translateX(50%)`};
            case NgxNotificationDirection.BOTTOM_RIGHT:
                return {bottom: '0', right: '20px', transform: `translateY(100%)`};
            case NgxNotificationDirection.BOTTOM_LEFT:
                return {bottom: '0', left: '20px', transform: `translateY(100%)`};
        }
    }

    private getDynamicPosition(): INgxNotificationPosition {
        const top = `calc(${100 * this.index}% + ${20 * (this.index + 1)}px)`;
        const bottom = `calc(${-100 * (this.index)}% + ${-20 * (this.index + 1)}px)`;

        switch (this.direction) {
            case NgxNotificationDirection.TOP:
                return {transform: `translate(50%, ${top})`};
            case NgxNotificationDirection.TOP_RIGHT:
                return {transform: `translateY(${top})`};
            case NgxNotificationDirection.TOP_LEFT:
                return {transform: `translateY(${top})`};
            case NgxNotificationDirection.BOTTOM:
                return {transform: `translate(50%, ${bottom})`};
            case NgxNotificationDirection.BOTTOM_RIGHT:
                return {transform: `translateY(${bottom})`};
            case NgxNotificationDirection.BOTTOM_LEFT:
                return {transform: `translateY(${bottom})`};
        }
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

interface INgxNotificationPosition {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    transform: string;
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

export enum NgxNotificationDirection {
    TOP = 'TOP',
    TOP_RIGHT = 'TOP_RIGHT',
    TOP_LEFT = 'TOP_LEFT',
    BOTTOM = 'BOTTOM',
    BOTTOM_RIGHT = 'BOTTOM_RIGHT',
    BOTTOM_LEFT = 'BOTTOM_LEFT'
}

export interface INgxNotificationMsgConfig {
    status?: NgxNotificationStatusMsg;
    direction?: NgxNotificationDirection;
    header?: string;
    msg: string;
    delay?: number;
    closeable?: boolean;
}
