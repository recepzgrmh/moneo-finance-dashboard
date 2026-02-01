import React from 'react';
import { PenTool } from 'lucide-react';
import sketchImg from '../../assets/themes/paper_pen.png';

export const sketchTheme = {
    id: 'sketch',
    name: 'Kağıt & Kalem',
    icon: <PenTool size={24} />,
    color: '#f8f5e6',
    textColor: '#2c3e50',
    borderColor: '#2c3e50',
    desc: 'Elle çizilmiş, organik ve sanatsal görünüm.',
    image: sketchImg
};
