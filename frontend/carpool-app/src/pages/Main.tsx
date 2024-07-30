import React, { useState } from 'react';
import { Route} from 'react-router-dom';
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon} from '@ionic/react';
import { map, chatbox, notifications, person, search } from 'ionicons/icons';
import Tab2 from './Tab2';
import SearchTrips from './SearchTrips';
import Profile from './Profile';
import { NewTrip } from './NewTrip';
import { TripInfoPage } from './TripInfoPage';
import { NotificationPage } from './NotificationPage';

//TODO make the tab turn blue when user clicks on a trip from search trips tab

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
          <Route path="/main/trip-info/:tripId" component={TripInfoPage} />
          <Route path="/main/tab2" component={Tab2} />
          <Route path="/main/search-trips" render={() => <SearchTrips refreshKey={refreshKey}/>}/>
          <Route path="/main/notifications" component={NotificationPage}/>
          <Route path="/main/profile" component={Profile} />
          {/* <Route path="/main/search-trips/:tripId" component={}/> */}
          <Route path="/main/create-trip" component={NewTrip} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tripInfo" href="/main/trip-info/">
            <IonIcon aria-hidden="true" icon={map} />
          </IonTabButton>
          <IonTabButton tab="tab2" href="/main/tab2">
            <IonIcon aria-hidden="true" icon={chatbox} />
          </IonTabButton>
          <IonTabButton tab="searchTrips" href="/main/search-trips" onClick={refreshTrips}>
            <IonIcon aria-hidden="true" icon={search} />
            {/* <IonLabel>Search Trips</IonLabel> */}
          </IonTabButton>
          <IonTabButton tab="notifications" href="/main/notifications">
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