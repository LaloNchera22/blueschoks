import { Instagram, Facebook, Twitter, Link2 as LinkIcon, MessageCircle, Mail, Store } from 'lucide-react';

export const FONTS = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Playfair', value: 'Playfair Display' },
];

export const PLATFORMS = [
  { id: 'instagram', icon: Instagram, label: 'Instagram', placeholder: 'https://instagram.com/usuario' },
  { id: 'tiktok', icon: LinkIcon, label: 'TikTok', placeholder: 'https://tiktok.com/@usuario' },
  { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', placeholder: 'https://wa.me/...' },
  { id: 'telegram', label: 'Telegram', icon: LinkIcon, placeholder: 'https://t.me/tu_usuario', prefix: 'https://t.me/' },
  { id: 'onlyfans', label: 'OnlyFans', icon: LinkIcon, placeholder: 'https://onlyfans.com/tu_usuario', prefix: 'https://onlyfans.com/', color: '#00AFF0' },
  { id: 'twitter', icon: Twitter, label: 'Twitter', placeholder: 'https://twitter.com/usuario' },
  { id: 'facebook', icon: Facebook, label: 'Facebook', placeholder: 'https://facebook.com/usuario' },
  { id: 'website', icon: Store, label: 'Mi Tienda Web', placeholder: 'https://...' },
  { id: 'email', icon: Mail, label: 'Email', placeholder: 'mailto:...' },
  { id: 'other', icon: LinkIcon, label: 'Otro', placeholder: 'https://...' },
];
