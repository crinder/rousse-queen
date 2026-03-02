import React, { useState, useEffect } from "react";
import { apis } from "../Utils/api";
import { Eye, BanknoteArrowDown, Check } from "lucide-react";

export default function Gastos() {

    const [isListVisible, setIsListVisible] = useState(false);
    const [descripcion, setDescripcion] = useState("");
    const [amount, setAmount] = useState("");
    const [type_expense, setType_expense] = useState("DELIVERY");
    const [currency, setCurrency] = useState("BS");


    const addgastos = async () => {
        if (!descripcion || !amount) return;

        const payload = {
            description: descripcion.toUpperCase(),
            amount: Number(amount),
            type_expense: type_expense,
            currency: currency
        };

        try {
            await apis.post("expense/add", payload);
            alert("¡Gasto agregado!");
            setDescripcion(""); setAmount("");
            invalidateQueries(['ordersByDay']);
        } catch (e) { alert("Error al guardar gasto"); }
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
                <span className="text-dorado text-xl"><BanknoteArrowDown size={16} /> </span>
                <h2 className="font-bold text-xl text-white tracking-tight">Cargar gastos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 italic">
                <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Descripcion</label>
                    <textarea
                        className="w-full bg-[#262626] border border-white/10 p-3 mt-1 text-white rounded-xl focus:ring-1 focus:ring-dorado/50 outline-none uppercase"
                        placeholder="cebollas, papas, tocinetas, etc..."
                        rezize={100}
                        value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Costo</label>
                    <input
                        className="w-full bg-[#262626] border border-white/10 p-3 mt-1 text-dorado rounded-xl font-bold outline-none"
                        type="number"
                        placeholder="0.00"
                        value={amount} onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="md:col-span-2">
                    <select name="paymentMethod"
                        className="w-full bg-[#262626] border border-white/10 p-3 mt-1 text-white rounded-xl outline-none"
                        onChange={(e) => setType_expense(e.target.value)}
                    >
                        <option value="DELIVERY">Entrega</option>
                        <option value="GASTOS">Gastos</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <select name="paymentMethod"
                        className="w-full bg-[#262626] border border-white/10 p-3 mt-1 text-white rounded-xl outline-none"
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <option value="USD">USD</option>
                        <option value="BS">BS</option>
                    </select>
                </div>

            </div>

            <button
                onClick={() => addgastos()}
                className="w-full bg-dorado hover:bg-dorado/90 text-black font-black py-4 rounded-xl mt-8 transition-all active:scale-95 shadow-[0_10px_30px_rgba(212,175,55,0.2)] flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
                <Check size={18} /> Guardar
            </button>

        </section>
    );
}