
import { Aurelia, LogManager } from "aurelia-framework";
import { ConsoleAppender } from "aurelia-logging-console";
import { HttpClient } from "aurelia-http-client";
import { AppConfig } from "./models/appConfig";
import environment from "./environment";
import AuthService from "./services/auth-service";
import { StorageService } from "./services/storage-service";
import { TokenService } from "./services/token-service";


// Configure Bluebird Promises.
// tslint:disable-next-line:whitespace
(<any>Promise).config({
    warnings: {
        wForgottenReturn: false,
    },
    longStackTraces: false,
});

let configureLogger = (moduleId) => {
    let logger = LogManager.getLogger(moduleId);
    LogManager.setLevel(LogManager.logLevel.info);
    if (environment.debug) {
        LogManager.setLevel(LogManager.logLevel.debug);
        LogManager.addAppender(new ConsoleAppender());
    }
    return logger;
};

let defaultClient = new HttpClient();

let appConfigResponse;

let logger = configureLogger("Main");

export function configure(aurelia: Aurelia) {
    logger.info("Configuring application");
    if (environment.testing) {
        aurelia.use.plugin("aurelia-testing");
    }
    let configureApis = async () => {
        try {
            let response = await defaultClient.get("scripts/appConfig.json");
            appConfigResponse = response.content;
            aurelia.use.instance(AppConfig, appConfigResponse);
        } catch (err) {
            logger.error(err);
            logger.info("Massive App Failure On Load");
        }
    };

    configureApis();

    aurelia.use.standardConfiguration()

    aurelia.start().then(() => {

        let authService = aurelia.container.get(AuthService);

        let userIsAuthenticated = authService.isAuthenticated();

        if (userIsAuthenticated) {
            aurelia.setRoot("shell/shell");
        } else {
            logger.info("User is NOT authenticated.  Redirecting to Azure login.");
            authService.login();
        }

    });
}
