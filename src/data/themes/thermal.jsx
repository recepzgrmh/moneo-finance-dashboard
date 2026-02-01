import React from 'react';
import { Flame } from 'lucide-react';
import thermalImg from '../../assets/themes/thermo.png';

export const thermalTheme = {
    id: 'thermal',
    name: 'Thermal Vision',
    icon: <Flame size={24} />,
    color: '#0a001a',
    textColor: '#00ffcc',
    borderColor: '#ff0000',
    desc: 'Isı haritası simülasyonu. Tıkladıkça ısınır.',
    image: thermalImg
};
