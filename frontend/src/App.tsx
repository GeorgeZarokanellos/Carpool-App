import React from 'react';
import { Route } from 'react-router-dom';
import {
  IonApp,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login';
import { Main } from './pages/Main';
import { UserRegistration } from './pages/UserRegistration';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { DriverVehicleRegistration } from './pages/DriverVehicleRegistration';
import { AdminDashboard } from './pages/admin/AdminDashboard';


setupIonicReact();  // This function call is required to set up the React app

const App: React.FC = () => {
  const userRole = localStorage.getItem('role');
  
  return (
    <IonApp>
      <IonReactRouter>
        <Route exact path ="/">
          <Login />
        </Route>
        <Route path="/main">
          <Main />
        </Route>
        <Route exact path="/registration">
          <UserRegistration />
        </Route>
        <Route path="/registration/driver/:userId">
          <DriverVehicleRegistration />
        </Route>
        {
          userRole === 'admin' && 
          <Route exact path='/admin/dashboard'>
            <AdminDashboard />
          </Route>
        }
      </IonReactRouter>
    </IonApp>
)};

export default App;
