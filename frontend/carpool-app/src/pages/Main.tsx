import React from 'react';
import { Route } from 'react-router-dom';
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { map, chatbox, notifications, person, search } from 'ionicons/icons';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import SearchTrips from './SearchTrips';
import Profile from './Profile';

export const Main: React.FC = () => {

 return (
    <IonTabs>
        <IonRouterOutlet>
          <Route path="/main/tab1" component={Tab1} />
          <Route path="/main/tab2" component={Tab2} />
          <Route path="/main/search-trips" component={SearchTrips}/>
          <Route path="/main/tab4" />
          <Route exact path="/main/profile" component={Profile} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/main/tab1">
            <IonIcon aria-hidden="true" icon={map} />
          </IonTabButton>
          <IonTabButton tab="tab2" href="/main/tab2">
            <IonIcon aria-hidden="true" icon={chatbox} />
          </IonTabButton>
          <IonTabButton tab="searchTrips" href="/main/search-trips">
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