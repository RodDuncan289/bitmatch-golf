import './index.css'
import { useGame } from './context/GameContext';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import SummaryScreen from './components/SummaryScreen';

function App() {
  const { state } = useGame();

  const renderScreen = () => {
    switch (state.appState) {
      case 'setup':
        return <SetupScreen />;
      case 'playing':
        return <GameScreen />;
      case 'summary':
        return <SummaryScreen />;
      default:
        return <SetupScreen />;
    }
  };

  return (
    <div className={`theme-${state.theme}`}>
      <img src="https://i.postimg.cc/VvsvsQx6/BitMatch.png" alt="BitMatch Logo" className="app-logo" />
      {renderScreen()}
    </div>
  )
}

export default App
