import React from 'react'

const OrderCard = () => {
  const burgers = menu.filter(m => m.type === "burger");
  const extras = menu.filter(m => m.type !== "burger" && m.type !== "combo");

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menu.find(m => m.id == id);
    return item ? sum + item.price * qty : sum;
  }, 0);

  return (
    <section className="bg-[#141c33] p-4 rounded-xl mb-4">
      <h2 className="font-bold mb-2">🧾 Tomar orden</h2>

      {menu.map(item => {
        const qty = cart[item.id] || 0;
        return (
          <div key={item.id} className="mb-2">
            <div className="flex justify-between items-center">
              <span>{item.name} (${item.price})</span>
              <input
                type="number"
                min="0"
                className="w-16 p-1 text-black rounded"
                onChange={e => setCart({ ...cart, [item.id]: Number(e.target.value) })}
              />
            </div>

            {item.type === "combo" && qty > 0 && (
              <div className="ml-3 mt-2">
                {item.burgerMax > 0 && (
                  <>
                    <p className="text-sm mb-1">Hamburguesas (máx {item.burgerMax * qty})</p>
                    {Object.entries(item.comboBurgers)
                      .filter(([_, included]) => included)
                      .map(([bId]) => {
                        const b = menu.find(m => m.id == bId);
                        const current = comboSelection[bId] || 0;
                        const totalSelected = Object.entries(item.comboBurgers)
                          .filter(([id, included]) => included)
                          .reduce((sum, [id]) => sum + (comboSelection[id] || 0), 0);
                        const maxAllowed = item.burgerMax * qty;

                        return (
                          <div key={bId} className="flex justify-between items-center text-sm mb-1">
                            <span>{b.name}</span>
                            <div className="flex items-center gap-2">
                              <button
                                className="bg-red-600 px-2 rounded"
                                onClick={() => {
                                  if (current > 0) setComboSelection({ ...comboSelection, [bId]: current - 1 });
                                }}
                              >
                                −
                              </button>
                              <span>{current}</span>
                              <button
                                className="bg-blue-600 px-2 rounded"
                                onClick={() => {
                                  if (totalSelected < maxAllowed)
                                    setComboSelection({ ...comboSelection, [bId]: current + 1 });
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </>
                )}

                {Object.entries(item.comboExtras).map(([extraId, cfg]) => {
                  if (!cfg) return null;
                  const extra = menu.find(m => m.id == extraId);
                  const current = comboSelection[extraId] || 0;
                  const maxAllowed = cfg.max * qty;

                  return (
                    <div key={extraId} className="flex justify-between items-center text-sm mb-1">
                      <span>{extra?.name} (máx {maxAllowed})</span>
                      <div className="flex items-center gap-2">
                        <button
                          className="bg-red-600 px-2 rounded"
                          onClick={() => { if (current > 0) setComboSelection({ ...comboSelection, [extraId]: current - 1 }); }}
                        >−</button>
                        <span>{current}</span>
                        <button
                          className="bg-blue-600 px-2 rounded"
                          onClick={() => { if (current < maxAllowed) setComboSelection({ ...comboSelection, [extraId]: current + 1 }); }}
                        >+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <select
        className="w-full p-2 text-black rounded mt-2"
        value={payment}
        onChange={e => setPayment(e.target.value)}
      >
        <option value="USD">Paga en USD</option>
        <option value="BS">Paga en BS</option>
      </select>

      <p className="font-bold mt-2">Total: ${total}</p>
    </section>
  );
}

export default OrderCard