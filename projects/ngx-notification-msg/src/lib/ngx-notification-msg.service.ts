import {ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector} from '@angular/core';
import {INgxNotificationMsgConfig, NgxNotificationMsgComponent} from './ngx-notification-msg.component';

@Injectable({
    providedIn: 'root'
})
export class NgxNotificationMsgService {

    private readonly defaultElement: Element = document.querySelector('body');
    private appendElement: Element;

    constructor(private readonly componentFactoryResolver: ComponentFactoryResolver,
                private readonly appRef: ApplicationRef,
                private readonly injector: Injector) {
    }

    open(inputsConfig: INgxNotificationMsgConfig, element?: Element): void {
        this.appendElement = element ? element : this.defaultElement;
        this.appendComponent(inputsConfig);
    }

    private appendComponent(inputsConfig?: INgxNotificationMsgConfig): void {
        const childComponentRef = this.componentFactoryResolver
            .resolveComponentFactory(NgxNotificationMsgComponent)
            .create(this.injector);

        this.attachConfig(inputsConfig, childComponentRef);
        this.subscribeToComponentDestroyEvent(childComponentRef);
        this.appRef.attachView(childComponentRef.hostView);

        const childDomElem = (childComponentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        this.appendElement.appendChild(childDomElem);
    }

    private subscribeToComponentDestroyEvent(componentRef: ComponentRef<NgxNotificationMsgComponent>): void {
        const sub = componentRef.instance.destroy.subscribe(() => {
            this.destroy(componentRef);
            sub.unsubscribe();
        });
    }

    private attachConfig(inputsConfig: INgxNotificationMsgConfig, componentRef): void {
        Object.keys(inputsConfig).forEach(key => {
            componentRef.instance[key] = inputsConfig[key];
        });
    }

    private destroy(componentRef: ComponentRef<NgxNotificationMsgComponent>): void {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
    }
}
