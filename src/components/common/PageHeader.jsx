import React from 'react';
import PropTypes from 'prop-types';

const PageHeader = ({ title, subtitle, icon: Icon, actions, children }) => {
    return (
        <header>
            <div className="header-title">
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {Icon && <Icon color="var(--primary)" />}
                    {title}
                </h1>
                <div className="header-subtitle">
                    {subtitle}
                    {children}
                </div>
            </div>
            {actions && <div className="header-actions">{actions}</div>}
        </header>
    );
};

PageHeader.propTypes = {
    title: PropTypes.node.isRequired,
    subtitle: PropTypes.node,
    icon: PropTypes.elementType,
    actions: PropTypes.node,
    children: PropTypes.node
};

export default PageHeader;
