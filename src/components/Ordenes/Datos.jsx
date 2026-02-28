import React, { useState } from 'react';
import { User, CreditCard, Hash, CircleDollarSign, DollarSign } from 'lucide-react';
import InputW from '../../Utils/InputW';
import Delivery from './Delivery';
import { useUser } from '../Context/useUser';

export default function Datos() {
    const {
        setOrder, order
    } = useUser();

    

    const baseInputStyle = "w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-[11px] text-white outline-none focus:border-dorado/30 transition-all";

    return (
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[28px] space-y-3">



            <div className="grid grid-cols-2 gap-3">
                <InputW icon={CircleDollarSign}>
                    <select
                        value={order.paymentMethod}
                        onChange={(e) => setOrder({ ...order, paymentMethod: e.target.value })}
                        className={`${baseInputStyle} appearance-none font-bold`}
                    >
                        <option value="BS">BS (PAGO MÓVIL)</option>
                        <option value="USD">USD (DIVISAS)</option>
                    </select>
                </InputW>

                <InputW icon={CreditCard}>
                    <select
                        value={order.status}
                        onChange={(e) => setOrder({ ...order, status: e.target.value })}
                        className={`${baseInputStyle} appearance-none font-bold`}
                    >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="PAGADO">PAGADO</option>
                    </select>
                </InputW>

                {order.paymentMethod === "BS" && order.status === "PAGADO" && (
                    <div className="col-span-2">
                        <InputW icon={Hash}>
                            <input
                                type="text"
                                placeholder="Últimos 4 dígitos de referencia"
                                maxLength={4}
                                value={order.referencia}
                                onChange={(e) => setOrder({ ...order, referencia: e.target.value })}
                                className={`${baseInputStyle} border-dorado/20 font-mono`}
                            />
                        </InputW>
                    </div>
                )}

                {order.paymentMethod === "USD" && order.status === "PAGADO" && (
                    <div className="col-span-2">
                        <InputW icon={DollarSign}>
                            <input
                                type="number"
                                placeholder="Efectivo en USD"
                                value={order.cash}
                                onChange={(e) => setOrder({ ...order, cash: Number(e.target.value) })}
                                className={`${baseInputStyle} border-dorado/20 font-mono`}
                            />
                        </InputW>
                    </div>
                )}
            </div>


            <Delivery />

        </div>
    );
}