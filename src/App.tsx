import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { VendorGate } from "@/components/VendorGate";
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
import VendorRegisterPage from "./pages/auth/VendorRegisterPage";
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
import VendorEditProductPage from "./pages/vendor/VendorEditProductPage";
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
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminShopsPage from "./pages/admin/AdminShopsPage";
import AdminPromotionsPage from "./pages/admin/AdminPromotionsPage";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import VendorShopSettingsPage from "./pages/vendor/VendorShopSettingsPage";
import VendorPromotionsPage from "./pages/vendor/VendorPromotionsPage";
import VendorReviewsPage from "./pages/vendor/VendorReviewsPage";
import VendorAnalyticsPage from "./pages/vendor/VendorAnalyticsPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Nouvelles pages
import StorefrontPage from "./pages/StorefrontPage";
import ProductFormPage from "./pages/vendor/ProductFormPage";
import VendorOrderDetailPage from "./pages/vendor/VendorOrderDetailPage";
import VendorPageBuilderPage from "./pages/vendor/VendorPageBuilderPage";

// Pages publiques additionnelles
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import FaqPage from "./pages/public/FaqPage";
import TermsPage from "./pages/public/TermsPage";
import PrivacyPage from "./pages/public/PrivacyPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";

// Client additionnel
import ClientOrderDetailPage from "./pages/client/ClientOrderDetailPage";
import OrderTrackingPage from "./pages/client/OrderTrackingPage";
import NotificationsPage from "./pages/client/NotificationsPage";
import SupportPage from "./pages/client/SupportPage";
import PaymentHistoryPage from "./pages/client/PaymentHistoryPage";
import BecomeVendorPage from "./pages/client/BecomeVendorPage";
import VendorApplicationStatusPage from "./pages/client/VendorApplicationStatusPage";

// Vendor additionnel
import VendorSubscriptionPage from "./pages/vendor/VendorSubscriptionPage";
import VendorExpensesPage from "./pages/vendor/VendorExpensesPage";
import VendorSuppliersPage from "./pages/vendor/VendorSuppliersPage";
import VendorShippingPage from "./pages/vendor/VendorShippingPage";
import AIShopGeneratorPage from "./pages/vendor/AIShopGeneratorPage";

// IA
import AIAssistantPage from "./pages/ai/AIAssistantPage";
import AIGenerateDescriptionPage from "./pages/ai/AIGenerateDescriptionPage";
import AIGenerateCategoriesPage from "./pages/ai/AIGenerateCategoriesPage";
import AIGeneratePagePage from "./pages/ai/AIGeneratePagePage";
import AISuggestionsPage from "./pages/ai/AISuggestionsPage";
import AIHistoryPage from "./pages/ai/AIHistoryPage";
import AISettingsPage from "./pages/ai/AISettingsPage";

// Admin additionnel
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminShippingPage from "./pages/admin/AdminShippingPage";
import AdminWilayasPage from "./pages/admin/AdminWilayasPage";
import AdminSaasPlansPage from "./pages/admin/AdminSaasPlansPage";
import AdminSupportPage from "./pages/admin/AdminSupportPage";
import AdminReportsModerationPage from "./pages/admin/AdminReportsModerationPage";
import AdminNotificationsPage from "./pages/admin/AdminNotificationsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminRolesPage from "./pages/admin/AdminRolesPage";
import AdminVendorApplicationsPage from "./pages/admin/AdminVendorApplicationsPage";

// Paiement & Système
import InvoicePage from "./pages/payment/InvoicePage";
import PaymentResultPage from "./pages/payment/PaymentResultPage";
import MaintenancePage from "./pages/system/MaintenancePage";
import ServerErrorPage from "./pages/system/ServerErrorPage";
import TrackPackagePage from "./pages/system/TrackPackagePage";

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

              {/* Pages publiques additionnelles */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/track" element={<TrackPackagePage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/500" element={<ServerErrorPage />} />
              <Route path="/payment/result" element={<PaymentResultPage />} />
              <Route path="/invoice/:id" element={<InvoicePage />} />

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/register/vendor" element={<VendorRegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* ============================================================
                  ESPACE CLIENT — réservé aux clients (et admin pour preview)
                  ============================================================ */}
              <Route path="/account" element={<ProtectedRoute allowedRoles={['client','viewer']}><ClientDashboard /></ProtectedRoute>} />
              <Route path="/account/orders" element={<ProtectedRoute allowedRoles={['client','viewer']}><ClientOrdersPage /></ProtectedRoute>} />
              <Route path="/account/orders/:id" element={<ProtectedRoute allowedRoles={['client','viewer']}><ClientOrderDetailPage /></ProtectedRoute>} />
              <Route path="/account/orders/:id/tracking" element={<ProtectedRoute allowedRoles={['client','viewer']}><OrderTrackingPage /></ProtectedRoute>} />
              <Route path="/account/profile" element={<ProtectedRoute allowedRoles={['client','viewer']}><ClientProfilePage /></ProtectedRoute>} />
              <Route path="/account/addresses" element={<ProtectedRoute allowedRoles={['client','viewer']}><ClientAddressesPage /></ProtectedRoute>} />
              <Route path="/account/notifications" element={<ProtectedRoute allowedRoles={['client','viewer']}><NotificationsPage /></ProtectedRoute>} />
              <Route path="/account/support" element={<ProtectedRoute allowedRoles={['client','viewer']}><SupportPage /></ProtectedRoute>} />
              <Route path="/account/payments" element={<ProtectedRoute allowedRoles={['client','viewer']}><PaymentHistoryPage /></ProtectedRoute>} />
              <Route path="/account/become-vendor" element={<ProtectedRoute allowedRoles={['client','viewer']}><BecomeVendorPage /></ProtectedRoute>} />
              <Route path="/account/vendor-status" element={<ProtectedRoute allowedRoles={['client','viewer','vendeur']}><VendorApplicationStatusPage /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute allowedRoles={['client','viewer']}><WishlistPage /></ProtectedRoute>} />

              {/* ============================================================
                  ESPACE GESTION (rétro-compat) — admin + super_admin uniquement
                  ============================================================ */}
              <Route path="/manage" element={<ProtectedRoute allowedRoles={['super_admin','admin']}><VendorDashboard /></ProtectedRoute>} />
              <Route path="/manage/sales" element={<ProtectedRoute allowedRoles={['super_admin','admin']}><VendorSalesManager /></ProtectedRoute>} />
              <Route path="/manage/products" element={<ProtectedRoute allowedRoles={['super_admin','admin']}><VendorProductsManager /></ProtectedRoute>} />
              <Route path="/manage/products/new" element={<ProtectedRoute allowedRoles={['super_admin','admin']}><ProductFormPage mode="create" /></ProtectedRoute>} />
              <Route path="/manage/products/:id/edit" element={<ProtectedRoute allowedRoles={['super_admin','admin']}><ProductFormPage mode="edit" /></ProtectedRoute>} />
              <Route path="/manage/clients" element={<ProtectedRoute allowedRoles={['super_admin','admin']}><VendorClientsPage /></ProtectedRoute>} />
              <Route path="/manage/stock" element={<ProtectedRoute allowedRoles={['super_admin','admin']}><VendorStockPage /></ProtectedRoute>} />
              <Route path="/manage/payments" element={<ProtectedRoute allowedRoles={['super_admin','admin']}><VendorFinancesPage /></ProtectedRoute>} />
              <Route path="/manage/users" element={<ProtectedRoute allowedRoles={['super_admin','admin']}><AdminUsersPage /></ProtectedRoute>} />

              {/* ============================================================
                  ESPACE VENDEUR — vendeur + admin uniquement
                  ============================================================ */}
              <Route path="/vendor/onboarding" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorOnboardingPage /></ProtectedRoute>} />
              <Route path="/vendor" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorDashboard /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/products" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorProductsManager /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/products/new" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorAddProductPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/products/:id/edit" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorEditProductPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/orders" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorOrdersPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/orders/:id" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorOrderDetailPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/finances" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorFinancesPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/clients" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorClientsPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/sales" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorSalesManager /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/stock" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorStockPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/settings" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorShopSettingsPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/promotions" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorPromotionsPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/reviews" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorReviewsPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/analytics" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorAnalyticsPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/subscription" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorSubscriptionPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/expenses" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorExpensesPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/suppliers" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorSuppliersPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/shipping" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorShippingPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/page-builder" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><VendorPageBuilderPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/ai-shop" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><AIShopGeneratorPage /></VendorGate></ProtectedRoute>} />
              <Route path="/vendor/ai-shop-generator" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><AIShopGeneratorPage /></VendorGate></ProtectedRoute>} />

              {/* IA */}
              <Route path="/ai/assistant" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><AIAssistantPage /></VendorGate></ProtectedRoute>} />
              <Route path="/ai/generate-description" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><AIGenerateDescriptionPage /></VendorGate></ProtectedRoute>} />
              <Route path="/ai/generate-categories" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><AIGenerateCategoriesPage /></VendorGate></ProtectedRoute>} />
              <Route path="/ai/generate-page" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><AIGeneratePagePage /></VendorGate></ProtectedRoute>} />
              <Route path="/ai/suggestions" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><AISuggestionsPage /></VendorGate></ProtectedRoute>} />
              <Route path="/ai/history" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><AIHistoryPage /></VendorGate></ProtectedRoute>} />
              <Route path="/ai/settings" element={<ProtectedRoute allowedRoles={['vendeur']}><VendorGate><AISettingsPage /></VendorGate></ProtectedRoute>} />


              {/* Admin legacy */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/vendor-applications" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminVendorApplicationsPage /></ProtectedRoute>} />
              <Route path="/admin/vendors" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminVendorsPage /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminProductsPage /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminOrdersPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute module="users"><AdminUsersPage /></ProtectedRoute>} />
              <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminCategoriesPage /></ProtectedRoute>} />
              <Route path="/admin/shops" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminShopsPage /></ProtectedRoute>} />
              <Route path="/admin/promotions" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminPromotionsPage /></ProtectedRoute>} />
              <Route path="/admin/reviews" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminReviewsPage /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminReportsPage /></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminPaymentsPage /></ProtectedRoute>} />
              <Route path="/admin/shipping" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminShippingPage /></ProtectedRoute>} />
              <Route path="/admin/wilayas" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminWilayasPage /></ProtectedRoute>} />
              <Route path="/admin/saas-plans" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminSaasPlansPage /></ProtectedRoute>} />
              <Route path="/admin/support" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminSupportPage /></ProtectedRoute>} />
              <Route path="/admin/moderation" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminReportsModerationPage /></ProtectedRoute>} />
              <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminNotificationsPage /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['super_admin','admin']}><AdminSettingsPage /></ProtectedRoute>} />
              <Route path="/admin/roles" element={<ProtectedRoute allowedRoles={['super_admin','admin']}><AdminRolesPage /></ProtectedRoute>} />
              <Route path="/admin/reports-moderation" element={<ProtectedRoute allowedRoles={['super_admin','admin']}><AdminReportsModerationPage /></ProtectedRoute>} />


              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </I18nProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
