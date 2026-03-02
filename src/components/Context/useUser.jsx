import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { apis } from "../../Utils/api";
import { useQuery } from "@tanstack/react-query";

const Context = createContext();

export const AuthProvider = ({ children }) => {
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState({});
    const [comboSelection, setComboSelection] = useState({});
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [currency, setCurrency] = useState("$");
    const [sales, setSales] = useState([]);
    const [rate, setRate] = useState(0);
    const [generalObservation, setGeneralObservation] = useState("");
    const [spicySelection, setSpicySelection] = useState({});

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
        cash: 0
    });

    const currentSubtotal = useMemo(() => {
        return Object.entries(cart).reduce((sum, [id, qty]) => {
            const item = menu.find(m => m._id === id);
            return item ? sum + item.price * qty : sum;
        }, 0);
    }, [cart, menu]);

    let tasa = 1


    if (order.paymentMethod === "USD" ? tasa = rate : tasa = 1);

    const currentTotal = (currentSubtotal + deliveryFee) / tasa;

    if (order.paymentMethod === "USD") {
        order.cash = currentTotal;
    }

    const totalSales = useMemo(() => sales.reduce((sum, s) => sum + s.total, 0), [sales]);
    const totalDelivery = useMemo(() => sales.reduce((sum, s) => sum + s.deliveryFee, 0), [sales]);

    const handleAddSale = () => {
        const itemsParaBackend = Object.entries(cart).map(([id, qty]) => {
            const product = menu.find(m => m._id === id);

            return {
                menuItemId: id,
                name: product?.name,
                unitPrice: product?.price,
                quantity: qty,
                // Guardamos la nota general aquí, ya que tu esquema la tiene por item
                observation: generalObservation || "",

                comboDetail: product?.type === "COMBO" ? {
                    burgers: Object.entries(comboSelection[id] || {})
                        .filter(([key, qty]) => typeof qty === 'number' && qty > 0)
                        .map(([burgerId, quantity]) => {
                            const burgerInfo = menu.find(m => m._id === burgerId);
                            return {
                                name: burgerInfo?.name || "Hamburguesa",
                                quantity: quantity
                            };
                        }),
                    extras: (product.comboConfig?.extras || []).map(ext => {
                        const extraId = ext.item?._id || ext.item;
                        const extraInfo = menu.find(m => m._id === extraId);
                        const spicy = spicySelection[`${id}_${extraId}`];

                        return {
                            // Concatenamos el picante al nombre porque el modelo solo tiene name y quantity
                            name: spicy ? `${extraInfo?.name} (${spicy})` : extraInfo?.name,
                            quantity: 1
                        };
                    })
                } : { burgers: [], extras: [] }
            };
        });

        const payload = {
            name: order.name,
            status: order.status || "PENDIENTE",
            referencia: order.paymentMethod === "USD" ? `EFECTIVO: ${order.cash}` : order.referencia,
            // IMPORTANTE: Tu esquema pide un array de itemSchema, y cada itemSchema tiene un array 'item'
            items: [{ item: itemsParaBackend }],
            delivery: [{ id_delivery: order.zona?._id, cost: deliveryFee }],
            payment: [{
                currency: order.paymentMethod,
                amount: currentTotal,
                totalusd: order.paymentMethod === "USD" ? currentTotal : 0,
                totalbs: order.paymentMethod === "BS" ? currentTotal : 0,
            }],
            caja: order.cajaId
        };

        return payload;
    };

    return (
        <Context.Provider value={{
            menu, setMenu,
            cart, setCart,
            comboSelection, setComboSelection,
            deliveryFee, setDeliveryFee,
            currentSubtotal,
            currentTotal,
            currency, setCurrency,
            handleAddSale,
            totalSales,
            totalDelivery,
            sales, setSales,
            order, setOrder,
            rate, setRate,
            spicySelection, setSpicySelection,
            generalObservation, setGeneralObservation
        }}>
            {children}
        </Context.Provider>
    )
}

export const useUser = () => useContext(Context);