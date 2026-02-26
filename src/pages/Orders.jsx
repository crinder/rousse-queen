import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, ShoppingCart, TrendingUp } from 'lucide-react';
import { apis } from "../Utils/api";
import Registrar from '../components/Ordenes/Registrar';

export default function Orders() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [payment, setPayment] = useState("USD");
  const [currency, setCurrency] = useState("$");
  const [sales, setSales] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [comboSelection, setComboSelection] = useState({});

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await apis.get("menu/menus");

        setMenu(response.menus || response.data || []);
      } catch (e) {
        console.error("Error cargando menú:", e);
      }
    };
    fetchMenu();
  }, []);

  const currentSubtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menu.find(m => m._id === id); // Usamos _id de MongoDB
    return item ? sum + item.price * qty : sum;
  }, 0);

  const currentTotal = currentSubtotal + deliveryFee;

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalDelivery = sales.reduce((sum, sale) => sum + sale.deliveryFee, 0);

  const handleAddSale = (saleData) => {
    const newSale = {
      ...saleData,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };
    setSales([newSale, ...sales]);
    setCart({});
    setDeliveryFee(0);
  };

  const handleDeleteSale = (id) => {
    setSales(sales.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#1A1A1A] border border-orange-500/20 rounded-2xl p-3 shadow-sm">
          <p className="text-[10px] uppercase font-black text-orange-500 mb-1 text-center italic">Ventas</p>
          <p className="text-xl font-black text-white text-center">{currency}{totalSales.toFixed(0)}</p>
        </div>
        <div className="bg-[#1A1A1A] border border-emerald-500/20 rounded-2xl p-3 shadow-sm">
          <p className="text-[10px] uppercase font-black text-emerald-500 mb-1 text-center italic">Envío</p>
          <p className="text-xl font-black text-white text-center">{currency}{totalDelivery.toFixed(0)}</p>
        </div>
        <div className="bg-[#1A1A1A] border border-blue-500/20 rounded-2xl p-3 shadow-sm">
          <p className="text-[10px] uppercase font-black text-blue-500 mb-1 text-center italic">Orden</p>
          <p className="text-xl font-black text-white text-center">{sales.length}</p>
        </div>
      </div>

      <div className="bg-[#0F0F0F] border border-white/5 rounded-[24px] p-1">
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <Registrar
            menu={menu}
            cart={cart}
            setCart={setCart}
            setDeliveryFee={setDeliveryFee}
            currency={currency}
            deliveryFee={deliveryFee}
            currentSubtotal={currentSubtotal}
            currentTotal={currentTotal}
            handleAddSale={handleAddSale}
            comboSelection={comboSelection}
            setComboSelection={setComboSelection}
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] italic">Últimos movimientos</h3>
          <TrendingUp size={14} className="text-white/20" />
        </div>

        <div className="space-y-3">
          {sales.length > 0 ? (
            sales.slice(0, 3).map((sale) => (
              <div key={sale.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex justify-between items-center group">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{sale.timestamp}</span>
                  </div>
                  <p className="text-xs text-white/80 font-medium line-clamp-1 pr-4 italic">
                    {sale.items.join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-black text-white italic">{currency}{sale.total.toFixed(2)}</p>
                    <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-tighter">
                      {sale.payment}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteSale(sale.id)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest italic">Esperando primera venta...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}