import { AnimatePresence, motion } from 'framer-motion'
import {
  ShoppingBag,
  User,
  ArrowRight,
  Search,
  Settings,
  Bell,
  Clock3,
  Shield,
  FileText,
  LogOut,
  Home,
  Heart,
  ShoppingCart,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Screen =
  | 'onboarding'
  | 'auth'
  | 'home'
  | 'details'
  | 'cart'
  | 'checkout'
  | 'profile'
  | 'notifications'
  | 'favorites'
  | 'orders'
  | 'admin'
  | 'settings'
  | 'privacy'
  | 'terms'
  | 'emailVerification'

type Lang = 'en' | 'ru'

type ColorOption = {
  id: string
  name: string
  hex: string
}

type Product = {
  id: string
  name: string
  category: 'Chairs' | 'Sofas' | 'Tables'
  price: number
  oldPrice?: number
  isNew?: boolean
  isBestseller?: boolean
  discountPercent?: number
  image: string
  description: string
  colors: ColorOption[]
  gallery?: string[]
}

type CartItem = {
  id: string
  productId: string
  quantity: number
  colorId: string
}

const NO_PHOTO_IMAGE =
  'https://png.pngtree.com/png-clipart/20230411/original/pngtree-no-photo-line-icon-png-image_9045393.png'

type Translations = {
  onboardingChip: string
  onboardingTitlePrefix: string
  onboardingTitleHighlight: string
  onboardingSubtitle: string
  onboardingCta: string
  searchPlaceholder: string
  homeBrandSubtitle: string
  categories: {
    All: string
    Chairs: string
    Sofas: string
    Tables: string
  }
  backToCollection: string
  finishAndColor: string
  addToCartCta: (price: number) => string
  freeDeliveryNote: string
  cartTitle: string
  continueBrowsing: string
  emptyCart: string
  subtotal: string
  shipping: string
  shippingNote: string
  proceedToCheckout: string
  secureCheckoutNote: string
  recentlyView: string
  profileTitle: string
  profileName: string
  profileEmail: string
  profileSections: {
    settings: { label: string; hint: string }
    notification: { label: string; hint: string }
    history: { label: string; hint: string }
    privacy: { label: string; hint: string }
    terms: { label: string; hint: string }
    logout: { label: string; hint: string }
  }
}

const TRANSLATIONS: Record<Lang, Translations> = {
  en: {
    onboardingChip: 'Furniture, reimagined for slow living.',
    onboardingTitlePrefix: 'Curated furniture for',
    onboardingTitleHighlight: 'warm, modern spaces',
    onboardingSubtitle:
      'Discover handcrafted pieces, soft curves, and tactile materials. Designed to feel like a boutique gallery, built for everyday life.',
    onboardingCta: 'Get Started',
    searchPlaceholder: 'Search for chairs, sofas, tables...',
    homeBrandSubtitle: 'Furniture Shop',
    categories: {
      All: 'All',
      Chairs: 'Chairs',
      Sofas: 'Sofas',
      Tables: 'Tables',
    },
    backToCollection: 'Back to collection',
    finishAndColor: 'Finish & color',
    addToCartCta: (price) => `Add to cart – $${price}`,
    freeDeliveryNote: 'Free delivery from $500 · 30-day at-home trial.',
    cartTitle: 'Cart',
    continueBrowsing: '← Continue browsing',
    emptyCart: 'Your cart is empty. Add a piece you love.',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    shippingNote: 'Calculated at checkout',
    proceedToCheckout: 'Proceed to checkout',
    secureCheckoutNote:
      'Secure checkout · No hidden fees · Split payment options available.',
    recentlyView: 'Recently view',
    profileTitle: 'Profile',
    profileName: 'Richard Dan',
    profileEmail: 'richarddan18@gmail.com',
    profileSections: {
      settings: {
        label: 'Settings',
        hint: 'Appearance, language, preferences',
      },
      notification: {
        label: 'Notification',
        hint: 'Order updates, promotions',
      },
      history: {
        label: 'Order history',
        hint: 'Past orders and invoices',
      },
      privacy: {
        label: 'Privacy & Policy',
        hint: 'How we use your data',
      },
      terms: {
        label: 'Terms & Conditions',
        hint: 'User agreement and legal',
      },
      logout: {
        label: 'Log out',
        hint: 'Sign out from this device',
      },
    },
    settingsTitle: 'Settings',
    themeLabel: 'Theme',
    languageLabel: 'Language',
    notificationsLabel: 'Notifications',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    systemTheme: 'System',
    pushNotifications: 'Push notifications',
    emailNotifications: 'Email notifications',
    privacyTitle: 'Privacy & Policy',
    privacyContent:
      'Your data is protected and used only to improve our service. We do not share information with third parties without your consent. All payments are protected by PCI DSS standard.',
    termsTitle: 'Terms & Conditions',
    termsContent:
      'By using our service, you agree to these terms of service. You are responsible for keeping your account credentials safe. We reserve the right to change prices and product availability. Returns are accepted within 30 days of purchase.',
    verifyEmailTitle: 'Verify your email',
    verifyEmailDescription: 'We sent a verification code to your email',
    telegramLogin: 'Sign in with Telegram',
    emailLogin: 'Sign in with email',
  },
  ru: {
    onboardingChip: 'Мебель, переосмысленная для спокойной жизни.',
    onboardingTitlePrefix: 'Подобранная мебель для',
    onboardingTitleHighlight: 'тёплые современные интерьеры',
    onboardingSubtitle:
      'Откройте для себя мебель с мягкими формами и тактильными материалами. Как небольшой шоурум, но для вашей повседневной жизни.',
    onboardingCta: 'Начать',
    searchPlaceholder: 'Найти кресла, диваны, столы...',
    homeBrandSubtitle: 'Магазин мебели',
    categories: {
      All: 'Все',
      Chairs: 'Кресла',
      Sofas: 'Диваны',
      Tables: 'Столы',
    },
    backToCollection: 'Назад к коллекции',
    finishAndColor: 'Отделка и цвет',
    addToCartCta: (price) => `В корзину – $${price}`,
    freeDeliveryNote: 'Бесплатная доставка от $500 · 30 дней на возврат дома.',
    cartTitle: 'Корзина',
    continueBrowsing: '← Продолжить покупки',
    emptyCart: 'Ваша корзина пуста. Добавьте товар, который вам нравится.',
    subtotal: 'Итого',
    shipping: 'Доставка',
    shippingNote: 'Рассчитывается при оформлении',
    proceedToCheckout: 'Перейти к оплате',
    secureCheckoutNote:
      'Безопасная оплата · Без скрытых комиссий · Возможна рассрочка.',
    recentlyView: 'Недавно просмотренные',
    profileTitle: 'Профиль',
    profileName: 'Ричард Дэн',
    profileEmail: 'richarddan18@gmail.com',
    profileSections: {
      settings: {
        label: 'Настройки',
        hint: 'Тема, язык, предпочтения',
      },
      notification: {
        label: 'Уведомления',
        hint: 'Статус заказов, акции',
      },
      history: {
        label: 'История заказов',
        hint: 'Предыдущие покупки и счета',
      },
      privacy: {
        label: 'Конфиденциальность',
        hint: 'Как мы используем ваши данные',
      },
      terms: {
        label: 'Условия использования',
        hint: 'Пользовательское соглашение',
      },
      logout: {
        label: 'Выйти',
        hint: 'Завершить сеанс на этом устройстве',
      },
    },
    settingsTitle: 'Настройки',
    themeLabel: 'Тема',
    languageLabel: 'Язык',
    notificationsLabel: 'Уведомления',
    lightTheme: 'Светлая',
    darkTheme: 'Тёмная',
    systemTheme: 'Система',
    pushNotifications: 'Push-уведомления',
    emailNotifications: 'Email-уведомления',
    privacyTitle: 'Конфиденциальность',
    privacyContent:
      'Ваши данные защищены и используются только для улучшения сервиса. Мы не передаём информацию третьим лицам без вашего согласия. Все платежи защищены стандартом PCI DSS.',
    termsTitle: 'Условия использования',
    termsContent:
      'Используя наш сервис, вы соглашаетесь с условиями обслуживания. Вы несёте ответственность за сохранность учётных данных. Мы оставляем право менять цены и доступность товаров. Возврат товара возможен в течение 30 дней с момента покупки.',
    verifyEmailTitle: 'Подтвердите почту',
    verifyEmailDescription: 'Мы отправили код подтверждения на вашу почту',
    telegramLogin: 'Вход через Telegram',
    emailLogin: 'Вход по почте',
  },
}

// Dummy catalog
const CATALOG: Product[] = [
  {
    id: 'chair-aurora',
    name: 'Aurora Lounge Chair',
    category: 'Chairs',
    price: 249,
    oldPrice: 289,
    discountPercent: 14,
    isNew: true,
    image:
      'https://images.pexels.com/photos/6964073/pexels-photo-6964073.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'A sculpted lounge chair with generous cushions and a floating silhouette. Perfect for slow mornings and late-night reads.',
    colors: [
      { id: 'forest', name: 'Forest', hex: '#2D4739' },
      { id: 'sand', name: 'Sand', hex: '#E3D5C4' },
      { id: 'terracotta', name: 'Terracotta', hex: '#D96C4A' },
    ],
  },
  {
    id: 'sofa-haven',
    name: 'Haven Modular Sofa',
    category: 'Sofas',
    price: 1299,
    image:
      'https://images.pexels.com/photos/6588585/pexels-photo-6588585.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'A flexible, modular sofa system with deep seats and gentle curves. Built for movie nights and effortless lounging.',
    colors: [
      { id: 'cloud', name: 'Cloud', hex: '#E5E7EB' },
      { id: 'ink', name: 'Ink', hex: '#111827' },
      { id: 'latte', name: 'Latte', hex: '#C7A17A' },
    ],
  },
  {
    id: 'table-orbit',
    name: 'Orbit Dining Table',
    category: 'Tables',
    price: 799,
    image:
      'https://images.pexels.com/photos/6964071/pexels-photo-6964071.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'A round oak dining table with a soft bevel and pedestal base. Seats up to six with an intimate, gallery-like presence.',
    colors: [
      { id: 'oak', name: 'Natural Oak', hex: '#D4B48C' },
      { id: 'espresso', name: 'Espresso', hex: '#3F2A1D' },
    ],
  },
  {
    id: 'chair-knot',
    name: 'Knot Dining Chair',
    category: 'Chairs',
    price: 189,
    isBestseller: true,
    image:
      'https://images.pexels.com/photos/6964072/pexels-photo-6964072.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'A light, stackable dining chair with a woven seat and refined profile. Pairs perfectly with modern and rustic tables alike.',
    colors: [
      { id: 'linen', name: 'Linen', hex: '#F5F5F4' },
      { id: 'ink', name: 'Ink', hex: '#111827' },
    ],
  },
  {
    id: 'sofa-cloud',
    name: 'Cloud Three-Seater Sofa',
    category: 'Sofas',
    price: 1599,
    image:
      'https://images.pexels.com/photos/4047070/pexels-photo-4047070.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'A deep, cloud-like sofa with feather-wrapped cushions and relaxed piping. Ideal for open-plan living rooms.',
    colors: [
      { id: 'stone', name: 'Stone', hex: '#D4D4D8' },
      { id: 'moss', name: 'Moss', hex: '#4B5563' },
    ],
  },
  {
    id: 'table-ridge',
    name: 'Ridge Rectangular Table',
    category: 'Tables',
    price: 920,
    image:
      'https://images.pexels.com/photos/3965526/pexels-photo-3965526.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'A slim oak table with softly rounded corners and tapered legs. Works as both a dining and studio table.',
    colors: [
      { id: 'natural', name: 'Natural Oak', hex: '#E0C9A6' },
      { id: 'walnut', name: 'Walnut', hex: '#4A3325' },
    ],
  },
  {
    id: 'chair-shell',
    name: 'Shell Accent Chair',
    category: 'Chairs',
    price: 310,
    image:
      'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'An upholstered accent chair with a shell-inspired back and slender metal legs, perfect for reading corners.',
    colors: [
      { id: 'sage', name: 'Sage', hex: '#A7B5A3' },
      { id: 'charcoal', name: 'Charcoal', hex: '#374151' },
    ],
  },
  {
    id: 'sofa-arc',
    name: 'Arc Curved Sofa',
    category: 'Sofas',
    price: 1890,
    image:
      'https://images.pexels.com/photos/4718249/pexels-photo-4718249.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'A sculptural curved sofa that frames your living room and invites conversation from every angle.',
    colors: [
      { id: 'ivory', name: 'Ivory Bouclé', hex: '#F5F5F4' },
      { id: 'olive', name: 'Olive', hex: '#556052' },
    ],
  },
  {
    id: 'table-pedestal',
    name: 'Axis Pedestal Coffee Table',
    category: 'Tables',
    price: 540,
    image:
      'https://images.pexels.com/photos/3965521/pexels-photo-3965521.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'A round pedestal coffee table in stained oak with a gallery edge for books, candles, and everyday objects.',
    colors: [
      { id: 'smoke', name: 'Smoked Oak', hex: '#3F3F46' },
      { id: 'honey', name: 'Honey', hex: '#E0B76A' },
    ],
  },
  {
    id: 'chair-bar',
    name: 'Pier Bar Stool',
    category: 'Chairs',
    price: 220,
    image:
      'https://images.pexels.com/photos/37347/office-freelancer-computer-business-37347.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'A minimalist bar stool with a curved seat and metal footrest, designed for kitchen islands and high tables.',
    colors: [
      { id: 'black', name: 'Black Oak', hex: '#111827' },
      { id: 'sandstone', name: 'Sandstone', hex: '#D6C2A6' },
    ],
  },
  {
    id: 'chair-no-photo-1',
    name: 'Soft Lounge Chair',
    category: 'Chairs',
    price: 260,
    image: NO_PHOTO_IMAGE,
    description:
      'A comfy lounge chair with soft edges and a compact footprint for small living rooms.',
    colors: [
      { id: 'neutral', name: 'Neutral', hex: '#E5E5E5' },
      { id: 'deepgreen', name: 'Deep Green', hex: '#1F2933' },
    ],
  },
  {
    id: 'chair-no-photo-2',
    name: 'City Studio Chair',
    category: 'Chairs',
    price: 210,
    image: NO_PHOTO_IMAGE,
    description:
      'A studio chair with slim metal legs and a rounded backrest, ideal for desks and dining.',
    colors: [
      { id: 'stone', name: 'Stone', hex: '#D4D4D8' },
      { id: 'ink', name: 'Ink', hex: '#111827' },
    ],
  },
  {
    id: 'chair-no-photo-3',
    name: 'Wrap Armchair',
    category: 'Chairs',
    price: 295,
    image: NO_PHOTO_IMAGE,
    description:
      'An armchair with enveloping arms and a low seat that pairs well with side tables.',
    colors: [
      { id: 'latte', name: 'Latte', hex: '#C7A17A' },
      { id: 'grey', name: 'Grey', hex: '#9CA3AF' },
    ],
  },
  {
    id: 'sofa-no-photo-1',
    name: 'Loft Two-Seater Sofa',
    category: 'Sofas',
    price: 1180,
    image: NO_PHOTO_IMAGE,
    description:
      'A compact two-seater with slim arms and generous seat depth, great for city apartments.',
    colors: [
      { id: 'fog', name: 'Fog', hex: '#E5E7EB' },
      { id: 'charcoal', name: 'Charcoal', hex: '#374151' },
    ],
  },
  {
    id: 'sofa-no-photo-2',
    name: 'Gallery Sectional Sofa',
    category: 'Sofas',
    price: 2040,
    image: NO_PHOTO_IMAGE,
    description:
      'A sectional sofa with clean lines and moveable ottoman modules to adapt your layout.',
    colors: [
      { id: 'ivory', name: 'Ivory', hex: '#F9FAFB' },
      { id: 'moss', name: 'Moss', hex: '#4B5563' },
    ],
  },
  {
    id: 'sofa-no-photo-3',
    name: 'Relax Daybed',
    category: 'Sofas',
    price: 980,
    image: NO_PHOTO_IMAGE,
    description:
      'A low-profile daybed with a tufted seat cushion, perfect for hallways or reading corners.',
    colors: [
      { id: 'sand', name: 'Sand', hex: '#E3D5C4' },
      { id: 'coal', name: 'Coal', hex: '#111827' },
    ],
  },
  {
    id: 'table-no-photo-1',
    name: 'Studio Desk Table',
    category: 'Tables',
    price: 540,
    image: NO_PHOTO_IMAGE,
    description:
      'A versatile work table with rounded corners and cable routing, ideal for home offices.',
    colors: [
      { id: 'oak', name: 'Oak', hex: '#D4B48C' },
      { id: 'black', name: 'Black', hex: '#111827' },
    ],
  },
  {
    id: 'table-no-photo-2',
    name: 'Compact Round Table',
    category: 'Tables',
    price: 430,
    image: NO_PHOTO_IMAGE,
    description:
      'A compact round table that fits into breakfast nooks and small dining areas.',
    colors: [
      { id: 'white', name: 'Matte White', hex: '#F9FAFB' },
      { id: 'walnut', name: 'Walnut', hex: '#4A3325' },
    ],
  },
  {
    id: 'table-no-photo-3',
    name: 'Low Coffee Table',
    category: 'Tables',
    price: 320,
    image: NO_PHOTO_IMAGE,
    description:
      'A low coffee table with a soft-edged rectangular top for books and decor.',
    colors: [
      { id: 'honey', name: 'Honey', hex: '#E0B76A' },
      { id: 'smoke', name: 'Smoke', hex: '#3F3F46' },
    ],
  },
  {
    id: 'table-no-photo-4',
    name: 'Side Table Duo',
    category: 'Tables',
    price: 260,
    image: NO_PHOTO_IMAGE,
    description:
      'A pair of nesting side tables that slide under each other to save space.',
    colors: [
      { id: 'whiteoak', name: 'White Oak', hex: '#E5D3B3' },
      { id: 'graphite', name: 'Graphite', hex: '#111827' },
    ],
  },
]

type ProductState = {
  products: Product[]
  addProduct: (input: Omit<Product, 'id'>) => void
  updateProduct: (id: string, patch: Partial<Omit<Product, 'id'>>) => void
}

const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: CATALOG,
      addProduct: (input) => {
        const base =
          input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24) ||
          'product'
        const id = `${base}-${Date.now()}`
        set({
          products: [
            ...get().products,
            {
              ...input,
              id,
            },
          ],
        })
      },
      updateProduct: (id, patch) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...patch } : p,
          ),
        })
      },
    }),
    { name: 'furniture-products' },
  ),
)

// NAVIGATION STORE
type NavState = {
  current: Screen
  selectedProductId?: string
  goTo: (screen: Screen) => void
  openDetails: (productId: string) => void
}

const useNavStore = create<NavState>((set) => ({
  current: 'onboarding',
  selectedProductId: undefined,
  goTo: (screen) => set({ current: screen }),
  openDetails: (productId) =>
    set({ current: 'details', selectedProductId: productId }),
}))

// CART STORE WITH PERSIST
type CartState = {
  items: CartItem[]
  addToCart: (productId: string, colorId: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (productId, colorId) => {
        const existing = get().items.find(
          (i) => i.productId === productId && i.colorId === colorId,
        )
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          })
        } else {
          set({
            items: [
              ...get().items,
              {
                id: `${productId}-${colorId}-${Date.now()}`,
                productId,
                colorId,
                quantity: 1,
              },
            ],
          })
        }
      },
      removeItem: (id) =>
        set({
          items: get().items.filter((i) => i.id !== id),
        }),
      updateQuantity: (id, quantity) =>
        set({
          items: get().items
            .map((i) =>
              i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i,
            )
            .filter((i) => i.quantity > 0),
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'furniture-cart',
    },
  ),
)

type User = {
  email: string
  isAdmin: boolean
  password: string
}

type AuthState = {
  user?: User
  register: (email: string, password: string) => void
  login: (email: string, password: string) => boolean
  logout: () => void
  reset: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: undefined,
      register: (email, password) => {
        // NOTE: demo only, do NOT store plain passwords in production apps.
        const isAdmin =
          email.toLowerCase() === 'admin@furniture.local' &&
          password === 'admin123'
        set({ user: { email, isAdmin, password } })
      },
      login: (email, password) => {
        const u = get().user
        if (!u) return false
        if (u.email !== email) return false
        if (u.password !== password) return false
        return true
      },
      logout: () => set({ user: undefined }),
      reset: () => set({ user: undefined }),
    }),
    { name: 'furniture-auth-v2' },
  ),
)

type FavoriteState = {
  ids: string[]
  toggle: (productId: string) => void
}

const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const { ids } = get()
        set({
          ids: ids.includes(productId)
            ? ids.filter((id) => id !== productId)
            : [...ids, productId],
        })
      },
    }),
    { name: 'furniture-favorites' },
  ),
)

type Order = {
  id: string
  createdAt: string
  total: number
  items: CartItem[]
  name?: string
  email?: string
  address?: string
  promoCode?: string
}

type OrderState = {
  orders: Order[]
  createOrder: (
    items: CartItem[],
    total: number,
    meta?: { name?: string; email?: string; address?: string; promoCode?: string },
  ) => void
}

const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      createOrder: (items, total, meta) => {
        const id = `order-${Date.now()}`
        const createdAt = new Date().toISOString()
        set({
          orders: [...get().orders, { id, createdAt, total, items, ...meta }],
        })
      },
    }),
    { name: 'furniture-orders' },
  ),
)

// THEME STORE
type ThemeState = {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'furniture-theme' },
  ),
)

// NOTIFICATIONS SETTINGS STORE
type NotificationsSettingsState = {
  pushEnabled: boolean
  emailEnabled: boolean
  setPushEnabled: (enabled: boolean) => void
  setEmailEnabled: (enabled: boolean) => void
}

const useNotificationsSettingsStore = create<NotificationsSettingsState>()(
  persist(
    (set) => ({
      pushEnabled: true,
      emailEnabled: true,
      setPushEnabled: (enabled) => set({ pushEnabled: enabled }),
      setEmailEnabled: (enabled) => set({ emailEnabled: enabled }),
    }),
    { name: 'furniture-notifications-settings' },
  ),
)

type LangState = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
}

const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: 'en',
      setLang: (lang) => set({ lang }),
      toggle: () =>
        set({
          lang: get().lang === 'en' ? 'ru' : 'en',
        }),
    }),
    { name: 'furniture-lang' },
  ),
)

// SIMPLE DESIGN SYSTEM
const ScreenShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="app-shell">
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
      {children}
    </div>
  </div>
)

const LanguageToggle = () => {
  const { lang, toggle } = useLangStore()
  return (
    <button
      onClick={toggle}
      className="inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white px-2 text-[11px] font-medium text-slate-700 shadow-soft"
    >
      {lang.toUpperCase()}
    </button>
  )
}

// AUTH
const AuthScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const user = useAuthStore((s) => s.user)
  const register = useAuthStore((s) => s.register)
  const login = useAuthStore((s) => s.login)
  const goTo = useNavStore((s) => s.goTo)
  const lang = useLangStore((s) => s.lang)

  const isRu = lang === 'ru'

  const passwordScore = useMemo(() => {
    let score = 0
    if (password.length >= 6) score++
    if (/[0-9]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }, [password])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.includes('@')) {
      setError(isRu ? 'Введите корректный e‑mail.' : 'Please enter a valid e‑mail.')
      return
    }
    if (password.length < 6) {
      setError(
        isRu
          ? 'Пароль должен быть не короче 6 символов.'
          : 'Password must be at least 6 characters.',
      )
      return
    }
    if (mode === 'register') {
      if (user && user.email === email) {
        setError(
          isRu
            ? 'Этот e‑mail уже зарегистрирован. Используйте вход.'
            : 'This e‑mail is already registered. Use login instead.',
        )
        return
      }
      register(email, password)
      // Переходим на экран подтверждения почты
      goTo('emailVerification')
    } else {
      const ok = login(email, password)
      if (!ok) {
        setError(
          isRu
            ? 'Неверная почта или пароль.'
            : 'Incorrect e‑mail or password.',
        )
        return
      }
      goTo('home')
    }
  }

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="mb-4 flex w-full max-w-sm justify-end">
          <LanguageToggle />
        </div>
        <div className="glass-card w-full max-w-sm px-6 py-6">
          <div className="mb-4 flex items-center justify-between text-xs font-medium">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 rounded-full px-3 py-1 ${
                mode === 'login'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isRu ? 'Вход' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`ml-2 flex-1 rounded-full px-3 py-1 ${
                mode === 'register'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isRu ? 'Регистрация' : 'Sign up'}
            </button>
          </div>
          <h2 className="mb-1 text-center text-xl font-semibold text-slate-900">
            {mode === 'register'
              ? isRu
                ? 'Создайте аккаунт'
                : 'Create account'
              : isRu
                ? 'Войдите в аккаунт'
                : 'Login to your account'}
          </h2>
          <p className="mb-6 text-center text-xs text-slate-500">
            {mode === 'register'
              ? isRu
                ? 'Введите почту и придумайте пароль, чтобы продолжить покупки.'
                : 'Enter your e-mail and create a password to continue shopping.'
              : isRu
                ? 'Введите почту и пароль от уже созданного аккаунта.'
                : 'Enter the e-mail and password you used when you signed up.'}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                {isRu ? 'Электронная почта' : 'E-mail'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none ring-primary/20 placeholder:text-slate-400 focus:border-primary/50 focus:ring-2"
                placeholder={isRu ? 'example@mail.com' : 'you@example.com'}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                {isRu ? 'Пароль' : 'Password'}
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none ring-primary/20 placeholder:text-slate-400 focus:border-primary/50 focus:ring-2"
                placeholder={isRu ? 'Не менее 6 символов' : 'At least 6 characters'}
              />
            </div>
            {mode === 'register' && (
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      passwordScore <= 1
                        ? 'w-1/4 bg-rose-400'
                        : passwordScore === 2
                          ? 'w-2/4 bg-amber-400'
                          : 'w-3/4 bg-emerald-500'
                    }`}
                  />
                </div>
                <span className="ml-2">
                  {password.length === 0
                    ? ''
                    : passwordScore <= 1
                      ? isRu
                        ? 'Пароль слабый'
                        : 'Weak password'
                      : passwordScore === 2
                        ? isRu
                          ? 'Нормальный'
                          : 'Medium'
                        : isRu
                          ? 'Надёжный'
                          : 'Strong'}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-left text-[11px] text-slate-500 hover:text-slate-700"
            >
              {isRu
                ? showPassword
                  ? 'Скрыть пароль'
                  : 'Показать пароль'
                : showPassword
                  ? 'Hide password'
                  : 'Show password'}
            </button>
            {error && (
              <p className="text-[11px] text-red-500" aria-live="polite">
                {error}
              </p>
            )}
            <button type="submit" className="primary-btn mt-2 w-full">
              {mode === 'register'
                ? isRu
                  ? 'Зарегистрироваться'
                  : 'Sign up'
                : isRu
                  ? 'Войти'
                  : 'Login'}
            </button>
            <div className="relative flex items-center gap-3 my-4">
              <div className="flex-1 border-t border-slate-200" />
              <span className="text-xs text-slate-400">
                {isRu ? 'или' : 'or'}
              </span>
              <div className="flex-1 border-t border-slate-200" />
            </div>
            <button
              type="button"
              onClick={() => {
                register('telegram@user.local', 'telegram_' + Date.now())
                goTo('home')
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295-.383 0-.64-.257-.64-.64V13.1l5.822-5.27c.252-.23-.055-.356-.39-.126l-7.19 4.532-.003.002-2.994-.936c-.648-.204-.66-.648.136-.96l11.701-4.513c.537-.196 1.006.128.836.954z" />
              </svg>
              {isRu ? 'Войти через Telegram' : 'Sign in with Telegram'}
            </button>
            <button
              type="button"
              onClick={() => goTo('home')}
              className="mt-3 w-full text-center text-[11px] text-slate-500 hover:text-slate-700"
            >
              {isRu
                ? 'Позже · продолжить как гость'
                : 'Maybe later · continue as guest'}
            </button>
          </form>
        </div>
      </div>
    </ScreenShell>
  )
}

// ONBOARDING
const OnboardingScreen = () => {
  const goTo = useNavStore((s) => s.goTo)
  const lang = useLangStore((s) => s.lang)
  const t = TRANSLATIONS[lang]
  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-3 flex w-full max-w-md justify-end">
          <LanguageToggle />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="glass-card relative overflow-hidden px-8 py-10 sm:px-10"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative space-y-6">
            <div className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-xs font-medium text-primary shadow-sm ring-1 ring-primary/10">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                <ShoppingBag size={14} />
              </span>
              {t.onboardingChip}
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {t.onboardingTitlePrefix}{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t.onboardingTitleHighlight}
              </span>
            </h1>
            <p className="mx-auto max-w-md text-sm text-slate-500 sm:text-base">
              {t.onboardingSubtitle}
            </p>
            <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                className="primary-btn group w-full sm:w-auto"
                onClick={() => goTo('auth')}
              >
                <span className="mr-2">{t.onboardingCta}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </ScreenShell>
  )
}

// HOME
const categoryTabs: Array<'All' | 'Chairs' | 'Sofas' | 'Tables'> = [
  'All',
  'Chairs',
  'Sofas',
  'Tables',
]

const HomeScreen = () => {
  const [category, setCategory] =
    useState<'All' | 'Chairs' | 'Sofas' | 'Tables'>('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] =
    useState<'relevance' | 'price-asc' | 'price-desc'>('relevance')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const openDetails = useNavStore((s) => s.openDetails)
  const goTo = useNavStore((s) => s.goTo)
  const addToCart = useCartStore((s) => s.addToCart)
  const favoriteIds = useFavoriteStore((s) => s.ids)
  const toggleFavorite = useFavoriteStore((s) => s.toggle)
  const lang = useLangStore((s) => s.lang)
  const t = TRANSLATIONS[lang]
  const products = useProductStore((s) => s.products)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 350)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    const min = Number(minPrice)
    const max = Number(maxPrice)
    const hasMin = !Number.isNaN(min) && minPrice !== ''
    const hasMax = !Number.isNaN(max) && maxPrice !== ''

    const base = products.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase())
      const matchesMin = !hasMin || p.price >= min
      const matchesMax = !hasMax || p.price <= max
      return matchesCategory && matchesQuery && matchesMin && matchesMax
    })

    if (sort === 'price-asc') {
      return [...base].sort((a, b) => a.price - b.price)
    }
    if (sort === 'price-desc') {
      return [...base].sort((a, b) => b.price - a.price)
    }
    return base
  }, [category, query, products, sort, minPrice, maxPrice])

  return (
    <ScreenShell>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 -mx-4 mb-4 border-b border-slate-100 bg-surface/90 px-4 pb-3 pt-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-soft">
              <ShoppingBag size={18} />
            </div>
      <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/70">
                LUMA STUDIO
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {t.homeBrandSubtitle}
              </p>
      </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={() => goTo('profile')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-soft ring-1 ring-slate-100"
            >
              <User size={18} />
        </button>
          </div>
        </div>
        {/* Search + cart */}
        <div className="mx-auto mt-3 flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="h-9 w-full rounded-full border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-700 outline-none ring-primary/20 placeholder:text-slate-400 focus:border-primary/40 focus:ring-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as 'relevance' | 'price-asc' | 'price-desc')
              }
              className="h-9 rounded-full border border-slate-200 bg-white px-3 text-[11px] text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            >
              <option value="relevance">
                {lang === 'ru' ? 'По умолчанию' : 'Relevance'}
              </option>
              <option value="price-asc">
                {lang === 'ru' ? 'Цена ↑' : 'Price ↑'}
              </option>
              <option value="price-desc">
                {lang === 'ru' ? 'Цена ↓' : 'Price ↓'}
              </option>
            </select>
            <CartButton />
          </div>
        </div>
        {/* Price range */}
        <div className="mx-auto mt-2 flex max-w-5xl gap-2 text-[11px] text-slate-600">
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={lang === 'ru' ? 'Цена от' : 'Price from'}
            className="h-7 w-24 rounded-full border border-slate-200 bg-white px-3 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
          />
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={lang === 'ru' ? 'до' : 'to'}
            className="h-7 w-20 rounded-full border border-slate-200 bg-white px-3 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
          />
        </div>
        {/* Categories */}
        <div className="mx-auto mt-3 flex max-w-5xl gap-2 overflow-x-auto pb-1">
          {categoryTabs.map((tab) => {
            const isActive = tab === category
            return (
              <button
                key={tab}
                onClick={() => setCategory(tab)}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition ${
                  isActive
                    ? 'bg-primary text-white shadow-soft'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                }`}
              >
                {t.categories[tab]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Products grid */}
      <div className="flex-1">
        {isLoading ? (
          <motion.div
            layout
            className="grid grid-cols-2 gap-3 pb-8 sm:grid-cols-3 lg:grid-cols-4"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex animate-pulse flex-col overflow-hidden rounded-2xl bg-white/60 text-left shadow-soft ring-1 ring-slate-100"
              >
                <div className="h-32 w-full bg-slate-200/60 sm:h-40" />
                <div className="space-y-2 px-3 pb-3 pt-2">
                  <div className="h-2 w-16 rounded bg-slate-200" />
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="flex items-center justify-between pt-1">
                    <div className="h-3 w-10 rounded bg-slate-200" />
                    <div className="flex gap-1">
                      <div className="h-4 w-4 rounded-full bg-slate-200" />
                      <div className="h-4 w-4 rounded-full bg-slate-200" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 text-center text-sm text-slate-500">
            No pieces found. Try a different category or name.
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 gap-3 pb-8 sm:grid-cols-3 lg:grid-cols-4"
          >
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => openDetails(product.id)}
                role="button"
                tabIndex={0}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white text-left shadow-soft ring-1 ring-slate-100"
              >
                <div className="relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      background:
                        'radial-gradient(circle at top, rgba(232,159,113,0.22), transparent 55%)',
                    }}
                  />
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-32 w-full object-cover sm:h-40"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(product.id)
                    }}
                    className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-soft"
                    aria-label="Toggle favorite"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favoriteIds.includes(product.id)
                          ? 'fill-accent text-accent'
                          : ''
                      }`}
                    />
                  </button>
                </div>
                <div className="flex flex-1 flex-col px-3 pb-3 pt-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                      {product.category}
                    </p>
                    <div className="flex items-center gap-1">
                      {product.isNew && (
                        <span className="rounded-full bg-emerald-100 px-2 py-[2px] text-[9px] font-semibold text-emerald-700">
                          NEW
                        </span>
                      )}
                      {product.isBestseller && (
                        <span className="rounded-full bg-amber-100 px-2 py-[2px] text-[9px] font-semibold text-amber-700">
                          {lang === 'ru' ? 'Хит' : 'Best'}
                        </span>
                      )}
                      {product.discountPercent && (
                        <span className="rounded-full bg-rose-100 px-2 py-[2px] text-[9px] font-semibold text-rose-700">
                          -{product.discountPercent}%
                        </span>
                      )}
      </div>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs font-semibold text-slate-900">
                    {product.name}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-primary">
                        ${product.price}
                      </span>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <span className="text-[10px] text-slate-400 line-through">
                          ${product.oldPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        {product.colors.slice(0, 3).map((color) => (
                          <span
                            key={color.id}
                            className="inline-flex h-4 w-4 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: color.hex }}
                          />
                        ))}
      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const defaultColor = product.colors[0]
                          addToCart(product.id, defaultColor.id)
                        }}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white shadow-soft"
                        aria-label="Add to cart"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </ScreenShell>
  )
}

// CART BUTTON
const CartButton = () => {
  const goTo = useNavStore((s) => s.goTo)
  const count = useCartStore((s) =>
    s.items.reduce((acc, item) => acc + item.quantity, 0),
  )
  return (
    <button
      onClick={() => goTo('cart')}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-soft"
    >
      <ShoppingBag size={18} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold text-white ring-2 ring-primary">
          {count}
        </span>
      )}
    </button>
  )
}

const BottomNav = () => {
  const current = useNavStore((s) => s.current)
  const goTo = useNavStore((s) => s.goTo)
  const lang = useLangStore((s) => s.lang)

  if (current === 'onboarding' || current === 'auth') return null

  const labels =
    lang === 'ru'
      ? {
          notification: 'Уведомл.',
          favourite: 'Избранное',
          home: 'Главная',
          cart: 'Корзина',
          profile: 'Профиль',
        }
      : {
          notification: 'Notification',
          favourite: 'Favourite',
          home: 'Home',
          cart: 'Cart',
          profile: 'Profile',
        }

  const isActive = (key: 'home' | 'cart' | 'profile') => {
    if (key === 'home') return current === 'home'
    if (key === 'cart') return current === 'cart'
    if (key === 'profile') return current === 'profile'
    return false
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-1 shadow-[0_-6px_20px_rgba(15,23,42,0.06)] backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-md items-center justify-between text-[10px] font-medium text-slate-400">
        <button
          className="flex flex-1 flex-col items-center gap-0.5 px-1"
          onClick={() => goTo('notifications')}
        >
          <Bell className="h-5 w-5" />
          <span>{labels.notification}</span>
        </button>
        <button
          className="flex flex-1 flex-col items-center gap-0.5 px-1"
          onClick={() => goTo('favorites')}
        >
          <Heart className="h-5 w-5" />
          <span>{labels.favourite}</span>
        </button>
        <button
          className={`flex flex-1 flex-col items-center gap-0.5 px-1 ${
            isActive('home') ? 'text-primary' : ''
          }`}
          onClick={() => goTo('home')}
        >
          <Home className="h-5 w-5" />
          <span>{labels.home}</span>
        </button>
        <button
          className={`flex flex-1 flex-col items-center gap-0.5 px-1 ${
            isActive('cart') ? 'text-primary' : ''
          }`}
          onClick={() => goTo('cart')}
        >
          <ShoppingCart className="h-5 w-5" />
          <span>{labels.cart}</span>
        </button>
        <button
          className={`flex flex-1 flex-col items-center gap-0.5 px-1 ${
            isActive('profile') ? 'text-primary' : ''
          }`}
          onClick={() => goTo('profile')}
        >
          <User className="h-5 w-5" />
          <span>{labels.profile}</span>
        </button>
      </div>
    </nav>
  )
}

// DETAILS SCREEN WITH DYNAMIC THEME
const DetailsScreen = () => {
  const { selectedProductId, goTo } = useNavStore()
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null)
  const addToCart = useCartStore((s) => s.addToCart)
  const lang = useLangStore((s) => s.lang)
  const t = TRANSLATIONS[lang]
  const favoriteIds = useFavoriteStore((s) => s.ids)
  const toggleFavorite = useFavoriteStore((s) => s.toggle)
  const products = useProductStore((s) => s.products)

  const product = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? products[0],
    [selectedProductId, products],
  )

  const activeColor =
    product.colors.find((c) => c.id === selectedColorId) ?? product.colors[0]

  const handleAdd = () => {
    addToCart(product.id, activeColor.id)
    goTo('cart')
  }

  return (
    <ScreenShell>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-1 flex-col gap-4 pb-4"
      >
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-soft">
          <motion.div
            key={activeColor.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
            style={{ backgroundColor: activeColor.hex }}
          />
          <div className="relative flex flex-col gap-4 p-4 sm:flex-row sm:p-6">
            <div className="flex-1 space-y-3">
              <button
                onClick={() => goTo('home')}
                className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-slate-100 ring-1 ring-white/15 backdrop-blur"
              >
                <span className="mr-1 text-xs">←</span> {t.backToCollection}
              </button>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-300">
                  {product.category}
                </p>
                <h2 className="mt-1 text-balance text-2xl font-semibold sm:text-3xl">
                  {product.name}
                </h2>
              </div>
              <p className="max-w-md text-sm text-slate-200/90">
                {product.description}
              </p>
              <p className="text-lg font-semibold text-white">
                ${product.price}
              </p>
            </div>
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-soft"
                aria-label="Toggle favorite"
              >
                <Heart
                  className={`h-5 w-5 ${
                    favoriteIds.includes(product.id)
                      ? 'fill-accent text-accent'
                      : ''
                  }`}
                />
              </button>
              <motion.img
                key={product.id}
                src={product.image}
                alt={product.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-44 w-full rounded-2xl object-cover sm:h-64"
              />
            </div>
          </div>
        </div>

        {/* Color picker + CTA */}
        <div className="glass-card flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
          <div className="flex-1 space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              {t.finishAndColor}
            </p>
            <div className="flex items-center gap-2">
              {product.colors.map((color) => {
                const isActive = color.id === activeColor.id
                return (
                  <motion.button
                    key={color.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedColorId(color.id)}
                    className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 ring-offset-surface ${
                      isActive ? 'ring-2 ring-primary' : 'ring-0'
                    }`}
                  >
                    <span
                      className="inline-flex h-7 w-7 rounded-full border border-black/5 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                  </motion.button>
                )
              })}
              <span className="ml-2 text-xs text-slate-500">
                {activeColor.name}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:w-56">
            <button onClick={handleAdd} className="primary-btn w-full">
              {t.addToCartCta(product.price)}
            </button>
            <p className="text-[11px] text-slate-500">
              {t.freeDeliveryNote}
            </p>
          </div>
        </div>
      </motion.div>
    </ScreenShell>
  )
}

// CART SCREEN
const CartScreen = () => {
  const goTo = useNavStore((s) => s.goTo)
  const { items, updateQuantity, removeItem } = useCartStore()
  const lang = useLangStore((s) => s.lang)
  const t = TRANSLATIONS[lang]
  const products = useProductStore((s) => s.products)

  const itemsWithProduct = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) return null
      const color = product.colors.find((c) => c.id === item.colorId) ?? product.colors[0]
      return { item, product, color }
    })
    .filter((v): v is { item: CartItem; product: Product; color: ColorOption } => Boolean(v))

  const subtotal = itemsWithProduct.reduce(
    (sum, { item, product }) => sum + item.quantity * product.price,
    0,
  )

  return (
    <ScreenShell>
      <div className="flex flex-col gap-4 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => goTo('home')}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            {t.continueBrowsing}
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {t.cartTitle}
          </p>
          <CartButton />
        </div>

        <div className="glass-card divide-y divide-slate-100">
          {itemsWithProduct.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-slate-500">
              {t.emptyCart}
            </div>
          ) : (
            itemsWithProduct.map(({ item, product, color }) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-3 sm:gap-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-16 w-16 rounded-xl object-cover sm:h-20 sm:w-20"
                />
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    {product.category}
                  </p>
                  <p className="line-clamp-1 text-sm font-semibold text-slate-900">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span
                      className="inline-flex h-3 w-3 rounded-full border border-slate-200"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    ${product.price * item.quantity}
                  </p>
                  <div className="inline-flex items-center rounded-full border border-slate-200 bg-surface px-1 py-1 text-xs">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 text-slate-500 hover:text-slate-700"
                    >
                      –
                    </button>
                    <span className="w-6 text-center text-[11px]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 text-slate-500 hover:text-slate-700"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[11px] text-slate-400 hover:text-slate-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="glass-card space-y-3 px-4 py-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>{t.subtotal}</span>
            <span className="font-semibold text-slate-900">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{t.shipping}</span>
            <span>{t.shippingNote}</span>
          </div>
          <button
            disabled={!items.length}
            className="primary-btn mt-1 w-full disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => {
              if (!items.length) return
              goTo('checkout')
            }}
          >
            {t.proceedToCheckout}
          </button>
          <p className="text-[11px] text-slate-400">
            {t.secureCheckoutNote}
          </p>
        </div>

        {/* Recently view - simple recommendations */}
        <div className="glass-card space-y-2 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {t.recentlyView}
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="min-w-[120px] max-w-[130px] rounded-2xl bg-white shadow-soft ring-1 ring-slate-100"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-20 w-full rounded-2xl object-cover"
                />
                <div className="px-2 pb-2 pt-1">
                  <p className="line-clamp-1 text-[11px] font-medium text-slate-900">
                    {product.name}
                  </p>
                  <p className="text-[11px] font-semibold text-primary">
                    ${product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenShell>
  )
}

// SETTINGS SCREEN
const SettingsScreen = () => {
  const lang = useLangStore((s) => s.lang)
  const toggleLang = useLangStore((s) => s.toggle)
  const goTo = useNavStore((s) => s.goTo)
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const pushEnabled = useNotificationsSettingsStore((s) => s.pushEnabled)
  const setPushEnabled = useNotificationsSettingsStore((s) => s.setPushEnabled)
  const emailEnabled = useNotificationsSettingsStore((s) => s.emailEnabled)
  const setEmailEnabled = useNotificationsSettingsStore((s) => s.setEmailEnabled)
  const isRu = lang === 'ru'
  const t = TRANSLATIONS[lang]

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col gap-4 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => goTo('profile')}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            ← {isRu ? 'Профиль' : 'Profile'}
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {t.settingsTitle}
          </p>
          <CartButton />
        </div>

        <div className="glass-card divide-y divide-slate-100">
          {/* Theme Setting */}
          <div className="px-5 py-4">
            <p className="text-sm font-medium text-slate-900 mb-3">
              {t.themeLabel}
            </p>
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map((th) => (
                <button
                  key={th}
                  onClick={() => setTheme(th)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    theme === th
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isRu
                    ? th === 'light'
                      ? 'Светлая'
                      : th === 'dark'
                        ? 'Тёмная'
                        : 'Система'
                    : th === 'light'
                      ? 'Light'
                      : th === 'dark'
                        ? 'Dark'
                        : 'System'}
                </button>
              ))}
            </div>
          </div>

          {/* Language Setting */}
          <div className="px-5 py-4">
            <p className="text-sm font-medium text-slate-900 mb-3">
              {t.languageLabel}
            </p>
            <div className="flex gap-2">
              <button
                onClick={toggleLang}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  lang === 'en'
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                English
              </button>
              <button
                onClick={toggleLang}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  lang === 'ru'
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Русский
              </button>
            </div>
          </div>

          {/* Notifications Settings */}
          <div className="px-5 py-4">
            <p className="text-sm font-medium text-slate-900 mb-3">
              {t.notificationsLabel}
            </p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushEnabled}
                  onChange={(e) => setPushEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-primary"
                />
                <span className="text-sm text-slate-700">
                  {t.pushNotifications}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-primary"
                />
                <span className="text-sm text-slate-700">
                  {t.emailNotifications}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </ScreenShell>
  )
}

// PRIVACY SCREEN
const PrivacyScreen = () => {
  const lang = useLangStore((s) => s.lang)
  const goTo = useNavStore((s) => s.goTo)
  const isRu = lang === 'ru'
  const t = TRANSLATIONS[lang]

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col gap-4 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => goTo('profile')}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            ← {isRu ? 'Профиль' : 'Profile'}
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {t.privacyTitle}
          </p>
          <CartButton />
        </div>

        <div className="glass-card px-5 py-6">
          <div className="prose prose-sm max-w-none">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {isRu ? 'Как мы используем ваши данные' : 'How we use your data'}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {t.privacyContent}
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-6 mb-3">
              {isRu ? 'Безопасность' : 'Security'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isRu
                ? 'Мы используем передовые методы шифрования для защиты ваших данных. Все соединения защищены протоколом TLS.'
                : 'We use advanced encryption methods to protect your data. All connections are secured with TLS protocol.'}
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-6 mb-3">
              {isRu ? 'Ваши права' : 'Your rights'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isRu
                ? 'Вы можете в любой момент запросить удаление ваших персональных данных или получить их копию.'
                : 'You can request deletion of your personal data or download a copy at any time.'}
            </p>
          </div>
        </div>
      </div>
    </ScreenShell>
  )
}

// TERMS SCREEN
const TermsScreen = () => {
  const lang = useLangStore((s) => s.lang)
  const goTo = useNavStore((s) => s.goTo)
  const isRu = lang === 'ru'
  const t = TRANSLATIONS[lang]

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col gap-4 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => goTo('profile')}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            ← {isRu ? 'Профиль' : 'Profile'}
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {t.termsTitle}
          </p>
          <CartButton />
        </div>

        <div className="glass-card px-5 py-6">
          <div className="prose prose-sm max-w-none">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {t.termsTitle}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {t.termsContent}
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-6 mb-3">
              {isRu ? 'Ответственность' : 'Liability'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isRu
                ? 'Сервис предоставляется "как есть". Мы не несём ответственность за прямые или косвенные убытки от использования сервиса.'
                : 'The service is provided "as is". We are not liable for any direct or indirect damages from using the service.'}
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-6 mb-3">
              {isRu ? 'Изменения' : 'Changes'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isRu
                ? 'Мы оставляем право изменять условия использования. Изменения вступают в силу при размещении на сайте.'
                : 'We reserve the right to modify these terms. Changes take effect upon posting on the website.'}
            </p>
          </div>
        </div>
      </div>
    </ScreenShell>
  )
}

// EMAIL VERIFICATION SCREEN
const EmailVerificationScreen = () => {
  const lang = useLangStore((s) => s.lang)
  const goTo = useNavStore((s) => s.goTo)
  const isRu = lang === 'ru'
  const t = TRANSLATIONS[lang]
  const user = useAuthStore((s) => s.user)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleVerify = () => {
    if (code.length !== 6) {
      setError(isRu ? 'Код должен состоять из 6 цифр' : 'Code must be 6 digits')
      return
    }
    // Simulate verification
    setError('')
    goTo('home')
  }

  const handleResend = () => {
    setError(isRu ? 'Код отправлен!' : 'Code sent!')
    setTimeout(() => setError(''), 3000)
  }

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 pb-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {t.verifyEmailTitle}
          </h1>
          <p className="text-sm text-slate-500">
            {user?.email}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {t.verifyEmailDescription}
          </p>
        </div>

        <div className="glass-card w-full px-5 py-6">
          <div className="space-y-4">
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, ''))
                setError('')
              }}
              className="w-full px-4 py-3 text-2xl text-center tracking-widest rounded-lg border border-slate-200 bg-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-mono"
            />
            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}
            <button
              onClick={handleVerify}
              className="primary-btn w-full py-3"
            >
              {isRu ? 'Подтвердить' : 'Verify'}
            </button>
            <button
              onClick={handleResend}
              className="w-full py-2 text-xs text-primary hover:text-primary/80 font-medium"
            >
              {isRu ? 'Отправить код снова' : 'Resend code'}
            </button>
          </div>
        </div>
      </div>
    </ScreenShell>
  )
}

// PROFILE SCREEN
const ProfileScreen = () => {
  const goTo = useNavStore((s) => s.goTo)
  const lang = useLangStore((s) => s.lang)
  const t = TRANSLATIONS[lang]
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col gap-4 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => goTo('home')}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            ← Back home
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {t.profileTitle}
          </p>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <CartButton />
          </div>
        </div>

        <div className="glass-card px-5 py-6">
          <div className="flex items-center gap-4">
            <img
              src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=160"
              alt="Profile avatar"
              className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/70"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {user?.email ?? t.profileName}
              </p>
              <p className="text-xs text-slate-400">
                {user?.email ?? t.profileEmail}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card divide-y divide-slate-100">
          <ProfileRow
            icon={<Settings className="h-4 w-4 text-primary" />}
            label={t.profileSections.settings.label}
            hint={t.profileSections.settings.hint}
            onClick={() => goTo('settings')}
          />
          <ProfileRow
            icon={<Bell className="h-4 w-4 text-primary" />}
            label={t.profileSections.notification.label}
            hint={t.profileSections.notification.hint}
            onClick={() => goTo('notifications')}
          />
          <ProfileRow
            icon={<Clock3 className="h-4 w-4 text-primary" />}
            label={t.profileSections.history.label}
            hint={t.profileSections.history.hint}
            onClick={() => goTo('orders')}
          />
        </div>

        <div className="glass-card divide-y divide-slate-100">
          <ProfileRow
            icon={<Shield className="h-4 w-4 text-primary" />}
            label={t.profileSections.privacy.label}
            hint={t.profileSections.privacy.hint}
            onClick={() => goTo('privacy')}
          />
          <ProfileRow
            icon={<FileText className="h-4 w-4 text-primary" />}
            label={t.profileSections.terms.label}
            hint={t.profileSections.terms.hint}
            onClick={() => goTo('terms')}
          />
          <ProfileRow
            icon={<LogOut className="h-4 w-4 text-accent" />}
            label={t.profileSections.logout.label}
            hint={t.profileSections.logout.hint}
            onClick={() => {
              logout()
              goTo('onboarding')
            }}
          />
          <ProfileRow
            icon={<LogOut className="h-4 w-4 text-slate-600" />}
            label={lang === 'ru' ? 'Очистить аккаунт' : 'Clear account'}
            hint={
              lang === 'ru'
                ? 'Удалить сохранённый аккаунт на этом устройстве'
                : 'Remove saved account on this device'
            }
            onClick={() => {
              const ok = window.confirm(
                lang === 'ru'
                  ? 'Очистить сохранённый аккаунт на этом устройстве? Это действие нельзя отменить.'
                  : 'Clear the saved account on this device? This cannot be undone.',
              )
              if (!ok) return
              useAuthStore.getState().reset()
              goTo('onboarding')
            }}
          />
          {user?.isAdmin && (
            <ProfileRow
              icon={<Settings className="h-4 w-4 text-primary" />}
              label={lang === 'ru' ? 'Админ‑панель' : 'Admin panel'}
              hint={
                lang === 'ru'
                  ? 'Управление товарами и заказами'
                  : 'Manage products and orders'
              }
              onClick={() => goTo('admin')}
            />
          )}
        </div>
      </div>
    </ScreenShell>
  )
}

const ProfileRow: React.FC<{
  icon: React.ReactNode
  label: string
  hint: string
  onClick?: () => void
}> = ({ icon, label, hint, onClick }) => (
  <button
    className="flex w-full items-center justify-between px-5 py-3 text-left text-sm"
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-primary shadow-soft">
        {icon}
      </div>
      <div>
        <p className="font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{hint}</p>
      </div>
    </div>
    <span className="text-xs text-slate-400">›</span>
  </button>
)

// NOTIFICATIONS
const NotificationsScreen = () => {
  const lang = useLangStore((s) => s.lang)
  const goTo = useNavStore((s) => s.goTo)
  const isRu = lang === 'ru'

  const items = [
    {
      id: 'n1',
      title: isRu ? 'Ваш заказ создан' : 'Your order was created',
      body: isRu
        ? 'Мы отправим письмо, как только заказ перейдёт в доставку.'
        : 'We will email you as soon as your order ships.',
    },
    {
      id: 'n2',
      title: isRu ? 'Новые кресла в разделе «Chairs»' : 'New lounge chairs',
      body: isRu
        ? 'Добавили несколько новых моделей в мягких оттенках.'
        : 'We added new models in soft, neutral tones.',
    },
  ]

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col gap-4 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => goTo('profile')}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            ← {isRu ? 'Профиль' : 'Profile'}
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {isRu ? 'Уведомления' : 'Notifications'}
          </p>
          <CartButton />
        </div>
        <div className="glass-card divide-y divide-slate-100">
          {items.map((n) => (
            <div key={n.id} className="flex items-start gap-3 px-5 py-3">
              <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{n.title}</p>
                <p className="text-xs text-slate-500">{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  )
}

// FAVORITES
const FavoritesScreen = () => {
  const lang = useLangStore((s) => s.lang)
  const goTo = useNavStore((s) => s.goTo)
  const favoriteIds = useFavoriteStore((s) => s.ids)
  const toggleFavorite = useFavoriteStore((s) => s.toggle)
  const addToCart = useCartStore((s) => s.addToCart)
  const products = useProductStore((s) => s.products)

  const favorites = products.filter((p) => favoriteIds.includes(p.id))
  const isRu = lang === 'ru'

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col gap-4 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => goTo('home')}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            ← {isRu ? 'Назад' : 'Back'}
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {isRu ? 'Избранное' : 'Favourites'}
          </p>
          <CartButton />
        </div>
        {favorites.length === 0 ? (
          <div className="glass-card px-5 py-6 text-center text-sm text-slate-500">
            {isRu
              ? 'Здесь будут товары, которые вы отметите сердечком.'
              : 'Products you mark with a heart will appear here.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-6 sm:grid-cols-3 lg:grid-cols-4">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-soft ring-1 ring-slate-100"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-32 w-full object-cover sm:h-40"
                  />
                  <button
                    type="button"
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-soft"
                  >
                    <Heart className="h-4 w-4 fill-accent text-accent" />
                  </button>
                </div>
                <div className="flex flex-1 flex-col px-3 pb-3 pt-2">
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                    {product.category}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs font-semibold text-slate-900">
                    {product.name}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-primary">
                      ${product.price}
                    </p>
                    <button
                      onClick={() =>
                        addToCart(product.id, product.colors[0]?.id ?? '')
                      }
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white shadow-soft"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScreenShell>
  )
}

// ORDERS
const OrdersScreen = () => {
  const lang = useLangStore((s) => s.lang)
  const goTo = useNavStore((s) => s.goTo)
  const orders = useOrderStore((s) => s.orders)
  const isRu = lang === 'ru'

  const total = orders.reduce((sum, o) => sum + o.total, 0)

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col gap-4 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => goTo('profile')}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            ← {isRu ? 'Профиль' : 'Profile'}
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {isRu ? 'История заказов' : 'Order history'}
          </p>
          <CartButton />
        </div>

        <div className="glass-card px-5 py-4">
          <p className="text-sm font-medium text-slate-900">
            {isRu ? 'Всего заказов' : 'Total orders'}
          </p>
          <p className="text-2xl font-semibold text-primary">{orders.length}</p>
          <p className="mt-1 text-xs text-slate-500">
            {isRu ? 'Накопительная сумма' : 'Lifetime value'}: ${total.toFixed(2)}
          </p>
        </div>

        <div className="glass-card divide-y divide-slate-100">
          {orders.length === 0 ? (
            <div className="px-5 py-6 text-sm text-slate-500">
              {isRu
                ? 'У вас ещё нет оформленных заказов.'
                : 'You do not have any orders yet.'}
            </div>
          ) : (
            orders
              .slice()
              .reverse()
              .map((order) => (
                <div key={order.id} className="px-5 py-3 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">
                      #{order.id.slice(-6)}
                    </p>
                    <p className="font-semibold text-primary">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  {order.name && (
                    <p className="text-xs text-slate-500">
                      {order.name} · {order.email}
                    </p>
                  )}
                  {order.address && (
                    <p className="text-xs text-slate-500">{order.address}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    {isRu
                      ? `${order.items.length} позиций в заказе`
                      : `${order.items.length} items`}
                  </p>
                </div>
              ))
          )}
        </div>
      </div>
    </ScreenShell>
  )
}

// CHECKOUT
const CheckoutScreen = () => {
  const lang = useLangStore((s) => s.lang)
  const goTo = useNavStore((s) => s.goTo)
  const { items, clear } = useCartStore()
  const createOrder = useOrderStore((s) => s.createOrder)
  const products = useProductStore((s) => s.products)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [promo, setPromo] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isRu = lang === 'ru'

  const itemsWithProduct = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) return null
      return { item, product }
    })
    .filter((v): v is { item: CartItem; product: Product } => Boolean(v))

  const subtotal = itemsWithProduct.reduce(
    (sum, { item, product }) => sum + item.quantity * product.price,
    0,
  )

  const discount = useMemo(() => {
    const code = promo.trim().toUpperCase()
    if (code === 'WELCOME10') return subtotal * 0.1
    if (code === 'FREESHIP') return 15
    return 0
  }, [promo, subtotal])

  const total = Math.max(0, subtotal - discount)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name || !email || !address) {
      setError(
        isRu
          ? 'Заполните имя, e‑mail и адрес доставки.'
          : 'Please fill in name, e‑mail and shipping address.',
      )
      return
    }
    createOrder(items, total, { name, email, address, promoCode: promo })
    clear()
    goTo('orders')
  }

  if (!items.length) {
    return (
      <ScreenShell>
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-sm text-slate-500">
            {isRu ? 'Ваша корзина пуста.' : 'Your cart is empty.'}
          </p>
          <button
            className="mt-4 primary-btn"
            onClick={() => goTo('home')}
          >
            {isRu ? 'Вернуться в каталог' : 'Back to catalog'}
          </button>
        </div>
      </ScreenShell>
    )
  }

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col gap-4 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => goTo('cart')}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            ← {isRu ? 'Назад в корзину' : 'Back to cart'}
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {isRu ? 'Оформление' : 'Checkout'}
          </p>
          <CartButton />
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-card grid gap-3 px-4 py-4 sm:grid-cols-2"
        >
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {isRu ? 'Контакты' : 'Contact'}
            </p>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">
                {isRu ? 'Имя' : 'Name'}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">
                E‑mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">
                {isRu ? 'Адрес доставки' : 'Shipping address'}
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-20 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {isRu ? 'Итого' : 'Summary'}
            </p>
            <div className="space-y-1 rounded-xl bg-surface px-3 py-3 text-xs">
              <div className="flex items-center justify-between">
                <span>{isRu ? 'Товары' : 'Items'}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{isRu ? 'Скидка' : 'Discount'}</span>
                <span className={discount ? 'text-emerald-600' : ''}>
                  -${discount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-sm font-semibold">
                <span>{isRu ? 'К оплате' : 'Total'}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">
                {isRu ? 'Промокод' : 'Promo code'}
              </label>
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                placeholder={isRu ? 'WELCOME10 или FREESHIP' : 'WELCOME10 or FREESHIP'}
              />
            </div>

            {error && (
              <p className="text-[11px] text-red-500" aria-live="polite">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="primary-btn mt-1 w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRu ? 'Подтвердить заказ' : 'Confirm order'}
            </button>
            <p className="text-[11px] text-slate-400">
              {isRu
                ? 'Оплата на этом демо‑сайте не взимается. Данные используются только для примера интерфейса.'
                : 'No real payment is processed on this demo. Data is used only for UI demonstration.'}
            </p>
          </div>
        </form>
      </div>
    </ScreenShell>
  )
}
// ADMIN
const AdminScreen = () => {
  const lang = useLangStore((s) => s.lang)
  const goTo = useNavStore((s) => s.goTo)
  const user = useAuthStore((s) => s.user)
  const orders = useOrderStore((s) => s.orders)
  const products = useProductStore((s) => s.products)
  const addProduct = useProductStore((s) => s.addProduct)
  const updateProduct = useProductStore((s) => s.updateProduct)
  const isRu = lang === 'ru'

  const [name, setName] = useState('')
  const [category, setCategory] =
    useState<'Chairs' | 'Sofas' | 'Tables'>('Chairs')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [gallery, setGallery] = useState('')
  const [color1Name, setColor1Name] = useState('')
  const [color1Hex, setColor1Hex] = useState('')
  const [color2Name, setColor2Name] = useState('')
  const [color2Hex, setColor2Hex] = useState('')
  const [color3Name, setColor3Name] = useState('')
  const [color3Hex, setColor3Hex] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [editedProductId, setEditedProductId] = useState<string | null>(null)
  const [editMainImage, setEditMainImage] = useState('')
  const [editGallery, setEditGallery] = useState('')

  if (!user?.isAdmin) {
    return (
      <ScreenShell>
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-sm text-slate-500">
            {isRu
              ? 'Доступ к админ‑панели есть только у администратора (e‑mail admin@furniture.local, пароль admin123).'
              : 'Admin panel is available only for the admin account (e-mail admin@furniture.local, password admin123).'}
          </p>
        </div>
      </ScreenShell>
    )
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const parsedPrice = Number(price)
    if (!name || !image || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError(
        isRu
          ? 'Заполните имя, цену (> 0) и главное фото.'
          : 'Please provide name, price (> 0), and main image URL.',
      )
      return
    }
    const colors: ColorOption[] = []
    const pushColor = (id: string, cname: string, chex: string) => {
      if (!cname || !chex) return
      colors.push({ id, name: cname, hex: chex })
    }
    pushColor('c1', color1Name, color1Hex)
    pushColor('c2', color2Name, color2Hex)
    pushColor('c3', color3Name, color3Hex)
    if (colors.length === 0) {
      colors.push({ id: 'default', name: 'Default', hex: '#E5E5E5' })
    }
    const extraImages =
      gallery
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean) ?? []

    addProduct({
      name,
      category,
      price: parsedPrice,
      image,
      description: isRu
        ? 'Новый товар, добавленный через админ‑панель.'
        : 'New product added from the admin panel.',
      colors,
      gallery: extraImages,
    })

    setName('')
    setPrice('')
    setImage('')
    setGallery('')
    setColor1Name('')
    setColor1Hex('')
    setColor2Name('')
    setColor2Hex('')
    setColor3Name('')
    setColor3Hex('')
  }

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col gap-4 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => goTo('profile')}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            ← {isRu ? 'Профиль' : 'Profile'}
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {isRu ? 'Админ‑панель' : 'Admin panel'}
          </p>
          <CartButton />
        </div>

        <div className="glass-card grid gap-4 px-5 py-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-500">
              {isRu ? 'Всего товаров' : 'Total products'}
            </p>
            <p className="text-xl font-semibold text-slate-900">
              {products.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">
              {isRu ? 'Всего заказов' : 'Total orders'}
            </p>
            <p className="text-xl font-semibold text-slate-900">
              {orders.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">
              {isRu ? 'Выручка' : 'Revenue'}
            </p>
            <p className="text-xl font-semibold text-primary">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="glass-card px-5 py-4">
          <p className="mb-2 text-sm font-semibold text-slate-900">
            {isRu ? 'Последние заказы' : 'Latest orders'}
          </p>
          {orders.length === 0 ? (
            <p className="text-xs text-slate-500">
              {isRu ? 'Пока заказов нет.' : 'No orders yet.'}
            </p>
          ) : (
            orders
              .slice()
              .reverse()
              .slice(0, 5)
              .map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between border-t border-slate-100 py-2 text-xs"
                >
                  <span className="font-medium text-slate-800">
                    #{o.id.slice(-6)}
                  </span>
                  <span className="text-slate-500">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-semibold text-primary">
                    ${o.total.toFixed(2)}
                  </span>
                </div>
              ))
          )}
        </div>

        <div className="glass-card px-5 py-4">
          <p className="mb-2 text-sm font-semibold text-slate-900">
            {isRu ? 'Добавить товар' : 'Add product'}
          </p>
          <form onSubmit={handleAddProduct} className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                {isRu ? 'Название' : 'Name'}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                {isRu ? 'Категория' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as 'Chairs' | 'Sofas' | 'Tables')
                }
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              >
                <option value="Chairs">{isRu ? 'Кресла' : 'Chairs'}</option>
                <option value="Sofas">{isRu ? 'Диваны' : 'Sofas'}</option>
                <option value="Tables">{isRu ? 'Столы' : 'Tables'}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                {isRu ? 'Цена' : 'Price'}
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                placeholder="249"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                {isRu ? 'Главное фото (URL)' : 'Main image (URL)'}
              </label>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-slate-600">
                {isRu
                  ? 'Доп. фото (через запятую, URL)'
                  : 'Extra images (comma separated URLs)'}
              </label>
              <input
                value={gallery}
                onChange={(e) => setGallery(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                placeholder="https://..., https://..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                {isRu ? 'Цвет 1 (имя)' : 'Color 1 name'}
              </label>
              <input
                value={color1Name}
                onChange={(e) => setColor1Name(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                placeholder="Ivory"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                {isRu ? 'Цвет 1 (HEX)' : 'Color 1 HEX'}
              </label>
              <input
                value={color1Hex}
                onChange={(e) => setColor1Hex(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                placeholder="#F5F5F4"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                {isRu ? 'Цвет 2 (имя)' : 'Color 2 name'}
              </label>
              <input
                value={color2Name}
                onChange={(e) => setColor2Name(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                {isRu ? 'Цвет 2 (HEX)' : 'Color 2 HEX'}
              </label>
              <input
                value={color2Hex}
                onChange={(e) => setColor2Hex(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                {isRu ? 'Цвет 3 (имя)' : 'Color 3 name'}
              </label>
              <input
                value={color3Name}
                onChange={(e) => setColor3Name(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                {isRu ? 'Цвет 3 (HEX)' : 'Color 3 HEX'}
              </label>
              <input
                value={color3Hex}
                onChange={(e) => setColor3Hex(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {formError && (
              <p className="sm:col-span-2 text-[11px] text-red-500">{formError}</p>
            )}

            <div className="sm:col-span-2">
              <button type="submit" className="primary-btn mt-1 w-full sm:w-auto">
                {isRu ? 'Сохранить товар' : 'Save product'}
              </button>
            </div>
          </form>
        </div>

        <div className="glass-card px-5 py-4">
          <p className="mb-2 text-sm font-semibold text-slate-900">
            {isRu ? 'Фотографии товаров' : 'Product photos'}
          </p>
          {products.length === 0 ? (
            <p className="text-xs text-slate-500">
              {isRu
                ? 'Пока нет товаров для редактирования.'
                : 'There are no products to edit yet.'}
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {products.map((p) => {
                const isActive = editedProductId === p.id
                return (
                  <div
                    key={p.id}
                    className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 line-clamp-1">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {p.category} · ${p.price}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-[11px] font-medium text-primary hover:text-primary/80"
                        onClick={() => {
                          setEditedProductId(p.id)
                          setEditMainImage(p.image)
                          setEditGallery((p.gallery ?? []).join(', '))
                        }}
                      >
                        {isRu ? 'Редактировать' : 'Edit'}
                      </button>
                    </div>
                    {isActive && (
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-slate-600">
                            {isRu ? 'Главное фото (URL)' : 'Main image (URL)'}
                          </label>
                          <input
                            value={editMainImage}
                            onChange={(e) => setEditMainImage(e.target.value)}
                            className="h-7 w-full rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-1">
                          <label className="text-[11px] font-medium text-slate-600">
                            {isRu
                              ? 'Галерея (через запятую)'
                              : 'Gallery (comma separated)'}
                          </label>
                          <input
                            value={editGallery}
                            onChange={(e) => setEditGallery(e.target.value)}
                            className="h-7 w-full rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-800 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div className="sm:col-span-2 flex justify-end gap-2">
                          <button
                            type="button"
                            className="text-[11px] text-slate-500 hover:text-slate-700"
                            onClick={() => {
                              setEditedProductId(null)
                              setEditMainImage('')
                              setEditGallery('')
                            }}
                          >
                            {isRu ? 'Отменить' : 'Cancel'}
                          </button>
                          <button
                            type="button"
                            className="primary-btn px-4 py-1 text-[11px]"
                            onClick={() => {
                              const galleryArr = editGallery
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean)
                              updateProduct(p.id, {
                                image: editMainImage || p.image,
                                gallery: galleryArr,
                              })
                              setEditedProductId(null)
                            }}
                          >
                            {isRu ? 'Сохранить фото' : 'Save photos'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </ScreenShell>
  )
}

// ROOT APP
function App() {
  const current = useNavStore((s) => s.current)

  return (
    <div className="min-h-screen bg-surface pb-16">
      <AnimatePresence mode="popLayout">
        {current === 'onboarding' && (
          <motion.div key="onboarding" className="h-full">
            <OnboardingScreen />
          </motion.div>
        )}
        {current === 'auth' && (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AuthScreen />
          </motion.div>
        )}
        {current === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HomeScreen />
          </motion.div>
        )}
        {current === 'details' && (
          <motion.div key="details">
            <DetailsScreen />
          </motion.div>
        )}
        {current === 'cart' && (
          <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CartScreen />
          </motion.div>
        )}
        {current === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CheckoutScreen />
          </motion.div>
        )}
        {current === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ProfileScreen />
          </motion.div>
        )}
        {current === 'notifications' && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <NotificationsScreen />
          </motion.div>
        )}
        {current === 'favorites' && (
          <motion.div
            key="favorites"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FavoritesScreen />
          </motion.div>
        )}
        {current === 'orders' && (
          <motion.div
            key="orders"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <OrdersScreen />
          </motion.div>
        )}
        {current === 'admin' && (
          <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AdminScreen />
          </motion.div>
        )}
        {current === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SettingsScreen />
          </motion.div>
        )}
        {current === 'privacy' && (
          <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <PrivacyScreen />
          </motion.div>
        )}
        {current === 'terms' && (
          <motion.div key="terms" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TermsScreen />
          </motion.div>
        )}
        {current === 'emailVerification' && (
          <motion.div
            key="emailVerification"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <EmailVerificationScreen />
          </motion.div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  )
}

export default App
