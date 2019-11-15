# NgxNotificationMsg

Angular Library to show notification message.

## Demo

- A simple usage example can be found under `src/app` directory of this repository.

- You may also visit the online usage example on https://maormoshe.github.io/NotificationMsgLibrary/

## Installation

1. Download from npm

`npm install ngx-notification-msg --save`

2. Import the `NgxNotificationMsgModule` module:

`import {NgxNotificationMsgModule} from 'ngx-notification-msg'`

3. Add `NgxNotificationMsgModule` to your module imports:

```ts
 @NgModule({ ... imports: [ ... NgxNotificationMsgModule ] })
 ```
 
4. Import the `NgxNotificationMsgService` service in any angular component:

`import {NgxNotificationMsgService} from 'ngx-notification-msg'`

5. Inject the `NgxNotificationMsgService` service in the angular component's constructor:

```ts
 constructor(private readonly ngxNotificationMsgService: NgxNotificationMsgService) {
 
 }
 ```
 
6. Now you can use `ngxNotificationMsgService` service:

```ts
 this.ngxNotificationMsgService.open({
    status: NgxNotificationStatusMsg.SUCCESS,
    header: 'Hey',
    msg: 'How are you today ?!'
 });
 ```
 
## API

Use the `NgxNotificationMsgService` service in any angular component you like.

> #### Methods

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; open(inputsConfig: INgxNotificationMsgConfig, element?: Element): void

## Enums & Interfaces

```ts
export enum NgxNotificationStatusMsg {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    INFO = 'INFO',
    NONE = 'NONE'
}

interface INgxNotificationMsgConfig {
    status?: NgxNotificationStatusMsg;
    header?: string;
    msg: string;
    delay?: number;
    closeable?: boolean;
}
 });
 ```
