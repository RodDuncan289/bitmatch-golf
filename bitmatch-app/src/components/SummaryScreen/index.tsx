import React from 'react';
import { useGame } from '../../context/GameContext';
import './style.css';

// Re-using this helper here, maybe it should be moved to a utils file. For now, this is fine.
const getHoleSequence = (startingHole: 1 | 10): number[] => {
    if (startingHole === 1) {
        return Array.from({ length: 18 }, (_, i) => i + 1);
    } else {
        const backNine = Array.from({ length: 9 }, (_, i) => i + 10);
        const frontNine = Array.from({ length: 9 }, (_, i) => i + 1);
        return [...backNine, ...frontNine];
    }
};

const SummaryScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { team1, team2, holes, bitValue, startingHole } = state;

  const holeSequence = getHoleSequence(startingHole);

  // Define Front 9 and Back 9 based on standard golf course layout, not play order
  const frontNineHoles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const backNineHoles = [10, 11, 12, 13, 14, 15, 16, 17, 18];

  const calculateTotalBits = (team: 'team1' | 'team2', holeNumbers: number[]) => {
      return holeNumbers.reduce((acc, holeNum) => {
          return acc + (holes[holeNum]?.bits[team] || 0);
      }, 0);
  };

  const frontNineBitsT1 = calculateTotalBits('team1', frontNineHoles);
  const frontNineBitsT2 = calculateTotalBits('team2', frontNineHoles);
  const backNineBitsT1 = calculateTotalBits('team1', backNineHoles);
  const backNineBitsT2 = calculateTotalBits('team2', backNineHoles);

  const totalBitsT1 = frontNineBitsT1 + backNineBitsT1;
  const totalBitsT2 = frontNineBitsT2 + backNineBitsT2;

  const totalMoneyT1 = (totalBitsT1 * bitValue).toFixed(2);
  const totalMoneyT2 = (totalBitsT2 * bitValue).toFixed(2);

  const matchplayStatus = Object.values(holes).reduce((acc, hole) => {
    if (hole.matchplay === 'win') return acc + 1;
    if (hole.matchplay === 'loss') return acc - 1;
    return acc;
  }, 0);

  let matchWinner = '';
  if (matchplayStatus > 0) {
      matchWinner = `Team 1 wins ${matchplayStatus} Up`;
  } else if (matchplayStatus < 0) {
      matchWinner = `Team 2 wins ${Math.abs(matchplayStatus)} Up`;
  } else {
      matchWinner = 'Match is a Draw';
  }

  const handleNewGame = () => {
    dispatch({ type: 'NEW_GAME' });
  };

  const handleShare = () => {
      alert("Take a screenshot to save or share your results!");
  };

  return (
    <div className="summary-screen">
      <h2>Game Summary</h2>

      <div className="summary-section totals-summary">
          <h3>Final Score</h3>
          <p><strong>{matchWinner}</strong></p>
          <div className="final-totals">
              <div>
                  <p>{team1.playerA.name} & {team1.playerB.name}</p>
                  <p>{totalBitsT1} Bits = ${totalMoneyT1}</p>
              </div>
              <div>
                  <p>{team2.playerA.name} & {team2.playerB.name}</p>
                  <p>{totalBitsT2} Bits = ${totalMoneyT2}</p>
              </div>
          </div>
      </div>

      <div className="summary-section breakdown">
        <h3>Hole-by-Hole</h3>
        <table>
          <thead>
            <tr>
              <th>Hole</th>
              <th>Team 1 Bits</th>
              <th>Team 2 Bits</th>
              <th>Matchplay</th>
            </tr>
          </thead>
          <tbody>
            {holeSequence.map(holeNum => {
              const holeData = holes[holeNum];
              return (
                <tr key={holeNum}>
                  <td>{holeNum}</td>
                  <td>{holeData?.bits.team1 || 0}</td>
                  <td>{holeData?.bits.team2 || 0}</td>
                  <td>{holeData?.matchplay || '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="summary-section nine-totals">
          <h3>Subtotals</h3>
          <p>Front 9: Team 1 ({frontNineBitsT1}) vs Team 2 ({frontNineBitsT2})</p>
          <p>Back 9: Team 1 ({backNineBitsT1}) vs Team 2 ({backNineBitsT2})</p>
      </div>

      <div className="summary-actions">
        <button onClick={handleNewGame}>Start New Game</button>
        <button onClick={handleShare}>Share Results</button>
      </div>
    </div>
  );
};

export default SummaryScreen;
