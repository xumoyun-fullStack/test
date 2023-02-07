import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Employees from './pages/Employees';
import ChangeWork from './pages/ChangeWork';
import EmployeesStatistics from './pages/EmployeesStatistics';
import Login from './pages/Login';
import Cookies from 'universal-cookie';
import AddEmployee from './pages/AddEmployees';
import SetReason from './pages/SetReason';
import { Base64 } from 'js-base64';
import MyStatistics from './pages/MyStatistics';
import ChangeEmployee from './pages/ChangeEmployee';
import ChangeLogin from './pages/ChangeLogin';
import OneEmployee from './pages/OneEmployee';
const cookies = new Cookies();

function App() {

  let t = cookies.get("name");
  let role = cookies.get("@");
  role = role ? Base64.decode(role) : "";

  return (     
   <div className="App">    
   <Router>
      <Switch>
          <Route path="/change-work" component={t === "name" && role === "super" ? ChangeWork : Login}/>
          <Route path="/employees" component={ t=== "name" ? Employees : Login}/>
          <Route path="/employees_statistics" component={t ==="name" && (role === "super" || role === "admin") ? EmployeesStatistics : Login}/>
          <Route path="/add" component={t === "name" && role === "super" ? AddEmployee : Login} />
          <Route path="/change_employee" component={t === "name" && role === "super" ? ChangeEmployee : Login} />
          <Route path="/employee" component={t === "name" && role === "super" ? OneEmployee : Login} />
          <Route path="/reason" component={t === "name" ? SetReason : Login}/>
          <Route path="/my_statistics" component={t === "name" ? MyStatistics : Login}/>
          <Route path="/change_login" component={t === "name" ? ChangeLogin : Login}/>
          <Route path="/" component={Login}/>
      </Switch>
    </Router>
   </div>
  );
}

export default App;