import React, { useState } from 'react';
import { Route} from 'react-router-dom';
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon} from '@ionic/react';
import { map, chatbox, notifications, person, search } from 'ionicons/icons';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import SearchTrips from './SearchTrips';
import Profile from './Profile';
import { DetailedTripInformation } from '../components/DetailedTripInformation';
import { NewTrip } from './NewTrip';

export const Main: React.FC = () => {
  //for testing purposes 
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshTrips = () => {
    setRefreshKey(refreshKey => refreshKey + 1)
  }
  // const { path } = useRouteMatch(); // path is the path of the current route

 return (
    <IonTabs>
        <IonRouterOutlet>
          <Route path="/main/tab1" component={Tab1} />
          <Route path="/main/tab2" component={Tab2} />
          <Route path="/main/search-trips" render={() => <SearchTrips refreshKey={refreshKey}/>}/>
          <Route path="/main/tab4" />
          <Route path="/main/profile" component={Profile} />
          <Route path={"/main/search-trips/:tripId"} component={DetailedTripInformation}/>
          <Route path={"/main/create-trip"} component={NewTrip} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/main/tab1">
            <IonIcon aria-hidden="true" icon={map} />
          </IonTabButton>
          <IonTabButton tab="tab2" href="/main/tab2">
            <IonIcon aria-hidden="true" icon={chatbox} />
          </IonTabButton>
          <IonTabButton tab="searchTrips" href="/main/search-trips" onClick={refreshTrips}>
            <IonIcon aria-hidden="true" icon={search} />
            {/* <IonLabel>Search Trips</IonLabel> */}
          </IonTabButton>
          <IonTabButton tab="tab4" href="/main/tab4">
            <IonIcon aria-hidden="true" icon={notifications} />
          </IonTabButton>
          <IonTabButton tab="tab5" href="/main/profile">
            <IonIcon aria-hidden="true" icon={person} />
            {/* <IonLabel>Tab 5</IonLabel> */}
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
 );
}