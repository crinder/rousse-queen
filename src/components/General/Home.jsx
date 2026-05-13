import React, { useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { apis } from "../../Utils/api";
import moment from 'moment';
import 'moment/locale/es';
import { TrendingUp, Wallet, Receipt, Truck, AlertCircle, Calendar, Banknote } from 'lucide-react';

moment.locale('es');

export default function ResumenModerno() {
    const { data: serverResponse, isLoading } = useQuery({
        queryKey: ['weeklyStats'],
        queryFn: () => apis.get('ordern/weekly-stats'),
        staleTime: 1000 * 60 * 5,
    });

    const data = serverResponse;

    

    const metrics = useMemo(() => {

        console.log(data?.stats== [] );

        if (!data  || data?.stats.length === 0) return null;

        console.log(data.stats);

        const totalVentasBS = data.stats.reduce((acc, s) => acc + s.totalVentasBS, 0);
        const totalVentasUSD = data.stats.reduce((acc, s) => acc + s.totalVentasUSD, 0);
        const totalGastosBS = data.stats.reduce((acc, s) => acc + s.totalGastosBS, 0);
        const totalGastosUSD = data.stats.reduce((acc, s) => acc + s.totalGastosUSD, 0);
        const totalDelivery = data.stats.reduce((acc, s) => acc + s.totalDelivery, 0);
        const totalPendienteUSD = data.stats.reduce((acc, s) => acc + s.totalPendingUSD, 0);
        const balanceNetoBS = data.stats.reduce((acc, s) => acc + s.balanceBS, 0);

        return {
            ventasBS: totalVentasBS,
            ventasUSD: totalVentasUSD,
            gastosBS: totalGastosBS,
            gastosUSD: totalGastosUSD,
            delivery: totalDelivery,
            pendienteUSD: totalPendienteUSD,
            netoBS: balanceNetoBS,
            rango: `${moment(data.rango.desde).format('DD/MM/YYYY')} - ${moment(data.rango.hasta).format('DD/MM/YYYY')}`
        };
    }, [data]);

    if (isLoading) return <div className="p-10 text-center text-dorado animate-pulse font-black uppercase tracking-tighter">Generando Reporte de Cajas...</div>;
    if (!metrics) return <div className="p-10 text-center text-gray-500">No hay datos disponibles en este rango.</div>;

    return (
        <div className="w-full space-y-6 bg-[#050505] p-6 rounded-[35px] border border-white/5">
            {/* Encabezado con Balance Neto en BS */}
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div>
                    <h2 className="font-black text-white italic  tracking-tighter text-2xl">Resumen</h2>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <Calendar size={14} />
                        <span className="text-[11px] font-bold uppercase">{metrics.rango}</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-dorado uppercase tracking-widest">Balance Neto (BS)</p>
                    <p className="text-xl font-black text-dorado">Bs. {metrics.netoBS.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KPICard 
                    icon={<Banknote className="text-blue-400" />} 
                    label="Ventas en BS" 
                    value={`Bs. ${metrics.ventasBS.toLocaleString()}`} 
                    sub="Total neto en Bolívares"
                />
                <KPICard 
                    icon={<Wallet className="text-green-500" />} 
                    label="Ventas en USD" 
                    value={`$${metrics.ventasUSD.toLocaleString()}`} 
                    sub="Efectivo real en Dólares"
                />
                <KPICard 
                    icon={<AlertCircle className="text-red-500" />} 
                    label="Por Cobrar (Global)" 
                    value={`$${metrics.pendienteUSD.toFixed(2)}`} 
                    sub="BS convertido + USD pendiente"
                    isAlert={metrics.pendienteUSD > 0}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] rounded-3xl p-5 border border-white/5">
                    <h3 className="text-xs font-black text-white uppercase mb-4 flex items-center gap-2">
                        <Receipt size={16} className="text-dorado" /> Detalle por Caja
                    </h3>
                    <div className="space-y-3">
                        {data.stats.map((s) => (
                            <div key={s._id} className="flex justify-between items-center p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                                <div>
                                    <p className="text-[11px] text-white font-bold uppercase">{s.diaNombre} {moment(s.fecha).format('DD/MM')}</p>
                                    <p className="text-[9px] text-gray-500 uppercase">{s.count} órdenes procesadas</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-white">Bs. {s.totalVentasBS.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-dorado">${s.totalVentasUSD.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#0a0a0a] rounded-3xl p-5 border border-white/5">
                    <h3 className="text-xs font-black text-white uppercase mb-4 flex items-center gap-2">
                        <Truck size={16} className="text-dorado" /> Operativa de Gastos
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                            <p className="text-[9px] font-bold text-gray-500 uppercase">Fondo Delivery</p>
                            <p className="text-xl font-black text-white">
                                ${metrics.delivery.toLocaleString()}
                            </p>
                            <p className="text-[8px] text-gray-600 mt-1 uppercase">Suma total del periodo</p>
                        </div>
                        <div className="bg-red-500/5 p-4 rounded-2xl border border-red-500/10 text-center">
                            <p className="text-[9px] font-bold text-red-500/60 uppercase">Gastos (BS)</p>
                            <p className="text-xl font-black text-red-500">
                                Bs. {metrics.gastosBS.toLocaleString()}
                            </p>
                            <p className="text-[8px] text-red-500/40 mt-1 uppercase">Solo egresos en BS</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Desglose rápido de egresos</p>
                        {data.stats.map((s, idx) => (
                            <div key={idx} className="flex justify-between text-[10px] p-2 border-b border-white/5">
                                <span className="text-gray-400 font-bold uppercase">{s.diaNombre}</span>
                                <div className="space-x-4">
                                    <span className="text-red-400 font-black">BS: -{s.totalGastosBS.toLocaleString()}</span>
                                    <span className="text-dorado font-black">USD: -{s.totalGastosUSD.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ icon, label, value, sub, isAlert }) {
    return (
        <div className={`p-5 rounded-[28px] border ${isAlert ? 'border-red-500/20 bg-red-500/5' : 'border-white/5 bg-white/[0.03]'}`}>
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">{icon}</div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
            </div>
            <p className="text-2xl font-black text-white italic">{value}</p>
            <p className="text-[10px] text-gray-500 font-bold mt-1">{sub}</p>
        </div>
    );
}