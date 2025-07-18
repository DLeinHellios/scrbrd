import plusIcon from './assets/plus.svg';
import minusIcon from './assets/minus.svg';
import { useState } from 'react';
import './App.css';

const PLAYER_COLORS = {
  "1": { "+": "#67b8d0", "-": "#7ac6d9" },
  "2": { "+": "#a34db2", "-": "#c07cc9" },
  "3": { "+": "#51b66a", "-": "#85d29a" },
  "4": { "+": "#ef6f33", "-": "#f38f60" }
}

function App() {
  const [counters, setCounters] = useState({
    1: 40,
    2: 40,
    3: 40,
    4: 40,
  });

  const getIcon = (label) => {
    return (
      <img
        src={label === '+' ? plusIcon : minusIcon}
        alt={label}
        style={{ width: '60%', height: '60%' }}
      />
    )
  };

  const handleClick = (label, quadrant) => {
    setCounters(prev => ({
      ...prev,
      [quadrant]: label === '+'
        ? prev[quadrant] + 1
        : prev[quadrant] - 1
    }));
  };

  const renderTitle = () => {
    return (
      <div>
        <span style={{color:PLAYER_COLORS['1']['+']}}>scr</span>
        <span style={{color:'#ffffff'}}>|</span>
        <span style={{color:PLAYER_COLORS['4']['+']}}>brd</span>
      </div>
    )
  }

  const renderPlayer = (quadrant) => {
    const isTop = quadrant === 1 || quadrant === 2;
    const buttons = isTop ? ['+', '-'] : ['-', '+'];

    return (
      <div
        key={quadrant}
        className="quadrant"
        style={{
          transform: isTop ? 'rotate(180deg)' : 'none',
        }}
      >
        <div
          style={{
            color: PLAYER_COLORS[quadrant]['+'],
            fontSize: '3rem',
            marginBottom: '0.5rem',
            userSelect: 'none',
            textAlign: [1,4].includes(quadrant) ? 'left': 'right'
          }}
        >
          {counters[quadrant]}
        </div>
        <div className="button-row">
          {buttons.map((label, i) => (
            <button
              key={i}
              onClick={() => handleClick(label, quadrant)}
              style={{
                backgroundColor: PLAYER_COLORS[quadrant][label]
              }}
            >
              {getIcon(label)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (    
  <div className="app-container">
      <div className="menu-bar">
        {renderTitle()}
      </div>
    <div className="grid-container">
      <div className="center-container">
        {renderPlayer(1)}
        {renderPlayer(2)}
        {renderPlayer(3)}
        {renderPlayer(4)}
      </div>
    </div>
    </div>
  );
}

export default App;