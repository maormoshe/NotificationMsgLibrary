import {ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector} from '@angular/core';
import {INgxNotificationMsgConfig, NgxNotificationMsgComponent} from './ngx-notification-msg.component';

@Injectable({
    providedIn: 'root'
})
export class NgxNotificationMsgService {

    private readonly defaultContainer = document.querySelector('body');
    private childComponentsRef: ChildComponentRef[] = [];
    private total = 0;

    constructor(private readonly componentFactoryResolver: ComponentFactoryResolver,
                private readonly appRef: ApplicationRef,
                private readonly injector: Injector) {
    }

    open(inputsConfig: INgxNotificationMsgConfig, element?: Element): void {
        const childComponentRef = this.appendChildComponentRef(element || this.defaultContainer);

        this.attachConfig(inputsConfig, childComponentRef);
        this.subscribeToComponentDestroyEvent(childComponentRef);
        this.childComponentsRef.push(childComponentRef);
        this.updateComponentsIndexesOnOpen(this.childComponentsRef, this.total);
        this.total++;
    }

    private appendChildComponentRef(container: Element): ChildComponentRef {
        const childComponentRef = this.componentFactoryResolver
            .resolveComponentFactory(NgxNotificationMsgComponent)
            .create(this.injector);
        const childDomElem = (childComponentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        this.appRef.attachView(childComponentRef.hostView);
        container.appendChild(childDomElem);

        return childComponentRef;
    }

    private attachConfig(inputsConfig: INgxNotificationMsgConfig, componentRef): void {
        Object.keys(inputsConfig).forEach(key => {
            componentRef.instance[key] = inputsConfig[key];
        });
    }

    private subscribeToComponentDestroyEvent(componentRef: ChildComponentRef): void {
        const sub = componentRef.instance.destroy.subscribe(() => {
            sub.unsubscribe();
            this.destroy(componentRef);
            this.removeChildComponentRef(componentRef);
            this.updateComponentsIndexesOnDestroy(this.childComponentsRef, --this.total);
        });
    }

    private destroy(componentRef: ChildComponentRef): void {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
    }

    private removeChildComponentRef(componentRef: ChildComponentRef): void {
        this.childComponentsRef = this.childComponentsRef.filter((_) => _ !== componentRef);
    }

    private updateComponentsIndexesOnDestroy(childComponentsRef: ChildComponentRef[], total: number): void {
        childComponentsRef.forEach(({instance}) => {
            instance.index = --total;
        });
    }

    private updateComponentsIndexesOnOpen(childComponentsRef: ChildComponentRef[], total: number): void {
        childComponentsRef.forEach(({instance}) => {
            instance.index = total--;
        });
    }
}

type ChildComponentRef = ComponentRef<NgxNotificationMsgComponent>;
