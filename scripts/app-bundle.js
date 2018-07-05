define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('models/appConfig',["require", "exports", "aurelia-framework", "aurelia-configuration"], function (require, exports, aurelia_framework_1, aurelia_configuration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppConfig = (function () {
        function AppConfig(attrs) {
            if (attrs) {
                Object.assign(this, attrs);
            }
        }
        AppConfig = __decorate([
            aurelia_framework_1.inject(aurelia_configuration_1.AureliaConfiguration),
            __metadata("design:paramtypes", [Object])
        ], AppConfig);
        return AppConfig;
    }());
    exports.AppConfig = AppConfig;
});

define('services/storage-service',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StorageService = (function () {
        function StorageService() {
            this.keyPrefix = "";
            this.storage = this.resolveStorage();
        }
        StorageService.prototype.resolveStorage = function () {
            return localStorage;
        };
        StorageService.prototype.get = function (key) {
            var item = this.storage.getItem("" + this.keyPrefix + key);
            if (item === "undefined") {
                return false;
            }
            return JSON.parse(item);
        };
        StorageService.prototype.set = function (key, value) {
            var item = JSON.stringify(value);
            this.storage.setItem("" + this.keyPrefix + key, item);
        };
        StorageService.prototype.clear = function () {
            for (var i = 0; i < this.storage.length; i++) {
                var key = this.storage.key(i);
                if (key.startsWith(this.keyPrefix)) {
                    this.storage.removeItem(key);
                }
            }
        };
        StorageService.prototype.insertIntoLocalStorage = function (key, value) {
            this.set(key, value);
        };
        StorageService.prototype.insertMultiValuesIntoLocalStorage = function (keys, values) {
            var _this = this;
            keys.forEach(function (key, index) {
                _this.set(key, values[index]);
            });
        };
        StorageService.prototype.getValueFromLocalStorage = function (key) {
            return this.get(key);
        };
        StorageService.prototype.getMultiValuesFromLocalStorage = function (keys) {
            var _this = this;
            var returnObj = {};
            keys.forEach(function (key) {
                returnObj[key] = _this.get(key);
            });
            return returnObj;
        };
        StorageService.prototype.removeItemFromLocalStorage = function (key) {
            this.storage.removeItem("" + this.keyPrefix + key);
        };
        StorageService.prototype.removeMultiItemsFromLocalStorage = function (keys) {
            var _this = this;
            keys.forEach(function (key) {
                _this.storage.removeItem("" + _this.keyPrefix + key);
            });
        };
        StorageService.prototype.clearLocalStorage = function () {
            this.clear();
        };
        StorageService.prototype.insertIntoSessionStorage = function (key, value) {
            this.set(key, value);
        };
        StorageService.prototype.insertMultiValuesIntoSessionStorage = function (keys, values) {
            var _this = this;
            keys.forEach(function (key, index) {
                _this.set(key, values[index]);
            });
        };
        StorageService.prototype.getValueFromSessionStorage = function (key) {
            return this.get(key);
        };
        StorageService.prototype.getMultiValuesFromSessionStorage = function (keys) {
            var _this = this;
            var returnObj = {};
            keys.forEach(function (key) {
                returnObj[key] = _this.get(key);
            });
            return returnObj;
        };
        StorageService.prototype.removeItemFromSessionStorage = function (key) {
            this.storage.removeItem("" + this.keyPrefix + key);
        };
        StorageService.prototype.removeMultiItemsFromSessionStorage = function (keys) {
            var _this = this;
            keys.forEach(function (key) {
                _this.storage.removeItem("" + _this.keyPrefix + key);
            });
        };
        StorageService.prototype.clearSessionStorage = function () {
            this.clear();
        };
        return StorageService;
    }());
    exports.StorageService = StorageService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/token-service',["require", "exports", "aurelia-framework", "../models/appConfig", "../services/storage-service", "aurelia-router", "msal"], function (require, exports, aurelia_framework_1, appConfig_1, storage_service_1, aurelia_router_1, Msal) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TokenService = (function () {
        function TokenService(appConfig, storageService, router) {
            this.appConfig = appConfig;
            this.storageService = storageService;
            this.router = router;
            this.msalLogger = new Msal.Logger(this.LoggerCallback.bind(this), { level: Msal.LogLevel.Verbose, correlationId: '12345' });
            this.currentADApplication = new Msal.UserAgentApplication(this.appConfig.clientId, this.appConfig.authority, this.authCallback.bind(this), {
                logger: this.msalLogger,
                cacheLocation: "localStorage",
                redirectUri: this.appConfig.WebURL
            });
        }
        TokenService.prototype.authCallback = function (errorDesc, token, error, tokenType) {
            var _this = this;
            if (token) {
                console.log("Token acquired: " + token);
            }
            else {
                this.currentADApplication.acquireTokenSilent(this.appConfig.b2cScopes).then(function (accessToken) {
                    return true;
                }, function (error) {
                    _this.currentADApplication.loginRedirect(_this.appConfig.b2cScopes);
                });
            }
        };
        TokenService.prototype.LoggerCallback = function (logLevel, message, piiLoggingEnabled) {
            console.log(message);
        };
        TokenService = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [appConfig_1.AppConfig,
                storage_service_1.StorageService,
                aurelia_router_1.Router])
        ], TokenService);
        return TokenService;
    }());
    exports.TokenService = TokenService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/auth-service',["require", "exports", "aurelia-framework", "./token-service", "../models/appConfig", "../services/storage-service"], function (require, exports, aurelia_framework_1, token_service_1, appConfig_1, storage_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AuthService = (function () {
        function AuthService(appConfig, aurelia, tokenService, storage) {
            this.appConfig = appConfig;
            this.aurelia = aurelia;
            this.tokenService = tokenService;
            this.storage = storage;
        }
        AuthService.prototype.isAuthenticated = function () {
            var user = this.tokenService.currentADApplication.getUser();
            return user !== null;
        };
        AuthService.prototype.login = function () {
            var _this = this;
            this.tokenService.currentADApplication.acquireTokenSilent(this.appConfig.b2cScopes).then(function (accessToken) {
                _this.storage.set("access_token", accessToken);
                return true;
            }, function (error) {
                _this.tokenService.currentADApplication.acquireTokenRedirect(_this.appConfig.b2cScopes);
            });
        };
        AuthService.prototype.logout = function () {
            this.storage.clear();
            this.tokenService.currentADApplication.logout();
        };
        AuthService = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [appConfig_1.AppConfig,
                aurelia_framework_1.Aurelia,
                token_service_1.TokenService,
                storage_service_1.StorageService])
        ], AuthService);
        return AuthService;
    }());
    exports.default = AuthService;
});

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('main',["require", "exports", "aurelia-framework", "aurelia-logging-console", "aurelia-http-client", "./models/appConfig", "./environment", "./services/auth-service"], function (require, exports, aurelia_framework_1, aurelia_logging_console_1, aurelia_http_client_1, appConfig_1, environment_1, auth_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Promise.config({
        warnings: {
            wForgottenReturn: false,
        },
        longStackTraces: false,
    });
    var configureLogger = function (moduleId) {
        var logger = aurelia_framework_1.LogManager.getLogger(moduleId);
        aurelia_framework_1.LogManager.setLevel(aurelia_framework_1.LogManager.logLevel.info);
        if (environment_1.default.debug) {
            aurelia_framework_1.LogManager.setLevel(aurelia_framework_1.LogManager.logLevel.debug);
            aurelia_framework_1.LogManager.addAppender(new aurelia_logging_console_1.ConsoleAppender());
        }
        return logger;
    };
    var defaultClient = new aurelia_http_client_1.HttpClient();
    var appConfigResponse;
    var logger = configureLogger("Main");
    function configure(aurelia) {
        var _this = this;
        logger.info("Configuring application");
        if (environment_1.default.testing) {
            aurelia.use.plugin("aurelia-testing");
        }
        var configureApis = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, defaultClient.get("scripts/appConfig.json")];
                    case 1:
                        response = _a.sent();
                        appConfigResponse = response.content;
                        aurelia.use.instance(appConfig_1.AppConfig, appConfigResponse);
                        return [3, 3];
                    case 2:
                        err_1 = _a.sent();
                        logger.error(err_1);
                        logger.info("Massive App Failure On Load");
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); };
        configureApis();
        aurelia.use.standardConfiguration();
        aurelia.start().then(function () {
            var authService = aurelia.container.get(auth_service_1.default);
            var userIsAuthenticated = authService.isAuthenticated();
            if (userIsAuthenticated) {
                aurelia.setRoot("shell/shell");
            }
            else {
                logger.info("User is NOT authenticated.  Redirecting to Azure login.");
                authService.login();
            }
        });
    }
    exports.configure = configure;
});

define('models/key-value-pair-model',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var KeyValuePairModel = (function () {
        function KeyValuePairModel() {
        }
        KeyValuePairModel.prototype.mapJsonToModel = function (jsonObj) {
            this.dataList = [];
            for (var _i = 0, jsonObj_1 = jsonObj; _i < jsonObj_1.length; _i++) {
                var data = jsonObj_1[_i];
                this.dataList.push(data);
            }
        };
        return KeyValuePairModel;
    }());
    exports.KeyValuePairModel = KeyValuePairModel;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('models/session-model',["require", "exports", "aurelia-framework", "../services/storage-service"], function (require, exports, aurelia_framework_1, storage_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SessionModel = (function () {
        function SessionModel(storage) {
            this.storage = storage;
        }
        SessionModel.prototype.activateSession = function (accessToken, refreshToken, expiresIn, tokenType, email) {
            if (expiresIn === void 0) { expiresIn = 300; }
            if (tokenType === void 0) { tokenType = ""; }
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
        };
        SessionModel.prototype.getUpdatedSession = function () {
            this.accessToken = this.storage.getValueFromSessionStorage("access_token");
            this.refreshToken = this.storage.getValueFromSessionStorage("refresh_token");
            return this;
        };
        SessionModel = __decorate([
            aurelia_framework_1.inject(storage_service_1.StorageService),
            __metadata("design:paramtypes", [Object])
        ], SessionModel);
        return SessionModel;
    }());
    exports.SessionModel = SessionModel;
});

define('services/cookie-service',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CookieService = (function () {
        function CookieService() {
        }
        CookieService.prototype.delete = function (name) {
            var cookie = name + " =;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.cookie = cookie;
        };
        return CookieService;
    }());
    exports.CookieService = CookieService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('resources/interceptors/authentication-interceptor',["require", "exports", "aurelia-http-client", "aurelia-framework", "aurelia-logging", "../../models/appConfig", "../../services/token-service", "../../services/storage-service", "../../services/cookie-service"], function (require, exports, aurelia_http_client_1, aurelia_framework_1, aurelia_logging_1, appConfig_1, token_service_1, storage_service_1, cookie_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_logging_1.getLogger("AuthorizationInterceptor");
    var AuthorizationInterceptor = (function () {
        function AuthorizationInterceptor(tokenService, storageService, cookieService, appConfig, aurelia) {
            this.tokenService = tokenService;
            this.storageService = storageService;
            this.cookieService = cookieService;
            this.appConfig = appConfig;
            this.aurelia = aurelia;
            this.reAuthAttempts = 0;
        }
        AuthorizationInterceptor.prototype.response = function (response) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    logger.debug("Recieved " + response.statusText, response.headers, { response: response });
                    this.reAuthAttempts = 0;
                    return [2, response];
                });
            });
        };
        AuthorizationInterceptor.prototype.request = function (request) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    logger.debug("Requesting " + request.method + " " + request.url, { request: request });
                    return [2, request];
                });
            });
        };
        AuthorizationInterceptor.prototype.responseError = function (responseError) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(responseError.statusCode === 401 && this.reAuthAttempts < 2)) return [3, 2];
                            this.reAuthAttempts++;
                            logger.debug("Re-authentication attempt number: " + this.reAuthAttempts);
                            return [4, this.refreshToken(responseError)];
                        case 1: return [2, _a.sent()];
                        case 2:
                            logger.debug("Max reauthentication attempts reached.");
                            this.reAuthAttempts = 0;
                            return [2, responseError];
                    }
                });
            });
        };
        AuthorizationInterceptor.prototype.refreshToken = function (responseError) {
            return __awaiter(this, void 0, void 0, function () {
                var accessToken, ex_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4, this.tokenService.currentADApplication.acquireTokenSilent(this.appConfig.b2cScopes)];
                        case 1:
                            accessToken = _a.sent();
                            this.storageService.insertIntoSessionStorage("access_token", accessToken);
                            responseError.requestMessage.headers.add("Authorization", "Bearer " + accessToken);
                            return [2, new aurelia_http_client_1.HttpClient().send(responseError.requestMessage, [])];
                        case 2:
                            ex_1 = _a.sent();
                            logger.debug("Error during silent token request: ", ex_1);
                            this.dumpStorageAndReroute();
                            return [3, 3];
                        case 3: return [2];
                    }
                });
            });
        };
        AuthorizationInterceptor.prototype.dumpStorageAndReroute = function () {
            this.storageService.clearLocalStorage();
            this.storageService.clearSessionStorage();
            this.cookieService.delete("io");
            this.aurelia.setRoot("shell/shell");
        };
        AuthorizationInterceptor = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [token_service_1.TokenService,
                storage_service_1.StorageService,
                cookie_service_1.CookieService,
                appConfig_1.AppConfig,
                aurelia_framework_1.Aurelia])
        ], AuthorizationInterceptor);
        return AuthorizationInterceptor;
    }());
    exports.default = AuthorizationInterceptor;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('services/http-service',["require", "exports", "aurelia-http-client", "aurelia-framework", "../models/appConfig", "../models/session-model", "../services/token-service", "../services/storage-service", "../resources/interceptors/authentication-interceptor"], function (require, exports, aurelia_http_client_1, aurelia_framework_1, appConfig_1, session_model_1, token_service_1, storage_service_1, authentication_interceptor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Client = (function () {
        function Client(httpClient, appConfig, session, authorizationInterceptor, tokenService, storageService) {
            var _this = this;
            this.httpClient = httpClient;
            this.appConfig = appConfig;
            this.session = session;
            this.authorizationInterceptor = authorizationInterceptor;
            this.tokenService = tokenService;
            this.storageService = storageService;
            this.httpClient.configure(function (config) {
                config.withBaseUrl(_this.appConfig.apiUrl);
                config.withHeader("Content-Type", "application/json");
                config.withInterceptor(authorizationInterceptor);
            });
        }
        Client.prototype.get = function (url, params) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, this.buildClient().get(url)];
                });
            });
        };
        Client.prototype.patch = function (url, content) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, this.buildClient().patch(url, content)];
                });
            });
        };
        Client.prototype.post = function (url, content) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, this.buildClient().post(url, content)];
                });
            });
        };
        Client.prototype.put = function (url, content) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, this.buildClient().put(url, content)];
                });
            });
        };
        Client.prototype.delete = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, this.buildClient().delete(url)];
                });
            });
        };
        Client.prototype.buildClient = function () {
            var accessToken = this.storageService.get("access_token");
            var client = this.httpClient.configure(function (config) {
                config.withHeader("Authorization", "Bearer " + accessToken);
            });
            return client;
        };
        Client = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_http_client_1.HttpClient,
                appConfig_1.AppConfig,
                session_model_1.SessionModel,
                authentication_interceptor_1.default,
                token_service_1.TokenService,
                storage_service_1.StorageService])
        ], Client);
        return Client;
    }());
    exports.Client = Client;
});

define('services/index',["require", "exports", "./auth-service", "./http-service", "./storage-service"], function (require, exports, auth_service_1, http_service_1, storage_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuthService = auth_service_1.default;
    exports.Client = http_service_1.Client;
    exports.StorageService = storage_service_1.StorageService;
});

define('shell/routes',["require", "exports", "aurelia-router"], function (require, exports, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = [
        {
            route: "",
            moduleId: "home/home",
            name: "Home",
            title: "Home",
            nav: true,
            activationStrategy: aurelia_router_1.activationStrategy.invokeLifecycle,
            auth: true,
            settings: { permission: "Reporting", home: true, embededIframe: true },
        },
        {
            route: "projects",
            moduleId: "../projects/list",
            name: "Projects",
            title: "Projects",
            nav: true,
            activationStrategy: aurelia_router_1.activationStrategy.invokeLifecycle,
            auth: true,
            settings: { permission: "Project" },
        },
        {
            route: "projects/add",
            moduleId: "../projects/add-edit-project",
            name: "Add Project",
            title: "Add Project",
            nav: false,
            activationStrategy: aurelia_router_1.activationStrategy.invokeLifecycle,
            auth: true,
            settings: { permission: "Project" },
        },
        {
            route: "projects/edit/:projectId",
            moduleId: "../projects/add-edit-project",
            name: "Edit Project",
            title: "Edit Project",
            nav: false,
            activationStrategy: aurelia_router_1.activationStrategy.invokeLifecycle,
            auth: true,
            settings: { permission: "Project" },
        },
        {
            route: ["facility", "facility/:facilityId"],
            moduleId: "../facilities/facility",
            name: "Facility",
            title: "Facilities",
            activationStrategy: aurelia_router_1.activationStrategy.invokeLifecycle,
            auth: true,
            settings: { permission: "Facility" },
        },
        {
            route: "admin",
            moduleId: "../admin/admin",
            name: "AdminModule",
            title: "Admin",
            nav: true,
            activationStrategy: aurelia_router_1.activationStrategy.invokeLifecycle,
            auth: true,
            settings: { dropdown: true, permission: ["Account", "Facility", "Users"] },
        },
        {
            route: "support",
            moduleId: "../support/support",
            name: "Support",
            title: "Support",
            nav: true,
            activationStrategy: aurelia_router_1.activationStrategy.invokeLifecycle,
            auth: true,
            settings: { dropdown: true, support: true, permission: "",
                nav: [
                    { href: "#rolePermissions", title: "Permissions", name: "Support" },
                ],
            },
        },
        {
            route: "rolePermissions",
            moduleId: "../role-permissions/role-permissions",
            name: "Permissions",
            title: "Permissions",
            nav: false,
            activationStrategy: aurelia_router_1.activationStrategy.invokeLifecycle,
            auth: true,
            settings: { permission: "Support" },
        },
        {
            route: "facilityPDF/:facilityId",
            moduleId: "../export/facilityPDF",
            name: "FacilityDetailsPDF",
            title: "FacilitiesPDF",
            activationStrategy: aurelia_router_1.activationStrategy.invokeLifecycle,
            auth: true,
            settings: { dropdown: true, support: true, permission: [] },
        },
        {
            route: "access-denied",
            moduleId: "../misc/access-denied",
            name: "AccessDenied",
            title: "Access Denied",
            nav: false,
            activationStrategy: aurelia_router_1.activationStrategy.invokeLifecycle,
            settings: { permission: [] },
        },
        {
            route: "knowledge-center",
            moduleId: "../knowledge-center/knowledge-center",
            name: "KnowledgeCenter",
            title: "Knowlege Center",
            nav: false,
            activationStrategy: aurelia_router_1.activationStrategy.invokeLifecycle,
            settings: { embededIframe: true },
        },
    ];
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('shell/shell',["require", "exports", "aurelia-router", "aurelia-logging", "../services/auth-service", "aurelia-framework", "./routes"], function (require, exports, aurelia_router_1, aurelia_logging_1, auth_service_1, aurelia_framework_1, routes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Shell = (function () {
        function Shell(logger, authService, router) {
            this.logger = logger;
            this.authService = authService;
            this.router = router;
            this.logger.id = "Shell";
        }
        Shell.prototype.configureRouter = function (config, router) {
            var self = this;
            var appNavStep = {
                run: function (navigation, next) {
                    self.logger.debug("" + navigation.fragment, { navigation: navigation });
                    return next();
                },
            };
            var postAuthRedirect = {
                run: function (navigation, next) {
                    return next();
                },
            };
            var authStep = {
                run: function (navigation, next) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (navigation.getAllInstructions().some(function (i) { return i.config.auth; })) {
                                if (!self.authService.isAuthenticated()) {
                                    return [2, next.cancel(self.authService.login())];
                                }
                                else {
                                }
                            }
                            return [2, next()];
                        });
                    });
                },
            };
            config.addAuthorizeStep(authStep);
            config.addPreActivateStep(postAuthRedirect);
            config.addPreRenderStep(appNavStep);
            config.options.root = "/";
            config.mapUnknownRoutes({ redirect: "/" });
            this.router = router;
            config.map(routes_1.default);
        };
        Shell.prototype.attached = function () {
        };
        Shell.prototype.logout = function () {
            this.authService.logout();
        };
        Shell.prototype.preventLinkNavigation = function (e) {
            e.preventDefault();
        };
        Shell.prototype.login = function () {
            this.logger.info("Login Called");
            this.authService.login();
        };
        Shell.prototype.reloadRoute = function (route) {
            this.router.navigate(route.config.title);
        };
        Shell = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_logging_1.Logger,
                auth_service_1.default,
                aurelia_router_1.Router])
        ], Shell);
        return Shell;
    }());
    exports.Shell = Shell;
});

define('models/user/user-info-basic-model',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserInfoBasicModel = (function () {
        function UserInfoBasicModel() {
        }
        UserInfoBasicModel.prototype.mapJsonToModel = function (jsonObj) {
            this.userId = jsonObj.UserId;
            this.firstName = jsonObj.FirstName;
            this.lastName = jsonObj.LastName;
            this.displayName = jsonObj.DisplayName;
            this.emailAddress = jsonObj.EmailAddress;
            this.phoneNumber = jsonObj.PhoneNumber;
            this.isActive = jsonObj.isActive;
            this.userName = jsonObj.UserName;
            this.jobTitle = jsonObj.JobTitle;
            this.userRole = jsonObj.UserRole;
        };
        return UserInfoBasicModel;
    }());
    exports.UserInfoBasicModel = UserInfoBasicModel;
});

define('text!shell/shell.html', ['module'], function(module) { module.exports = "<template>\r\n  <h1>It Worked</h1>\r\n  <button click.delegate=\"logout()\">Logout</button>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map