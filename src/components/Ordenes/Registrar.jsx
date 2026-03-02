import React, { useState, useMemo } from 'react';
import { Plus, Minus } from 'lucide-react';
import Find from './Find';
import Datos from './Datos';
import { useUser } from '../Context/useUser';

export default function Registrar() {

    const {
        menu, cart, setCart,
        comboSelection, setComboSelection,
        generalObservation, setGeneralObservation,
        spicySelection, setSpicySelection
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

                            <div key={item._id} className="p-3 rounded-[20px] border bg-white/[0.02] border-white/5 flex flex-col space-y-2">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase leading-tight">
                                            {item.name}
                                            {/* Mostramos el nivel seleccionado al lado del nombre si existe */}
                                            {spicySelection[item._id] && (
                                                <span className="text-orange-500 ml-2">[{spicySelection[item._id]}]</span>
                                            )}
                                        </p>
                                        <p className="text-dorado font-mono text-[9px]">${item.price.toFixed(2)}</p>
                                    </div>


                                </div>

                                {/* LÓGICA PARA ALITAS (PICANTE) */}
                                {item.name.toUpperCase().includes("ALITAS") && cart[item._id] > 0 && (
                                    <div className="mt-1 pt-2 border-t border-white/5">
                                        <p className="text-[8px] font-black text-orange-500/70 uppercase tracking-[0.2em] mb-2">
                                            ¿Nivel de picante?
                                        </p>
                                        <div className="flex gap-2">
                                            {["POCO", "MEDIO", "PICANTE"].map((level) => (
                                                <button
                                                    key={level}
                                                    onClick={() => setSpicySelection(prev => ({ ...prev, [item._id]: level }))}
                                                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all border ${spicySelection[item._id] === level
                                                        ? "bg-orange-500 text-black border-transparent"
                                                        : "bg-white/5 text-gray-500 border-white/5"
                                                        }`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
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

                                    {item.comboConfig.extras?.map((extra) => {
                                        const extraInfo = menu.find(m => m._id === (extra.item?._id || extra.item));
                                        const isWingsExtra = extraInfo?.name.toUpperCase().includes("ALITAS");

                                        // Al ser obligatorio, forzamos que esté seleccionado internamente
                                        const isSelected = true;

                                        return (
                                            <div key={extraInfo?._id} className="space-y-2 mb-3">
                                                <div className="flex items-center justify-between p-2 rounded-xl border bg-dorado/5 border-dorado/30">
                                                    <span className="text-[10px] text-white font-medium uppercase italic">
                                                        {extraInfo?.name}
                                                    </span>
                                                    <span className="text-[8px] text-dorado font-bold">INCLUIDO</span>
                                                </div>

                                                {/* Configuración de Picante si son alitas */}
                                                {isWingsExtra && (
                                                    <div className="ml-4 p-2 bg-orange-500/5 border-l-2 border-orange-500 rounded-r-lg">
                                                        <p className="text-[7px] font-black text-orange-500 uppercase mb-1">
                                                            Nivel de picante:
                                                        </p>
                                                        <div className="flex gap-1">
                                                            {["POCO", "MEDIO", "PICANTE"].map((level) => (
                                                                <button
                                                                    key={level}
                                                                    onClick={() => setSpicySelection(prev => ({
                                                                        ...prev,
                                                                        [`${item._id}_${extraInfo._id}`]: level
                                                                    }))}
                                                                    className={`flex-1 py-1 rounded-md text-[8px] font-bold transition-all ${spicySelection[`${item._id}_${extraInfo._id}`] === level
                                                                            ? "bg-orange-600 text-white"
                                                                            : "bg-white/5 text-gray-500 border border-white/5"
                                                                        }`}
                                                                >
                                                                    {level}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="mt-6 space-y-2">
                                <label className="text-[10px] font-black text-dorado uppercase tracking-widest ml-1">
                                    Observaciones adicionales
                                </label>
                                <div className="relative">
                                    <textarea
                                        value={generalObservation}
                                        onChange={(e) => setGeneralObservation(e.target.value)}
                                        placeholder="Ej: Sin cebolla, por favor enviar servilletas extras..."
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-dorado/40 transition-all resize-none"
                                        rows="3"
                                    />
                                    <div className="absolute bottom-3 right-3 opacity-20">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Datos />

        </div>
    );
}