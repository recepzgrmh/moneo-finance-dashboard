import React from 'react';
import { Bone } from 'lucide-react';
import xrayImg from '../../assets/themes/x-ray.png';

export const xrayTheme = {
    id: 'xray',
    name: 'Röntgen',
    icon: <Bone size={24} />,
    color: '#000000',
    textColor: '#00ffff',
    borderColor: '#00ffff',
    desc: 'Ters renkler ve iç gösteren iskelet yapısı.',
    image: xrayImg
};
