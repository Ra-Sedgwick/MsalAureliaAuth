export class CookieService {

    delete(name: string) {
        let cookie = `${name} =;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        document.cookie = cookie;
    }
}
