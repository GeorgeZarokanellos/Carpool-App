import React, { useEffect, useState } from 'react';
import { Route} from 'react-router-dom';
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge, IonPage, IonMenu, IonContent, IonButton, IonMenuToggle, IonAlert} from '@ionic/react';
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
import './Main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';

//TODO make the tab turn blue when user clicks on a trip from search trips tab

export const Main: React.FC = () => {
  const [searchTripsRefreshKey, setSearchTripsRefreshKey] = useState(0);
  const [currentTripRefreshKey, setCurrentTripRefreshKey] = useState(0);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);
  const [profileRefreshKey, setProfileRefreshKey] = useState(0);
  const [userNotifications, setUserNotifications] = useState<NotificationInterface[]>([]);
  const [notificationsNumber, setNotificationsNumber] = useState<number>(0);
  const [userLogoutConfirmation, setUserLogoutConfirmation] = useState<boolean>(false);
  const [selectedInstruction, setSelectedInstruction] = useState<string>('');

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

  const handleSelectedInstruction = (instruction: string) => {
    setSelectedInstruction(instruction);
  }

  const renderInstructions = () => {
    switch(selectedInstruction){
      case 'joinTrip':  
        return(
              <ol className='instructions-list'>
                <li>On the search trips screen. Click on a trip that suits your needs.</li>
                <li>A screen displaying detailed information about the trip will show up.</li>
                <li>At the bottom of the screen, tap the Request to Join button.</li>
                <li>A popup will appear showing the available stops where the driver can pick you up.</li>
                <li>Choose the stop that&apos;s most convenient for you.</li>
                <li>A join request notification will be sent to the driver. Once they accept, you&apos;ll officially be added to the trip!</li>
              </ol>
        );
      case 'leaveTrip':
        return(
          <ol className='instructions-list'>
            <li>Navigate to the current trip screen from the navigation bar in the bottom.</li>
            <li>If the trip hasn&apos;t started yet, a Leave Trip button will appear at the bottom of the screen.</li>
            <li>Tap Leave Trip to remove yourself from the trip.</li>
            <li>Once you&apos;ve left the trip, you&apos;re free to join another one if you&apos;d like!</li>
          </ol>
        );
      case 'review':
        return (
          <ol className='instructions-list'>
            <li>After completing a trip, go to the Notifications screen.</li>
            <li>You will see a trip participants review notification.</li>
            <li>At the bottom of the notification, you&apos;ll see each participant&apos;s name with a row of selectable stars below.</li>
            <li>Select the amount of stars for this participant.</li>
            <li>Swipe right to view the next participant and repeat the rating process.</li>
            <li>Once you&apos;ve rated all participants, tap the Submit Review button.</li>
            <li>After submitting, your reviews will be saved, and you&apos;ll receive one point for each review submitted.</li>
          </ol>
        );
      case 'createTrip':
        return (
          <ol className='instructions-list'>
            <li>On the Search Trips screen, tap the Create a New Trip button.</li>
            <li>You&apos;ll be taken to the Trip Creation screen, where you can set up your trip details:</li>
            <ul className='bullet-list'>
              <li>Start and End Location</li>
              <li>Available seats</li>
              <li>Date and Time of the trip</li>
            </ul>
            <li>Note: If you choose any Start Location other than Prytaneia, the End Location will automatically be set to Prytaneia.</li>
            <li>Finally, tap the Submit Trip button to confirm and create your trip!</li>
          </ol>
        );
      case 'delayTrip':
        return (
          <ol className='instructions-list'>
            <li>On the Current Trip screen, tap the Delay Trip button.</li>
            <li>A popup will appear, prompting you to enter the number of minutes to delay the trip.</li>
            <li>Enter the new time and tap Done.</li>
            <li>The trip&apos;s start time will be adjusted, and all participants will be notified of the delay.</li>
          </ol>
        )
      case 'acceptRequest':
        return (
          <ol className='instructions-list'>
            <li>On the Notifications screen, you will see a notification for a join request.</li>
            <li>At the bottom of the notification, you&apos;ll see the Accept and Decline buttons.</li>
            <li>Tap Accept to add the user to your trip, or Decline to reject the request.</li>
            <li>Once you accept the request, the user will be added to your trip along with the stop that they have selected.</li>
          </ol>
        );
      case 'close': 
        return null;
      default:
    }
  }

  useEffect(() => {
      retrieveNotifications();
  }, [notificationRefreshKey]);

 return (
  <>
    <IonMenu contentId='main-content'>
      <IonContent>
        <IonMenuToggle autoHide={false}>
          <IonButton >Close Menu</IonButton>
        </IonMenuToggle>
        <div className='menu-content' >
          <Dropdown style={{width: '100%'}} >
            <Dropdown.Toggle style={{marginTop: '2rem'}}>See Instructions</Dropdown.Toggle>
            <Dropdown.Menu>
              {
                userRole === 'passenger' ? (
                  <>
                    <Dropdown.Item onClick={() => handleSelectedInstruction('joinTrip')}>Joining a trip</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSelectedInstruction('leaveTrip')}>Leaving a trip</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSelectedInstruction('review')}>Reviewing users</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSelectedInstruction('close')}>Close</Dropdown.Item>     
                  </>
                ) : (
                  <>
                    <Dropdown.Item onClick={() => handleSelectedInstruction('createTrip')}>Creating a trip</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSelectedInstruction('delayTrip')}>Delaying a trip</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSelectedInstruction('acceptRequest')}>Accepting a request</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSelectedInstruction('review')}>Reviewing users</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSelectedInstruction('close')}>Close</Dropdown.Item>     
                  </>
                )
              }
            </Dropdown.Menu>
          </Dropdown>
          {renderInstructions()}
          <IonButton className='logout-button' color='danger' onClick={() => setUserLogoutConfirmation(true)}>Logout</IonButton>
        </div>
      </IonContent>
    </IonMenu>
    <IonPage id='main-content'>
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
      <IonAlert 
        isOpen={userLogoutConfirmation}
        onDidDismiss={() => setUserLogoutConfirmation(false)}
        header={'Logout'}
        message={'Are you sure you want to logout?'}
        buttons={[  
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              setUserLogoutConfirmation(false);
            }
          },
          {
            text: 'Logout',
            handler: () => {
              localStorage.clear();
              setUserLogoutConfirmation(false);
              window.location.href = '/';
            }
          }
        ]}
      />
    </IonPage>
  </>
 );
}