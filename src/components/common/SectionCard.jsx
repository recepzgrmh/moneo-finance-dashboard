import React from 'react';
import PropTypes from 'prop-types';

const SectionCard = ({ title, icon: Icon, actions, children, className = '', style = {} }) => {
    return (
        <div className={`section-card ${className}`} style={style}>
            {title && (
                <div className="section-title" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {Icon && <Icon size={18} />}
                        {title}
                    </div>
                    {actions && <div>{actions}</div>}
                </div>
            )}
            {children}
        </div>
    );
};

SectionCard.propTypes = {
    title: PropTypes.node,
    icon: PropTypes.elementType,
    actions: PropTypes.node,
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object
};

export default SectionCard;
