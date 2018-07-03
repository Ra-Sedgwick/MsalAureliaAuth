import { inject } from "aurelia-framework";
import { AureliaConfiguration } from "aurelia-configuration";

@inject(AureliaConfiguration)
export class AppConfig {
    public clientId: string;
    public authority: string;
    public b2cScopes: string[];
    public apiUrl: string;
    public logiAppUrl: string;
    public logiURL: string;
    public WebURL: string;
    public timeoutTime: number;
    public warningTime: number;
    public logiPingInterval: number;

    constructor(attrs) {
        if (attrs) {
            Object.assign(this, attrs);
        }
    }
}
