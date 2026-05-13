import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apis } from "../../Utils/api";
import { CheckCircle2, Clock, Utensils } from 'lucide-react';

export default function Cocina() {
    const queryClient = useQueryClient();
    const [lastOrderCount, setLastOrderCount] = useState(0);

    const { data: ordenes, isLoading } = useQuery({
        queryKey: ['kitchen-orders'],
        queryFn: () => apis.get('ordern/kitchen-view'),
        refetchInterval: 50000, // Revisa cada 5 segundos
    });

    console.log(ordenes);

    // Sonido de alerta para nuevas órdenes
    /*useEffect(() => {
        if (ordenes?.length > lastOrderCount) {
            const audio = new Audio('/new-order.mp3'); 
            audio.play().catch(e => console.log("Esperando interacción para audio"));
        }
        setLastOrderCount(ordenes?.length || 0);
    }, [ordenes, lastOrderCount]);*/

    const mutation = useMutation({
        mutationFn: (id) => apis.post(`ordern/kitchen-update/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['kitchen-orders']),
    });

    if (isLoading) return <div className="h-screen bg-black flex items-center justify-center text-dorado font-mono uppercase tracking-widest">Iniciando ordenes...</div>;

    return (
        <div className="min-h-screen bg-black p-4 space-y-6">

            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-dorado/10 p-2 rounded-xl">
                        <Utensils className="text-dorado" size={24} />
                    </div>
                    <h1 className="text-white font-black text-2xl uppercase tracking-tighter">Ordenes en cocina</h1>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-white/5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-gray-400 font-mono uppercase">En Línea</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {ordenes && ordenes?.map((order) => (
                    <div key={order._id} className="flex flex-col bg-zinc-900/50 border border-white/10 rounded-[24px] overflow-hidden hover:border-dorado/30 transition-all duration-300">

                        <div className="p-4 bg-white/[0.03] flex justify-between items-center border-b border-white/5">
                            <div>
                                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Orden</span>
                                <h2 className="text-2xl font-black text-white leading-none">#{order.num_order}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-dorado font-mono text-[11px] uppercase">{order.name}</p>
                                <div className="flex items-center gap-1 text-[9px] text-gray-500 justify-end">
                                    <Clock size={10} />
                                    <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 flex-1 space-y-4">
                            {order.items[0].item.map((item, idx) => (
                                <div key={idx} className="space-y-1">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-black text-white uppercase leading-tight">
                                            <span className="text-dorado mr-2">{item.quantity}x</span>
                                            {item.name}
                                        </p>
                                    </div>

                                    {(item.comboDetail?.burgers?.length > 0 || item.comboDetail?.extras?.length > 0) && (
                                        <div className="ml-6 space-y-1 border-l border-white/10 pl-3 py-1">
                                            {item.comboDetail.burgers.map((b, i) => (
                                                <p key={i} className="text-[10px] text-gray-400 uppercase font-medium">• {b.name}</p>
                                            ))}
                                            {item.comboDetail.extras.map((e, i) => (
                                                <p key={i} className="text-[10px] text-orange-400/80 italic">• {e.name}</p>
                                            ))}
                                        </div>
                                    )}

                                    {item.observation && (
                                        <div className="ml-6 mt-2 bg-orange-500/10 border border-orange-500/20 p-2 rounded-lg">
                                            <p className="text-[9px] text-orange-500 font-black uppercase leading-none">Nota: {item.observation}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => mutation.mutate(order._id)}
                            disabled={mutation.isLoading}
                            className="w-full py-4 bg-dorado opacity-80 hover:opacity-100
                             hover:bg-dorado disabled:bg-gray-700 text-black font-black uppercase text-xs transition-colors flex items-center justify-center gap-2"   
                        >
                            <CheckCircle2 size={16} />
                            {mutation.isLoading ? 'Procesando...' : 'Marcar como Despachado'}
                        </button>
                    </div>
                ))}
            </div>

            {ordenes?.length === 0 && (
                <div className="h-[60vh] flex flex-col items-center justify-center text-zinc-700">
                    <Utensils size={64} className="mb-4 opacity-20" />
                    <p className="font-mono uppercase tracking-[0.3em] text-sm">Sin pedidos pendientes</p>
                </div>
            )}
        </div>
    );
}