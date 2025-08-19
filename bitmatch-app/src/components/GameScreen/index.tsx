import React from 'react';
import { useGame } from '../../context/GameContext';
import './style.css';

// Helper for hole sequence
const getHoleSequence = (startingHole: 1 | 10): number[] => {
    if (startingHole === 1) {
        return Array.from({ length: 18 }, (_, i) => i + 1); // 1-18
    } else {
        const backNine = Array.from({ length: 9 }, (_, i) => i + 10); // 10-18
        const frontNine = Array.from({ length: 9 }, (_, i) => i + 1); // 1-9
        return [...backNine, ...frontNine];
    }
};

const GameScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { team1, team2, currentHole, holes, startingHole } = state;
  const [animatedScore, setAnimatedScore] = React.useState<'team1' | 'team2' | null>(null);

  // Memoize hole sequence
  const holeSequence = React.useMemo(() => getHoleSequence(startingHole), [startingHole]);
  const currentHoleIndex = holeSequence.indexOf(currentHole);

  const currentHoleData = holes[currentHole] || { bits: { team1: 0, team2: 0 }, matchplay: null };

  // Calculate totals
  const totalBitsTeam1 = Object.values(holes).reduce((acc, hole) => acc + hole.bits.team1, 0);
  const totalBitsTeam2 = Object.values(holes).reduce((acc, hole) => acc + hole.bits.team2, 0);

  const matchplayStatus = Object.values(holes).reduce((acc, hole) => {
    if (hole.matchplay === 'win') return acc + 1;
    if (hole.matchplay === 'loss') return acc - 1;
    return acc;
  }, 0);

  React.useEffect(() => {
    if (animatedScore) {
      const timer = setTimeout(() => setAnimatedScore(null), 300); // Duration of the animation
      return () => clearTimeout(timer);
    }
  }, [animatedScore]);

  // Handlers
  const handleBitChange = (team: 'team1' | 'team2', change: number) => {
    dispatch({ type: 'UPDATE_BITS', payload: { hole: currentHole, team, change } });
    setAnimatedScore(team);
  };

  const handleMatchplayChange = (result: 'win' | 'loss' | 'draw') => {
    dispatch({ type: 'UPDATE_MATCHPLAY', payload: { hole: currentHole, result } });
  };

  const goToPrevHole = () => {
    if (currentHoleIndex > 0) {
      dispatch({ type: 'SET_CURRENT_HOLE', payload: holeSequence[currentHoleIndex - 1] });
    }
  };

  const goToNextHole = () => {
    if (currentHoleIndex < holeSequence.length - 1) {
      dispatch({ type: 'SET_CURRENT_HOLE', payload: holeSequence[currentHoleIndex + 1] });
    }
  };

  const handleEndGame = () => {
    dispatch({ type: 'END_GAME' });
  };

  return (
    <div className="game-screen">
      {/* Header: Totals and Match Status */}
      <div className="game-header">
        <div className="team-total">
          <h4>{team1.playerA.name} & {team1.playerB.name}</h4>
          <p>{totalBitsTeam1} Bits</p>
        </div>
        <div className="match-status">
          <h3>
            {matchplayStatus === 0 ? 'All Square' : `Team 1 ${matchplayStatus > 0 ? `${matchplayStatus} Up` : `${Math.abs(matchplayStatus)} Down`}`}
          </h3>
        </div>
        <div className="team-total">
          <h4>{team2.playerA.name} & {team2.playerB.name}</h4>
          <p>{totalBitsTeam2} Bits</p>
        </div>
      </div>

      {/* Current Hole Interface */}
      <div className="hole-interface">
        <h2>Hole {currentHole}</h2>

        {/* Bits Scorer */}
        <div className="bits-scorer">
          <div className="team-bits">
            <button onClick={() => handleBitChange('team1', -1)}>−</button>
            <span className={animatedScore === 'team1' ? 'score-animated' : ''}>{currentHoleData.bits.team1}</span>
            <button onClick={() => handleBitChange('team1', 1)}>+</button>
          </div>
          <h3>Bits</h3>
          <div className="team-bits">
            <button onClick={() => handleBitChange('team2', -1)}>−</button>
            <span className={animatedScore === 'team2' ? 'score-animated' : ''}>{currentHoleData.bits.team2}</span>
            <button onClick={() => handleBitChange('team2', 1)}>+</button>
          </div>
        </div>

        {/* Matchplay Tracker */}
        <div className="matchplay-tracker">
            <h3>Matchplay</h3>
            <div className="matchplay-buttons">
                <button onClick={() => handleMatchplayChange('win')} className={currentHoleData.matchplay === 'win' ? 'active' : ''}>Win</button>
                <button onClick={() => handleMatchplayChange('draw')} className={currentHoleData.matchplay === 'draw' ? 'active' : ''}>Draw</button>
                <button onClick={() => handleMatchplayChange('loss')} className={currentHoleData.matchplay === 'loss' ? 'active' : ''}>Loss</button>
            </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="game-navigation">
        <button onClick={goToPrevHole} disabled={currentHoleIndex === 0}>Prev Hole</button>
        <button onClick={handleEndGame}>View Summary</button>
        <button onClick={goToNextHole} disabled={currentHoleIndex === holeSequence.length - 1}>Next Hole</button>
      </div>
    </div>
  );
};

export default GameScreen;
