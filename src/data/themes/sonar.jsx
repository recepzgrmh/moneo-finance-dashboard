import React from 'react';
import { Radar } from 'lucide-react';
import sonarImg from '../../assets/themes/sonar.png';

export const sonarTheme = {
    id: 'sonar',
    name: 'Sonar Radar',
    icon: <Radar size={24} />,
    color: '#001100',
    textColor: '#00ff00',
    borderColor: '#00ff00',
    desc: 'Denizaltı radarı, dönen tarayıcı ve yeşil fosfor.',
    image: sonarImg
};
