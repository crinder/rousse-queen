import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useUser } from '../Context/useUser';
import { useManagerOrdern } from '../../Hooks/useManagerOrdern';

const CartItemCard = ({ item }) => {
    const { data, actions } = useManagerOrdern();
    const { spicySelection } = useUser();
    
    const qty = data.cart[item._id] || 0;
    const currentSpicy = spicySelection?.[item._id];
    const currentCombo = data.comboSelection?.[item._id] || {};


    return (
        <div className="p-4 rounded-[26px] border bg-white/[0.03] border-white/10 space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <h3 className="text-[11px] font-black text-white uppercase flex items-center gap-2">
                        {item.name}
                        {currentSpicy && (
                            <span className="text-orange-500 text-[9px]">[{currentSpicy}]</span>
                        )}
                    </h3>
                    <p className="text-dorado font-mono text-[10px] mt-0.5">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-3 bg-black/60 rounded-2xl p-1 border border-white/10">
                    <button onClick={() => actions.updateQty(item._id, -1)} className="p-1 text-gray-500">
                        <Minus size={16} />
                    </button>
                    <span className="text-white font-black text-sm w-4 text-center">{qty}</span>
                    <button onClick={() => actions.updateQty(item._id, 1)} className="p-1 text-dorado">
                        <Plus size={16} />
                    </button>
                </div>
            </div>
            {item.name.toUpperCase().includes("ALITAS") && (
                <div className="flex gap-1.5 bg-black/30 p-1 rounded-xl border border-white/5">
                    {["POCO", "MEDIO", "FULL"].map(lvl => (
                        <button 
                            key={lvl}
                            onClick={() => actions.updateSpicy(item._id, lvl)}
                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                                currentSpicy === lvl ? 'bg-orange-500 text-black' : 'text-gray-500'
                            }`}
                        >
                            {lvl}
                        </button>
                    ))}
                </div>
            )}

            {item.type === "COMBO" && item.comboConfig && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex justify-between px-1">
                        <p className="text-[8px] font-bold text-gray-500 uppercase">Burgers</p>
                        <p className="text-[9px] font-mono text-dorado">
                            {Object.values(currentCombo).reduce((a, b) => a + b, 0)} / {item.comboConfig.burgerMax * qty}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                        {item.comboConfig.allowedBurgers?.map(b => (
                            <div key={b._id} className="flex justify-between items-center bg-black/20 p-2 rounded-xl border border-white/5">
                                <span className="text-[10px] text-gray-400 uppercase truncate pr-2">{b.name}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => actions.updateBurgerInCombo(item._id, b._id, -1, item.comboConfig.burgerMax)}>
                                        <Minus size={12}/>
                                    </button>
                                    <span className="text-white text-[10px] font-bold">{data.comboSelection?.[item._id]?.[b._id] || 0}</span>
                                    <button onClick={() => actions.updateBurgerInCombo(item._id, b._id, 1, item.comboConfig.burgerMax)}>
                                        <Plus size={12}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartItemCard;