import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import AnimatedPage from '../../Utils/AnimatedPage';
import Principal from '../General/Principal';
import Menu from '../../components/Menu/Menu';
import Orders from '../../pages/Orders';
import Delivery from '../../components/Delivery/Delivery';
import Caja from '../../pages/Caja';
import List from '../Ordenes/List'
import Gastos from '../../pages/Gastos'
import Cocina from '../Ordenes/Cocina';
import Home from '../General/Home';
import Pending from '../../pages/Pending';

const Routing = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

                {/*<Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />

                {/*<Route element={<Protected isAuthenticated={true} />}>
                    <Route path='/app-jewerly/*' element={<PrincipalGeneral />}>
                        <Route index element={<Navigate to="home" replace />} />
                    </Route>
                </Route>{*/}

                <Route 
                    path="/cocina-view" 
                    element={<AnimatedPage><Cocina /></AnimatedPage>} 
                />

                <Route path='/app-rousse-queen/*' element={<Principal />}>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<AnimatedPage><Home /></AnimatedPage>} />
                    <Route path="menu" element={<AnimatedPage><Menu /></AnimatedPage>} />
                    <Route path="ordenes" element={<AnimatedPage><Orders /></AnimatedPage>} />
                    <Route path="historial" element={<AnimatedPage><List /></AnimatedPage>} />
                    <Route path="caja" element={<AnimatedPage><Caja /></AnimatedPage>} />
                    <Route path="delivery" element={<AnimatedPage><Delivery /></AnimatedPage>} />
                    <Route path="gastos" element={<AnimatedPage><Gastos /></AnimatedPage>} />
                    <Route path="pending" element={<AnimatedPage><Pending /></AnimatedPage>} />
                </Route>

            </Routes>
        </AnimatePresence>
    );
}

export default Routing