import React, { useState, useMemo } from 'react';
import { Plus, Minus } from 'lucide-react';
import Find from './Find';
import Datos from './Datos';
import { useUser } from '../Context/useUser';

export default function Registrar() {

    const {
        menu, cart, setCart,
        comboSelection, setComboSelection
    } = useUser();

    const itemsInCart = useMemo(() =>
        menu?.filter(item => cart[item._id] > 0),
        [menu, cart]);

    const updateQty = (id, delta, type) => {
        const newQty = Math.max(0, (cart[id] || 0) + delta);
        setCart(prev => ({ ...prev, [id]: newQty }));

        if (newQty === 0 && type === "COMBO") {
            setComboSelection(prev => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });
        }
    };

    const updateComboQty = (comboId, burgerId, delta, maxPerCombo) => {
        const comboQtyInCart = cart[comboId] || 0;
        const totalMaxAllowed = maxPerCombo * comboQtyInCart;

        setComboSelection(prev => {
            const currentSelections = prev[comboId] || {};
            const currentTotal = Object.values(currentSelections).reduce((a, b) => a + b, 0);
            const currentQty = currentSelections[burgerId] || 0;

            if (delta > 0 && currentTotal >= totalMaxAllowed) return prev;

            const newQty = Math.max(0, currentQty + delta);

            return {
                ...prev,
                [comboId]: {
                    ...currentSelections,
                    [burgerId]: newQty
                }
            };
        });
    };

    return (
        <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-300">

            <Find />

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <div className="grid grid-cols-1 gap-3 pb-4">
                    {itemsInCart?.map(item => (
                        <div key={item._id} className="p-3 rounded-[20px] border bg-white/[0.02] border-white/5 flex flex-col space-y-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black text-white uppercase leading-tight">{item.name}</p>
                                    <p className="text-dorado font-mono text-[9px]">${item.price.toFixed(2)}</p>
                                </div>

                                <div className="flex items-center gap-3 bg-black/40 rounded-xl p-1.5 border border-white/5">
                                    <button onClick={() => updateQty(item._id, -1, item.type)} className="text-gray-500 hover:text-white transition-colors">
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-white font-black text-xs">{cart[item._id]}</span>
                                    <button onClick={() => updateQty(item._id, 1, item.type)} className="text-dorado hover:scale-110 transition-transform">
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Lógica de Combos */}
                            {item.type === "COMBO" && item.comboConfig && (
                                <div className="mt-2 pt-2 border-t border-white/5 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                                            Selecciona {item.comboConfig.burgerMax * cart[item._id]} hamburguesas
                                        </p>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${Object.values(comboSelection[item._id] || {}).reduce((a, b) => a + b, 0) === (item.comboConfig.burgerMax * cart[item._id])
                                            ? "bg-green-500/20 text-green-500"
                                            : "bg-dorado/10 text-dorado"
                                            }`}>
                                            {Object.values(comboSelection[item._id] || {}).reduce((a, b) => a + b, 0)} / {item.comboConfig.burgerMax * cart[item._id]}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                        {item.comboConfig.allowedBurgers?.map((burger) => {
                                            const selectedQty = comboSelection[item._id]?.[burger._id] || 0;
                                            return (
                                                <div key={burger._id} className={`flex items-center justify-between p-2 rounded-xl border transition-all ${selectedQty > 0 ? "bg-dorado/5 border-dorado/30" : "bg-black/20 border-white/5"}`}>
                                                    <span className="text-[10px] text-white font-medium uppercase truncate pr-2">
                                                        {burger.name}
                                                    </span>
                                                    <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/5">
                                                        <button onClick={() => updateComboQty(item._id, burger._id, -1, item.comboConfig.burgerMax)} className="text-gray-500 hover:text-white">
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="text-white font-bold text-[10px] min-w-[12px] text-center">
                                                            {selectedQty}
                                                        </span>
                                                        <button onClick={() => updateComboQty(item._id, burger._id, 1, item.comboConfig.burgerMax)} className="text-dorado hover:scale-110">
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Datos />

        </div>
    );
}