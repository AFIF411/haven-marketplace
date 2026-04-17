import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import UnauthorizedPage from "./pages/UnauthorizedPage";

// Marketplace pages
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

// Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

// Client
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientOrdersPage from "./pages/client/ClientOrdersPage";
import ClientProfilePage from "./pages/client/ClientProfilePage";
import WishlistPage from "./pages/client/WishlistPage";
import ClientAddressesPage from "./pages/client/ClientAddressesPage";

// Vendor (legacy)
import VendorOnboardingPage from "./pages/vendor/VendorOnboardingPage";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProductsManager from "./pages/vendor/VendorProductsManager";
import VendorAddProductPage from "./pages/vendor/VendorAddProductPage";
import VendorOrdersPage from "./pages/vendor/VendorOrdersPage";
import VendorFinancesPage from "./pages/vendor/VendorFinancesPage";
import VendorClientsPage from "./pages/vendor/VendorClientsPage";
import VendorSalesManager from "./pages/vendor/VendorSalesManager";
import VendorStockPage from "./pages/vendor/VendorStockPage";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVendorsPage from "./pages/admin/AdminVendorsPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

// Nouvelles pages
import StorefrontPage from "./pages/StorefrontPage";
import ProductFormPage from "./pages/vendor/ProductFormPage";
import VendorOrderDetailPage from "./pages/vendor/VendorOrderDetailPage";
import VendorPageBuilderPage from "./pages/vendor/VendorPageBuilderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <I18nProvider>
          <AuthProvider>
            <Routes>
              {/* Pages publiques */}
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
              <Route path="/shop/:slug" element={<StorefrontPage />} />

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Espace client (authentifié) */}
              <Route path="/account" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
              <Route path="/account/orders" element={<ProtectedRoute><ClientOrdersPage /></ProtectedRoute>} />
              <Route path="/account/profile" element={<ProtectedRoute><ClientProfilePage /></ProtectedRoute>} />
              <Route path="/account/addresses" element={<ProtectedRoute><ClientAddressesPage /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

              {/* Espace gestion unifié — protégé par module */}
              <Route path="/manage" element={<ProtectedRoute module="dashboard"><VendorDashboard /></ProtectedRoute>} />
              <Route path="/manage/sales" element={<ProtectedRoute module="sales"><VendorSalesManager /></ProtectedRoute>} />
              <Route path="/manage/products" element={<ProtectedRoute module="products"><VendorProductsManager /></ProtectedRoute>} />
              <Route path="/manage/products/new" element={<ProtectedRoute module="products" action="add"><ProductFormPage mode="create" /></ProtectedRoute>} />
              <Route path="/manage/products/:id/edit" element={<ProtectedRoute module="products" action="edit"><ProductFormPage mode="edit" /></ProtectedRoute>} />
              <Route path="/manage/clients" element={<ProtectedRoute module="clients"><VendorClientsPage /></ProtectedRoute>} />
              <Route path="/manage/stock" element={<ProtectedRoute module="stock"><VendorStockPage /></ProtectedRoute>} />
              <Route path="/manage/payments" element={<ProtectedRoute module="payments"><VendorFinancesPage /></ProtectedRoute>} />
              <Route path="/manage/users" element={<ProtectedRoute module="users"><AdminUsersPage /></ProtectedRoute>} />

              {/* Vendor — nouvelles pages */}
              <Route path="/vendor/orders/:id" element={<ProtectedRoute allowedRoles={['super_admin','admin','vendeur','manager']}><VendorOrderDetailPage /></ProtectedRoute>} />
              <Route path="/vendor/page-builder" element={<ProtectedRoute allowedRoles={['super_admin','admin','vendeur']}><VendorPageBuilderPage /></ProtectedRoute>} />
              {/* Vendor legacy routes (rétro-compatibilité) */}
              <Route path="/vendor/onboarding" element={<VendorOnboardingPage />} />
              <Route path="/vendor" element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} />
              <Route path="/vendor/products" element={<ProtectedRoute><VendorProductsManager /></ProtectedRoute>} />
              <Route path="/vendor/products/new" element={<ProtectedRoute><VendorAddProductPage /></ProtectedRoute>} />
              <Route path="/vendor/orders" element={<ProtectedRoute><VendorOrdersPage /></ProtectedRoute>} />
              <Route path="/vendor/finances" element={<ProtectedRoute><VendorFinancesPage /></ProtectedRoute>} />
              <Route path="/vendor/clients" element={<ProtectedRoute><VendorClientsPage /></ProtectedRoute>} />
              <Route path="/vendor/sales" element={<ProtectedRoute><VendorSalesManager /></ProtectedRoute>} />
              <Route path="/vendor/stock" element={<ProtectedRoute><VendorStockPage /></ProtectedRoute>} />

              {/* Admin legacy */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/vendors" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminVendorsPage /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminProductsPage /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminOrdersPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute module="users"><AdminUsersPage /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </I18nProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
