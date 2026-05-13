import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ListCheck, NotebookPen, Folders, ShieldEllipsis, Motorbike, PlusCircle, MoreHorizontal, ReceiptText, Clock } from "lucide-react";

const Nav = () => {
  const [showMore, setShowMore] = useState(false);

  const mainItems = [
    { label: "Inicio", path: "/app-rousse-queen/home", icon: Home },
    { label: "Ordenes", path: "/app-rousse-queen/ordenes", icon: NotebookPen },
    { label: "Historial", path: "/app-rousse-queen/historial", icon: Folders },
    { label: "Delivery", path: "/app-rousse-queen/delivery", icon: Motorbike },
  ];

  const moreItems = [
    { label: "Caja", path: "/app-rousse-queen/caja", icon: ShieldEllipsis },
    { label: "Menu", path: "/app-rousse-queen/menu", icon: ListCheck },
    { label: "Gastos", path: "/app-rousse-queen/gastos", icon: ReceiptText }, 
    { label: "Pendientes", path: "/app-rousse-queen/pending", icon: Clock },
  ];

  return (
    <>
      {showMore && (
        <div className="fixed bottom-20 right-4 w-48 bg-[#1A1A1A]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-5">
          {moreItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setShowMore(false)}
              className="flex items-center gap-3 p-3 text-gray-400 hover:text-[#D4AF37] no-underline transition-colors"
            >
              <item.icon size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around pt-3 pb-6 bg-black/90 backdrop-blur-lg border-t border-white/10 z-50 px-2">
        {mainItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setShowMore(false)}
            className={({ isActive }) => `
              flex flex-col items-center justify-center text-[9px] uppercase tracking-[0.15em] transition-all duration-300 no-underline relative flex-1
              ${isActive ? 'text-[#D4AF37] -translate-y-1' : 'text-gray-500'}
            `}
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`mt-1 font-black ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-2 w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37]"></div>
                )}
              </>
            )}
          </NavLink>
        ))}

        <button 
          onClick={() => setShowMore(!showMore)}
          className={`flex flex-col items-center justify-center text-[9px] uppercase tracking-[0.15em] flex-1 transition-colors ${showMore ? 'text-[#D4AF37]' : 'text-gray-500'}`}
        >
          <MoreHorizontal size={20} strokeWidth={showMore ? 2.5 : 2} />
          <span className="mt-1 font-black opacity-60">Más</span>
        </button>
      </nav>

      {showMore && (
        <div 
          className="fixed inset-0 bg-black/20 z-40" 
          onClick={() => setShowMore(false)}
        />
      )}
    </>
  );
};

export default Nav;