import React from 'react';
import { Book } from 'lucide-react';
import einkImg from '../../assets/themes/e-ink.png';

export const einkTheme = {
    id: 'eink',
    name: 'E-Ink Paper',
    icon: <Book size={24} />,
    color: '#f4f4f4',
    textColor: '#111111',
    borderColor: '#000000',
    desc: 'Kindle ekranı gibi, yavaş yenilenen mat kağıt.',
    image: einkImg
};
