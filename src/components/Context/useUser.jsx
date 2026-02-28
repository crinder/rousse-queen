import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'

const Context = createContext();

export const AuthProvider = ({ children }) => {
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState({});
    const [comboSelection, setComboSelection] = useState({});
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [currency, setCurrency] = useState("$");
    const [sales, setSales] = useState([]);

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

    const currentTotal = currentSubtotal + deliveryFee;

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

                comboDetail: product?.type === "COMBO" ? {
                    burgers: comboSelection[id]?.burgers || [],
                    extras: comboSelection[id]?.extras || []
                } : undefined
            };
        });

        const payload = {
            name: order.name,
            status: order.status,
            referencia: order.paymentMethod === "USD" ? `EFECTIVO: ${order.cash}` : order.referencia,
            items: [{ item: itemsParaBackend }],
            delivery: [{ id_delivery: order.zona?._id, cost: deliveryFee }],
            payment: [{
                currency: order.paymentMethod,
                amount: currentTotal,
                totalusd: order.paymentMethod === "USD" ? currentTotal : 0,
                totalbs: order.paymentMethod === "BS" ? currentTotal : 0,
            }]
        };

        const uiHistorial = {
            id: Date.now().toString(),
            name: order.name,
            total: currentTotal,
            deliveryFee: deliveryFee,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            items: itemsParaBackend.map(i => `${i.quantity}x ${i.name}`)
        };

        setSales(prev => [uiHistorial, ...prev]);

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
            order, setOrder
        }}>
            {children}
        </Context.Provider>
    )
}

export const useUser = () => useContext(Context);