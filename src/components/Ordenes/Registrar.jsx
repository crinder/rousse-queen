import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, User, CreditCard, Hash, CircleDollarSign, MapPin } from 'lucide-react';
import InputW from '../../Utils/InputW';
// import { Dropdown } from 'primereact/dropdown'; 

export default function Registrar({ 
    menu, cart, setCart, setDeliveryFee, deliveryFee, currency, 
    currentSubtotal, currentTotal, handleAddSale,
    comboSelection, setComboSelection 
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showResults, setShowResults] = useState(false);

    const [order, setOrder] = useState({
        clientName: "",
        status: "PENDIENTE",
        referencia: "",
        paymentMethod: "BS",
        zona: null
    });

    const baseInputStyle = "w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-[11px] text-white outline-none focus:border-dorado/30 transition-all";

    const itemsInCart = useMemo(() => menu?.filter(item => cart[item._id] > 0), [menu, cart]);

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

    const resetForm = () => {
        setOrder({ clientName: "", status: "PENDIENTE", referencia: "", paymentMethod: "BS", zona: null });
        setCart({});
        setComboSelection({});
    };

    return (
        <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-300">
            
            <InputW icon={Search}>
                <input 
                    type="text" placeholder="Agregar producto..." value={searchTerm}
                    onFocus={() => setShowResults(true)}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={baseInputStyle.replace("pl-9", "pl-11 py-3.5 text-sm")}
                />
                {showResults && searchTerm && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto">
                        {menu?.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                            <button key={item._id} onClick={() => { updateQty(item._id, 1); setSearchTerm(""); setShowResults(false); }} className="w-full p-4 flex justify-between items-center hover:bg-dorado/10 border-b border-white/5 last:border-0">
                                <span className="text-xs font-bold text-white uppercase">{item.name}</span>
                                <span className="text-dorado font-mono text-[10px]">{currency}{item.price.toFixed(2)}</span>
                            </button>
                        ))}
                    </div>
                )}
            </InputW>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-[30vh]">
                <div className="grid grid-cols-2 gap-3 pb-4">
                    {itemsInCart?.map(item => (
                        <div key={item._id} className="p-3 rounded-[20px] border bg-white/[0.02] border-white/5 flex flex-col">
                            <p className="text-[10px] font-black text-white uppercase leading-tight min-h-[24px]">{item.name}</p>
                            <div className="flex items-center justify-between bg-black/40 rounded-lg p-1 border border-white/5 my-2">
                                <button onClick={() => updateQty(item._id, -1, item.type)} className="text-gray-500 p-0.5"><Minus size={12} /></button>
                                <span className="text-white font-black text-[10px]">{cart[item._id]}</span>
                                <button onClick={() => updateQty(item._id, 1, item.type)} className="text-dorado p-0.5"><Plus size={12} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[28px] space-y-3">
                
                <InputW icon={User}>
                    <input 
                        type="text" placeholder="Nombre del Cliente" value={order.clientName}
                        onChange={(e) => setOrder({...order, clientName: e.target.value.toUpperCase()})}
                        className={baseInputStyle}
                    />
                </InputW>

                <div className="grid grid-cols-2 gap-3">
                    <InputW icon={CircleDollarSign}>
                        <select 
                            value={order.paymentMethod}
                            onChange={(e) => setOrder({...order, paymentMethod: e.target.value})}
                            className={`${baseInputStyle} appearance-none font-bold`}
                        >
                            <option value="BS">BS (PAGO MÓVIL)</option>
                            <option value="USD">USD (DIVISAS)</option>
                        </select>
                    </InputW>
                    
                    <InputW icon={CreditCard}>
                        <select 
                            value={order.status}
                            onChange={(e) => setOrder({...order, status: e.target.value})}
                            className={`${baseInputStyle} appearance-none font-bold`}
                        >
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="PAGADO">PAGADO</option>
                            <option value="CANCELADO">CANCELADO</option>
                        </select>
                    </InputW>

                    <div className="col-span-2">
                         <InputW icon={MapPin}>
                            <select className={`${baseInputStyle} appearance-none opacity-50`}>
                                <option>Seleccionar Zona de Domicilio...</option>
                            </select>
                         </InputW>
                    </div>

                    {order.paymentMethod === "BS" && order.status === "PAGADO" && (
                        <div className="col-span-2 animate-in slide-in-from-top-1">
                            <InputW icon={Hash}>
                                <input 
                                    type="text" placeholder="Últimos 4 dígitos de referencia" maxLength={4}
                                    value={order.referencia}
                                    onChange={(e) => setOrder({...order, referencia: e.target.value})}
                                    className={`${baseInputStyle} border-dorado/20 font-mono`}
                                />
                            </InputW>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center px-1 pt-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-gray-500 uppercase">Envío:</span>
                        <input 
                            type="number" value={deliveryFee}
                            onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                            className="w-12 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white font-mono text-[10px] outline-none"
                        />
                    </div>
                    <p className="text-3xl font-black text-dorado italic tracking-tighter">
                        {currency}{currentTotal.toFixed(2)}
                    </p>
                </div>

                <button
                    onClick={() => {
                        handleAddSale({
                            name: order.clientName,
                            status: order.status,
                            referencia: order.paymentMethod === "USD" ? "" : order.referencia,
                            paymentMethod: order.paymentMethod,
                            subtotal: currentSubtotal,
                            total: currentTotal,
                            deliveryFee: deliveryFee
                        });
                        resetForm();
                    }}
                    disabled={currentSubtotal === 0 || !order.clientName || (order.paymentMethod === "BS" && order.status === "PAGADO" && order.referencia.length < 4)}
                    className="w-full bg-dorado text-black font-black py-4 rounded-2xl shadow-xl active:scale-95 disabled:opacity-30 transition-all uppercase tracking-[0.2em] text-[11px]"
                >
                    Confirmar
                </button>
            </div>
        </div>
    );
}