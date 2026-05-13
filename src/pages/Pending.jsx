import { useState } from 'react';
import { Trash2, CheckCircle, ChevronDown, ReceiptText, ArrowDownCircle } from 'lucide-react';
import { apis } from "../Utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from '../components/Context/useUser';
import Toast from '../Utils/Toast';

export default function Pending() {
    const queryClient = useQueryClient();
    const [visibleCount, setVisibleCount] = useState(5);
    const [refs, setRefs] = useState({});
    const { rate } = useUser();
    const [paymentMethods, setPaymentMethods] = useState({});
    const [toast, setToast] = useState(null);
    const [type, setType] = useState("success");

    const { data, isLoading } = useQuery({
        queryKey: ['pending'],
        queryFn: async () => {
            const res = await apis.get('ordern/pending');
            return res || {};
        },
        staleTime: 1000 * 60 * 10,
    });

    const ordenes = data?.pending || [];

    const toggleCurrency = (orderId) => {
        setPaymentMethods(prev => ({
            ...prev,
            [orderId]: prev[orderId] === 'USD' ? 'BS' : 'USD'
        }));
    };

    const updateStatusMutation = useMutation({
        mutationFn: (payload) => apis.post(`ordern/update/${payload.id}`, payload),
        onSuccess: () => {
            queryClient.invalidateQueries(['ordersByDay']);
            queryClient.invalidateQueries(['weeklyStats']);
            queryClient.invalidateQueries(['pending']);
        }
    });

    const handleDelete = (id, type) => {
        try {
            apis.post(`${type}/delete/${id}`);
            queryClient.invalidateQueries(['ordersByDay']);
            queryClient.invalidateQueries(['weeklyStats']);
            queryClient.invalidateQueries(['pending']);

            setToast(`eliminado exitosamente`);
            setType("success");

        } catch (e) {
            setToast("Error al eliminar");
            setType("error");
        }

    };

    const handlePayOrder = (order) => {
        const id = order._id;
        const referencia = refs[id] || "";
        const metodoElegido = paymentMethods[id] || 'BS'; // Por defecto BS

        const totalEnBS = (order.payment?.[0]?.amount || 0) + (order.delivery?.[0]?.cost || 0);

        const esValido = metodoElegido === 'BS' ? (referencia.length === 4) : true;

        if (esValido) {
            const payload = {
                id,
                status: "PAGADO",
                referencia: metodoElegido === 'BS' ? referencia : "EFECTIVO/USD",
                payment: [
                    {
                        ...order.payment[0],
                        method: metodoElegido,
                        currency: metodoElegido,
                        amount: metodoElegido === 'USD' ? (totalEnBS / rate) : totalEnBS,
                        totalusd: metodoElegido === 'USD' ? totalEnBS : 0,
                        totalbs: metodoElegido === 'USD' ? 0 : totalEnBS
                    }
                ]
            };

            console.log(payload);

            updateStatusMutation.mutate(payload);
        } else {
            setToast("Para pagos en BS es obligatorio ingresar los 4 dígitos de la referencia.");
            setType("warning");
        }
    };

    if (isLoading) return <div className="text-white text-center py-10 italic">Cargando datos del día...</div>;

    return (
        <div className="space-y-6 pb-20">
            <section className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <ReceiptText size={14} className="text-gray-500" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Pendientes</h2>
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
                                const totalEnBS = amount + delivery;

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
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        {/* Selector de Moneda */}
                                                        <button
                                                            onClick={() => toggleCurrency(order._id)}
                                                            className={`text-[9px] font-black px-2 py-1 rounded-lg border transition-all ${(paymentMethods[order._id] || 'BS') === 'USD'
                                                                ? "border-emerald-500 text-emerald-500 bg-emerald-500/10"
                                                                : "border-orange-500 text-orange-500 bg-orange-500/10"
                                                                }`}
                                                        >
                                                            {paymentMethods[order._id] || 'BS'}
                                                        </button>

                                                        {/* Solo mostramos el input si el método es BS */}
                                                        {(paymentMethods[order._id] || 'BS') === 'BS' ? (
                                                            <input
                                                                type="text"
                                                                placeholder="REF 4 dígitos"
                                                                maxLength={4}
                                                                value={refs[order._id] || ''}
                                                                onChange={(e) => setRefs({ ...refs, [order._id]: e.target.value })}
                                                                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white w-24 focus:outline-none focus:border-emerald-500/50"
                                                            />
                                                        ) : (
                                                            <div className="text-[9px] text-emerald-500/50 italic px-2 font-bold uppercase tracking-widest">
                                                                Pago en Dólares
                                                            </div>
                                                        )}

                                                        <button
                                                            onClick={() => handlePayOrder(order)}
                                                            className="text-emerald-500 hover:scale-110 transition-transform p-1"
                                                        >
                                                            <CheckCircle size={20} />
                                                        </button>
                                                    </div>

                                                    {(paymentMethods[order._id] === 'USD') && (
                                                        <p className="text-[9px] text-gray-500 italic">
                                                            A cobrar: <span className="text-white font-bold">${((totalEnBS) / rate).toFixed(2)}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                order.referencia && <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded uppercase font-bold">Ref: {order.referencia}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="text-base font-black text-white italic leading-none">
                                                    {(amount).toLocaleString()} <span className="text-[9px] font-normal not-italic text-white/30">BS</span>
                                                </p>
                                                <p className={`text-[8px] font-black uppercase mt-1 ${isPaid ? "text-emerald-500" : "text-amber-500"}`}>{order.status}</p>
                                            </div>
                                            <button className="p-2 text-gray-800 hover:text-red-500 transition-colors" onClick={() => handleDelete(order._id, 'ordern')}><Trash2 size={16} /></button>
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
                    ) : <p className="text-center text-gray-600 text-[10px] py-4">Sin pendientes.</p>}
                </div>
            </section>

            {toast && <Toast message={toast} type={type} onClose={() => setToast(null)} />}
        </div>

    );
}