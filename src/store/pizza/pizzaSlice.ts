import {MenuItemsType, MenuPropsType, OrderItemType, RestaurantType} from "../../utils/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchAllRestaurantsAsync, fetchMenuAsync} from "./pizzaThunks";


export enum fetchStatusesType {
    idle = 'idle',
    loading = 'loading',
    succeeded = 'succeeded',
    failed = 'failed',
}

interface PizzaState {
    restaurants: {
        items: RestaurantType[],
        status: fetchStatusesType,
    },
    menus: {
        items: MenuItemsType,
        status: fetchStatusesType,
    },
    orders: OrderItemType[],
}

const initialState = {
    restaurants: {
        items: [],
        status: fetchStatusesType.idle,
    },
    menus: {
        items: {},
        status: fetchStatusesType.idle,
    },
    orders: []
} as PizzaState;

const pizzaSlice = createSlice({
    name: 'pizza',
    initialState,
    reducers: {
        addItemToOrders(state, action: PayloadAction<OrderItemType>) {
            state.orders.push(action.payload);
        },
        removeItem(state, action: PayloadAction<number>) {
            state.orders = state.orders.filter(item => item.id !== action.payload);
        },
        changeOrderItemPrice(state, action: PayloadAction<{ id: number; price: number }>) {
            state.orders = state.orders.map(item => item.id === action.payload.id ? {
                ...item,
                price: action.payload.price,
            } : {...item});
        },
        setOrderItems(state, action: PayloadAction<OrderItemType[]>) {
            state.orders = action.payload;
        },
    },
    extraReducers: (builder => {
        builder
            .addCase(fetchAllRestaurantsAsync.pending, (state) => {
                state.restaurants.status = fetchStatusesType.loading;
            })
            .addCase(fetchAllRestaurantsAsync.fulfilled, (state, action: PayloadAction<RestaurantType[]>) => {
                state.restaurants.status = fetchStatusesType.succeeded;
                state.restaurants.items = action.payload;
            })
            .addCase(fetchAllRestaurantsAsync.rejected, (state) => {
                state.restaurants.status = fetchStatusesType.failed;
            })
            .addCase(fetchMenuAsync.pending, (state) => {
                state.menus.status = fetchStatusesType.loading;
            })
            .addCase(fetchMenuAsync.fulfilled, (state, action: PayloadAction<MenuPropsType>) => {
                state.menus.status = fetchStatusesType.succeeded;

                state.menus.items = {
                    ...state.menus.items,
                    [action.payload.menuKey]: action.payload.products,
                };
            })
            .addCase(fetchMenuAsync.rejected, (state) => {
                state.menus.status = fetchStatusesType.failed;
            });
    })
})

export const {
    addItemToOrders,
    removeItem,
    changeOrderItemPrice,
    setOrderItems
} = pizzaSlice.actions
export default pizzaSlice.reducer