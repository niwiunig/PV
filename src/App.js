import logo from './logo.svg';
import './App.css';
import { TodaysPowerChart } from './components/Charting/todaysPower/todaysPowerChart';
import Navbar from './components/Navigation/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <TodaysPowerChart />
    </div>
  );
}

export default App;
