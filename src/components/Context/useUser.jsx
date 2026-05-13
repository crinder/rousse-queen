import React, { createContext, useContext, useState, useMemo,useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { apis } from "../../Utils/api";

const Context = createContext();

export const AuthProvider = ({ children }) => {
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState({});
    const [comboSelection, setComboSelection] = useState({});
    const [spicySelection, setSpicySelection] = useState({});
    const [generalObservation, setGeneralObservation] = useState("");
    const [rate, setRate] = useState(0);

    const { data: caja, isLoading } = useQuery({
        queryKey: ['caja'],
        queryFn: () => apis.get('util/getBox'),
        staleTime: 1000 * 60 * 10,
    });

    const cajaData = caja?.caja[0];

    useEffect(() => {
        if (cajaData) {
            setRate(Number(cajaData.rate));
        }
    }, [cajaData]);

    const [order, setOrder] = useState({
        name: "",
        status: "PENDIENTE",
        referencia: "",
        paymentMethod: "BS",
        zona: null,
    });

    const isCartValid = useMemo(() => {
        const hasItems = Object.keys(cart).some(id => cart[id] > 0);
        const hasName = order.name.trim().length > 0;
        return hasItems && hasName;
    }, [cart, order.name]);

    const getOrderPayload = () => {
        const itemsParaBackend = Object.entries(cart)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => {
                const product = menu.find(m => m._id === id);
                return {
                    menuItemId: id,
                    quantity: qty,
                    observation: generalObservation || "",
                    comboDetail: product?.type === "COMBO" ? {
                        burgers: Object.entries(comboSelection[id] || {})
                            .filter(([_, q]) => q > 0)
                            .map(([burgerId, quantity]) => ({
                                name: menu.find(m => m._id === burgerId)?.name,
                                quantity
                            })),
                        extras: []
                    } : { burgers: [], extras: [] }
                };
            });

        return {
            name: order.name,
            status: order.status,
            referencia: order.referencia,
            paymentMethod: order.paymentMethod,
            deliveryZoneId: order.zona?._id,
            items: [{ item: itemsParaBackend }],
            rate: rate
        };
    };

    return (
        <Context.Provider value={{
            menu, setMenu,
            cart, setCart,
            comboSelection, setComboSelection,
            order, setOrder,
            rate, setRate,
            spicySelection, setSpicySelection,
            generalObservation, setGeneralObservation,
            isCartValid,
            getOrderPayload
        }}>
            {children}
        </Context.Provider>
    );
};

export const useUser = () => useContext(Context);