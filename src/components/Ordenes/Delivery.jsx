import React, { useState, useMemo } from 'react';
import { MapPin, X, User } from 'lucide-react';
import InputW from '../../Utils/InputW';
import { useQuery } from "@tanstack/react-query";
import { apis } from "../../Utils/api";
import { useManagerOrdern } from '../../Hooks/useManagerOrdern'

export default function Delivery() {
    const { data, actions, state } = useManagerOrdern();
    const { order, totals } = data;

    const [searchDelivery, setSearchDelivery] = useState(order.zona?.zona || "");
    const [showDeliveryResults, setShowDeliveryResults] = useState(false);

    const { data: deliveryData } = useQuery({
        queryKey: ['delivery'],
        queryFn: () => apis.get('delivery/deliveries'),
        staleTime: 1000 * 60 * 10,
    });

    const baseInputStyle = "w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-[11px] text-white outline-none focus:border-dorado/30 transition-all";

    const filteredDelivery = useMemo(() => {
        if (!searchDelivery || !deliveryData?.deliveries) return [];
        return deliveryData.deliveries.filter(d =>
            d.zona.toLowerCase().includes(searchDelivery.toLowerCase())
        );
    }, [deliveryData, searchDelivery]);

    const handleSelectZona = (zonaObj) => {
        actions.setOrder(prev => ({ ...prev, zona: zonaObj }));
        setSearchDelivery(zonaObj.zona);
        setShowDeliveryResults(false);
    };

    const handleClearZona = () => {
        actions.setOrder(prev => ({ ...prev, zona: null }));
        setSearchDelivery("");
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <InputW icon={User}>
                <input
                    type="text"
                    placeholder="NOMBRE DEL CLIENTE..."
                    value={order.name}
                    onChange={(e) => actions.setOrder({ ...order, name: e.target.value.toUpperCase() })}
                    className={baseInputStyle}
                />
            </InputW>

            <div className="relative">
                <InputW icon={MapPin}>
                    <input
                        type="text"
                        placeholder="BUSCAR ZONA (DELIVERY)..."
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
                            onClick={handleClearZona}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    )}
                </InputW>

                {showDeliveryResults && searchDelivery && (
                    <div className="absolute bottom-full left-0 w-full mb-2 bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-48 overflow-y-auto custom-scrollbar">
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
                    </div>
                )}
            </div>

            <div className="flex justify-between items-end px-1 pt-2">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-500 uppercase italic">Delivery</span>
                    <p className="text-white font-mono text-lg font-bold">
                        ${totals.deliveryBS > 0 ? totals.deliveryBS / totals.rate : 0} 
                        <span className="text-[10px] ml-1 text-gray-500">
                            (Bs. {totals.deliveryBS.toFixed(2)})
                        </span>
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-[9px] font-black text-gray-500 uppercase italic">Total a Pagar</span>
                    <p className="text-4xl font-black text-dorado italic tracking-tighter leading-none">
                        Bs. {totals.totalBS.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-mono text-gray-400">
                        ${totals.totalUSD.toFixed(2)} USD
                    </p>
                </div>
            </div>

            <button
                onClick={actions.handleAddOrder}
                disabled={!totals.hasItems || !order.name || state.isLoading}
                className="w-full bg-dorado text-black font-black py-4 rounded-2xl shadow-xl active:scale-95 disabled:opacity-20 transition-all uppercase tracking-[0.2em] text-[11px]"
            >
                {state.isLoading ? "Procesando..." : "Confirmar Orden"}
            </button>
        </div>
    );
}