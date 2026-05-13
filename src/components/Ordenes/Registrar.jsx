import Find from './Find';
import Datos from './Datos';
import CartItemCard from './CartItemCard';
import { useUser } from '../Context/useUser';
import { useManagerOrdern } from '../../Hooks/useManagerOrdern';

export default function Registrar() {
    const { menu, generalObservation, setGeneralObservation } = useUser();
    const { data, actions } = useManagerOrdern();
    const { cart } = data;

    console.log("registro cart", cart);

    const itemsInCart = menu?.filter(item => cart[item._id] > 0);

    return (
        <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500">
            <Find />

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <div className="grid grid-cols-1 gap-3 pb-4">
                    {itemsInCart?.map(item => (
                        <CartItemCard key={item._id} item={item} />
                    ))}
                    
                    {itemsInCart.length === 0 && (
                        <div className="text-center py-20 opacity-20 text-[10px] uppercase tracking-[0.2em] text-white">
                            No hay productos seleccionados
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-white/5">
                <textarea
                    value={generalObservation}
                    onChange={(e) => setGeneralObservation(e.target.value)}
                    placeholder="Observaciones adicionales..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-dorado/40 transition-all resize-none"
                    rows="2"
                />
                
                <Datos 
                    actions={actions} 
                    totals={data.totals} 
                />
            </div>
        </div>
    );
}