// pages/POS.jsx
import { menu } from "../data/mock";
import { useState } from "react";

export default function POS() {
  const [currency, setCurrency] = useState("USD");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Nueva Orden</h2>

      <div className="flex gap-2 mb-4">
        {["USD", "BS"].map(c => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={`px-4 py-2 rounded-xl
              ${currency === c ? "bg-orange-500 text-black" : "bg-slate-800"}
            `}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {menu.map(item => (
          <div key={item.id} className="bg-slate-900 p-4 rounded-xl">
            <h3 className="font-bold">{item.name}</h3>
            <p className="text-orange-400 mt-2">
              {currency === "USD"
                ? `$${item.priceUsd}`
                : `Bs ${item.priceBs}`}
            </p>
            <button className="mt-3 w-full bg-green-500 text-black py-2 rounded-xl">
              Agregar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}