import {OrderItemType} from "./types";

export class Cookie {
    static setCookie(name: string, value: string, timeSec: number): void {
        const now = new Date();
        let time = now.getTime();
        time += timeSec * 1000;
        now.setTime(time);

        document.cookie = `${name}=${value}; expires=${now.toUTCString()}; path=/`;
    }

    static getCookie(name: string): string | undefined {
        const matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));

        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    static deleteCookie(name: string): void {
        this.setCookie(name, "", -1)
    }
}

export class LocalStorage {
    static getOrders(): OrderItemType[] | null {
        const jsonData = window.localStorage.getItem('orders');

        return jsonData ? JSON.parse(jsonData) : null;
    }

    static setOrders(orders: OrderItemType[]) {
        const jsonData = JSON.stringify(orders);

        window.localStorage.setItem('orders', jsonData);
    }

    static clearOrders() {
        window.localStorage.removeItem('orders');
    }
}

export const getMenuKeyNameByRestaurantId = (id: number): string => `rest${id}`;