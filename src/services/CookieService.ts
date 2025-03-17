import Cookies, { CookieSetOptions } from "universal-cookie";

const cookies = new Cookies();

class CookieService {
  // Get cookie
  getCookie<T = string>(name: string): T | undefined {
    return cookies.get(name);
  }

  // Set cookie
  setCookie(
    name: string,
    value: string | object,
    options?: CookieSetOptions
  ): void {
    cookies.set(name, value, options);
  }

  // Delete cookie
  removeCookie(name: string, options?: CookieSetOptions): void {
    cookies.remove(name, options);
  }
}

export default new CookieService();
