import React, {FC, useState} from "react";
import {useAppDispatch} from "../../store/hooks";
import {changeOrderItemPrice} from "../../store/pizza/pizzaSlice";
import {saveOrderToLocalStorageAsync} from "../../store/pizza/pizzaThunks";

interface PriceColumnPropsType {
    orderID: number;
    price: number;
}

const PriceColumn: FC<PriceColumnPropsType> = ({orderID, price}) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [newPrice, setNewPrice] = useState<number>(price);

    const dispatch = useAppDispatch();

    const toggleInputVisibility = (): void => {
        setIsVisible(prevState => !prevState);
    }

    const priceInputOnKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    }

    const saveNewPriceHandler = () => {
        dispatch(changeOrderItemPrice({id: orderID, price: newPrice}));
        dispatch(saveOrderToLocalStorageAsync());
        toggleInputVisibility();
    }

    return (
        <td className="calculation__price-column">
            <span onClick={toggleInputVisibility} className="price">{price}</span>
            {
                isVisible &&
                <div>
                    <input
                        value={newPrice}
                        onKeyPress={priceInputOnKeyPress}
                        onChange={(e) => setNewPrice(+e.target?.value || 0)}
                    />
                    <button onClick={saveNewPriceHandler}>save</button>
                </div>
            }
        </td>
    );
};

export default PriceColumn;