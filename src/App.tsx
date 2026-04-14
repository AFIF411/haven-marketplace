import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "./pages/NotFound.tsx";

import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ShopsPage from "./pages/ShopsPage";
import ShopDetailPage from "./pages/ShopDetailPage";
import PromotionsPage from "./pages/PromotionsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

import ClientDashboard from "./pages/client/ClientDashboard";
import ClientOrdersPage from "./pages/client/ClientOrdersPage";
import ClientProfilePage from "./pages/client/ClientProfilePage";
import WishlistPage from "./pages/client/WishlistPage";
import ClientAddressesPage from "./pages/client/ClientAddressesPage";

import VendorOnboardingPage from "./pages/vendor/VendorOnboardingPage";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProductsPage from "./pages/vendor/VendorProductsPage";
import VendorAddProductPage from "./pages/vendor/VendorAddProductPage";
import VendorOrdersPage from "./pages/vendor/VendorOrdersPage";
import VendorFinancesPage from "./pages/vendor/VendorFinancesPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVendorsPage from "./pages/admin/AdminVendorsPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/shops" element={<ShopsPage />} />
          <Route path="/shops/:id" element={<ShopDetailPage />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Client */}
          <Route path="/account" element={<ClientDashboard />} />
          <Route path="/account/orders" element={<ClientOrdersPage />} />
          <Route path="/account/profile" element={<ClientProfilePage />} />
          <Route path="/account/addresses" element={<ClientAddressesPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Vendor */}
          <Route path="/vendor/onboarding" element={<VendorOnboardingPage />} />
          <Route path="/vendor" element={<VendorDashboard />} />
          <Route path="/vendor/products" element={<VendorProductsPage />} />
          <Route path="/vendor/products/new" element={<VendorAddProductPage />} />
          <Route path="/vendor/orders" element={<VendorOrdersPage />} />
          <Route path="/vendor/finances" element={<VendorFinancesPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vendors" element={<AdminVendorsPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
