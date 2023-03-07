export interface RestaurantType {
    readonly id: number
    name: string;
    address1: string;
    address2: string;
    latitude: number;
    longitude: number;
}

export interface ProductType {
    readonly id: number;
    category: string;
    name: string;
    topping: string[];
    price: number;
    rank: number;
}

export interface MenuItemsType {
    [key: string]: ProductType[],
}

export interface MenuPropsType {
    menuKey: string;
    products: ProductType[];
}

export interface OrderItemType {
    readonly id: number;
    restaurant: RestaurantType;
    product: ProductType;
    price: number;
}

export interface SelectOptionsType {
    value: number;
    label: string;
}

export enum CookieTypes {
    restaurants = 'restaurants',
    menu = 'menu',
}