import React from 'react';
import { Moon } from 'lucide-react';
import cosmicImg from '../../assets/themes/cosmic_glass.png';

export const defaultTheme = {
    id: 'default',
    name: 'Cosmic Glass',
    icon: <Moon size={24} />,
    color: 'linear-gradient(135deg, #1e1e24, #2a2a35)',
    desc: 'Mevcut karanlık ve canlı cam tasarımı.',
    image: cosmicImg
};
