import React, { useEffect, useState } from 'react';
import { Route} from 'react-router-dom';
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge} from '@ionic/react';
import { map, chatbox, notifications, person, search } from 'ionicons/icons';
import Tab2 from './Tab2';
import SearchTrips from './SearchTrips';
import Profile from './Profile';
import { NewTrip } from './NewTrip';
import { CurrentTripPage } from './CurrentTripPage';
import { NotificationPage } from './NotificationPage';
import { DetailedTripInformationPage } from './DetailedTripInformationPage';
import instance from '../AxiosConfig';
import { NotificationInterface } from '../interfacesAndTypes/Interfaces';

//TODO make the tab turn blue when user clicks on a trip from search trips tab

export const Main: React.FC = () => {
  const [searchTripsRefreshKey, setSearchTripsRefreshKey] = useState(0);
  const [currentTripRefreshKey, setCurrentTripRefreshKey] = useState(0);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);
  const [profileRefreshKey, setProfileRefreshKey] = useState(0);
  const [userNotifications, setUserNotifications] = useState<NotificationInterface[]>([]);
  const [notificationsNumber, setNotificationsNumber] = useState<number>(0);

  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role');
  let queryParams = new URLSearchParams();
  if(userId !== null && userRole !== null) {
      queryParams = new URLSearchParams({
          userRole
      });
  }

  const retrieveNotifications = async () => {

    try {
        await instance.get(`/notifications/${userId}?${queryParams.toString()}`)
        .then(response => {
            // console.log(response.data);
            setUserNotifications(response.data);
            setNotificationsNumber(response.data.length);
        })
        .catch(error => {
            console.log("Error retrieving notifications", error);
        });
    } catch (error) {
        console.log("Error retrieving notifications", error);
    }

}

useEffect(() => {
    retrieveNotifications();
}, [notificationRefreshKey]);

 return (
    <IonTabs>
        <IonRouterOutlet>
          <Route path="/main/current-trip" render={() => <CurrentTripPage refreshKey={currentTripRefreshKey} />} />
          <Route path="/main/tab2" component={Tab2} />
          <Route path="/main/search-trips" render={() => <SearchTrips refreshKey={searchTripsRefreshKey}/>}/>
          <Route path="/main/notifications" render={() => <NotificationPage notifications={userNotifications}/> }/>
          <Route path="/main/profile" render={() => <Profile refreshKey={profileRefreshKey} /> }/>
          <Route path="/main/create-trip" component={NewTrip} />
          <Route path="/main/trip-info/:tripId" component={DetailedTripInformationPage}/>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="currentTrip" href="/main/current-trip" onClick={() => setCurrentTripRefreshKey(currentTripRefreshKey => currentTripRefreshKey + 1)}>
            <IonIcon aria-hidden="true" icon={map} />
            <IonLabel style={{fontSize: '0.6rem'}}>Current Trip</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/main/tab2">
            <IonIcon aria-hidden="true" icon={chatbox} />
            <IonLabel style={{fontSize: '0.6rem'}}>Demo</IonLabel>
          </IonTabButton>
          <IonTabButton tab="searchTrips" href="/main/search-trips" onClick={() => setSearchTripsRefreshKey(searchTripsRefreshKey => searchTripsRefreshKey + 1)}>
            <IonIcon aria-hidden="true" icon={search} />
            <IonLabel style={{fontSize: '0.6rem'}}>Search Trips</IonLabel>
          </IonTabButton>
          <IonTabButton tab="notifications" href="/main/notifications" onClick={() => setNotificationRefreshKey(notificationRefreshKey => notificationRefreshKey + 1)}>
            <IonIcon aria-hidden="true" icon={notifications} />
            <IonLabel style={{fontSize: '0.6rem'}}>Notifications</IonLabel>
            {
              notificationsNumber > 0 && (
                <IonBadge color="danger" style={{ position: 'absolute', top: '4px', right: '5px'}}>
                  {notificationsNumber}
                </IonBadge>
              )
            }
          </IonTabButton>
          <IonTabButton tab="profile" href="/main/profile" onClick={() => setProfileRefreshKey(profileRefreshKey => profileRefreshKey + 1)}>
            <IonIcon aria-hidden="true" icon={person} />
            <IonLabel style={{fontSize: '0.6rem'}}>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
 );
}