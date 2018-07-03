import { inject } from "aurelia-framework";
import { StorageService } from "../services/storage-service";

@inject(StorageService)
export class SessionModel {
    public accessToken: string;
    public expiresIn: number;
    public refreshToken: string;
    public tokenType: string;
    public email: string;
    private storage: StorageService;

    constructor(storage) {
        this.storage = storage;
    }
    activateSession(accessToken: string, refreshToken: string, expiresIn: number = 300, tokenType: string = "", email?: string | null) {
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;

        this.storage.insertIntoSessionStorage("access_token", this.accessToken);
        this.storage.insertIntoSessionStorage("refresh_token", this.refreshToken);

        if (email) {
            this.email = email;
            this.storage.insertIntoSessionStorage("userEmail", this.email);
        }
    }
    getUpdatedSession(): SessionModel {
        this.accessToken = this.storage.getValueFromSessionStorage("access_token");
        this.refreshToken = this.storage.getValueFromSessionStorage("refresh_token");
        return this;
    }
}
