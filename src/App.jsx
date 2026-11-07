import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import TeamPage from '@/pages/TeamPage';
import ProductPage from '@/pages/ProductPage';
import About from '@/pages/About';
import OrderConfirmation from '@/pages/OrderConfirmation';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="teams/:slug" element={<TeamPage />} />
          <Route path="products/:slug" element={<ProductPage />} />
          <Route path="about" element={<About />} />
          <Route path="cart" element={<Navigate to="/shop" replace />} />
          <Route path="order-confirmation/:orderNumber" element={<OrderConfirmation />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
