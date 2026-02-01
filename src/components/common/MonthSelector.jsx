import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MonthSelector = ({ selectedMonth, onPrev, onNext, monthNames }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn-glass" onClick={onPrev} style={{ padding: '0.5rem' }}>
                <ChevronLeft size={20} />
            </button>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, minWidth: '150px', textAlign: 'center' }}>
                {monthNames[selectedMonth.month]} {selectedMonth.year}
            </div>
            <button className="btn-glass" onClick={onNext} style={{ padding: '0.5rem' }}>
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

MonthSelector.propTypes = {
    selectedMonth: PropTypes.shape({
        month: PropTypes.number.isRequired,
        year: PropTypes.number.isRequired
    }).isRequired,
    onPrev: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    monthNames: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default MonthSelector;
