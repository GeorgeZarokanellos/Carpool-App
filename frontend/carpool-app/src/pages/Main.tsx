import React, { useState } from 'react';
import { Route} from 'react-router-dom';
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon} from '@ionic/react';
import { map, chatbox, notifications, person, search } from 'ionicons/icons';
import Tab2 from './Tab2';
import SearchTrips from './SearchTrips';
import Profile from './Profile';
import { NewTrip } from './NewTrip';
import { CurrentTripPage } from './CurrentTripPage';
import { NotificationPage } from './NotificationPage';
import { DetailedTripInformationPage } from './DetailedTripInformationPage';

//TODO make the tab turn blue when user clicks on a trip from search trips tab

export const Main: React.FC = () => {
  const [searchTripsRefreshKey, setSearchTripsRefreshKey] = useState(0);
  const [currentTripRefreshKey, setCurrentTripRefreshKey] = useState(0);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);
  const [profileRefreshKey, setProfileRefreshKey] = useState(0);

 return (
    <IonTabs>
        <IonRouterOutlet>
          <Route path="/main/current-trip" render={() => <CurrentTripPage refreshKey={currentTripRefreshKey} />} />
          <Route path="/main/tab2" component={Tab2} />
          <Route path="/main/search-trips" render={() => <SearchTrips refreshKey={searchTripsRefreshKey}/>}/>
          <Route path="/main/notifications" render={() => <NotificationPage refreshKey={notificationRefreshKey} /> }/>
          <Route path="/main/profile" render={() => <Profile refreshKey={profileRefreshKey} /> }/>
          <Route path="/main/create-trip" component={NewTrip} />
          <Route path="/main/trip-info/:tripId" component={DetailedTripInformationPage}/>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="currentTrip" href="/main/current-trip" onClick={() => setCurrentTripRefreshKey(currentTripRefreshKey => currentTripRefreshKey + 1)}>
            <IonIcon aria-hidden="true" icon={map} />
          </IonTabButton>
          <IonTabButton tab="tab2" href="/main/tab2">
            <IonIcon aria-hidden="true" icon={chatbox} />
          </IonTabButton>
          <IonTabButton tab="searchTrips" href="/main/search-trips" onClick={() => setSearchTripsRefreshKey(searchTripsRefreshKey => searchTripsRefreshKey + 1)}>
            <IonIcon aria-hidden="true" icon={search} />
            {/* <IonLabel>Search Trips</IonLabel> */}
          </IonTabButton>
          <IonTabButton tab="notifications" href="/main/notifications" onClick={() => setNotificationRefreshKey(notificationRefreshKey => notificationRefreshKey + 1)}>
            <IonIcon aria-hidden="true" icon={notifications} />
          </IonTabButton>
          <IonTabButton tab="profile" href="/main/profile" onClick={() => setProfileRefreshKey(profileRefreshKey => profileRefreshKey + 1)}>
            <IonIcon aria-hidden="true" icon={person} />
            {/* <IonLabel>Tab 5</IonLabel> */}
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
 );
}