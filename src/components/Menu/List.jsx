import React from "react";
import { Dialog } from "primereact/dialog";
import { Trash2, Search, X, ChevronDown, ChevronUp, Package, Edit3 } from "lucide-react";
import { useListFilter } from "../../Hooks/useListMenu";

export default function List({ visible, onHide, items, onDelete, onEdit }) {

    const {
        searchTerm, setSearchTerm,
        filterType, setFilterType,
        expandedCombo, toggleCombo,
        filteredMenu
    } = useListFilter(items);

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            unstyled
            modal
            className="w-[95vw] md:w-full max-w-4xl bg-[#0F0F0F] border border-white/10 rounded-[24px] shadow-2xl flex flex-col overflow-hidden outline-none"
            maskClassName="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
            <div className="flex flex-col gap-6 w-full p-6 bg-[#0F0F0F] border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-dorado rounded-full" />
                        <span className="text-white font-black tracking-widest uppercase italic text-lg">Catálogo</span>
                    </div>
                    <button onClick={onHide} className="text-gray-500 hover:text-dorado transition-colors outline-none">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar en el catálogo..."
                            className="w-full bg-[#1A1A1A] border border-white/10 text-white pl-12 py-3 rounded-xl focus:border-dorado/50 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                        {["ALL", "BURGER", "COMBO", "ITEM"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilterType(t)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all border ${filterType === t ? "bg-dorado text-black border-dorado" : "bg-white/5 text-gray-400 border-white/10"}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar bg-[#0F0F0F]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                    {filteredMenu.map((item) => (
                        <div
                            key={item._id}
                            className={`flex flex-col border rounded-xl transition-all ${expandedCombo === item._id ? 'border-dorado/40 bg-white/[0.04]' : 'border-white/5 bg-white/[0.02]'}`}
                        >
                            <div className="flex items-center justify-between p-3">
                                <div
                                    className="flex items-center gap-3 cursor-pointer flex-1"
                                    onClick={() => item.type === "COMBO" && toggleCombo(item._id)}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center shadow-lg text-lg">
                                        {item.type === "BURGER" ? "🍔" : item.type === "COMBO" ? "🌟" : "🥤"}
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-white font-bold text-xs uppercase italic flex items-center gap-2">
                                            {item.name}
                                            {item.type === "COMBO" && (expandedCombo === item._id ? <ChevronUp size={12} className="text-dorado" /> : <ChevronDown size={12} className="text-gray-500" />)}
                                        </h4>
                                        <span className="text-dorado font-bold text-[11px]">${item.price.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="p-2 text-gray-500 hover:text-dorado transition-colors"
                                        title="Editar"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(item._id)}
                                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {item.type === "COMBO" && expandedCombo === item._id && (
                                <div className="px-4 pb-4 pt-1 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-3">
                                        <p className="text-[9px] font-black text-dorado uppercase flex items-center gap-1">
                                            <Package size={10} /> Burgers (Max: {item.comboConfig?.burgerMax})
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {item.comboConfig?.allowedBurgers?.map((b, i) => (
                                                <span key={i} className="text-[9px] bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/10 italic">
                                                    {b.name || "N/A"}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Dialog>
    );
}