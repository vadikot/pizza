import {RootState} from "../store";
import {fetchStatusesType} from "./pizzaSlice";
import {OrderItemType, RestaurantType, SelectOptionsType} from "../../utils/types";
import {createSelector} from "@reduxjs/toolkit";


// Restaurants
export const getAllRestaurants = (state: RootState): RestaurantType[] => state.pizza.restaurants.items;
export const isRestaurantsLoading = (state: RootState): boolean => state.pizza.restaurants.status === fetchStatusesType.loading;
export const getRestaurantsOptions = createSelector(
    [getAllRestaurants],
    (restaurants: RestaurantType[]): SelectOptionsType[] => restaurants.map(item => {
        return {value: item.id, label: item.name} || [];
    })
);

// Menus
export const getAllMenus = (state: RootState) => state.pizza.menus.items;
export const isMenuLoading = (state: RootState) => state.pizza.menus.status === fetchStatusesType.loading;

// Orders
export const getOrderItems = (state: RootState): OrderItemType[] => state.pizza.orders;