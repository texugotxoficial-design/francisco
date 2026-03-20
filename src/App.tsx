/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Search,
  Home as HomeIcon,
  Menu as MenuIcon,
  ClipboardList,
  User,
  Plus,
  ChevronLeft,
  MessageCircle,
  Clock,
  MapPin,
  Instagram,
  Facebook,
  Cake,
  Candy,
  Sparkles,
  Zap,
  Info,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserPlus,
  LogIn,
  LayoutDashboard,
  ArrowLeft,
  CheckCircle2,
  Package,
  Gift,
  Star,
  Coffee,
  Utensils,
  LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PRODUCTS, CATEGORIES } from './constants';
import { Product } from './types';
import { supabase } from './lib/supabase';
import AdminScreen from './AdminScreen';
import Logo from './components/Logo';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = ({ isDark, toggleTheme }: { isDark: boolean, toggleTheme: () => void }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-secondary/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-primary/10 transition-all duration-300 shadow-sm px-4">
      <div className="py-3 flex items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center cursor-pointer transition-transform hover:scale-105 active:scale-95 flex-shrink-0" onClick={() => navigate('/')}>
          <Logo iconSize={40} textSize="text-lg" />
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-secondary/40 transition-colors"
          >
            {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link
            to="/search"
            className="p-2 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Search className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};

const BottomNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const navItems = [
    { id: 'home', label: 'Início', icon: HomeIcon, path: '/' },
    { id: 'menu', label: 'Cardápio', icon: MenuIcon, path: '/menu' },
    { id: 'about', label: 'Sobre', icon: Info, path: '/about' },
    { 
      id: isAdmin ? 'admin' : 'auth', 
      label: isAdmin ? 'Admin' : 'Perfil', 
      icon: isAdmin ? LayoutDashboard : User, 
      path: isAdmin ? '/admin' : '/auth' 
    },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-surface/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-primary/10 p-1.5 rounded-[2rem] shadow-2xl flex items-center gap-1 min-w-[300px] justify-between transition-all duration-500">
      {navItems.map((item) => {
        const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-3xl transition-all duration-500 flex-1 justify-center",
              isActive 
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                : "text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary"
            )}
          >
            <item.icon className={cn("h-5 w-5", isActive ? "fill-white/20" : "")} />
            <span className={cn("text-[10px] font-black uppercase tracking-widest", isActive ? "block" : "hidden")}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

// Removed BottomNav from here

// --- Components ---

const ProductCard: React.FC<{ product: Product, onClick: () => void }> = ({ product, onClick }) => {
  return (
    <article
      onClick={onClick}
      className="bg-white dark:bg-slate-900 p-3 lg:p-4 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-row lg:flex-col gap-4 cursor-pointer hover:shadow-md transition-all active:scale-[0.98] group"
    >
      <div className="w-28 h-28 lg:w-full lg:aspect-square rounded-[1.5rem] overflow-hidden flex-shrink-0 relative bg-slate-50 dark:bg-slate-800">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
      </div>
      <div className="flex flex-col justify-between py-1 flex-grow w-full">
        <div>
          <p className="text-[8px] text-slate-400 dark:text-slate-500 italic mb-1.5 leading-none">Imagem meramente ilustrativa</p>
          <h4 className="font-extrabold text-slate-900 dark:text-slate-50 tracking-tight line-clamp-2">{product.name}</h4>
          <p className="text-[11px] lg:text-xs text-slate-500 dark:text-slate-400 leading-snug mt-1.5 line-clamp-2 font-medium">{product.description}</p>
        </div>
        <div className="flex justify-between items-center mt-3 lg:mt-4">
          <span className="text-primary font-black tracking-tight lg:text-lg">R$ {product.price.toFixed(2).replace('.', ',')}</span>
          <div className="bg-primary text-white p-2 lg:p-2.5 rounded-full shadow-md shadow-primary/20 group-hover:scale-110 transition-transform">
            <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
          </div>
        </div>
      </div>
    </article>
  );
};

// --- Screens ---

const HomeScreen = ({ isDark, toggleTheme, products }: { isDark: boolean, toggleTheme: () => void, products: Product[] }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('amigo(a)');

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const mostOrderedProducts = products.filter(p => p.badge?.toLowerCase().includes('mais pedido'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-background min-h-screen pb-10"
    >
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <BottomNav />

      <main className="max-w-7xl mx-auto w-full">
        <section className="px-6 py-8 md:py-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight">
            Olá, <span className="text-primary italic">{userName}!</span> ✨
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium tracking-wide md:text-lg">O que vamos adoçar hoje?</p>
        </section>

      <section className="mb-10 md:mb-16">
        {mostOrderedProducts.length > 0 && (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 px-6 no-scrollbar pb-4 -mb-4">
            {mostOrderedProducts.map((product) => (
                <article
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="w-[88vw] md:w-[45vw] lg:w-[31vw] xl:w-[24vw] snap-center relative overflow-hidden rounded-[2.5rem] bg-slate-900 h-[22rem] md:h-[24rem] shadow-xl shadow-black/10 cursor-pointer group flex-shrink-0"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90"
                />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-black dark:via-black/70 dark:to-transparent p-6 md:p-8 flex flex-col justify-end transition-colors">
                <div className="flex flex-col items-start w-full">
                  <span className="bg-primary text-white text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full w-fit uppercase shadow-lg shadow-primary/20">
                    {product.badge}
                  </span>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 italic mt-2 mb-3 md:mb-4 uppercase tracking-wider font-bold">Imagem meramente ilustrativa</p>
                </div>
                <h3 className="text-slate-900 dark:text-white text-2xl font-black leading-tight drop-shadow-sm line-clamp-2 transition-colors">{product.name}</h3>
                <p className="text-slate-600 dark:text-slate-200 text-sm mt-2 font-medium leading-relaxed drop-shadow-none dark:drop-shadow transition-colors">{product.description}</p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <span className="text-slate-900 dark:text-white text-2xl font-black whitespace-nowrap drop-shadow-sm transition-colors">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                  <button className="bg-primary text-white font-black py-3 px-6 rounded-full text-xs uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all flex-shrink-0 whitespace-nowrap">
                    Detalhes
                  </button>
                </div>
              </div>
            </article>
            ))}
          </div>
        )}
      </section>

      <section className="px-6 mb-10">
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/category/combo')}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/90 to-[#7E22CE] p-8 shadow-2xl shadow-primary/30 cursor-pointer group min-h-[240px] flex flex-col justify-between"
        >
          {/* Background Logo Watermark */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/20 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute -right-16 -bottom-16 w-96 h-96 opacity-10 mix-blend-multiply rotate-[-15deg] transition-transform group-hover:scale-110 group-hover:rotate-[-5deg] duration-1000 ease-out pointer-events-none">
             <Logo showText={false} iconSize={120} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 bg-black/20 text-white border border-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-inner">
                    <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                    Preferido dos Clientes
                  </span>
                </div>
                <h3 className="text-[2.5rem] font-black text-white leading-[1] mb-2 tracking-tighter drop-shadow-md">
                  Monte seu <br /> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 italic font-black pr-2 pb-1 inline-block">
                    Combo Ideal
                  </span>
                </h3>
              </div>
            </div>

            <div className="mt-8 flex items-end justify-between gap-4">
              <p className="text-white/90 text-sm font-semibold max-w-[200px] leading-snug drop-shadow-sm">
                Escolha suas delícias favoritas e monte um kit exclusivo do seu jeito!
              </p>
              
              <div className="flex items-center gap-2 bg-white text-primary px-6 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 group-hover:bg-amber-300 group-hover:text-amber-900 transition-colors duration-300">
                Criar

                <ArrowLeft className="w-4 h-4 rotate-180" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="px-6 mb-10 md:mb-16">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg md:text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Categorias</h4>
          <Link to="/menu" className="text-primary text-xs md:text-sm font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Ver todas</Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
          {CATEGORIES.filter(c => c.id !== 'combo').map((cat) => {
            const Icon = cat.id === 'bolos-caseiros' || cat.id === 'bolo-no-pote' ? Cake : 
                         cat.id === 'bebidas' ? Coffee : 
                         cat.id === 'salgados' || cat.id === 'batatas' || cat.id === 'tortas-salgadas' ? Utensils : Candy;
            return (
              <Link
                to={`/category/${cat.id}`}
                key={cat.id}
                className="flex flex-col items-center gap-3 group transition-all"
              >
                <div className={cn(
                  "w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-1 group-hover:rotate-3 relative",
                  cat.color,
                  "dark:bg-slate-900 dark:border dark:border-slate-800"
                )}>
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] text-center group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-6 mb-10 md:mb-16">
        <h4 className="text-lg md:text-2xl font-bold text-slate-950 dark:text-slate-100 mb-4 md:mb-8">Escolhas do Dia</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.filter(p => p.featured).slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} onClick={() => navigate(`/product/${product.id}`)} />
          ))}
        </div>
      </section>
      </main>
    </motion.div>
  );
};

const MenuScreen = ({ isDark, toggleTheme, products }: { isDark: boolean, toggleTheme: () => void, products: Product[] }) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('all');
  const allProducts = products;
  const filteredProducts = category === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === category);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 bg-background min-h-screen"
    >
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <BottomNav />

      <main className="max-w-7xl mx-auto w-full">
        <div className="px-6 pt-8 md:pt-12 text-center mb-10 md:mb-14">
        <span className="bg-primary/10 text-primary px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
          Feito com Amor
        </span>
        <h2 className="text-2xl font-black mt-4 text-slate-900 dark:text-slate-50">Escolha suas Delícias</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">Toque em cada doce para ver mais detalhes</p>
      </div>

      <div className="flex overflow-x-auto gap-3 px-6 mb-10 no-scrollbar">
        <button
          onClick={() => setCategory('all')}
          className={cn(
            "px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm",
            category === 'all' 
              ? "bg-primary text-white scale-105" 
              : "bg-surface text-slate-400 border border-slate-100 dark:border-slate-800 dark:bg-slate-900"
          )}
        >
          Todos
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={cn(
              "px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm",
              category === cat.id 
                ? "bg-primary text-white scale-105" 
                : "bg-surface text-slate-400 border border-slate-100 dark:border-slate-800 dark:bg-slate-900"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} onClick={() => navigate(`/product/${product.id}`)} />
        ))}
      </div>
      </main>
    </motion.div>
  );
};

const ComboBuilder = ({ products, settings }: { products: Product[], settings: any }) => {
  const [selections, setSelections] = useState<{ [key: string]: Product[] }>({});
  const navigate = useNavigate();

  // Get all valid categories (excluding 'combo')
  const comboSections = CATEGORIES.filter(c => c.id !== 'combo');

  const handleSelect = (categoryId: string, product: Product) => {
    const currentCategorySelections = selections[categoryId] || [];
    const isSelected = currentCategorySelections.some(p => p.id === product.id);
    
    if (isSelected) {
      setSelections({
        ...selections,
        [categoryId]: currentCategorySelections.filter(p => p.id !== product.id)
      });
    } else {
      setSelections({
        ...selections,
        [categoryId]: [...currentCategorySelections, product]
      });
    }
  };

  const selectedItems = Object.values(selections).flat() as Product[];
  const isAnySelected = selectedItems.length > 0;

  const handleOrder = async () => {
    let text = `Olá! Gostaria de montar o meu combo:\n\n`;
    const orderItems: any[] = [];
    
    comboSections.forEach(section => {
      const selectedArray = selections[section.id] || [];
      if (selectedArray.length > 0) {
        text += `*${section.name}*:\n`;
        selectedArray.forEach(item => {
          text += `- ${item.name}\n`;
          orderItems.push({ name: `${section.name}: ${item.name}`, price: item.price, quantity: 1 });
        });
        text += `\n`;
      }
    });

    const whatsappLink = `https://wa.me/${settings?.whatsapp_number?.replace(/\D/g, '') || '5511988789335'}?text=${encodeURIComponent(text)}`;
    
    // Record in database
    const userName = localStorage.getItem('userName') || 'Cliente';
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

    const { error } = await supabase.from('orders').insert([{
      customer_name: userName,
      items: orderItems,
      total_price: totalPrice,
      whatsapp_link: whatsappLink,
      status: 'pendente'
    }]);

    if (error) console.error('Error recording combo order:', error);

    // Open WhatsApp
    window.open(whatsappLink, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-40 bg-background"
    >
      <header className="fixed top-0 left-0 right-0 p-6 flex items-center justify-between z-50 bg-surface/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-primary/10 dark:border-slate-800">
        <button onClick={() => navigate(-1)} className="p-2 text-primary hover:bg-primary/5 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-50">Monte seu Combo</h2>
        <div className="w-10"></div>
      </header>

      <main className="pt-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="mb-6 max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tighter mb-2">Seu Combo, Seu Jeito</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Escolha os itens das categorias que desejar</p>
        </div>

        {comboSections.map((section) => {
          const sectionProducts = products.filter(p => p.category === section.id);
          if (sectionProducts.length === 0) return null;

          return (
            <div key={section.id} className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{CATEGORIES.find(c => c.id === section.id)?.icon === 'Cake' ? '🍰' : '🍭'}</span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">{section.name}</h3>
                </div>
                {selections[section.id]?.length > 0 && (
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {selections[section.id].length} {selections[section.id].length === 1 ? 'Selecionado' : 'Selecionados'}
                  </span>
                )}
              </div>
              
              <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 snap-x no-scrollbar">
                {sectionProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(section.id, product)}
                    className={`min-w-[160px] max-w-[160px] md:min-w-[180px] md:max-w-[180px] flex-shrink-0 snap-start p-3 rounded-4xl border-2 transition-all cursor-pointer ${
                      selections[section.id]?.some(p => p.id === product.id)
                        ? 'bg-primary/5 dark:bg-primary/20 border-primary shadow-glow' 
                        : 'bg-surface dark:bg-slate-900 border-slate-50 dark:border-slate-800 hover:border-primary/30 dark:hover:border-primary/50 shadow-sm'
                    }`}
                  >
                    <div className="w-full aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 relative">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                          <Cake className="w-10 h-10" />
                        </div>
                      )}
                      {selections[section.id]?.some(p => p.id === product.id) && (
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                          <CheckCircle2 className="w-10 h-10 text-white drop-shadow-lg" />
                        </div>
                      )}
                    </div>
                    <p className="text-[8px] text-slate-400 dark:text-slate-500 italic mb-1 text-center font-medium">Imagem meramente ilustrativa</p>
                    <h4 className="font-bold text-slate-900 dark:text-slate-50 text-sm mb-1 line-clamp-2">{product.name}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">{product.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-surface/90 dark:bg-slate-900/90 backdrop-blur-2xl border-t border-primary/10 dark:border-slate-800 safe-bottom z-50">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Resumo do Combo</span>
            <span className="text-xs font-black text-primary">{selectedItems.length} itens</span>
          </div>
          
          {isAnySelected ? (
            <motion.button
              onClick={handleOrder}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full bg-[#25D366] hover:bg-[#20bd5c] text-white py-4 px-8 rounded-full flex items-center justify-center gap-3 shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)] transition-transform active:scale-95 duration-200"
            >
              <MessageCircle className="w-6 h-6" />
              <div className="flex flex-col items-center">
                <span className="font-black text-sm uppercase tracking-widest leading-none">Pedir pelo WhatsApp</span>
                <span className="text-[10px] opacity-80 font-bold mt-1">
                  {selectedItems.length} itens selecionados
                </span>
              </div>
            </motion.button>
          ) : (
            <div className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 py-4 px-8 rounded-full flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest transition-all shadow-inner">
              Escolha pelo menos 1 item
            </div>
          )}
        </div>
      </footer>
    </motion.div>
  );
};

const CategoryScreen = ({ isDark, toggleTheme, products, settings }: { isDark: boolean, toggleTheme: () => void, products: Product[], settings: any }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const category = CATEGORIES.find(c => c.id === id);
  const allProducts = products;

  if (id === 'combo') {
    return <ComboBuilder products={products} settings={settings} />;
  }

  const categoryProducts = allProducts.filter(p => p.category === id);

  if (!category) return <div>Categoria não encontrada</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background min-h-screen"
    >
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <BottomNav />

      <main className="max-w-7xl mx-auto w-full pb-24">
        <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
          {categoryProducts.length > 0 ? categoryProducts.map(product => (
          <ProductCard key={product.id} product={product} onClick={() => navigate(`/product/${product.id}`)} />
        )) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 dark:text-slate-600 font-medium italic">Nenhum produto encontrado nesta categoria no momento.</p>
          </div>
        )}
      </div>
      </main>
    </motion.div>
  );
};

const SearchScreen = ({ isDark, toggleTheme, products }: { isDark: boolean, toggleTheme: () => void, products: Product[] }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const allProducts = products;
  const filteredProducts = search.trim() === "" 
    ? [] 
    : allProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.description.toLowerCase().includes(search.toLowerCase())
      );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      <BottomNav />
      <div className="sticky top-0 z-50 bg-surface/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-primary/10 dark:border-slate-800 px-4 py-3">
        <div className="flex items-center gap-4 max-w-7xl mx-auto w-full">
          <button onClick={() => navigate(-1)} className="p-2 text-primary hover:bg-primary/5 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              autoFocus
              type="text"
              placeholder="O que você procura?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>

      <main className="p-6 max-w-7xl mx-auto w-full">
        {search.trim() !== '' && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 font-extrabold uppercase tracking-widest px-1">
            Resultados para <span className="text-primary italic">"{search}"</span>
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onClick={() => navigate(`/product/${product.id}`)} />
          ))}
        </div>

        {search.trim() !== '' && filteredProducts.length === 0 && (
          <div className="text-center py-20 px-10">
            <div className="bg-primary/5 dark:bg-slate-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-primary/30" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight">Nenhum doce encontrado.</p>
            <p className="text-slate-400 dark:text-slate-600 text-xs mt-2 font-medium">Tente buscar por palavras-chave como "bolo" ou "ninho".</p>
          </div>
        )}

        {search.trim() === '' && (
          <div className="text-center py-20 opacity-50">
            <p className="text-slate-400 font-medium">Digite algo para começar a procurar...</p>
          </div>
        )}
      </main>
    </motion.div>
  );
};

const ProductDetailScreen = ({ products, settings }: { products: Product[], settings: any }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const allProducts = products;
  const product = allProducts.find(p => p.id === id);

  if (!product) return <div>Produto não encontrado</div>;

  const handleOrder = async () => {
    const userName = localStorage.getItem('userName') || 'Cliente';
    const whatsappLink = `https://wa.me/${settings?.whatsapp_number?.replace(/\D/g, '') || '5511988789335'}?text=Olá! Gostaria de pedir o ${product.name}`;
    
    // Record in DB
    const { error } = await supabase.from('orders').insert([{
      customer_name: userName,
      items: [{ name: product.name, price: product.price, quantity: 1 }],
      total_price: product.price,
      whatsapp_link: whatsappLink,
      status: 'pendente'
    }]);

    if (error) console.error('Error recording order:', error);
    
    // Open WhatsApp
    window.open(whatsappLink, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-white dark:bg-slate-950 pb-32"
    >
      <main className="flex flex-col md:flex-row gap-0 md:gap-4 md:items-stretch h-full max-w-6xl mx-auto w-full md:p-6 lg:p-10">
        <div className="relative h-[400px] md:h-[600px] md:w-1/2 overflow-hidden md:rounded-[40px] shadow-md">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-2 rounded-full shadow-sm text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-12 md:bottom-4 flex justify-center z-20 pointer-events-none">
            <span className="text-[10px] text-white/90 uppercase tracking-widest font-bold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">Imagem meramente ilustrativa</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <section className="px-6 py-8 bg-surface dark:bg-slate-950 -mt-8 md:mt-0 rounded-t-[40px] md:rounded-none relative shadow-2xl md:shadow-none flex-1 h-full overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div>
              {product.badge && (
                <span className="inline-block px-3 py-1 mb-3 text-[10px] font-extrabold tracking-widest text-white uppercase bg-primary rounded-full shadow-sm">
                  {product.badge}
                </span>
              )}
              <h1 className="text-3xl font-extrabold leading-tight text-slate-900 dark:text-slate-50">
                {product.name}
              </h1>
              <p className="mt-2 text-2xl font-bold text-primary">R$ {product.price.toFixed(2).replace('.', ',')}</p>
            </div>

            <hr className="border-slate-100 dark:border-slate-800 my-2" />

            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Descrição</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            {product.ingredients && (
              <div className="mt-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Ingredientes</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60 dark:bg-primary/40"></div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.category !== 'bebidas' && (
              <div className="mt-4 p-5 border border-primary/20 dark:border-primary/20 rounded-3xl bg-primary/5 dark:bg-primary/10">
                <p className="text-xs text-primary font-bold flex items-center gap-3 leading-relaxed">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>Produto artesanal e fresquinho. Recomendamos consumir {['salgados', 'tortas-salgadas', 'batatas'].includes(product.category) ? 'quente' : 'frio'} para melhor experiência.</span>
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex justify-center items-center z-40 pb-safe">
        <motion.button
          onClick={handleOrder}
          className="w-full max-w-md bg-[#25D366] hover:bg-[#20bd5c] text-white py-4 px-8 rounded-full flex items-center justify-center gap-3 shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)] transition-transform active:scale-95 duration-200"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-xl font-black uppercase tracking-tight">Pedir pelo WhatsApp</span>
        </motion.button>
      </footer>
    </motion.div>
  );
};

const AboutScreen = ({ isDark, toggleTheme, settings }: { isDark: boolean, toggleTheme: () => void, settings: any }) => {
  const navigate = useNavigate();

  const infoItems = [
    { icon: Clock, label: "Horário de Funcionamento", value: settings?.opening_hours || "Terça a Sábado: 10:00 às 19:00\nDomingo: 09:00 às 13:00" },
    { icon: MapPin, label: "Onde Estamos", value: settings?.address || "Rua das Amoras, 123 - Centro\nCidade Doce, SP" },
    { icon: MessageCircle, label: "WhatsApp", value: settings?.whatsapp_number || "(11) 99999-9999" },
  ];

  const socialLinks = [
    { icon: Instagram, url: settings?.instagram_url || "https://instagram.com/lsdoceamor", label: "Instagram" },
    { icon: Facebook, url: settings?.facebook_url || "https://facebook.com/lsdoceamor", label: "Facebook" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 bg-background min-h-screen"
    >
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <BottomNav />

      <main className="max-w-4xl mx-auto w-full">
        <section className="p-6">
        <div className="bg-gradient-to-br from-primary to-accent rounded-4xl p-8 text-white mb-10 shadow-xl shadow-primary/20">
          <h2 className="text-3xl font-black mb-4 tracking-tighter italic">Nossa Doce História</h2>
          <p className="text-white/90 leading-relaxed font-medium tracking-wide">
            {settings?.about_text || "Nascida de um sonho de infância, a LS Doce Amor traz o sabor do afeto em cada pedaço. Começamos em uma pequena cozinha caseira e hoje espalhamos doçura por toda a cidade."}
          </p>
        </div>

        <div className="space-y-8 px-2">
          {infoItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="bg-primary/10 p-3.5 rounded-2xl text-primary flex-shrink-0">
                <item.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">{item.label}</h3>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium whitespace-pre-line">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="p-8 bg-surface dark:bg-slate-900 rounded-t-5xl shadow-[0_-10px_30px_rgba(0,0,0,0.03)] dark:shadow-none mt-10 border-t border-slate-50 dark:border-slate-800">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-primary italic">Fale Conosco</h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 font-medium">Escolha sua forma preferida de contato</p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <motion.a
            href={`https://wa.me/${settings?.whatsapp_number?.replace(/\D/g, '') || '5511999999999'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-[#25D366] text-white px-8 py-5 rounded-full font-black shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)] active:scale-95 transition-all"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-4 text-lg uppercase tracking-widest">
              <MessageCircle className="w-7 h-7" />
              <span>WhatsApp</span>
            </div>
            <Plus className="h-6 w-6" />
          </motion.a>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-4 rounded-3xl font-bold border border-slate-100 dark:border-slate-700 hover:border-primary/30 hover:text-primary transition-all"
              >
                <social.icon className="w-5 h-5" />
                <span>{social.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => navigate('/')}
            className="text-primary font-black text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
          >
            Voltar para o Início
          </button>
        </div>
      </section>
      </main>
    </motion.div>
  );
};

const AuthScreen = ({ isDark, toggleTheme }: { isDark: boolean, toggleTheme: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionUser, setSessionUser] = useState<string | null>(localStorage.getItem('userName'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('isAdmin');
    setSessionUser(null);
    navigate('/');
  };

  if (sessionUser) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="min-h-screen bg-background"
      >
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />

        <div className="px-8 pt-12 max-w-md mx-auto w-full text-center">
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 ring-4 ring-primary/5">
              <User className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              Olá, <span className="text-primary italic">{sessionUser}</span>!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Você está conectado à sua conta.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 mb-8 space-y-4">
             <div className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors cursor-pointer group" onClick={() => navigate('/')}>
               <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                 <HomeIcon className="w-5 h-5" />
               </div>
               <div className="text-left">
                 <span className="block font-black text-slate-800 dark:text-slate-100 text-sm">Voltar ao Cardápio</span>
                 <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ver delícias de hoje</span>
               </div>
             </div>
             
             <button 
               onClick={handleLogout}
               className="w-full flex items-center gap-4 p-4 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-colors group"
             >
               <div className="w-10 h-10 bg-red-100 dark:bg-red-500/20 rounded-xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                 <LogOut className="w-5 h-5" />
               </div>
               <div className="text-left">
                 <span className="block font-black text-red-500 text-sm">Sair da Conta</span>
                 <span className="block text-[10px] text-red-400/60 font-bold uppercase tracking-widest">Encerrar sua sessão</span>
               </div>
             </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'layssousa@gmail.com' && password === '123456') {
      localStorage.setItem('userName', 'Lays');
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
      return;
    }

    if (isLogin) {
      // Mock login for demonstration
      const mockName = email.split('@')[0];
      localStorage.setItem('userName', mockName.charAt(0).toUpperCase() + mockName.slice(1));
      localStorage.setItem('isAdmin', 'false');
    } else {
      // Registration: save the actual name entered
      if (name && typeof name === 'string') {
        localStorage.setItem('userName', name);
      }
      localStorage.setItem('isAdmin', 'false');
    }
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-background"
    >
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <BottomNav />

      <div className="px-8 pt-12 max-w-md mx-auto w-full">
        <div className="flex flex-col items-center mb-12">
          <Logo iconSize={64} textSize="text-2xl" className="flex-col gap-4 text-center mb-6" />
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight text-center">
            {isLogin ? "Bem-vindo de volta!" : "Junte-se a nós!"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-center">
            {isLogin ? "Entre para continuar seus pedidos" : "Crie sua conta para uma experiência personalizada"}
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleAuth}>
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="relative"
            >
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400"
              />
            </motion.div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-2xl py-4 pl-12 pr-12 text-sm font-semibold focus:ring-2 focus:ring-primary/20 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors p-1"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-[0.98] transition-all mt-4">
            {isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {isLogin ? "Não tem uma conta?" : "Já possui uma conta?"}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-black mt-2 text-sm uppercase tracking-widest hover:underline decoration-2 underline-offset-4 px-4 py-2"
          >
            {isLogin ? "Criar Conta agora" : "Fazer Login"}
          </button>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/about')}
            className="flex items-center gap-2 mx-auto text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
          >
            <Info className="w-4 h-4" />
            Ver mais sobre a LS Doce Amor
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<any>(null);

  const { pathname } = useLocation();

  const fetchData = async () => {
    // Fetch Products
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (productsData) setProducts(productsData);

    // Fetch Settings
    const { data: settingsData } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'store_config')
      .single();
    
    if (settingsData) setSettings(settingsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Refetch when entering public screens from admin or vice versa
  useEffect(() => {
    if (pathname === '/' || pathname === '/menu' || pathname === '/search') {
      fetchData();
    }
  }, [pathname]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const availableProducts = products.filter(p => p.is_available !== false);

  return (
    <div className={cn(
        "max-w-md md:max-w-3xl mx-auto bg-slate-50 min-h-screen relative shadow-2xl overflow-x-hidden transition-all duration-300",
        isDark && "dark"
      )}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomeScreen isDark={isDark} toggleTheme={toggleTheme} products={availableProducts} />} />
            <Route path="/menu" element={<MenuScreen isDark={isDark} toggleTheme={toggleTheme} products={availableProducts} />} />
            <Route path="/search" element={<SearchScreen isDark={isDark} toggleTheme={toggleTheme} products={availableProducts} />} />
            <Route path="/category/:id" element={<CategoryScreen isDark={isDark} toggleTheme={toggleTheme} products={availableProducts} settings={settings} />} />
            <Route path="/product/:id" element={<ProductDetailScreen products={products} settings={settings} />} />
            <Route path="/about" element={<AboutScreen isDark={isDark} toggleTheme={toggleTheme} settings={settings} />} />
            <Route path="/auth" element={<AuthScreen isDark={isDark} toggleTheme={toggleTheme} />} />
            <Route path="/admin" element={<AdminScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
  );
}
