class HandlerSettings {
    constructor(wsServer, security, prefix = '/api/v1/') {
        this.wsServer = null;
        this.security = null;
        this.prefix = '/api/v1/';
        this.wsServer = wsServer;
        this.security = security;
        this.prefix = prefix;
    }
}
exports.HandlerSettings = HandlerSettings;
