import {WebSocketServer } from './app.websockets';

export class HandlerSettings {
    public wsServer: WebSocketServer = null;
    public security: any = null;
    public prefix: string= '/api/v1/';

    constructor (wsServer: WebSocketServer, security: any, prefix: string = '/api/v1/') {
        this.wsServer = wsServer;
        this.security = security;
        this.prefix = prefix;
    } 
}