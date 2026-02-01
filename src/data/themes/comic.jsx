import React from 'react';
import { MessageCircle } from 'lucide-react';
import comicImg from '../../assets/themes/pop_art.png';

export const comicTheme = {
    id: 'comic',
    name: 'Pop Art',
    icon: <MessageCircle size={24} />,
    color: '#ffffff',
    textColor: '#000000',
    borderColor: '#000000',
    desc: 'Çizgi roman estetiği, canlı renkler ve halftone.',
    image: comicImg
};
