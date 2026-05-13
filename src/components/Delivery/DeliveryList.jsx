import React, { useState, useEffect } from "react";
import { Dialog } from 'primereact/dialog';
import { apis } from "../../Utils/api";
import { Trash2, Search, Check, MapPin, X } from "lucide-react";
import {useQueryClient,useQuery} from "@tanstack/react-query";
import Toast from '../../Utils/Toast';

export default function DeliveryList({ visible, onHide }) {
    const [zonas, setZonas] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [toast, setToast] = useState(null);
    const [type, setType] = useState("success");
    const queryClient = useQueryClient();

    const { data: deliveries, isLoading } = useQuery({
        queryKey: ['deliveries'],
        queryFn: () => apis.get('delivery/deliveries'),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
        refetctOnWindowsFocus: true,
        retry: 2,
        networkMode: 'offlineFirst'
    });

    useEffect(() => { if (visible) setZonas(deliveries.deliveries || []); }, [ deliveries, isLoading]);

    const onInputChange = (id, field, value) => {
        setZonas(prev => prev.map(z => {
            if (z._id === id) {
                return { ...z, [field]: field === 'zona' ? value.toUpperCase() : value, hasChanges: true };
            }
            return z;
        }));
    };

    const saveChanges = async (rowData) => {
        try {
            await apis.post(`delivery/update/${rowData._id}`, rowData);
            setZonas(prev => prev.map(z => z._id === rowData._id ? { ...z, hasChanges: false } : z));
            setToast("Zona actualizada exitosamente");
            setType("success");
            queryClient.invalidateQueries(['deliveries']);
        } catch (e) { setToast("Error al actualizar") && setType("error") }
    };

    const deleteItem = async (id) => {
        if (!window.confirm("¿Eliminar zona?")) return;
        try {
            await apis.post(`delivery/delete/${id}`);
            useQueryClient().invalidateQueries(['deliveries']);
            setToast("Zona eliminada exitosamente");
            setType("success");
        } catch (e) { setToast("Error al eliminar") && setType("error") }
    };

    const filteredZonas = zonas.filter(z =>
        z.zona.toLowerCase().includes(globalFilter.toLowerCase())
    );

    return (
        <Dialog
            header="GESTIÓN DE DOMICILIOS"
            visible={visible}
            onHide={onHide}
            style={{ width: '95%', maxWidth: '600px' }}
            modal
            draggable={false}
            headerStyle={{ backgroundColor: '#1A1A1A', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem' }}
            contentStyle={{ backgroundColor: '#1A1A1A', color: 'white', padding: '1rem' }}
        >
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        className="w-full bg-black/40 border border-white/10 p-3 pl-10 text-white rounded-xl outline-none focus:border-dorado/30 text-xs uppercase transition-all"
                        placeholder="BUSCAR UBICACIÓN..."
                        value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>
                
                <div className="border border-white/5 rounded-2xl overflow-hidden bg-black/20">
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-[#222] z-10">
                                <tr>
                                    <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Ubicación</th>
                                    <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Costo</th>
                                    <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {filteredZonas && filteredZonas.map((z) => (
                                    <tr key={z._id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-3">
                                            <input
                                                className="bg-transparent border-b border-transparent focus:border-dorado/50 text-white font-bold text-xs uppercase outline-none py-1 w-full"
                                                value={z.zona}
                                                onChange={(e) => onInputChange(z._id, 'zona', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-1">
                                                <span className="text-dorado text-[10px] font-bold">$</span>
                                                <input
                                                    type="number"
                                                    className="bg-transparent border-b border-transparent focus:border-dorado/50 text-dorado font-mono text-xs outline-none py-1 w-20"
                                                    value={z.cost}
                                                    onChange={(e) => onInputChange(z._id, 'cost', Number(e.target.value))}
                                                />
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-2 justify-end items-center">
                                                {z.hasChanges && (
                                                    <button
                                                        onClick={() => saveChanges(z)}
                                                        className="bg-dorado text-black p-1.5 rounded-lg shadow-lg shadow-dorado/20 hover:scale-110 transition-transform"
                                                        title="Guardar cambios"
                                                    >
                                                        <Check size={14} strokeWidth={3} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteItem(z._id)}
                                                    className="p-1.5 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredZonas.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="p-10 text-center text-gray-600 italic text-xs uppercase tracking-widest">
                                            No se encontraron resultados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {toast && <Toast message={toast} type={type} onClose={() => setToast(null)} />}
        </Dialog>
    );
}