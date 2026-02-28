import React, { useState, useEffect } from "react";
import { apis } from "../../Utils/api";
import { Eye, MapPin, Check } from "lucide-react";
import DeliveryList from "./DeliveryList";

export default function Delivery() {
    const [zonas, setZonas] = useState([]);
    const [isListVisible, setIsListVisible] = useState(false);

    // States para el formulario
    const [zona, setZona] = useState("");
    const [cost, setCost] = useState("");

    const fetchZonas = async () => {
        try {
            const response = await apis.get("delivery/deliveries");
            setZonas(response.data || []);
        } catch (e) { console.error("Error al traer zonas", e); }
    };

    useEffect(() => { fetchZonas(); }, []);

    const addDeliveryZone = async () => {
        if (!zona || !cost) return;

        const payload = { 
            zona: zona.toUpperCase(), 
            cost: Number(cost) 
        };
        
        try {
            await apis.post("delivery/add", payload);
            alert("¡Zona agregada!");
            setZona(""); setCost("");
            fetchZonas();
        } catch (e) { alert("Error al guardar zona"); }
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
                <span className="text-dorado text-xl">📍</span>
                <h2 className="font-bold text-xl text-white tracking-tight">Cargar Domicilio</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 italic">
                <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Nombre de la Zona / Ubicación</label>
                    <input
                        className="w-full bg-[#262626] border border-white/10 p-3 mt-1 text-white rounded-xl focus:ring-1 focus:ring-dorado/50 outline-none uppercase"
                        placeholder="EJ: CHACAO, EL HATILLO..."
                        value={zona} onChange={(e) => setZona(e.target.value)}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Costo del Envío (USD)</label>
                    <input
                        className="w-full bg-[#262626] border border-white/10 p-3 mt-1 text-dorado rounded-xl font-bold outline-none"
                        type="number" 
                        placeholder="0.00"
                        value={cost} onChange={(e) => setCost(e.target.value)}
                    />
                </div>
            </div>

            <button
                onClick={addDeliveryZone}
                className="w-full bg-dorado hover:bg-dorado/90 text-black font-black py-4 rounded-xl mt-8 transition-all active:scale-95 shadow-[0_10px_30px_rgba(212,175,55,0.2)] flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
                <Check size={18} /> Guardar Zona
            </button>

            <DeliveryList
                visible={isListVisible}
                onHide={() => setIsListVisible(false)}
                refreshData={fetchZonas}
            />
        </section>
    );
}