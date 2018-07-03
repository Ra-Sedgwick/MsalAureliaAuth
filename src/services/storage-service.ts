export class StorageService {
    private keyPrefix: string;
    private storage: Storage;

    constructor() {
        this.keyPrefix = "";
        this.storage = this.resolveStorage();
    }
    resolveStorage(): Storage {
        return localStorage;
    }
    get(key: string): any {
        let item = this.storage.getItem(`${this.keyPrefix}${key}`);
        if (item === "undefined") {
            return false;
        }
        return JSON.parse(item);
    }
    set(key: string, value: any): void {
        let item = JSON.stringify(value);
        this.storage.setItem(`${this.keyPrefix}${key}`, item);
    }
    clear(): void {
        for (let i = 0; i < this.storage.length; i++) {
            let key = this.storage.key(i);
            if (key.startsWith(this.keyPrefix)) {
                this.storage.removeItem(key);
            }
        }
    }
    insertIntoLocalStorage(key: string, value: string): void {
        this.set(key, value);
    }

    insertMultiValuesIntoLocalStorage(keys: string[], values: string[]): void {
        keys.forEach((key, index) => {
            this.set(key, values[index]);
        });
    }

    getValueFromLocalStorage(key: string): string {
        return this.get(key);
    }

    getMultiValuesFromLocalStorage(keys: string[]): Object {
        let returnObj = {};
        keys.forEach(key => {
            returnObj[key] = this.get(key);
        });
        return returnObj;
    }

    removeItemFromLocalStorage(key: string): void {
        this.storage.removeItem(`${this.keyPrefix}${key}`);
    }

    removeMultiItemsFromLocalStorage(keys: string[]) {
        keys.forEach(key => {
            this.storage.removeItem(`${this.keyPrefix}${key}`);
        });
    }
    clearLocalStorage(): void {
        this.clear();
    }

    insertIntoSessionStorage(key: string, value: string): void {
        this.set(key, value);
    }

    insertMultiValuesIntoSessionStorage(keys: string[], values: string[]): void {
        keys.forEach((key, index) => {
            this.set(key, values[index]);
        });
    }

    getValueFromSessionStorage(key: string): string {
        return this.get(key);
    }

    getMultiValuesFromSessionStorage(keys: string[]): Object {
        let returnObj = {};
        keys.forEach(key => {
            returnObj[key] = this.get(key);
        });
        return returnObj;
    }

    removeItemFromSessionStorage(key: string): void {
        this.storage.removeItem(`${this.keyPrefix}${key}`);
    }

    removeMultiItemsFromSessionStorage(keys: string[]) {
        keys.forEach(key => {
            this.storage.removeItem(`${this.keyPrefix}${key}`);
        });
    }

    clearSessionStorage(): void {
        this.clear();
    }
}
