import { useState, useMemo } from "react";
import { useOrdernQueries } from "./useOrdern";
import { useUser } from "../components/Context/useUser";

export const useManagerOrdern = () => {
    const { addOrdernItem, isLoading: isQueryLoading } = useOrdernQueries();
    const { cart, setCart, menu, rate, order, setOrder,
        comboSelection, setComboSelection,
        spicySelection, setSpicySelection,
        generalObservation, setGeneralObservation
    } = useUser();

    const [toast, setToast] = useState(null);
    const totals = useMemo(() => {
        let subUSD = 0;
        let subBS = 0;

        Object.entries(cart).forEach(([id, qty]) => {
            if (qty <= 0) return;
            const p = menu.find(m => m._id === id);
            if (!p) return;

            let unitPriceUSD = 0;
            let unitPriceBS = 0;

            if (p.moneda === "USD") {
                unitPriceUSD = p.price;
                unitPriceBS = p.price * rate;
            } else {
                unitPriceBS = p.price;
                unitPriceUSD = p.price / rate;
            }


            subUSD += unitPriceUSD * qty;
            subBS += unitPriceBS * qty;
        });

        const deliveryUSD = order.zona?.cost || 0;
        const deliveryBS = deliveryUSD * rate;
        const totalUSD = subUSD + deliveryUSD;
        const totalBS = subBS + deliveryBS;

        return {
            totalUSD,
            totalBS,
            deliveryBS,
            hasItems: Object.values(cart).some(q => q > 0)
        };
    }, [cart, menu, rate, order.zona]);

    const handleAddOrder = async () => {
        if (!totals.hasItems) {
            setToast({ message: "El carrito está vacío", type: "error" });
            return;
        }

        const itemsSaved = Object.entries(cart)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => {
                const p = menu.find(m => m._id === id);
                const obsPicante = spicySelection[id] ? `[PICANTE: ${spicySelection[id]}] ` : "";

                return {
                    menuItemId: id,
                    quantity: qty,
                    observation: `${obsPicante}${generalObservation}`.trim(),
                    comboDetail: p?.type === "COMBO" ? {
                        burgers: Object.entries(comboSelection[id] || {})
                            .map(([bId, bQty]) => ({
                                name: menu.find(m => m._id === bId)?.name,
                                quantity: bQty
                            })),
                        extras: []
                    } : { burgers: [], extras: [] }
                };
            });

        const payload = {
            name: order.name,
            status: order.status,
            referencia: order.referencia,
            paymentMethod: order.paymentMethod,
            deliveryZoneId: order.zona?._id,
            items: [{ item: itemsSaved }],
            rate: rate
        };

        try {
            await addOrdernItem(payload);
            setToast({ message: "Orden creada con éxito", type: "success" });
            resetCart();
        } catch (error) {
            setToast({ message: "Error al procesar orden", type: "error" });
        }
    };

    const resetCart = () => {
        setCart({});
        setComboSelection({});
        setSpicySelection({});
        setGeneralObservation("");
        setOrder(prev => ({ ...prev, name: "", referencia: "" }));
    };

    const updateQty = (id, delta) => {
        setCart(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
    };

    const updateSpicy = (id, level) => {
        setSpicySelection(prev => ({ ...prev, [id]: level }));
    };

    const updateBurgerInCombo = (comboId, burgerId, delta, max) => {
        const limit = max * (cart[comboId] || 0);

        setComboSelection(prev => {
            const selections = prev[comboId] || {};
            const currentTotal = Object.values(selections).reduce((a, b) => a + b, 0);
            if (delta > 0 && currentTotal >= limit) return prev;
            return {
                ...prev,
                [comboId]: { ...selections, [burgerId]: Math.max(0, (selections[burgerId] || 0) + delta) }
            };
        });
    };

    return {
        state: { isLoading: isQueryLoading, toast },
        data: { totals, order, cart, comboSelection },
        actions: { setToast, setOrder, handleAddOrder, resetCart, updateQty, updateSpicy, updateBurgerInCombo }
    };
};