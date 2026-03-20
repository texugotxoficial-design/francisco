import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronLeft, 
  Save, 
  X, 
  Package, 
  DollarSign, 
  Image as ImageIcon, 
  FileText, 
  Tag, 
  Star,
  LayoutDashboard,
  Settings,
  Upload,
  Loader2,
  Home,
  ClipboardList,
  CheckCircle,
  Clock,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { supabase } from './lib/supabase';
import { Product } from './types';
import { CATEGORIES } from './constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Logo from './components/Logo';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AdminScreen = () => {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]); // New orders state
  const [settings, setSettings] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'settings' | 'orders'>('products');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // New state for product saving

  // Form states for product editing/adding
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]?.id || 'bolos');
  const [image, setImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true); // New state for product availability
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'products') {
        fetchProducts();
      } else if (activeTab === 'settings') {
        fetchSettings();
      } else {
        fetchOrders();
      }
    }
  }, [isAdmin, activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'store_config')
      .single();

    if (error) {
      console.error('Error fetching settings:', error);
      setSettings({
        opening_hours: '',
        whatsapp_number: '',
        about_text: '',
        instagram_url: '',
        facebook_url: '',
        address: ''
      });
    } else {
      setSettings(data);
    }
    setLoading(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    const { error } = await supabase
      .from('settings')
      .upsert({ ...settings, id: 'store_config', updated_at: new Date().toISOString() });

    if (error) {
      alert('Erro ao salvar configurações: ' + error.message);
    } else {
      alert('Configurações salvas com sucesso!');
    }
    setSavingSettings(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'layssousa@gmail.com' && password === '123456') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('userName', 'Lays');
    } else {
      alert('Email ou senha incorretos!');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const handleDelete = async (id: string) => {
    console.log('Attempting to delete product with ID:', id);
    
    // Optimistic update
    const previousProducts = [...products];
    setProducts(products.filter(p => p.id !== id));

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      console.log('Product deleted successfully from DB');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      alert('Erro ao excluir: ' + error.message);
      setProducts(previousProducts); // Rollback
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setEditingProduct({ ...editingProduct!, image: publicUrl });
    } catch (error: any) {
      alert('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = editingProduct!;
    
    // Convert price to number and ingredients to array if needed
    const finalProduct = {
      ...product,
      price: Number(product.price),
      ingredients: Array.isArray(product.ingredients) ? product.ingredients : (product.ingredients || '').split(',').map((s: string) => s.trim()).filter(Boolean)
    };

    const { error } = await supabase
      .from('products')
      .upsert(finalProduct);

    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      setEditingProduct(null);
      setIsAdding(false);
      fetchProducts();
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-slate-900 rounded-4xl p-10 border border-slate-800 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-10">
            <Logo iconSize={64} textSize="text-3xl" className="flex-col gap-4 text-center" />
            <p className="text-slate-400 mt-4 font-medium text-center">Área restrita para gerentes</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-2">E-mail do Administrador</label>
              <input
                type="email"
                placeholder="exemplo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border-none rounded-2xl py-4 px-6 text-white font-semibold focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-slate-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border-none rounded-2xl py-4 px-6 text-white font-semibold focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-slate-600"
              />
            </div>
            <button className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              Entrar no Dashboard <ChevronRight className="w-4 h-4" />
            </button>
          </form>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full mt-6 text-slate-500 hover:text-slate-300 font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Voltar para o App
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col border-r border-slate-800">
        <div className="flex flex-col gap-4 mb-10 cursor-pointer transition-transform hover:scale-105 active:scale-95" onClick={() => navigate('/')}>
          <Logo iconSize={32} textSize="text-xl" />
          <h1 className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase ml-1">Admin Panel</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all border",
              activeTab === 'products' ? "bg-primary/10 text-primary border-primary/20" : "text-slate-400 hover:bg-slate-800 hover:text-white border-transparent"
            )}
          >
            <Package className="w-5 h-5" /> Produtos
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all border",
              activeTab === 'orders' ? "bg-primary/10 text-primary border-primary/20" : "text-slate-400 hover:bg-slate-800 hover:text-white border-transparent"
            )}
          >
            <ClipboardList className="w-5 h-5" /> Pedidos
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all border",
              activeTab === 'settings' ? "bg-primary/10 text-primary border-primary/20" : "text-slate-400 hover:bg-slate-800 hover:text-white border-transparent"
            )}
          >
            <Settings className="w-5 h-5" /> Configurações
          </button>

          <div className="pt-4 mt-4 border-t border-slate-800 space-y-1">
            <button 
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all border text-slate-400 hover:bg-slate-800 hover:text-white border-transparent"
            >
              <Home className="w-5 h-5" /> Voltar ao App
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl font-bold transition-all border border-transparent hover:border-red-400/20"
            >
              <LogOut className="w-5 h-5" /> Sair
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'products' ? (
          <>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gerenciar Produtos</h2>
                <p className="text-slate-500 font-medium">Cadastre e edite os itens do cardápio</p>
              </div>
              <button 
                onClick={() => {
                  setEditingProduct({
                    id: Math.random().toString(36).substr(2, 9),
                    name: '',
                    description: '',
                    price: 0,
                    image: '',
                    category: CATEGORIES[0].id,
                    ingredients: [],
                    featured: false,
                    badge: '',
                    is_available: true
                  });
                  setIsAdding(true);
                }}
                className="bg-primary text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              >
                <Plus className="w-5 h-5" /> Novo Produto
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(
                  products.reduce((acc, product) => {
                    const cat = product.category || 'outros';
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(product);
                    return acc;
                  }, {} as Record<string, typeof products>)
                ).map(([category, catProducts]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest pl-2 border-l-4 border-primary">
                      {{
                        'promocoes': 'Promoções',
                        'salgados': 'Salgados',
                        'tortas-salgadas': 'Tortas Salgadas',
                        'batatas': 'Batatas',
                        'bebidas': 'Bebidas',
                        'bolo-no-pote': 'Bolo no Pote',
                        'brownie': 'Brownie / Pão de Mel',
                        'pao-de-mel': 'Pão de Mel',
                        'copo-da-felicidade': 'Copo da Felicidade',
                        'cone-trufado': 'Cone Trufado',
                        'torta-cookies': 'Torta Cookies',
                        'bolos-caseiros': 'Bolos Caseiros'
                      }[category] || category}
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      {(catProducts as typeof products).map(product => (
                        <motion.div 
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 grid grid-cols-[auto_1fr_auto] items-center gap-6 group hover:shadow-lg transition-all"
                        >
                          {/* Column 1: Image */}
                          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                            <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          
                          {/* Column 2: Content */}
                          <div className="min-w-0 py-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{product.category}</span>
                              <h3 className="text-base font-black text-slate-900 truncate">{product.name}</h3>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-primary font-black text-sm">R$ {product.price.toFixed(2)}</span>
                                {product.featured && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                                {product.is_available === false && (
                                  <span className="ml-auto bg-red-100 text-red-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                                    Indisponível
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 line-clamp-1 mt-2 font-medium">{product.description}</p>
                            </div>

                          {/* Column 3: Actions */}
                          <div className="flex items-center gap-2 pr-4">
                            <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setEditingProduct(product); setIsAdding(false); }}
                              className="p-3 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-2xl transition-all"
                              title="Editar"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                            <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
                              className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                              title="Excluir"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : activeTab === 'orders' ? (
          <div className="max-w-6xl">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pedidos do WhatsApp</h2>
                <p className="text-slate-500 font-medium">Histórico de pedidos direcionados ao WhatsApp</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-600">{orders.filter(o => o.status === 'pendente').length} Pendentes</span>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-12 rounded-4xl border border-slate-100 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <ClipboardList className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum pedido ainda</h3>
                <p className="text-slate-500">Os pedidos aparecerão aqui assim que os clientes clicarem no botão do WhatsApp.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "bg-white p-6 rounded-3xl border shadow-sm transition-all hover:shadow-md grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6",
                      order.status === 'concluído' ? "border-slate-100 opacity-80" : "border-primary/10"
                    )}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white font-black",
                            order.status === 'concluído' ? "bg-slate-300" : "bg-primary shadow-lg shadow-primary/20"
                          )}>
                            {order.customer_name[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-slate-900 tracking-tight">{order.customer_name}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              <Clock className="w-3 h-3" />
                              {new Date(order.created_at).toLocaleString('pt-BR')}
                            </div>
                          </div>
                        </div>
                        <div className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          order.status === 'concluído' ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                        )}>
                          {order.status}
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Itens do Pedido</h5>
                        <ul className="space-y-2">
                          {order.items.map((item: any, idx: number) => (
                            <li key={idx} className="flex items-center justify-between font-bold text-sm text-slate-700">
                              <span>{item.quantity}x {item.name}</span>
                              <span className="text-slate-400 font-black">R$ {(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                          <span className="text-xs font-black text-slate-900">Total do Pedido</span>
                          <span className="text-lg font-black text-primary">R$ {order.total_price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 justify-center">
                      <a 
                        href={order.whatsapp_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-green-200"
                      >
                        Chamar no Whats
                      </a>
                      <div className="grid grid-cols-2 gap-2">
                        {order.status !== 'concluído' && (
                          <button 
                            onClick={async () => {
                              const { error } = await supabase.from('orders').update({ status: 'concluído' }).eq('id', order.id);
                              if (!error) fetchOrders();
                            }}
                            className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-md"
                            title="Concluir Pedido"
                          >
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </button>
                        )}
                        <button 
                          onClick={async () => {
                            if (confirm('Deseja excluir este pedido?')) {
                              const { error } = await supabase.from('orders').delete().eq('id', order.id);
                              if (!error) fetchOrders();
                            }
                          }}
                          className="p-4 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-all border border-red-100"
                          title="Excluir Pedido"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Configurações do App</h2>
              <p className="text-slate-500 font-medium">Edite as informações da seção "Sobre Nós" e contatos</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <form onSubmit={handleSaveSettings} className="space-y-8 bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Horário de Funcionamento</label>
                    <textarea
                      rows={2}
                      value={settings?.opening_hours || ''}
                      onChange={e => setSettings({ ...settings!, opening_hours: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp (apenas números)</label>
                    <input
                      type="text"
                      value={settings?.whatsapp_number || ''}
                      onChange={e => setSettings({ ...settings!, whatsapp_number: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Sobre a Loja (História)</label>
                  <textarea
                    rows={4}
                    value={settings?.about_text || ''}
                    onChange={e => setSettings({ ...settings!, about_text: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">URL Instagram</label>
                    <input
                      type="text"
                      value={settings?.instagram_url || ''}
                      onChange={e => setSettings({ ...settings!, instagram_url: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">URL Facebook</label>
                    <input
                      type="text"
                      value={settings?.facebook_url || ''}
                      onChange={e => setSettings({ ...settings!, facebook_url: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Endereço Completo</label>
                  <input
                    type="text"
                    value={settings?.address || ''}
                    onChange={e => setSettings({ ...settings!, address: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={savingSettings}
                    className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {savingSettings ? 'Salvando...' : <><Save className="w-5 h-5" /> Salvar Configurações</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Editor Modal */}
      <AnimatePresence>
        {(editingProduct || isAdding) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-4xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">{isAdding ? 'Novo Produto' : 'Editar Produto'}</h3>
                <button onClick={() => { setEditingProduct(null); setIsAdding(false); }} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Tag className="w-3 h-3"/> Nome do Produto</label>
                    <input
                      required
                      type="text"
                      value={editingProduct?.name || ''}
                      onChange={e => setEditingProduct({...editingProduct!, name: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><DollarSign className="w-3 h-3"/> Preço (R$)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={editingProduct?.price || 0}
                      onChange={e => setEditingProduct({...editingProduct!, price: Number(e.target.value)})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FileText className="w-3 h-3"/> Descrição</label>
                  <textarea
                    rows={3}
                    value={editingProduct?.description || ''}
                    onChange={e => setEditingProduct({...editingProduct!, description: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" /> Imagem do Produto
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="relative group cursor-pointer border-2 border-dashed border-slate-200 hover:border-primary/40 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 transition-all bg-slate-50 overflow-hidden min-h-[160px]"
                    >
                      {editingProduct?.image ? (
                        <>
                          <img src={editingProduct.image} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-10 transition-opacity" />
                          <div className="relative z-10 flex flex-col items-center gap-3">
                            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary group-hover:scale-110 transition-transform">
                              <Upload className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-slate-600">Alterar Imagem</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:scale-110 transition-transform">
                            {uploading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <Upload className="w-6 h-6" />}
                          </div>
                          <div className="text-center">
                            <span className="block text-xs font-bold text-slate-600">Enviar Imagem</span>
                            <span className="block text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">JPG ou PNG</span>
                          </div>
                        </>
                      )}
                      
                      <input 
                        id="image-upload"
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden" 
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><LayoutDashboard className="w-3 h-3"/> Categoria</label>
                        <select
                          value={editingProduct?.category || ''}
                          onChange={e => setEditingProduct({...editingProduct!, category: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                        >
                          {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <label className="flex items-center gap-3 cursor-pointer w-full">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              className="sr-only"
                              checked={editingProduct?.is_available !== false}
                              onChange={e => setEditingProduct({...editingProduct!, is_available: e.target.checked})}
                            />
                            <div className={cn(
                              "w-12 h-6 rounded-full transition-colors",
                              (editingProduct?.is_available !== false) ? "bg-primary" : "bg-slate-300"
                            )}>
                              <div className={cn(
                                "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                                (editingProduct?.is_available !== false) ? "translate-x-6" : "translate-x-0"
                              )} />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">Disponível no Cardápio</span>
                            <span className="text-[10px] text-slate-400 font-medium">Oculta o produto se estiver desmarcado.</span>
                          </div>
                        </label>
                      </div>
                      
                      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest mb-2">Dica</p>
                        <p className="text-xs text-slate-600 font-medium">Use fotos quadradas para um melhor visual no cardápio.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Tag className="w-3 h-3"/> Selo/Badge (ex: MAIS PEDIDO)</label>
                    <input
                      type="text"
                      value={editingProduct?.badge || ''}
                      onChange={e => setEditingProduct({...editingProduct!, badge: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-4 pt-8">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={editingProduct?.featured || false}
                          onChange={e => {
                            if (e.target.checked) {
                              const currentCount = products.filter(p => p.featured && p.id !== editingProduct?.id).length;
                              if (currentCount >= 4) {
                                alert('Só é permitido 4 produtos como Escolha do Dia.');
                                return;
                              }
                            }
                            setEditingProduct({...editingProduct!, featured: e.target.checked});
                          }}
                        />
                        <div className={cn(
                          "w-12 h-6 rounded-full transition-colors",
                          editingProduct?.featured ? "bg-primary" : "bg-slate-300 group-hover:bg-slate-400"
                        )}>
                          <div className={cn(
                            "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                            editingProduct?.featured ? "translate-x-6" : "translate-x-0"
                          )} />
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Escolha do Dia</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Package className="w-3 h-3"/> Ingredientes (separados por vírgula)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingProduct?.ingredients) ? editingProduct?.ingredients.join(', ') : editingProduct?.ingredients || ''}
                    onChange={e => setEditingProduct({...editingProduct!, ingredients: e.target.value as any})}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </form>

              <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button 
                  type="button"
                  onClick={() => { setEditingProduct(null); setIsAdding(false); }}
                  className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  disabled={uploading}
                  className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Carregando Imagem...</>
                  ) : (
                    <><Save className="w-4 h-4" /> Salvar Alterações</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminScreen;
