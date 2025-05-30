
import './App.css';
import './pages/LoginPage/Login'; 
import Login from './pages/LoginPage/Login';
import DailyUpdates from './pages/FormPage/DailyUpdates';
import Dashboard from './pages/Dashboard/Dashboard';
import  {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

function App() {
  return (
    <Router>
    <div className="App">
      <Switch>
        <Route exact path="/">
        <Login/>
        </Route>
        <Route path="/daily-updates">
        <DailyUpdates/>
        </Route>
        <Route path="/dashboard">
        <Dashboard/>
        </Route>
      </Switch>
    </div>
  </Router>  
  );
}

export default App;
