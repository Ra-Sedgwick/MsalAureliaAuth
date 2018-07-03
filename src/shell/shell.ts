import { NavigationInstruction, Next, Redirect, Router } from "aurelia-router";
import { Logger } from "aurelia-logging";
import AuthService from "../services/auth-service";
import {autoinject} from "aurelia-framework";
import routes from "./routes";


declare var window: any;
@autoinject
export class Shell {

    private user;

    constructor(
        private logger: Logger,
        private authService: AuthService,
        private router: Router,
    ) {
        this.logger.id = "Shell";
    }

    configureRouter(config, router) {
        let self = this;
        let appNavStep = {
            run(navigation: NavigationInstruction, next: Next): Promise<any> {
                self.logger.debug(`${navigation.fragment}`, { navigation });
                return next();
            },
        };
        let postAuthRedirect = {
            run(navigation: NavigationInstruction, next: Next): Promise<any> {
                return next();
            },
        };
        let authStep = {
            async run(navigation: NavigationInstruction, next: Next): Promise<any> {
                if (navigation.getAllInstructions().some((i) => i.config.auth)) {
                    if (!self.authService.isAuthenticated()) {
                        return next.cancel(self.authService.login());
                    } else {
                        // Load User Info
                    }

                }
                return next();
            },
        };

        config.addAuthorizeStep(authStep);
        config.addPreActivateStep(postAuthRedirect);
        config.addPreRenderStep(appNavStep);
        config.options.root = "/";
        config.mapUnknownRoutes({ redirect: "/" });
        this.router = router;
        config.map(routes);
    }

    attached() {

    }

    logout() {
        this.authService.logout();
    }

    preventLinkNavigation(e) {
        e.preventDefault();
    }

    login() {
        this.logger.info(`Login Called`);
        this.authService.login();
    }

    reloadRoute(route) {
        this.router.navigate(route.config.title);
    }
}
