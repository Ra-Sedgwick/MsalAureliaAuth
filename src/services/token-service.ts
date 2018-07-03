

import { autoinject } from "aurelia-framework";
import { AppConfig } from "../models/appConfig";
import { StorageService } from "../services/storage-service";
import { Router } from "aurelia-router";
import * as Msal from "msal";

@autoinject
export class TokenService {

    public currentADApplication;
    public msalLogger;

    constructor(
        private appConfig: AppConfig,
        private storageService: StorageService,
        private router: Router,
    ) {
        this.msalLogger = new Msal.Logger(this.LoggerCallback.bind(this), { level: Msal.LogLevel.Verbose, correlationId:'12345' }); // level and correlationId are optional parameters.

        this.currentADApplication = new Msal.UserAgentApplication(
            this.appConfig.clientId,
            this.appConfig.authority,
            this.authCallback.bind(this),
            {
                logger: this.msalLogger,
                cacheLocation: "localStorage",
                redirectUri: this.appConfig.WebURL
            });
    }

    authCallback(errorDesc, token, error, tokenType) {
        if (token) {
            console.log(`Token acquired: ${token}`);
        } else {
            this.currentADApplication.acquireTokenSilent(this.appConfig.b2cScopes).then(accessToken => {
                return true;
            }, (error) => {
                this.currentADApplication.loginRedirect(this.appConfig.b2cScopes);
            });
        }
    }

    LoggerCallback(logLevel, message, piiLoggingEnabled) {
        console.log(message);
    }
}
