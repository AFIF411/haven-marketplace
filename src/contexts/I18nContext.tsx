import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "fr" | "ar";

const translations = {
  // Header
  "search.placeholder": { fr: "Rechercher produits, boutiques...", ar: "البحث عن منتجات، متاجر..." },
  "nav.categories": { fr: "Catégories", ar: "الفئات" },
  "nav.shops": { fr: "Boutiques", ar: "المتاجر" },
  "nav.promos": { fr: "Promos", ar: "عروض" },
  "nav.login": { fr: "Se connecter", ar: "تسجيل الدخول" },
  "nav.logout": { fr: "Déconnexion", ar: "تسجيل الخروج" },
  "nav.myAccount": { fr: "Mon compte", ar: "حسابي" },
  "nav.createAccount": { fr: "Créer un compte", ar: "إنشاء حساب" },
  "nav.promotions": { fr: "Promotions", ar: "العروض" },
  "nav.products": { fr: "Produits", ar: "المنتجات" },

  // Home
  "home.hero.title": { fr: "Découvrez le meilleur de l'Algérie", ar: "اكتشفوا أفضل ما في الجزائر" },
  "home.hero.subtitle": { fr: "Des milliers de boutiques algériennes réunies sur une seule plateforme. Qualité, authenticité et confiance — livraison dans les 58 wilayas.", ar: "آلاف المتاجر الجزائرية مجتمعة في منصة واحدة. جودة، أصالة وثقة — توصيل عبر 58 ولاية." },
  "home.hero.explore": { fr: "Explorer", ar: "استكشف" },
  "home.hero.becomeVendor": { fr: "Devenir vendeur", ar: "كن بائعاً" },
  "home.features.delivery": { fr: "Livraison nationale", ar: "توصيل وطني" },
  "home.features.deliveryDesc": { fr: "Vers toutes les 58 wilayas", ar: "إلى جميع الولايات الـ 58" },
  "home.features.payment": { fr: "Paiement sécurisé", ar: "دفع آمن" },
  "home.features.paymentDesc": { fr: "CCP, BaridiMob, à la livraison", ar: "CCP، بريدي موب، عند الاستلام" },
  "home.features.refund": { fr: "Satisfait ou remboursé", ar: "راضٍ أو مسترد" },
  "home.features.refundDesc": { fr: "30 jours pour changer d'avis", ar: "30 يوماً لتغيير رأيك" },
  "home.features.support": { fr: "Support 7j/7", ar: "دعم 7/7" },
  "home.features.supportDesc": { fr: "Une équipe à votre écoute", ar: "فريق في خدمتكم" },
  "home.popularCategories": { fr: "Catégories populaires", ar: "الفئات الشائعة" },
  "home.trendingProducts": { fr: "Produits tendance", ar: "المنتجات الرائجة" },
  "home.discoverShops": { fr: "Boutiques à découvrir", ar: "متاجر للاكتشاف" },
  "home.cta.title": { fr: "Ouvrez votre boutique gratuitement", ar: "افتحوا متجركم مجاناً" },
  "home.cta.subtitle": { fr: "Rejoignez des milliers de vendeurs algériens et développez votre activité sur Souk DZ.", ar: "انضموا لآلاف البائعين الجزائريين وطوّروا نشاطكم على سوق DZ." },
  "home.cta.button": { fr: "Commencer maintenant", ar: "ابدأ الآن" },

  // Common
  "common.seeAll": { fr: "Voir tout", ar: "عرض الكل" },
  "common.articles": { fr: "articles", ar: "منتج" },
  "common.verified": { fr: "Vérifié", ar: "موثق" },
  "common.reviews": { fr: "avis", ar: "تقييم" },
  "common.products": { fr: "produits", ar: "منتج" },
  "common.contact": { fr: "Contacter", ar: "تواصل" },
  "common.home": { fr: "Accueil", ar: "الرئيسية" },
  "common.apply": { fr: "Appliquer", ar: "تطبيق" },
  "common.andMore": { fr: "& plus", ar: "و أكثر" },
  "common.back": { fr: "Retour", ar: "رجوع" },
  "common.continue": { fr: "Continuer", ar: "متابعة" },
  "common.save": { fr: "Sauvegarder", ar: "حفظ" },
  "common.add": { fr: "Ajouter", ar: "إضافة" },
  "common.edit": { fr: "Modifier", ar: "تعديل" },
  "common.delete": { fr: "Supprimer", ar: "حذف" },
  "common.default": { fr: "Par défaut", ar: "افتراضي" },
  "common.description": { fr: "Description", ar: "الوصف" },
  "common.select": { fr: "Sélectionner", ar: "اختر" },

  // Product detail
  "product.inStock": { fr: "En stock", ar: "متوفر" },
  "product.reviews": { fr: "avis", ar: "تقييم" },
  "product.quantity": { fr: "Quantité", ar: "الكمية" },
  "product.addToCart": { fr: "Ajouter au panier", ar: "أضف إلى السلة" },
  "product.delivery58": { fr: "Livraison vers les 58 wilayas", ar: "توصيل عبر 58 ولاية" },
  "product.freeReturn": { fr: "Retour gratuit sous 30 jours", ar: "إرجاع مجاني خلال 30 يوم" },
  "product.similar": { fr: "Produits similaires", ar: "منتجات مشابهة" },
  "product.description": { fr: "Produit artisanal de haute qualité, fabriqué avec des matériaux soigneusement sélectionnés. Chaque pièce est unique et témoigne d'un savoir-faire traditionnel algérien allié à un design contemporain.", ar: "منتج حرفي عالي الجودة، مصنوع من مواد مختارة بعناية. كل قطعة فريدة وتشهد على حرفية تقليدية جزائرية ممزوجة بتصميم عصري." },

  // Products page
  "products.title": { fr: "Produits", ar: "المنتجات" },
  "products.found": { fr: "produits trouvés", ar: "منتج تم العثور عليه" },
  "products.price": { fr: "Prix", ar: "السعر" },
  "products.minRating": { fr: "Note minimum", ar: "التقييم الأدنى" },
  "products.relevance": { fr: "Pertinence", ar: "الصلة" },
  "products.priceAsc": { fr: "Prix croissant", ar: "السعر تصاعدي" },
  "products.priceDesc": { fr: "Prix décroissant", ar: "السعر تنازلي" },
  "products.bestRated": { fr: "Mieux notés", ar: "الأعلى تقييماً" },
  "products.newest": { fr: "Nouveautés", ar: "الأحدث" },
  "products.min": { fr: "Min", ar: "أدنى" },
  "products.max": { fr: "Max", ar: "أقصى" },

  // Cart
  "cart.title": { fr: "Mon panier", ar: "سلتي" },
  "cart.summary": { fr: "Récapitulatif", ar: "الملخص" },
  "cart.subtotal": { fr: "Sous-total", ar: "المجموع الفرعي" },
  "cart.shipping": { fr: "Livraison", ar: "التوصيل" },
  "cart.free": { fr: "Gratuit", ar: "مجاني" },
  "cart.total": { fr: "Total", ar: "المجموع" },
  "cart.order": { fr: "Commander", ar: "طلب" },
  "cart.securePayment": { fr: "Paiement 100% sécurisé", ar: "دفع آمن 100%" },
  "cart.empty": { fr: "Votre panier est vide", ar: "سلتك فارغة" },
  "cart.emptyDesc": { fr: "Parcourez nos produits et ajoutez vos favoris", ar: "تصفح منتجاتنا وأضف مفضلاتك" },
  "cart.browsProducts": { fr: "Parcourir les produits", ar: "تصفح المنتجات" },

  // Checkout
  "checkout.title": { fr: "Checkout", ar: "الدفع" },
  "checkout.address": { fr: "Adresse", ar: "العنوان" },
  "checkout.delivery": { fr: "Livraison", ar: "التوصيل" },
  "checkout.payment": { fr: "Paiement", ar: "الدفع" },
  "checkout.deliveryAddress": { fr: "Adresse de livraison", ar: "عنوان التوصيل" },
  "checkout.firstName": { fr: "Prénom", ar: "الاسم" },
  "checkout.lastName": { fr: "Nom", ar: "اللقب" },
  "checkout.addressField": { fr: "Adresse", ar: "العنوان" },
  "checkout.wilaya": { fr: "Wilaya", ar: "الولاية" },
  "checkout.selectWilaya": { fr: "Sélectionner une wilaya", ar: "اختر ولاية" },
  "checkout.commune": { fr: "Commune", ar: "البلدية" },
  "checkout.phone": { fr: "Téléphone", ar: "الهاتف" },
  "checkout.deliveryMode": { fr: "Mode de livraison", ar: "طريقة التوصيل" },
  "checkout.homeDelivery": { fr: "Livraison à domicile", ar: "توصيل للمنزل" },
  "checkout.expressDelivery": { fr: "Livraison express", ar: "توصيل سريع" },
  "checkout.relayPoint": { fr: "Point relais / bureau de poste", ar: "نقطة استلام / مكتب بريد" },
  "checkout.paymentMethod": { fr: "Paiement", ar: "طريقة الدفع" },
  "checkout.cod": { fr: "Paiement à la livraison", ar: "الدفع عند الاستلام" },
  "checkout.codDesc": { fr: "Payez en espèces à la réception", ar: "ادفع نقداً عند الاستلام" },
  "checkout.ccp": { fr: "CCP / BaridiMob", ar: "CCP / بريدي موب" },
  "checkout.ccpDesc": { fr: "Transfert via votre compte postal", ar: "تحويل عبر حسابك البريدي" },
  "checkout.card": { fr: "Carte bancaire (CIB / Edahabia)", ar: "بطاقة بنكية (CIB / الذهبية)" },
  "checkout.cardDesc": { fr: "Paiement en ligne sécurisé", ar: "دفع إلكتروني آمن" },
  "checkout.back": { fr: "Retour", ar: "رجوع" },
  "checkout.continue": { fr: "Continuer", ar: "متابعة" },
  "checkout.confirm": { fr: "Confirmer", ar: "تأكيد" },

  // Order confirmation
  "orderConfirm.title": { fr: "Commande confirmée !", ar: "تم تأكيد الطلب!" },
  "orderConfirm.success": { fr: "a été passée avec succès.", ar: "تم بنجاح." },
  "orderConfirm.date": { fr: "Date", ar: "التاريخ" },
  "orderConfirm.total": { fr: "Total", ar: "المجموع" },
  "orderConfirm.delivery": { fr: "Livraison", ar: "التوصيل" },
  "orderConfirm.standard": { fr: "Standard (2-4 jours)", ar: "عادي (2-4 أيام)" },
  "orderConfirm.wilaya": { fr: "Wilaya", ar: "الولاية" },
  "orderConfirm.status": { fr: "Statut", ar: "الحالة" },
  "orderConfirm.confirmed": { fr: "Confirmée", ar: "مؤكد" },
  "orderConfirm.viewOrders": { fr: "Voir mes commandes", ar: "عرض طلباتي" },
  "orderConfirm.continueShopping": { fr: "Continuer mes achats", ar: "متابعة التسوق" },

  // Auth
  "auth.login": { fr: "Connexion", ar: "تسجيل الدخول" },
  "auth.loginSubtitle": { fr: "Accédez à votre compte Souk DZ", ar: "ادخل إلى حسابك على سوق DZ" },
  "auth.email": { fr: "Email", ar: "البريد الإلكتروني" },
  "auth.password": { fr: "Mot de passe", ar: "كلمة المرور" },
  "auth.forgotPassword": { fr: "Mot de passe oublié ?", ar: "نسيت كلمة المرور؟" },
  "auth.loginButton": { fr: "Se connecter", ar: "تسجيل الدخول" },
  "auth.noAccount": { fr: "Pas encore de compte ?", ar: "ليس لديك حساب؟" },
  "auth.register": { fr: "S'inscrire", ar: "إنشاء حساب" },
  "auth.registerTitle": { fr: "Créer un compte", ar: "إنشاء حساب" },
  "auth.registerSubtitle": { fr: "Rejoignez Souk DZ", ar: "انضم إلى سوق DZ" },
  "auth.registerButton": { fr: "Créer mon compte", ar: "إنشاء حسابي" },
  "auth.hasAccount": { fr: "Déjà un compte ?", ar: "لديك حساب بالفعل؟" },
  "auth.loginLink": { fr: "Se connecter", ar: "تسجيل الدخول" },
  "auth.acceptTerms": { fr: "J'accepte les", ar: "أوافق على" },
  "auth.terms": { fr: "CGV", ar: "الشروط" },
  "auth.and": { fr: "et la", ar: "و" },
  "auth.privacy": { fr: "politique de confidentialité", ar: "سياسة الخصوصية" },
  "auth.forgotTitle": { fr: "Mot de passe oublié", ar: "نسيت كلمة المرور" },
  "auth.forgotSubtitle": { fr: "Entrez votre email pour réinitialiser votre mot de passe", ar: "أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور" },
  "auth.sendLink": { fr: "Envoyer le lien", ar: "إرسال الرابط" },
  "auth.backToLogin": { fr: "Retour à la connexion", ar: "العودة لتسجيل الدخول" },
  "auth.fillAll": { fr: "Veuillez remplir tous les champs", ar: "يرجى ملء جميع الحقول" },
  "auth.fillRequired": { fr: "Veuillez remplir tous les champs obligatoires", ar: "يرجى ملء جميع الحقول المطلوبة" },
  "auth.minPassword": { fr: "Le mot de passe doit contenir au moins 8 caractères", ar: "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل" },
  "auth.acceptConditions": { fr: "Veuillez accepter les conditions", ar: "يرجى قبول الشروط" },

  // Client dashboard
  "client.hello": { fr: "Bonjour", ar: "مرحباً" },
  "client.orders": { fr: "Commandes", ar: "الطلبات" },
  "client.wishlist": { fr: "Wishlist", ar: "المفضلة" },
  "client.addresses": { fr: "Adresses", ar: "العناوين" },
  "client.reviewsGiven": { fr: "Avis donnés", ar: "التقييمات" },
  "client.recentOrders": { fr: "Commandes récentes", ar: "الطلبات الأخيرة" },
  "client.myOrders": { fr: "Mes commandes", ar: "طلباتي" },
  "client.myAddresses": { fr: "Mes adresses", ar: "عناويني" },
  "client.myWishlist": { fr: "Ma wishlist", ar: "مفضلتي" },
  "client.myProfile": { fr: "Mon profil", ar: "ملفي الشخصي" },
  "client.save": { fr: "Sauvegarder", ar: "حفظ" },
  "client.add": { fr: "Ajouter", ar: "إضافة" },
  "client.edit": { fr: "Modifier", ar: "تعديل" },
  "client.default": { fr: "Par défaut", ar: "افتراضي" },
  "client.firstName": { fr: "Prénom", ar: "الاسم" },
  "client.lastName": { fr: "Nom", ar: "اللقب" },
  "client.email": { fr: "Email", ar: "البريد الإلكتروني" },
  "client.phone": { fr: "Téléphone", ar: "الهاتف" },

  // Status
  "status.delivered": { fr: "Livré", ar: "تم التوصيل" },
  "status.shipped": { fr: "Expédié", ar: "تم الشحن" },
  "status.processing": { fr: "En cours", ar: "قيد المعالجة" },
  "status.pending": { fr: "En attente", ar: "في الانتظار" },
  "status.new": { fr: "Nouvelle", ar: "جديد" },
  "status.preparing": { fr: "En préparation", ar: "قيد التحضير" },
  "status.active": { fr: "Actif", ar: "نشط" },
  "status.draft": { fr: "Brouillon", ar: "مسودة" },
  "status.approved": { fr: "Approuvé", ar: "معتمد" },
  "status.completed": { fr: "Complété", ar: "مكتمل" },

  // Table headers
  "table.order": { fr: "Commande", ar: "الطلب" },
  "table.date": { fr: "Date", ar: "التاريخ" },
  "table.status": { fr: "Statut", ar: "الحالة" },
  "table.total": { fr: "Total", ar: "المجموع" },
  "table.shop": { fr: "Boutique", ar: "المتجر" },
  "table.items": { fr: "Articles", ar: "المنتجات" },
  "table.customer": { fr: "Client", ar: "الزبون" },
  "table.product": { fr: "Produit", ar: "المنتج" },
  "table.price": { fr: "Prix", ar: "السعر" },
  "table.stock": { fr: "Stock", ar: "المخزون" },
  "table.sales": { fr: "Ventes", ar: "المبيعات" },
  "table.actions": { fr: "Actions", ar: "الإجراءات" },
  "table.buyer": { fr: "Acheteur", ar: "المشتري" },
  "table.seller": { fr: "Vendeur", ar: "البائع" },
  "table.commission": { fr: "Commission", ar: "العمولة" },
  "table.user": { fr: "Utilisateur", ar: "المستخدم" },
  "table.role": { fr: "Rôle", ar: "الدور" },
  "table.joined": { fr: "Inscrit le", ar: "تاريخ التسجيل" },
  "table.products": { fr: "Produits", ar: "المنتجات" },
  "table.revenue": { fr: "CA", ar: "الإيرادات" },
  "table.ref": { fr: "Réf.", ar: "المرجع" },
  "table.type": { fr: "Type", ar: "النوع" },
  "table.amount": { fr: "Montant", ar: "المبلغ" },
  "table.net": { fr: "Net", ar: "صافي" },

  // Filters
  "filter.all": { fr: "Toutes", ar: "الكل" },
  "filter.allM": { fr: "Tous", ar: "الكل" },
  "filter.inProgress": { fr: "En cours", ar: "قيد المعالجة" },
  "filter.shipped": { fr: "Expédiées", ar: "تم شحنها" },
  "filter.delivered": { fr: "Livrées", ar: "تم توصيلها" },
  "filter.new": { fr: "Nouvelles", ar: "جديدة" },
  "filter.preparing": { fr: "En préparation", ar: "قيد التحضير" },
  "filter.search": { fr: "Rechercher...", ar: "بحث..." },
  "filter.allStatus": { fr: "Tous les statuts", ar: "كل الحالات" },
  "filter.active": { fr: "Actif", ar: "نشط" },
  "filter.draft": { fr: "Brouillon", ar: "مسودة" },
  "filter.approved": { fr: "Approuvés", ar: "معتمد" },
  "filter.pendingFilter": { fr: "En attente", ar: "في الانتظار" },
  "filter.rejected": { fr: "Rejetés", ar: "مرفوض" },
  "filter.suspended": { fr: "Suspendus", ar: "موقوف" },
  "filter.clients": { fr: "Clients", ar: "الزبائن" },
  "filter.vendors": { fr: "Vendeurs", ar: "البائعون" },
  "filter.admins": { fr: "Admins", ar: "المشرفون" },
  "filter.actifs": { fr: "Actifs", ar: "نشطون" },

  // Vendor
  "vendor.dashboard": { fr: "Dashboard", ar: "لوحة التحكم" },
  "vendor.myShop": { fr: "Ma boutique", ar: "متجري" },
  "vendor.products": { fr: "Produits", ar: "المنتجات" },
  "vendor.orders": { fr: "Commandes", ar: "الطلبات" },
  "vendor.customers": { fr: "Clients", ar: "الزبائن" },
  "vendor.promotions": { fr: "Promotions", ar: "العروض" },
  "vendor.finances": { fr: "Finances", ar: "المالية" },
  "vendor.stats": { fr: "Statistiques", ar: "الإحصائيات" },
  "vendor.settings": { fr: "Paramètres", ar: "الإعدادات" },
  "vendor.revenue": { fr: "Chiffre d'affaires", ar: "رقم الأعمال" },
  "vendor.visitors": { fr: "Visiteurs", ar: "الزوار" },
  "vendor.activeProducts": { fr: "Produits actifs", ar: "منتجات نشطة" },
  "vendor.recentOrders": { fr: "Commandes récentes", ar: "الطلبات الأخيرة" },
  "vendor.salesOverview": { fr: "Aperçu ventes (7j)", ar: "نظرة على المبيعات (7 أيام)" },
  "vendor.myProducts": { fr: "Mes produits", ar: "منتجاتي" },
  "vendor.addProduct": { fr: "Ajouter un produit", ar: "إضافة منتج" },
  "vendor.searchProduct": { fr: "Rechercher un produit...", ar: "البحث عن منتج..." },
  "vendor.publish": { fr: "Publier le produit", ar: "نشر المنتج" },
  "vendor.saveDraft": { fr: "Sauvegarder en brouillon", ar: "حفظ كمسودة" },
  "vendor.generalInfo": { fr: "Informations générales", ar: "المعلومات العامة" },
  "vendor.productName": { fr: "Nom du produit", ar: "اسم المنتج" },
  "vendor.description": { fr: "Description", ar: "الوصف" },
  "vendor.category": { fr: "Catégorie", ar: "الفئة" },
  "vendor.subcategory": { fr: "Sous-catégorie", ar: "الفئة الفرعية" },
  "vendor.images": { fr: "Images", ar: "الصور" },
  "vendor.dragImages": { fr: "Glissez vos images ici ou", ar: "اسحب صورك هنا أو" },
  "vendor.browse": { fr: "parcourez", ar: "تصفح" },
  "vendor.priceAndStock": { fr: "Prix et stock", ar: "السعر والمخزون" },
  "vendor.price": { fr: "Prix (DA)", ar: "(DA) السعر" },
  "vendor.strikePrice": { fr: "Prix barré (DA)", ar: "(DA) السعر المشطوب" },
  "vendor.optional": { fr: "Optionnel", ar: "اختياري" },
  "vendor.balance": { fr: "Solde disponible", ar: "الرصيد المتاح" },
  "vendor.pendingBalance": { fr: "En attente", ar: "في الانتظار" },
  "vendor.totalRevenue": { fr: "CA total", ar: "إجمالي الإيرادات" },
  "vendor.withdrawals": { fr: "Retraits", ar: "السحوبات" },
  "vendor.transactions": { fr: "Transactions", ar: "المعاملات" },
  "vendor.requestWithdrawal": { fr: "Demander un retrait", ar: "طلب سحب" },
  "vendor.completed": { fr: "Complété", ar: "مكتمل" },
  "vendor.sale": { fr: "Vente", ar: "بيع" },
  "vendor.withdrawal": { fr: "Retrait", ar: "سحب" },
  "vendor.daysChart": { fr: "Sam Dim Lun Mar Mer Jeu Ven", ar: "سبت أحد اثن ثلا أرب خمي جمع" },

  // Vendor onboarding
  "onboarding.title": { fr: "Ouvrez votre boutique", ar: "افتح متجرك" },
  "onboarding.subtitle": { fr: "En quelques minutes, commencez à vendre sur Souk DZ", ar: "في دقائق قليلة، ابدأ البيع على سوق DZ" },
  "onboarding.shopInfo": { fr: "Informations de la boutique", ar: "معلومات المتجر" },
  "onboarding.shopName": { fr: "Nom de la boutique", ar: "اسم المتجر" },
  "onboarding.mainCategory": { fr: "Catégorie principale", ar: "الفئة الرئيسية" },
  "onboarding.productType": { fr: "Type de produits", ar: "نوع المنتجات" },
  "onboarding.productTypeDesc": { fr: "Quels types de produits comptez-vous vendre ?", ar: "ما نوع المنتجات التي تنوي بيعها؟" },
  "onboarding.physicalProducts": { fr: "Produits physiques", ar: "منتجات مادية" },
  "onboarding.digitalProducts": { fr: "Produits digitaux", ar: "منتجات رقمية" },
  "onboarding.services": { fr: "Services", ar: "خدمات" },
  "onboarding.traditionalCraft": { fr: "Artisanat traditionnel", ar: "حرف تقليدية" },
  "onboarding.paymentInfo": { fr: "Informations de paiement", ar: "معلومات الدفع" },
  "onboarding.ccpNumber": { fr: "Numéro CCP", ar: "رقم CCP" },
  "onboarding.accountHolder": { fr: "Titulaire du compte", ar: "صاحب الحساب" },
  "onboarding.ribOptional": { fr: "RIB bancaire (optionnel)", ar: "(اختياري) RIB بنكي" },
  "onboarding.createShop": { fr: "Créer ma boutique", ar: "إنشاء متجري" },
  "onboarding.yourShop": { fr: "Votre boutique", ar: "متجرك" },
  "onboarding.basicInfo": { fr: "Informations de base", ar: "المعلومات الأساسية" },
  "onboarding.yourProducts": { fr: "Vos produits", ar: "منتجاتك" },
  "onboarding.whatYouSell": { fr: "Ce que vous vendez", ar: "ما تبيعه" },
  "onboarding.howToPay": { fr: "Comment être payé", ar: "كيف تُدفع لك" },
  "onboarding.describeShop": { fr: "Décrivez votre boutique...", ar: "صف متجرك..." },
  "onboarding.myShop": { fr: "Ma Boutique", ar: "متجري" },
  "onboarding.wilaya": { fr: "Wilaya", ar: "الولاية" },

  // Admin
  "admin.dashboard": { fr: "Dashboard admin", ar: "لوحة تحكم المشرف" },
  "admin.manageOrders": { fr: "Gestion commandes", ar: "إدارة الطلبات" },
  "admin.manageProducts": { fr: "Gestion produits", ar: "إدارة المنتجات" },
  "admin.manageVendors": { fr: "Gestion vendeurs", ar: "إدارة البائعين" },
  "admin.users": { fr: "Utilisateurs", ar: "المستخدمون" },
  "admin.recentActivity": { fr: "Activité récente", ar: "النشاط الأخير" },
  "admin.sales30d": { fr: "Ventes (30j)", ar: "المبيعات (30 يوم)" },
  "admin.last15days": { fr: "15 derniers jours", ar: "آخر 15 يوم" },
  "admin.shops": { fr: "Boutiques", ar: "المتاجر" },
  "admin.complaints": { fr: "Réclamations", ar: "الشكاوى" },
  "admin.reviews": { fr: "Avis", ar: "التقييمات" },
  "admin.cms": { fr: "CMS", ar: "إدارة المحتوى" },
  "admin.reports": { fr: "Rapports", ar: "التقارير" },
  "admin.payments": { fr: "Paiements", ar: "المدفوعات" },
  "admin.withdrawalsAdmin": { fr: "Retraits", ar: "السحوبات" },
  "admin.categoriesAdmin": { fr: "Catégories", ar: "الفئات" },
  "admin.verified": { fr: "Vérifié", ar: "موثق" },
  "admin.client": { fr: "Client", ar: "زبون" },
  "admin.vendor": { fr: "Vendeur", ar: "بائع" },

  // Shops page
  "shops.title": { fr: "Toutes les boutiques", ar: "جميع المتاجر" },
  "shops.search": { fr: "Rechercher une boutique...", ar: "البحث عن متجر..." },
  "shops.contact": { fr: "Contacter", ar: "تواصل" },
  "shops.productsOf": { fr: "Produits de", ar: "منتجات" },
  "shops.allFilter": { fr: "Toutes", ar: "الكل" },

  // Categories
  "categories.title": { fr: "Toutes les catégories", ar: "جميع الفئات" },

  // Promotions
  "promotions.title": { fr: "Promotions en cours", ar: "العروض الحالية" },
  "promotions.subtitle": { fr: "Profitez de réductions exclusives sur une sélection de produits", ar: "استفيدوا من تخفيضات حصرية على مجموعة مختارة من المنتجات" },

  // Footer
  "footer.description": { fr: "La marketplace algérienne multi-boutique où qualité et confiance se rencontrent.", ar: "السوق الجزائري متعدد المتاجر حيث تلتقي الجودة والثقة." },
  "footer.marketplace": { fr: "Marketplace", ar: "السوق" },
  "footer.help": { fr: "Aide", ar: "المساعدة" },
  "footer.helpCenter": { fr: "Centre d'aide", ar: "مركز المساعدة" },
  "footer.deliveryFooter": { fr: "Livraison", ar: "التوصيل" },
  "footer.returns": { fr: "Retours", ar: "الإرجاع" },
  "footer.faq": { fr: "FAQ", ar: "الأسئلة الشائعة" },
  "footer.legal": { fr: "Légal", ar: "قانوني" },
  "footer.rights": { fr: "Tous droits réservés.", ar: "جميع الحقوق محفوظة." },
  "footer.becomeVendor": { fr: "Devenir vendeur", ar: "كن بائعاً" },
  "footer.about": { fr: "À propos", ar: "من نحن" },
  "footer.contact": { fr: "Contact", ar: "اتصل بنا" },
  "footer.termsFooter": { fr: "CGV", ar: "الشروط العامة" },
  "footer.privacyFooter": { fr: "Politique de confidentialité", ar: "سياسة الخصوصية" },

  // Dashboard sidebar
  "sidebar.backToSite": { fr: "Retour au site", ar: "العودة للموقع" },
  "sidebar.vendorSpace": { fr: "Espace vendeur", ar: "مساحة البائع" },
  "sidebar.administration": { fr: "Administration", ar: "الإدارة" },
  "sidebar.myAccount": { fr: "Mon compte", ar: "حسابي" },

  // Mock category names (for translated display)
  "cat.electronics": { fr: "Électronique", ar: "إلكترونيات" },
  "cat.fashion": { fr: "Mode", ar: "أزياء" },
  "cat.home": { fr: "Maison", ar: "منزل" },
  "cat.beauty": { fr: "Beauté", ar: "جمال" },
  "cat.sports": { fr: "Sports", ar: "رياضة" },
  "cat.food": { fr: "Alimentation", ar: "تغذية" },
  "cat.craft": { fr: "Artisanat", ar: "حرف يدوية" },
  "cat.hightech": { fr: "High-Tech", ar: "تكنولوجيا" },
  "cat.leather": { fr: "Maroquinerie", ar: "صناعة الجلود" },
  "cat.wellness": { fr: "Bien-être", ar: "رفاهية" },

  // Vendor product form
  "vendor.productNamePlaceholder": { fr: "Ex: Sac en cuir artisanal", ar: "مثال: حقيبة جلدية حرفية" },
  "vendor.descriptionPlaceholder": { fr: "Décrivez votre produit...", ar: "صف منتجك..." },
  "vendor.imageLimit": { fr: "PNG, JPG jusqu'à 5 Mo", ar: "PNG، JPG حتى 5 ميغا" },

  // Admin activity
  "admin.activity.newShop": { fr: "Nouvelle boutique inscrite", ar: "متجر جديد مسجل" },
  "admin.activity.orderValidation": { fr: "nécessite une validation", ar: "يحتاج تأكيد" },
  "admin.activity.withdrawalRequest": { fr: "Retrait demandé par", ar: "طلب سحب من" },
  "admin.activity.complaintResolved": { fr: "Réclamation résolue", ar: "شكوى محلولة" },
  "admin.activity.reportedProduct": { fr: "Produit signalé dans boutique", ar: "منتج مُبلّغ عنه في متجر" },
  "admin.ago5min": { fr: "Il y a 5 min", ar: "منذ 5 دقائق" },
  "admin.ago15min": { fr: "Il y a 15 min", ar: "منذ 15 دقيقة" },
  "admin.ago30min": { fr: "Il y a 30 min", ar: "منذ 30 دقيقة" },
  "admin.ago1h": { fr: "Il y a 1h", ar: "منذ ساعة" },
  "admin.ago2h": { fr: "Il y a 2h", ar: "منذ ساعتين" },
  "admin.today": { fr: "Aujourd'hui", ar: "اليوم" },
  "admin.yesterday": { fr: "Hier", ar: "أمس" },
  "admin.twoDaysAgo": { fr: "Il y a 2j", ar: "منذ يومين" },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem("soukdz_lang") as Lang) || "fr";
  });

  useEffect(() => {
    localStorage.setItem("soukdz_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = (key: TranslationKey): string => {
    const entry = translations[key];
    return entry ? entry[lang] : key;
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within I18nProvider");
  return ctx;
}
