import axios from "axios";
import {ProductType, RestaurantType} from "../../utils/types";


export const PIZZA_URL = 'https://private-anon-82254b1941-pizzaapp.apiary-mock.com';

export const fetchRestaurants = async (): Promise<RestaurantType[]> => {
    try {
        const response = await axios.get<RestaurantType[]>(`${PIZZA_URL}/restaurants/`);

        return response.data;
    } catch (e) {
        throw(e);
    }
}

export async function fetchMenu(restaurantID: number): Promise<ProductType[]> {
    try {
        const response = await axios.get<ProductType[]>(`${PIZZA_URL}/restaurants/${restaurantID}/menu?category=Pizza&orderBy=rank`);

        return response.data;
    } catch (e) {
        throw(e);
    }
}