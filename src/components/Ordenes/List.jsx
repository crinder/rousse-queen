import { useState } from 'react';
import { Trash2, CheckCircle, ChevronDown, ReceiptText, ArrowDownCircle } from 'lucide-react';
import { apis } from "../../Utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from '../Context/useUser';

export default function Orders() {
    const queryClient = useQueryClient();
    const [visibleCount, setVisibleCount] = useState(5);
    const [refs, setRefs] = useState({});
    const { rate } = useUser();

    const { data, isLoading } = useQuery({
        queryKey: ['ordersByDay'],
        queryFn: async () => {
            const res = await apis.get('util/reportForDay');
            return res || {};
        },
        staleTime: 1000 * 60 * 10,
    });

    const ordenes = data?.ordenes || [];
    const totales = data?.totales?.[0] || {};
    const gastos = data?.gastos || [];

    const updateStatusMutation = useMutation({
        mutationFn: (payload) => apis.put(`ordern/update/${payload.id}`, payload),
        onSuccess: () => queryClient.invalidateQueries(['ordersByDay']),
    });

    const handlePayOrder = (id) => {
        const referencia = refs[id];
        if (referencia && referencia.length === 4) {
            updateStatusMutation.mutate({ id, status: "PAGADO", referencia });
        } else {
            alert("Ingrese los 4 dígitos de la referencia.");
        }
    };

    if (isLoading) return <div className="text-white text-center py-10 italic">Cargando datos del día...</div>;

    return (
        <div className="space-y-6 pb-20">
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {[
                    { label: "Ventas BS", val: totales.totalVentas, color: "orange" },
                    { label: "Ventas USD", val: `$${totales.totalVentasUSD}`, color: "emerald" },
                    { label: "Envío", val: totales.totalDelivery, color: "blue" },
                    { label: "Gastos", val: totales.totalGastosBS, color: "red" },
                    { label: "Pendiente", val: totales.totalPending, color: "amber" },
                    { label: "Ordenes", val: ordenes?.length, color: "gray" },
                    { label: "Balance BS", val: totales.balanceBS, color: "green" },
                ].map((item, idx) => (
                    <div key={idx} className={`bg-[#1A1A1A] border border-${item.color}-500/20 rounded-2xl p-2 text-center`}>
                        <p className={`text-[8px] uppercase font-black text-${item.color}-500 mb-0.5 italic`}>{item.label}</p>
                        <p className="text-sm font-black text-white">{item.val ? item.val.toLocaleString() : 0}</p>
                    </div>
                ))}
            </div>

            <section className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <ReceiptText size={14} className="text-gray-500" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Ventas Recientes</h2>
                </div>

                <div className="space-y-2">
                    {ordenes.length > 0 ? (
                        <>
                            {ordenes.slice(0, visibleCount).map((order) => {
                                const isPaid = order.status === "PAGADO";
                                const amount = order.payment?.[0]?.amount || 0;
                                const delivery = order.delivery?.[0]?.cost || 0;
                                const itemsSummary = order.items.map(i =>
                                    i.item.map(sub => `${sub.quantity}x ${sub.name}`).join(", ")
                                ).join(" | ");

                                return (
                                    <div key={order._id} className="bg-[#1A1A1A]/50 border border-white/5 rounded-2xl p-4 flex justify-between items-center group">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"}`} />
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    #{order.num_order} - {order.name}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-white/60 line-clamp-1 italic mb-2 pr-4">{itemsSummary}</p>

                                            {!isPaid ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="REF 4 dígitos"
                                                        maxLength={4}
                                                        value={refs[order._id] || ''}
                                                        onChange={(e) => setRefs({ ...refs, [order._id]: e.target.value })}
                                                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white w-24 focus:outline-none focus:border-emerald-500/50"
                                                    />
                                                    <button onClick={() => handlePayOrder(order._id)} className="text-emerald-500 hover:scale-110 transition-transform">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                order.referencia && <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded uppercase font-bold">Ref: {order.referencia}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="text-base font-black text-white italic leading-none">
                                                    {(amount + delivery).toLocaleString()} <span className="text-[9px] font-normal not-italic text-white/30">BS</span>
                                                </p>
                                                <p className={`text-[8px] font-black uppercase mt-1 ${isPaid ? "text-emerald-500" : "text-amber-500"}`}>{order.status}</p>
                                            </div>
                                            <button className="p-2 text-gray-800 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                );
                            })}
                            {ordenes.length > visibleCount && (
                                <button onClick={() => setVisibleCount(prev => prev + 10)} className="w-full py-3 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black uppercase text-gray-500 italic flex items-center justify-center gap-2">
                                    <ChevronDown size={14} /> Cargar más órdenes
                                </button>
                            )}
                        </>
                    ) : <p className="text-center text-gray-600 text-[10px] py-4">Sin ventas hoy.</p>}
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <ArrowDownCircle size={14} className="text-red-500/70" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/70">Gastos del Día</h2>
                </div>

                <div className="grid gap-2">
                    {gastos.length > 0 ? (
                        gastos.map((gasto) => (
                            <div key={gasto._id} className="bg-red-500/5 border border-red-500/10 rounded-2xl p-3 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black text-red-500/80 uppercase tracking-widest">{gasto.category || 'General'}</p>
                                    <p className="text-xs text-white/80 italic">{gasto.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-white">-{gasto.amount.toLocaleString()} <span className="text-[8px] text-white/30">BS</span></p>
                                    <p className="text-[8px] text-gray-500 uppercase">{new Date(gasto.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-6 text-center border-2 border-dashed border-white/5 rounded-3xl">
                            <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest italic">No hay egresos registrados</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}