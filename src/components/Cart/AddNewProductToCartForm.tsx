import React, {FC, useCallback, useEffect, useMemo, useState} from "react";
import Select from "react-select";
import "./AddNewProductToCartForm.css";
import {
    getAllMenus,
    getAllRestaurants,
    getRestaurantsOptions,
    isMenuLoading as isMenuLoadingSelector,
    isRestaurantsLoading as isRestaurantsLoadingSelector,
} from "../../store/pizza/pizzaSelectors";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {OrderItemType, ProductType, RestaurantType, SelectOptionsType} from "../../utils/types";
import {addItemToOrders} from "../../store/pizza/pizzaSlice";
import {fetchAllRestaurantsAsync, fetchMenuAsync, saveOrderToLocalStorageAsync} from "../../store/pizza/pizzaThunks";
import {getMenuKeyNameByRestaurantId} from "../../utils/global";
import Loader from "../Loader";

const AddNewProductToCartForm: FC = () => {
    const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantType | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchAllRestaurantsAsync());
    }, [])

    const restaurants = useAppSelector(getAllRestaurants);
    const restaurantsOptions = useAppSelector(getRestaurantsOptions);
    const allMenus = useAppSelector(getAllMenus);
    const isMenuLoading = useAppSelector(isMenuLoadingSelector);
    const isRestaurantsLoading = useAppSelector(isRestaurantsLoadingSelector);

    const productOptionsBySelectedRestaurant = useMemo(() => {
        if (!selectedRestaurant) return [];

        const keyName = getMenuKeyNameByRestaurantId(selectedRestaurant.id)

        if (Object.keys(allMenus)?.length) {
            return allMenus[keyName]?.map(item => {
                return {value: item.id, label: item.name};
            }) || [];
        }
    }, [allMenus, selectedRestaurant]);

    const restaurantSelectHandler = useCallback((option: SelectOptionsType | null): void => {
        if (option) {
            const selectedRestaurant = restaurants.find(item => item.id === option.value);

            if (selectedRestaurant) {
                setSelectedRestaurant(selectedRestaurant);

                const menuKey = getMenuKeyNameByRestaurantId(option.value);

                if (!allMenus.hasOwnProperty(menuKey) || allMenus[menuKey]?.length === 0) {
                    dispatch(fetchMenuAsync({restaurantId: option.value}));
                }
            }
        } else {
            setSelectedRestaurant(null);
        }
    }, [restaurantsOptions]);

    const productSelectHandler = useCallback((option: SelectOptionsType | null): void => {
        if (option) {
            if (selectedRestaurant) {
                const menuKey = getMenuKeyNameByRestaurantId(selectedRestaurant.id);

                if (allMenus[menuKey]?.length) {
                    const selectedProduct = allMenus[menuKey].find(item => item.id === option.value);

                    if (selectedProduct) {
                        setSelectedProduct(selectedProduct);
                    }
                } else {
                    dispatch(fetchMenuAsync({restaurantId: selectedRestaurant.id})).then(() => {
                        const selectedProduct = allMenus[menuKey]?.find(item => item.id === option.value);

                        if (selectedProduct) {
                            setSelectedProduct(selectedProduct);
                        }
                    });
                }
            }
        } else {
            setSelectedProduct(null);
        }
    }, [productOptionsBySelectedRestaurant]);

    const addToTableHandler = useCallback(() => {
        if (selectedRestaurant && selectedProduct) {
            const newOrderItem: OrderItemType = {
                id: Date.now(),
                restaurant: selectedRestaurant,
                product: selectedProduct,
                price: selectedProduct.price,
            }

            dispatch(addItemToOrders(newOrderItem));
            dispatch(saveOrderToLocalStorageAsync());
        }
    }, [selectedRestaurant, selectedProduct]);

    return (
        <div className="order__form">
            {
                (isRestaurantsLoading || isMenuLoading) && <Loader/>
            }
            <h2>Create new entry</h2>
            <Select
                className="order__form__select"
                options={restaurantsOptions}
                onChange={restaurantSelectHandler}
            />
            <Select
                className="order__form__select"
                options={productOptionsBySelectedRestaurant}
                onChange={productSelectHandler}
                isDisabled={!selectedRestaurant}
            />
            <button
                className="app-button"
                disabled={!selectedProduct}
                onClick={addToTableHandler}
            >
                Add To Table
            </button>
        </div>
    );
};

export default AddNewProductToCartForm;