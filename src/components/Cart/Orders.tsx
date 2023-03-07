import React, {FC, useCallback, useEffect, useMemo} from "react";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {removeItem, setOrderItems} from "../../store/pizza/pizzaSlice";
import PriceColumn from "./PriceColumn";
import "./Orders.css";
import {OrderItemType} from "../../utils/types";
import {getOrderItems} from "../../store/pizza/pizzaSelectors";
import {LocalStorage} from "../../utils/global";
import {saveOrderToLocalStorageAsync} from "../../store/pizza/pizzaThunks";

const Orders: FC = () => {
    const items = useAppSelector(getOrderItems);
    const dispatch = useAppDispatch();

    const removeItemHandler = useCallback((id: number) => {
        dispatch(removeItem(id));
        dispatch(saveOrderToLocalStorageAsync());
    }, []);

    const getColumns = useCallback((item: OrderItemType) => (
        <tr key={item.id}>
            <td>{item.restaurant.name}</td>
            <td>{item.product.name}</td>
            <PriceColumn orderID={item.id} price={item.price}/>
            <td className="calculation__actions-column">
                <button className="app-button" onClick={() => removeItemHandler(item.id)}>Remove</button>
            </td>
        </tr>
    ), []);

    const sum = useMemo(() => {
        return items.reduce((sum, item) => sum + item.price, 0);
    }, [items]);

    useEffect(() => {
        if (!items?.length) {
            const orderItems = LocalStorage.getOrders();

            if (orderItems) {
                dispatch(setOrderItems(orderItems));
            }
        }
    }, []);

    return (
        <table className="calculation">
            <thead>
            <tr>
                <th>Restaurant</th>
                <th>Product</th>
                <th>Cost</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {items?.map(getColumns)}
            </tbody>
            <tfoot>
            <tr>
                <td className="calculation__summary" colSpan={2}>Summary:</td>
                <td className="calculation__sum">{sum} USD</td>
            </tr>
            </tfoot>
        </table>
    );
};

export default Orders;