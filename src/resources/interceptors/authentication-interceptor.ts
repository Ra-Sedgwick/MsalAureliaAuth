import { Interceptor, HttpResponseMessage, HttpRequestMessage, HttpClient } from "aurelia-http-client";
import { autoinject, Aurelia } from "aurelia-framework";
import { getLogger } from "aurelia-logging";
import { AppConfig } from "../../models/appConfig";
import { TokenService } from "../../services/token-service";
import { StorageService } from "../../services/storage-service";
import { CookieService } from "../../services/cookie-service";

let logger = getLogger("AuthorizationInterceptor");

@autoinject
export default class AuthorizationInterceptor implements Interceptor {
    private reAuthAttempts = 0;
    constructor(
        private tokenService: TokenService,
        private storageService: StorageService,
        private cookieService: CookieService,
        private appConfig: AppConfig,
        private aurelia: Aurelia
    ) {
    }
    async response(response: HttpResponseMessage) {
        logger.debug(`Recieved ${response.statusText}`, response.headers, { response });
        this.reAuthAttempts = 0;
        return response;
    }

    async request(request: HttpRequestMessage) {
        logger.debug(`Requesting ${request.method} ${request.url}`, { request });
        return request;
    }

    async responseError(responseError: HttpResponseMessage): Promise<HttpResponseMessage> {
        if (responseError.statusCode === 401 && this.reAuthAttempts < 2) {
            this.reAuthAttempts++;
            logger.debug(`Re-authentication attempt number: ${this.reAuthAttempts}`);
            return await this.refreshToken(responseError);
        } else {
            logger.debug("Max reauthentication attempts reached.");
            this.reAuthAttempts = 0;
            return responseError;
        }
    }

    async refreshToken(responseError: HttpResponseMessage) {
        try {
            let accessToken = await this.tokenService.currentADApplication.acquireTokenSilent(this.appConfig.b2cScopes);
            this.storageService.insertIntoSessionStorage("access_token", accessToken);
            responseError.requestMessage.headers.add("Authorization", `Bearer ${accessToken}`);
            return new HttpClient().send(responseError.requestMessage, []);
        } catch (ex) {
            logger.debug("Error during silent token request: ", ex);
            this.dumpStorageAndReroute();
        }
    }

    dumpStorageAndReroute() {
        this.storageService.clearLocalStorage();
        this.storageService.clearSessionStorage();
        this.cookieService.delete("io");
        this.aurelia.setRoot("shell/shell");
    }
}
