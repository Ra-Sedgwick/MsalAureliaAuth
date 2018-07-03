import { autoinject, Aurelia } from "aurelia-framework";
import { TokenService } from "./token-service";
import { AppConfig } from "../models/appConfig";
import { StorageService } from "../services/storage-service";


@autoinject
export default class AuthService {

    constructor(
        private appConfig: AppConfig,
        private aurelia: Aurelia,
        private tokenService: TokenService,
        private storage: StorageService,

    ) {
    }

    isAuthenticated() {
        let user = this.tokenService.currentADApplication.getUser();
        return user !== null;
    }

    login() {
        this.tokenService.currentADApplication.acquireTokenSilent(this.appConfig.b2cScopes).then(accessToken => {
            this.storage.set("access_token", accessToken);
            return true;
        }, (error) => {
            this.tokenService.currentADApplication.acquireTokenRedirect(this.appConfig.b2cScopes);
        });
    }
    logout() {
        this.storage.clear();
        this.tokenService.currentADApplication.logout();
    }
}
