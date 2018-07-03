import { HttpClient, HttpResponseMessage } from "aurelia-http-client";
import { autoinject } from "aurelia-framework";
import { AppConfig } from "../models/appConfig";
import { SessionModel as Session } from "../models/session-model";
import { TokenService } from "../services/token-service";
import { StorageService } from "../services/storage-service";
import AuthorizationInterceptor from "../resources/interceptors/authentication-interceptor";

@autoinject
export class Client {
    private accessToken: string;
    constructor(
        private httpClient: HttpClient,
        private appConfig: AppConfig,
        private session: Session,
        private authorizationInterceptor: AuthorizationInterceptor,
        private tokenService: TokenService,
        private storageService: StorageService
    ) {
        this.httpClient.configure(config => {
            config.withBaseUrl(this.appConfig.apiUrl);
            config.withHeader("Content-Type", "application/json");
            config.withInterceptor(authorizationInterceptor);
        });
    }

    async get(url, params?): Promise<HttpResponseMessage> {
        return this.buildClient().get(url);
    }
    async patch(url: string, content: any): Promise<HttpResponseMessage> {
        return this.buildClient().patch(url, content);
    }
    async post(url: string, content: any): Promise<HttpResponseMessage> {
        return this.buildClient().post(url, content);
    }
    async put(url: string, content: any): Promise<HttpResponseMessage> {
        return this.buildClient().put(url, content);
    }
    async delete(url: string): Promise<HttpResponseMessage> {
        return this.buildClient().delete(url);
    }

    private buildClient(): HttpClient {
        let accessToken = this.storageService.get("access_token");
        let client = this.httpClient.configure(config => {
            config.withHeader("Authorization", `Bearer ${accessToken}`);
        });
        return client;
    }

}
