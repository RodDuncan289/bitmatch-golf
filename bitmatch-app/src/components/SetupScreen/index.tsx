import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import './style.css';

const SetupScreen: React.FC = () => {
  const { dispatch } = useGame();
  const [playerA, setPlayerA] = useState('');
  const [playerB, setPlayerB] = useState('');
  const [playerC, setPlayerC] = useState('');
  const [playerD, setPlayerD] = useState('');
  const [bitValue, setBitValue] = useState<0.20 | 0.50 | 1.00>(0.20);
  const [startingHole, setStartingHole] = useState<1 | 10>(1);

  const handleStartGame = () => {
    // Basic validation
    if (!playerA || !playerB || !playerC || !playerD) {
      alert('Please enter all player names.');
      return;
    }

    dispatch({
      type: 'START_GAME',
      payload: {
        team1: { playerA: { name: playerA }, playerB: { name: playerB } },
        team2: { playerA: { name: playerC }, playerB: { name: playerD } },
        bitValue,
        startingHole,
      },
    });
  };

  return (
    <div className="setup-screen">
      <h2>Setup Game</h2>
      <div className="setup-form">
        <div className="team-setup">
          <h3>Team 1</h3>
          <input
            type="text"
            placeholder="Player A"
            value={playerA}
            onChange={(e) => setPlayerA(e.target.value)}
          />
          <input
            type="text"
            placeholder="Player B"
            value={playerB}
            onChange={(e) => setPlayerB(e.target.value)}
          />
        </div>
        <div className="team-setup">
          <h3>Team 2</h3>
          <input
            type="text"
            placeholder="Player C"
            value={playerC}
            onChange={(e) => setPlayerC(e.target.value)}
          />
          <input
            type="text"
            placeholder="Player D"
            value={playerD}
            onChange={(e) => setPlayerD(e.target.value)}
          />
        </div>
        <div className="game-settings">
          <h3>Settings</h3>
          <label>
            Bit Value:
            <select value={bitValue} onChange={(e) => setBitValue(Number(e.target.value) as 0.20 | 0.50 | 1.00)}>
              <option value={0.20}>$0.20</option>
              <option value={0.50}>$0.50</option>
              <option value={1.00}>$1.00</option>
            </select>
          </label>
          <label>
            Starting Hole:
            <select value={startingHole} onChange={(e) => setStartingHole(Number(e.target.value) as 1 | 10)}>
              <option value={1}>Hole 1</option>
              <option value={10}>Hole 10</option>
            </select>
          </label>
        </div>
        <button onClick={handleStartGame}>Start Game</button>
      </div>
    </div>
  );
};

export default SetupScreen;
