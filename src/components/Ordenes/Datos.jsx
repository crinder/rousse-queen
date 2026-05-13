import React from 'react';
import { CreditCard, Hash, CircleDollarSign, DollarSign } from 'lucide-react';
import InputW from '../../Utils/InputW';
import Delivery from './Delivery';
import { useManagerOrdern } from '../../Hooks/useManagerOrdern';

export default function Datos() {
    const { data, actions } = useManagerOrdern();
    const { order, totals } = data;

    const baseInputStyle = "w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-[11px] text-white outline-none focus:border-dorado/30 transition-all";
    const updateOrderField = (field, value) => {
        actions.setOrder(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[28px] space-y-3">
            
            <div className="grid grid-cols-2 gap-3">
                <InputW icon={CircleDollarSign}>
                    <select
                        value={order.paymentMethod}
                        onChange={(e) => updateOrderField('paymentMethod', e.target.value)}
                        className={`${baseInputStyle} appearance-none font-bold`}
                    >
                        <option value="BS">BS (PAGO MÓVIL)</option>
                        <option value="USD">USD (DIVISAS)</option>
                        <option value="MIXTO">BS y USD (MIXTO)</option>
                    </select>
                </InputW>

                <InputW icon={CreditCard}>
                    <select
                        value={order.status}
                        onChange={(e) => updateOrderField('status', e.target.value)}
                        className={`${baseInputStyle} appearance-none font-bold`}
                    >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="PAGADO">PAGADO</option>
                    </select>
                </InputW>

                {order.paymentMethod === "BS" && order.status === "PAGADO" && (
                    <div className="col-span-2 animate-in fade-in zoom-in-95 duration-200">
                        <InputW icon={Hash}>
                            <input
                                type="text"
                                placeholder="Últimos 4 dígitos de referencia"
                                maxLength={4}
                                value={order.referencia}
                                onChange={(e) => updateOrderField('referencia', e.target.value)}
                                className={`${baseInputStyle} border-dorado/20 font-mono`}
                            />
                        </InputW>
                    </div>
                )}

                {order.paymentMethod === "USD" && order.status === "PAGADO" && (
                    <div className="col-span-2 animate-in fade-in zoom-in-95 duration-200">
                        <InputW icon={DollarSign}>
                            <input
                                type="text"
                                readOnly
                                value={`TOTAL A RECIBIR: $${totals.totalUSD.toFixed(2)}`}
                                className={`${baseInputStyle} border-emerald-500/20 font-mono bg-white/5 text-emerald-500 cursor-not-allowed`}
                            />
                        </InputW>
                    </div>
                )}
            </div>

            <Delivery />

        </div>
    );
}