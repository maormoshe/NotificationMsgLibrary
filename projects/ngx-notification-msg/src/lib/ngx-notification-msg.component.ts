import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'ngx-notification-msg',
    templateUrl: './ngx-notification-msg.html',
    styleUrls: ['./ngx-notification-msg.less']
})
export class NgxNotificationMsgComponent implements OnInit, AfterViewInit {
    private static readonly DELAY_ON_CLICK = 400;

    @Input() status: NgxNotificationStatusMsg = NgxNotificationStatusMsg.NONE;
    @Input() direction: NgxNotificationDirection = NgxNotificationDirection.TOP;
    @Input() displayProgressBar = true;
    @Input() displayIcon = true;
    @Input() header: string;

    @Input()
    set messages(messages: string[]) {
        this.msgs = [...messages];
    }

    @Input() delay = 3000;
    @Input() closeable = true;
    @Input() index: number;

    @Output() destroy: EventEmitter<any> = new EventEmitter();

    componentState: NgxNotificationMsgComponentState = NgxNotificationMsgComponentState.CLOSE;
    componentStates = NgxNotificationMsgComponentState;
    statusToClass = {
        [NgxNotificationStatusMsg.NONE]: '',
        [NgxNotificationStatusMsg.INFO]: '#0067FF',
        [NgxNotificationStatusMsg.FAILURE]: '#FE355A',
        [NgxNotificationStatusMsg.SUCCESS]: '#00CC69'
    };
    msgs: string[] = [];

    private readonly NONE = 'NONE';
    private closeTimeout;
    private destroyTimeout;
    private referencePointTimestamp;
    private mouseEnterTimestamp;

    constructor(private readonly cd: ChangeDetectorRef,
                private readonly element: ElementRef) {
    }

    ngOnInit(): void {
        this.init();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.componentState = NgxNotificationMsgComponentState.OPEN;
            this.cd.markForCheck();
        });
    }

    isNotificationMsgOpened(): boolean {
        return this.componentState === this.componentStates.OPEN;
    }

    isProgressBarDisplayed(): boolean {
        return this.status !== this.NONE && this.displayProgressBar;
    }

    isIconDisplayed(): boolean {
        return this.status !== this.NONE && this.displayIcon;
    }

    getPosition(): INgxNotificationPosition {
        return {
            ...this.getDefaultPosition(),
            ...(this.componentState === this.componentStates.OPEN && this.getDynamicPosition())
        };
    }

    mouseEnter(): void {
        this.mouseEnterTimestamp = performance.now();

        clearTimeout(this.closeTimeout);
        clearTimeout(this.destroyTimeout);
    }

    mouseLeave(): void {
        const timestampGap = this.mouseEnterTimestamp - this.referencePointTimestamp;

        this.autoSelfDestroy(this.delay - timestampGap);
        this.referencePointTimestamp = performance.now() - timestampGap;
    }

    close(): void {
        this.componentState = NgxNotificationMsgComponentState.CLOSE;

        setTimeout(() => {
            this.destroy.emit();
        }, NgxNotificationMsgComponent.DELAY_ON_CLICK);
    }

    private init(): void {
        this.referencePointTimestamp = performance.now();
        this.initTheme();
        this.autoSelfDestroy(this.delay);
    }

    private initTheme(): void {
        this.element.nativeElement.style.setProperty('--ngx-notification-msg-delay', `${this.delay}ms`);
        this.element.nativeElement.style.setProperty('--ngx-notification-msg-color', this.statusToClass[this.status]);
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

    private autoSelfDestroy(delay: number): void {
        this.closeTimeout = setTimeout(() => {
            this.componentState = NgxNotificationMsgComponentState.CLOSE;
            this.cd.markForCheck();
        }, delay);

        this.destroyTimeout = setTimeout(() => {
            this.destroy.emit();
        }, delay + NgxNotificationMsgComponent.DELAY_ON_CLICK);
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
    messages: string[];
    delay?: number;
    displayIcon?: boolean;
    displayProgressBar?: boolean;
    closeable?: boolean;
}
