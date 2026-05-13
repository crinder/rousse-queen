import React, { useState, useEffect } from 'react';
import { useForm } from '../../Hooks/useForm';

const MenuForm = ({ onSubmit, initialData, onCancel, burgersAvailable, extrasAvailable }) => {

    const { values, handleChange, reset, setFieldValue } = useForm({
        name: "", price: "", type: "ITEM", moneda: "US", burgerMax: 0
    });

    const [selectedBurgers, setSelectedBurgers] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState([]);

    console.log("initialData", initialData);

    useEffect(() => {
        if (initialData) {
            // Seteamos los valores en el hook useForm
            reset({
                name: initialData.name || "",
                price: initialData.price || 0,
                type: initialData.type || "ITEM",
                moneda: initialData.moneda || "US",
                burgerMax: initialData.comboConfig?.burgerMax || 0
            });

            // Seteamos los estados locales de los combos
            const burgers = initialData.comboConfig?.allowedBurgers?.map(b =>
                typeof b === 'object' ? b._id : b
            ) || [];

            const extras = initialData.comboConfig?.extras?.map(ex => ({
                item: typeof ex.item === 'object' ? ex.item._id : ex.item,
                max: ex.max || 1
            })) || [];

            setSelectedBurgers(burgers);
            setSelectedExtras(extras);
        } else {
            reset({
                name: "",
                price: "",
                type: "ITEM",
                moneda: "US",
                burgerMax: 0
            });
            setSelectedBurgers([]);
            setSelectedExtras([]);
        }
    }, [initialData]);

    const sendData = () => {
        const payload = {
            ...values,
            comboConfig: {
                burgerMax: Number(values.burgerMax),
                allowedBurgers: selectedBurgers,
                extras: selectedExtras
            }
        };
        onSubmit(initialData ? { id: initialData._id, ...payload } : payload)
            .then(() => !initialData && reset());
    };

    return (
        <div className="space-y-4">

            {initialData && (
                <div className="flex justify-between items-center mb-6 bg-dorado/20 p-3 rounded-xl border border-dorado/30">
                    <span className="text-dorado font-black text-xs uppercase tracking-widest italic">✨ Editando Producto</span>
                    <button onClick={onCancel} className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-all">Cancelar Edición</button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Nombre del producto</label>
                    <input
                        name="name"
                        className="w-full bg-[#262626] border border-white/10 p-3 mt-1 text-white rounded-xl focus:ring-1 focus:ring-dorado/50 outline-none"
                        value={values.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Moneda</label>
                        <select
                            name="moneda"
                            className="w-full bg-[#262626] border border-white/10 p-3 mt-1 text-white rounded-xl outline-none"
                            value={values.moneda}
                            onChange={handleChange}
                        >
                            <option value="BS">Bolívares</option>
                            <option value="US">Dólares</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Precio</label>
                        <input
                            name="price"
                            type="number"
                            className="w-full bg-[#262626] border border-white/10 p-3 mt-1 text-dorado rounded-xl font-bold outline-none"
                            value={values.price}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Tipo</label>
                        <select
                            name="type"
                            className="w-full bg-[#262626] border border-white/10 p-3 mt-1 text-white rounded-xl outline-none"
                            value={values.type}
                            onChange={handleChange}
                        >
                            <option value="ITEM">📦 Item General</option>
                            <option value="BURGER">🍔 Hamburguesa</option>
                            <option value="COMBO">🌟 Combo Especial</option>
                        </select>
                    </div>
                </div>
            </div>

            {values.type === "COMBO" && (
                <div className="mt-6 bg-black/40 p-5 rounded-2xl border border-dorado/20 space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-dorado uppercase">🍔 Máximo de Hamburguesas</label>
                        <input
                            name="burgerMax"
                            type="number"
                            className="w-20 bg-dorado/10 border border-dorado/30 p-2 text-center text-dorado font-bold rounded-lg"
                            value={values.burgerMax}
                            onChange={handleChange}
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
                onClick={sendData}
                className="w-full bg-dorado hover:bg-dorado/90 text-black font-black py-4 rounded-xl mt-8 transition-all active:scale-95 shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
            >
                {initialData ? 'GUARDAR CAMBIOS' : 'AGREGAR AL MENÚ'}
            </button>
        </div>
    );
};

export default MenuForm;