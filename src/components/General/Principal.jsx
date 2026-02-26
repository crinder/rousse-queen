import Header from "../../components/General/Header";
import { Outlet } from 'react-router-dom'
import Nav from "../../components/General/Nav";


const Principal = () => {

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-4 font-sans">
      <Header />
      <div className="max-w-3xl mx-auto">
        <Outlet />
        <Nav />
      </div>
    </div>
  );
};

export default Principal;