import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import PromotionForm from './components/promotions/PromotionForm';
import PromotionList from './components/promotions/PromotionList';
import PromotionupdateForm from './components/promotions/UpdatePromotionForm';
import DiscountForm from './components/discounts/DiscountForm';
import DiscountList from './components/discounts/DiscountList';
import UpdateDiscountForm from './components/discounts/UpdateDiscountForm';
import TicketRaise from './pages/TicketRaise';
import TicketStatus from './pages/TicketStatus';
import TicketManage from './pages/TicketManage';
import UserPromotions from './pages/UserPromotions';
import UserDiscounts from './pages/UserDiscounts';
import Register from './pages/Register';
import Login from './pages/Login';
import Shop from './pages/Shop';
import DashboardLayout from './layouts/DashboardLayout';
import Header from './components/Header';
import AdminCouponManager from './pages/AdminCouponManager';
import AdminTicketForm from './components/tickets/AdminTicketForm';
import AdminReports from './components/reports/AdminReports';
import CustomToastContainer from './components/ui/ToastContainer';
import PublicCustomization from './pages/PublicCustomization';
import Customize from './pages/Customize';
import UserCustomizations from './pages/UserCustomizations';
import AdminCustomizations from './pages/AdminCustomizations';

function isAdmin() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.role === 'admin';
  } catch {
    return false;
  }
}

function App() {
  return (
    <div>
      <Router>
        {!isAdmin() && <Header />}
        <Routes>
          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="discountlist" element={<DiscountList />} />
            <Route path="promotionsList" element={<PromotionList />} />
            <Route path="tickets" element={<TicketManage />} />
            <Route path="adminreports" element={<AdminReports />} />
            <Route path="coupons" element={<AdminCouponManager />} />
            <Route path="customizations" element={<AdminCustomizations />} />
          </Route>
          {/* USER ROUTES */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/customize/:productId" element={<Customize />} />
          <Route path="/my-customizations" element={<UserCustomizations />} />
          <Route path="/promotions" element={<PromotionForm />} />
          <Route path="/updatepromo" element={<PromotionupdateForm />} />
          <Route path="/discount" element={<DiscountForm />} />
          <Route path="/updatedis" element={<UpdateDiscountForm />} />
          <Route path="/ticket-raise" element={<TicketRaise />} />
          <Route path="/ticket-status" element={<TicketStatus />} />
          <Route path="/user-promotions" element={<UserPromotions />} />
          <Route path="/user-discounts" element={<UserDiscounts />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/public-customize" element={<PublicCustomization />} />
        </Routes>
      </Router>
      <CustomToastContainer />
    </div>
  );
}

export default App;
