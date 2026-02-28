import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import InputW from '../../Utils/InputW';
import { useUser } from '../Context/useUser';

export default function Find() {
    const { 
        menu, cart, setCart, currency, 
        setComboSelection 
    } = useUser();

    const [showResults, setShowResults] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const categorias = useMemo(() => {
        return [...new Set(menu?.map(item => item.type))];
    }, [menu]);

    const baseInputStyle = "w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-[11px] text-white outline-none focus:border-dorado/30 transition-all";

    const updateQty = (id, delta) => {
        const item = menu.find(i => i._id === id);
        const newQty = Math.max(0, (cart[id] || 0) + delta);
        
        setCart(prev => ({ ...prev, [id]: newQty }));

        if (newQty === 0 && item?.type === "COMBO") {
            setComboSelection(prev => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });
        }
    };

    return (
        <div className="space-y-3">
            <div className="relative">
                <InputW icon={Search}>
                    <input
                        type="text" 
                        placeholder="Buscar producto..." 
                        value={searchTerm}
                        onFocus={() => setShowResults(true)}
                        onBlur={() => setTimeout(() => setShowResults(false), 200)} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={baseInputStyle.replace("pl-9", "pl-11 py-3.5 text-sm")}
                    />
                </InputW>

                {showResults && searchTerm && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[60] max-h-60 overflow-y-auto">
                        {menu?.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                            <button 
                                key={item._id} 
                                onClick={() => { 
                                    updateQty(item._id, 1); 
                                    setSearchTerm(""); 
                                    setShowResults(false); 
                                }} 
                                className="w-full p-4 flex justify-between items-center hover:bg-dorado/10 border-b border-white/5 last:border-0"
                            >
                                <span className="text-xs font-bold text-white uppercase">{item.name}</span>
                                <span className="text-dorado font-mono text-[10px]">{currency}{item.price.toFixed(2)}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {categorias.map(cat => (
                    <button
                        key={cat}
                        onClick={() => {
                            setActiveCategory(activeCategory === cat ? null : cat);
                            setSearchTerm("");
                        }}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                            activeCategory === cat
                            ? "bg-dorado border-dorado text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                            : "bg-white/[0.03] border-white/5 text-gray-400 hover:border-white/20"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            
            {activeCategory && (
                <div className="bg-black/40 border border-dorado/20 rounded-2xl p-2 grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-200">
                    {menu?.filter(i => i.type === activeCategory).map(item => (
                        <button
                            key={item._id}
                            onClick={() => updateQty(item._id, 1)}
                            className="flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-dorado/5 hover:border-dorado/30 transition-all text-left group"
                        >
                            <span className="text-[10px] font-bold text-white uppercase group-hover:text-dorado transition-colors">
                                {item.name}
                            </span>
                            <span className="text-gray-500 font-mono text-[9px]">
                                {currency}{item.price.toFixed(2)}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}