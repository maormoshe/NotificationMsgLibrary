import {ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector} from '@angular/core';
import {INgxNotificationMsgConfig, NgxNotificationMsgComponent} from './ngx-notification-msg.component';

@Injectable({
    providedIn: 'root'
})
export class NgxNotificationMsgService {

    private readonly defaultContainer = document.querySelector('body');
    private readonly containerToChildComponentsRef = new Map<Element, ChildComponentRef[]>();

    constructor(private readonly componentFactoryResolver: ComponentFactoryResolver,
                private readonly appRef: ApplicationRef,
                private readonly injector: Injector) {
    }

    private static appendChildComponentRef(componentFactoryResolver: ComponentFactoryResolver,
                                           appRef: ApplicationRef,
                                           injector: Injector,
                                           container: Element): ChildComponentRef {
        const childComponentRef = componentFactoryResolver
            .resolveComponentFactory(NgxNotificationMsgComponent)
            .create(injector);
        const childDomElem = (childComponentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        appRef.attachView(childComponentRef.hostView);
        container.appendChild(childDomElem);

        return childComponentRef;
    }

    private static attachConfig(inputsConfig: INgxNotificationMsgConfig, componentRef): void {
        Object.keys(inputsConfig).forEach(key => {
            componentRef.instance[key] = inputsConfig[key];
        });
    }

    private static addChildComponentRef(container: Element,
                                        containerToChildComponentsRef: ContainerToComponentsRef,
                                        childComponentRef: ChildComponentRef): void {
        if (containerToChildComponentsRef.has(container)) {
            containerToChildComponentsRef.get(container).push(childComponentRef);
        } else {
            containerToChildComponentsRef.set(container, [childComponentRef]);
        }
    }

    private static subscribeToComponentDestroyEvent(appRef: ApplicationRef,
                                                    containerToChildComponentsRef: ContainerToComponentsRef,
                                                    componentRef: ChildComponentRef): void {
        const sub = componentRef.instance.destroy.subscribe(() => {
            sub.unsubscribe();
            NgxNotificationMsgService.destroy(appRef, componentRef);
            NgxNotificationMsgService.removeChildComponentRef(containerToChildComponentsRef, componentRef);
            NgxNotificationMsgService.updateComponentsIndexesOnDestroy(containerToChildComponentsRef);
        });
    }

    private static destroy(appRef: ApplicationRef, componentRef: ChildComponentRef): void {
        appRef.detachView(componentRef.hostView);
        componentRef.destroy();
    }

    private static updateComponentsIndexesOnDestroy(containerToChildComponentsRef: ContainerToComponentsRef): void {
        containerToChildComponentsRef.forEach((value, key) => {
            let total = containerToChildComponentsRef.get(key).length - 1;
            containerToChildComponentsRef.get(key).forEach(({instance}) => {
                instance.index = total--;
            });
        });
    }

    private static removeChildComponentRef(containerToChildComponentsRef: ContainerToComponentsRef, componentRef: ChildComponentRef): void {
        containerToChildComponentsRef.forEach((value, key) => {
            containerToChildComponentsRef.set(key, [...containerToChildComponentsRef.get(key).filter(_ => _ !== componentRef)]);
        });
    }

    private static updateComponentsIndexesOnOpen(containerToChildComponentsRef: ContainerToComponentsRef): void {
        containerToChildComponentsRef.forEach((value, key) => {
            let total = containerToChildComponentsRef.get(key).length;
            containerToChildComponentsRef.get(key).forEach(({instance}) => {
                instance.index = --total;
            });
        });
    }

    open(inputsConfig: INgxNotificationMsgConfig, element?: Element): void {
        const container = element ? element : this.defaultContainer;
        const childComponentRef = NgxNotificationMsgService.appendChildComponentRef(
            this.componentFactoryResolver,
            this.appRef,
            this.injector,
            container
        );

        NgxNotificationMsgService.attachConfig(inputsConfig, childComponentRef);
        NgxNotificationMsgService.addChildComponentRef(container, this.containerToChildComponentsRef, childComponentRef);
        NgxNotificationMsgService.subscribeToComponentDestroyEvent(this.appRef, this.containerToChildComponentsRef, childComponentRef);
        NgxNotificationMsgService.updateComponentsIndexesOnOpen(this.containerToChildComponentsRef);
    }
}

type ChildComponentRef = ComponentRef<NgxNotificationMsgComponent>;
type ContainerToComponentsRef = Map<Element, ChildComponentRef[]>;
