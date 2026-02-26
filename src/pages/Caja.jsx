import React from 'react'

const Caja = ({ orders }) => {
  return (
    <section className="bg-[#141c33] p-4 rounded-xl">
      <h2 className="font-bold mb-2">💰 Caja</h2>
      <p>Órdenes: {orders.length}</p>
      <p>Total ventas: ${orders.reduce((s, o) => s + o.total, 0)}</p>
    </section>
  );
}

export default Caja