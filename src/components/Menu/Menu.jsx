import React, { useState, useEffect } from "react";
import { apis } from "../../Utils/api";
import { Trash2, Eye, X, Package } from "lucide-react";
import List from "./List";

export default function Menu() {
    const [menuList, setMenuList] = useState([]);
    const [isListVisible, setIsListVisible] = useState(false);

    // States para el formulario
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("ITEM"); // ITEM | BURGER | COMBO
    const [burgerMax, setBurgerMax] = useState(0);
    const [selectedBurgers, setSelectedBurgers] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState([]);

    const burgersAvailable = menuList.filter((m) => m.type === "BURGER");
    const extrasAvailable = menuList.filter((m) => m.type === "ITEM");

    const devuelveMenu = async () => {
        try {
            const response = await apis.get("menu/menus");
            setMenuList(response.data || response.menus || []);
        } catch (e) { console.error("Error al traer menu", e); }
    };

    useEffect(() => { devuelveMenu(); }, []);

    const addMenuItem = async () => {
        if (!name || !price) return;

        const payload = {
            name,
            price: Number(price),
            type,
            comboConfig: {
                burgerMax: type === "COMBO" ? burgerMax : undefined,
                allowedBurgers: type === "COMBO" ? selectedBurgers : undefined,
                extras: type === "COMBO" ? selectedExtras : undefined,
            }
        };
        
        try {
            await apis.post("menu/add", payload);
            alert("¡Producto agregado!");
            setName(""); setPrice(""); setType("ITEM");
            setSelectedBurgers([]); setSelectedExtras([]);
            devuelveMenu();
        } catch (e) { alert("Error al guardar"); }
    };

    return (
        <section className="bg-[#1A1A1A] border border-white/5 p-6 rounded-2xl shadow-2xl mb-6 relative overflow-hidden">
            <button
                onClick={() => setIsListVisible(true)}
                className="absolute top-6 right-6 flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-dorado px-4 py-2 rounded-xl border border-white/10 transition-all text-xs font-bold"
            >
                <Eye size={16} /> VER LISTA
            </button>

            <div className="flex items-center gap-2 mb-6">
                <span className="text-dorado text-xl">📋</span>
                <h2 className="font-bold text-xl text-white tracking-tight">Cargar menú</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Nombre del producto</label>
                    <input
                        className="w-full bg-[#262626] border border-white/10 p-3 mt-1 text-white rounded-xl focus:ring-1 focus:ring-dorado/50 outline-none"
                        value={name} onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Precio (USD)</label>
                    <input
                        className="w-full bg-[#262626] border border-white/10 p-3 mt-1 text-dorado rounded-xl font-bold outline-none"
                        type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Tipo</label>
                    <select
                        className="w-full bg-[#262626] border border-white/10 p-3 mt-1 text-white rounded-xl outline-none"
                        value={type} onChange={(e) => setType(e.target.value)}
                    >
                        <option value="ITEM">📦 Item General</option>
                        <option value="BURGER">🍔 Hamburguesa</option>
                        <option value="COMBO">🌟 Combo Especial</option>
                    </select>
                </div>
            </div>

            {type === "COMBO" && (
                <div className="mt-6 bg-black/40 p-5 rounded-2xl border border-dorado/20 space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-dorado uppercase">🍔 Máximo de Hamburguesas</label>
                        <input
                            type="number"
                            className="w-20 bg-dorado/10 border border-dorado/30 p-2 text-center text-dorado font-bold rounded-lg"
                            value={burgerMax} onChange={(e) => setBurgerMax(Number(e.target.value))}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest">Seleccionar Burgers</p>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                {burgersAvailable.map((b) => (
                                    <label key={b._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:border-dorado/30 transition-all">
                                        <input
                                            type="checkbox"
                                            className="accent-dorado w-4 h-4"
                                            checked={selectedBurgers.includes(b._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedBurgers([...selectedBurgers, b._id]);
                                                else setSelectedBurgers(selectedBurgers.filter(id => id !== b._id));
                                            }}
                                        />
                                        <span className="text-sm text-gray-300">{b.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest">Seleccionar Acompañantes</p>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                {extrasAvailable.map((item) => {
                                    const isSelected = selectedExtras.find(e => e.item === item._id);
                                    return (
                                        <div key={item._id} className="flex items-center justify-between gap-2 p-3 bg-white/5 border border-white/5 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="accent-dorado w-4 h-4"
                                                    checked={!!isSelected}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedExtras([...selectedExtras, { item: item._id, max: 1 }]);
                                                        else setSelectedExtras(selectedExtras.filter(ex => ex.item !== item._id));
                                                    }}
                                                />
                                                <span className="text-sm text-gray-300">{item.name}</span>
                                            </div>
                                            {isSelected && (
                                                <input
                                                    type="number"
                                                    className="w-12 bg-black text-dorado text-center text-xs rounded border border-dorado/20"
                                                    value={isSelected.max}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        setSelectedExtras(selectedExtras.map(ex => ex.item === item._id ? { ...ex, max: val } : ex));
                                                    }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={addMenuItem}
                className="w-full bg-dorado hover:bg-dorado/90 text-black font-black py-4 rounded-xl mt-8 transition-all active:scale-95 shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
            >
                Agregar
            </button>

            <List
                visible={isListVisible}
                onHide={() => setIsListVisible(false)}
            />
        </section>
    );
}