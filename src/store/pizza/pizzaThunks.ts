import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchMenu, fetchRestaurants} from "./pizzaAPI";
import {Cookie, getMenuKeyNameByRestaurantId, LocalStorage} from "../../utils/global";
import {CookieTypes, MenuPropsType} from "../../utils/types";
import {RootState} from "../store";

const SEC_PER_HOUR = 3600;

export const fetchAllRestaurantsAsync = createAsyncThunk('pizza/fetchRestaurants', async () => {
    const cookieRestaurants = Cookie.getCookie(CookieTypes.restaurants);

    if (cookieRestaurants) {
        return JSON.parse(cookieRestaurants);
    } else {
        const restaurants = await fetchRestaurants();

        if (restaurants) {
            Cookie.setCookie(CookieTypes.restaurants, JSON.stringify(restaurants), SEC_PER_HOUR);
        }

        return restaurants;
    }
});

export const fetchMenuAsync = createAsyncThunk('pizza/fetchMenu', async ({restaurantId}: { restaurantId: number }) => {
    const menuKey = getMenuKeyNameByRestaurantId(restaurantId)
    const cookieMenuName = `${CookieTypes.menu}/${menuKey}`;

    const cookieMenu = Cookie.getCookie(cookieMenuName);

    const menuProps: MenuPropsType = {
        menuKey,
        products: [],
    }

    if (cookieMenu) {
        menuProps.products = JSON.parse(cookieMenu);
    } else {
        const products = await fetchMenu(restaurantId);

        if (products) {
            Cookie.setCookie(cookieMenuName, JSON.stringify(products), SEC_PER_HOUR);
            menuProps.products = products;
        }
    }

    return menuProps;
});

export const saveOrderToLocalStorageAsync = createAsyncThunk('pizza/saveOrders', (arg, {getState}) => {
    const state = getState() as RootState;
    const orders = state.pizza.orders;

    LocalStorage.setOrders(orders);
});