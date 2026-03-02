import React, { useState, useMemo } from 'react';
import { MapPin, X, User } from 'lucide-react';
import InputW from '../../Utils/InputW';
import { apis } from "../../Utils/api";
import { useQuery } from "@tanstack/react-query";
import { useUser } from '../Context/useUser';

export default function Delivery() {
    const {
        setCart, currency, currentSubtotal, currentTotal,
        handleAddSale, setComboSelection, deliveryFee, setDeliveryFee, order, setOrder
    } = useUser();

    const [searchDelivery, setSearchDelivery] = useState("");
    const [showDeliveryResults, setShowDeliveryResults] = useState(false);

    const { data: deliveryData } = useQuery({
        queryKey: ['delivery'],
        queryFn: () => apis.get('delivery/deliveries'),
        staleTime: 1000 * 60 * 10,
        networkMode: 'offlineFirst'
    });

    const baseInputStyle = "w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-[11px] text-white outline-none focus:border-dorado/30 transition-all";

    const handleSelectZona = (zonaObj) => {
        setOrder(prev => ({ ...prev, zona: zonaObj }));
        setDeliveryFee(zonaObj.cost);
        setSearchDelivery(zonaObj.zona);
        setShowDeliveryResults(false);
    };

    const resetForm = () => {
        setOrder({ clientName: "", status: "PENDIENTE", referencia: "", paymentMethod: "BS", zona: null, cash: 0 });
        setSearchDelivery("");
        setCart({});
        setComboSelection({});
        setDeliveryFee(0);
    };

    const handleConfirmar = async () => {

        if (currentSubtotal === 0 || !order.name) return;

        const dataFinal = handleAddSale();

        try {
            await apis.post("ordern/add", dataFinal);
            setCart({});
            setComboSelection({});
            setDeliveryFee(0);
            setOrder({
                name: "",
                status: "PENDIENTE",
                referencia: "",
                paymentMethod: "BS",
                zona: null,
                cash: 0
            });

            alert("Venta procesada con éxito");
            invalidateQueries(['ordersByDay']);
        } catch (e) {
            console.error("Error al guardar la orden:", e);
        }
    };

    const filteredDelivery = useMemo(() => {
        if (!searchDelivery || !deliveryData?.deliveries) return [];
        return deliveryData.deliveries.filter(d =>
            d.zona.toLowerCase().includes(searchDelivery.toLowerCase())
        );
    }, [deliveryData, searchDelivery]);

    return (
        <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-300">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[28px] space-y-3">

                <InputW icon={User}>
                    <input
                        type="text"
                        placeholder="NOMBRE DEL CLIENTE..."
                        value={order.name}
                        onChange={(e) => setOrder({ ...order, name: e.target.value.toUpperCase() })}
                        className={baseInputStyle}
                    />
                </InputW>

                <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 relative">
                        <InputW icon={MapPin}>
                            <input
                                type="text"
                                placeholder="BUSCAR ZONA..."
                                value={searchDelivery}
                                onFocus={() => setShowDeliveryResults(true)}
                                onChange={(e) => {
                                    setSearchDelivery(e.target.value.toUpperCase());
                                    setShowDeliveryResults(true);
                                }}
                                className={`${baseInputStyle} ${order.zona ? 'border-dorado/40 text-dorado' : ''}`}
                            />
                            {(order.zona || searchDelivery) && (
                                <button
                                    onClick={() => { setOrder({ ...order, zona: null }); setSearchDelivery(""); setDeliveryFee(0); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </InputW>

                        {showDeliveryResults && searchDelivery && (
                            <div className="absolute bottom-full left-0 w-full mb-2 bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-48 overflow-y-auto">
                                {filteredDelivery.map(d => (
                                    <button
                                        key={d._id}
                                        onClick={() => handleSelectZona(d)}
                                        className="w-full p-3 flex justify-between items-center hover:bg-dorado/10 border-b border-white/5 last:border-0 text-left"
                                    >
                                        <span className="text-[10px] font-bold text-white uppercase">{d.zona}</span>
                                        <span className="text-dorado font-mono text-[10px]">${d.cost.toFixed(2)}</span>
                                    </button>
                                ))}
                                {filteredDelivery.length === 0 && (
                                    <div className="p-3 text-[10px] text-gray-500 italic text-center">No hay coincidencias</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-end px-1 pt-2">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-500 uppercase italic">Delivery</span>
                        <p className="text-white font-mono text-lg font-bold">
                            {currency}{deliveryFee.toFixed(2)}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-[9px] font-black text-gray-500 uppercase italic">Total a Pagar</span>
                        <p className="text-4xl font-black text-dorado italic tracking-tighter leading-none">
                            {currency}{currentTotal.toFixed(2)}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleConfirmar}
                    disabled={currentSubtotal === 0 || !order.name}
                    className="w-full bg-dorado text-black font-black py-4 rounded-2xl shadow-xl active:scale-95 disabled:opacity-30 transition-all uppercase tracking-[0.2em] text-[11px]"
                >
                    Confirmar
                </button>
            </div>
        </div>
    );
}