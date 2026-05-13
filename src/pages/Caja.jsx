import React, { useState, useEffect } from "react";
import { apis } from "../Utils/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from '../Utils/Toast';

export default function Caja() {
  const queryClient = useQueryClient();
  const [tasa, setTasa] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [noExiste, setNoExiste] = useState(false);
  const [toast, setToast] = useState(null);
  const [type, setType] = useState("success");

  const { data, isLoading } = useQuery({
    queryKey: ['caja'],
    queryFn: () => apis.get('util/getBox'),
    staleTime: 1000 * 60 * 10,
  });

  const caja = data?.caja?.[0];

  useEffect(() => {
    if (caja) {
      setTasa(caja.rate || "");
      setIsOpen(caja.status || false);
    } else {
      setTasa("");
      setIsOpen(true);
      setNoExiste(true);
    }
  }, [caja]);

  const validaCaja = async (newStatus) => {
    if (!caja) {
      if (!tasa) return setToast("Debes ingresar una tasa") && setType("warning");
      try {
        await apis.post("util/add", { rate: tasa, status: true });
        queryClient.invalidateQueries(['caja']);
        setToast("Caja abierta por primera vez");
        setType("success");
      } catch (e) { setToast("Error al guardar") && setType("error") }

      return;
    }

    if (caja.status && !newStatus) {
      try {
        await apis.post(`util/close/${caja._id}`);
        queryClient.invalidateQueries(['caja']);

      } catch (e) { setToast("Error al cerrar") && setType("error") }
      return;
    }

    if (newStatus) {
      if (!tasa) return  setToast("Debes ingresar una tasa") && setType("warning");
      try {
        await apis.put(`util/update/${caja._id}`, { rate: tasa, status: true });
        queryClient.invalidateQueries(['caja']);
        setToast("Caja actualizada/abierta exitosamente");
        setType("success");
      } catch (e) { setToast("Error al actualizar") && setType("error") }
    }
  };

  if (isLoading) return <div className="text-white p-6">Cargando caja...</div>;

  return (
    <section className="bg-[#1A1A1A] border border-white/5 p-6 rounded-2xl shadow-2xl mb-6 relative overflow-hidden">

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="text-dorado text-xl">📋</span>
          <h2 className="font-bold text-xl text-white tracking-tight">Caja</h2>
        </div>

        <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-2xl border border-white/5">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isOpen ? 'text-emerald-500' : 'text-gray-500'}`}>
            {isOpen ? 'Abierta' : 'Cerrada'}
          </span>

          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={noExiste}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none ${isOpen ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-red-500/10 border-red-500/30'
              } border`}
          >
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-300 shadow-lg ${isOpen
                  ? 'left-7 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                  : 'left-1 bg-gray-600'
                }`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-widest">Tasa de Cambio</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dorado/50 text-xs font-bold">BS</span>
            <input
              type="number"
              className="w-full bg-[#262626] border border-white/10 p-3 pl-10 mt-1 text-white rounded-xl focus:border-dorado/50 outline-none transition-all font-mono"
              placeholder="0.00"
              value={tasa}
              onChange={(e) => setTasa(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => validaCaja(isOpen)}
        className={`w-full font-black py-4 rounded-xl mt-8 transition-all active:scale-95 uppercase tracking-[0.2em] text-[11px] shadow-xl ${isOpen
            ? 'bg-dorado text-black shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:bg-dorado/90'
            : 'bg-red-500/20 text-red-500 border border-red-500/20 hover:bg-red-500/30'
          }`}
      >
        {isOpen ? (caja?.status ? 'Actualizar Caja' : 'Abrir Caja') : 'Confirmar Cierre de Caja'}
      </button>
      {toast && <Toast message={toast} type={type} onClose={() => setToast(null)} />}
    </section>
  );
}