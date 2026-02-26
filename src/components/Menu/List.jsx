import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { apis } from "../../Utils/api";
import { Trash2, Search, X, ChevronDown, ChevronUp, Package, Plus } from "lucide-react";

export default function List({ visible, onHide }) {
    const [menuList, setMenuList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("ALL");
    const [expandedCombo, setExpandedCombo] = useState(null);

    const fetchMenu = async () => {
        try {
            const response = await apis.get("menu/menus");
            setMenuList(response.data || response.menus || []);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { if (visible) fetchMenu(); }, [visible]);

    const toggleCombo = (id) => {
        setExpandedCombo(expandedCombo === id ? null : id);
    };

    const filteredMenu = menuList.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "ALL" || item.type === filterType;
        return matchesSearch && matchesType;
    });

    const deleteItem = (id) => {
        try{
            apis.post(`menu/delete/${id}`);
            alert("¡Producto eliminado!");
        } catch (e) {
            alert("Error al eliminar");
        }
        
    };
    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            unstyled
            modal
            draggable={false}
            dismissableMask
            pt={{ closeButton: { className: "hidden" }, header: { className: "hidden" } }}
            className="w-[95vw] md:w-full max-w-4xl bg-[#0F0F0F] border border-white/10 rounded-[24px] shadow-2xl flex flex-col overflow-hidden outline-none"
            maskClassName="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
            <div className="flex flex-col gap-6 w-full p-6 bg-[#0F0F0F] border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-dorado rounded-full" />
                        <span className="text-white font-black tracking-widest uppercase italic text-lg">Catálogo</span>
                    </div>
                    <button onClick={onHide} className="text-gray-500 hover:text-dorado transition-colors outline-none"><X size={24} /></button>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar en el catálogo..."
                            className="w-full bg-[#1A1A1A] border border-white/10 text-white pl-12 py-3 rounded-xl focus:border-dorado/50 outline-none transition-all placeholder:text-gray-600"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                        {["ALL", "BURGER", "COMBO", "ITEM"].map((t) => (
                            <button key={t} onClick={() => setFilterType(t)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all border whitespace-nowrap ${filterType === t ? "bg-dorado text-black border-dorado" : "bg-white/5 text-gray-400 border-white/10 hover:border-dorado/50"}`}>{t}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar bg-[#0F0F0F]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                    {filteredMenu.map((item) => {
                        const isExpanded = expandedCombo === item._id;
                        const isCombo = item.type === "COMBO";

                        return (
                            <div
                                key={item._id}
                                className={`flex flex-col border rounded-xl transition-all duration-300 ${isExpanded ? 'border-dorado/40 bg-white/[0.04]' : 'border-white/5 bg-white/[0.02] hover:border-dorado/20'}`}
                            >
                                <div className="flex items-center justify-between p-3">
                                    <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => isCombo && toggleCombo(item._id)}>
                                        <div className="w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center text-lg shadow-lg">
                                            {item.type === "BURGER" ? "🍔" : item.type === "COMBO" ? "🌟" : "🥤"}
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="text-white font-bold text-xs uppercase tracking-tight italic flex items-center gap-2">
                                                {item.name}
                                                {isCombo && (isExpanded ? <ChevronUp size={12} className="text-dorado" /> : <ChevronDown size={12} className="text-gray-500" />)}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-dorado font-bold text-[11px]">${item.price.toFixed(2)}</span>
                                                <span className="text-[9px] text-gray-500 font-bold uppercase">{item.type}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={() => deleteItem(item._id)} className="p-2 text-gray-700 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {isCombo && isExpanded && (
                                    <div className="px-4 pb-4 pt-1 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-3">
                                            {/* Hamburguesas Permitidas */}
                                            <div>
                                                <p className="text-[9px] font-black text-dorado uppercase mb-2 tracking-widest flex items-center gap-1">
                                                    <Package size={10} /> Burgers (Max: {item.comboConfig?.burgerMax || 0})
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {item.comboConfig?.allowedBurgers?.length > 0 ? (
                                                        item.comboConfig.allowedBurgers.map((b, idx) => {
                                                            const idToShow = typeof b === 'string' ? b : (b._id || "ID");
                                                            const nameToShow = b.name || `ID: ...${idToShow.slice(-4)}`;

                                                            return (
                                                                <span key={idx} className="text-[10px] bg-white/5 text-gray-300 px-2 py-0.5 rounded border border-white/10 uppercase tracking-tighter">
                                                                    {nameToShow}
                                                                </span>
                                                            );
                                                        })
                                                    ) : (
                                                        <span className="text-[9px] text-gray-600">No hay burgers asignadas</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Extras */}
                                            <div>
                                                <p className="text-[9px] font-black text-dorado uppercase mb-2 tracking-widest flex items-center gap-1">
                                                    <Plus size={10} /> Extras Incluidos
                                                </p>
                                                <div className="space-y-1">
                                                    {item.comboConfig?.extras?.length > 0 ? (
                                                        item.comboConfig.extras.map((ex, idx) => (
                                                            <div key={idx} className="flex justify-between items-center text-[10px] bg-black/40 p-1.5 rounded border border-white/5 text-gray-400 font-mono">
                                                                <span className="uppercase tracking-tight">
                                                                    {ex.item?.name || "Cargando..."}
                                                                </span>
                                                                <span className="text-dorado font-bold">MAX: {ex.max}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-[9px] text-gray-600">Sin extras configurados</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Dialog>
    );
}