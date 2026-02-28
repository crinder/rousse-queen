import { NavLink } from 'react-router-dom';
import { Home, ListCheck, NotebookPen, Folders, ShieldEllipsis, Motorbike } from "lucide-react";

const Nav = () => {
  const navItems = [
    { label: "Inicio", path: "/app-rousse-queen/", icon: Home },
    { label: "Menu", path: "/app-rousse-queen/menu", icon: ListCheck },
    { label: "Ordenes", path: "/app-rousse-queen/ordenes", icon: NotebookPen },
    { label: "Historial", path: "/app-rousse-queen/historial", icon: Folders },
    { label: "Caja", path: "/app-rousse-queen/caja", icon: ShieldEllipsis },
    { label: "Delivery", path: "/app-rousse-queen/delivery", icon: Motorbike},
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around pt-3 pb-5 bg-black/80 backdrop-blur-lg border-t border-white/10 z-50">
      {navItems.map(({ label, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => `
            flex flex-col items-center justify-center text-[10px] uppercase tracking-widest transition-all duration-300 no-underline relative
            ${isActive 
              ? 'text-[#D4AF37] -translate-y-1 scale-110' 
              : 'text-gray-500 hover:text-gray-300'
            }
          `}
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`mt-1 font-bold ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {label}
              </span>
              {isActive && (
                <div className="absolute -bottom-2 w-1 h-1 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]"></div>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default Nav;