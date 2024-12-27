import React, { useEffect, useState } from 'react';
import { IonAlert, IonButton, IonContent, IonHeader, IonLabel, IonLoading, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './CouponsPage.scss';
import { MenuButton } from '../components/MenuButton';
import { ShopSubTab } from '../components/coupons_subcomponents/ShopSubTab';
import { MyCouponsSubTab } from '../components/coupons_subcomponents/MyCouponsSubTab';
import { Coupon, UserCoupon } from '../interfacesAndTypes/Types';
import instance from '../AxiosConfig';

interface CouponsPageProps {
  refreshKey: number;
}

enum ActiveSubTabNameEnum {
  SHOP = 'shop',
  MY_COUPONS = 'myCoupons'
}

export const CouponsPage: React.FC<CouponsPageProps> = ({refreshKey}) => {

  const userId = localStorage.getItem('userId');

  //page info
  const [activeSubTab, setActiveSubTab] = useState<ActiveSubTabNameEnum>(ActiveSubTabNameEnum.SHOP);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  //error related
  const [errorMessage, setErrorMessage] = useState('');
  const [errorAlert, setErrorAlert] = useState(false);
  //user interaction/feedback
  const [isLoading, setIsLoading] = useState(false);
  const [couponPurchasedAlert, setCouponPurchasedAlert] = useState(false);
  const [couponDeleted, setCouponDeletedAlert] = useState(false);

  const retrieveUserInfo = async () => {
    try {
      const userInfoResponse = await instance.get(`/user/${userId}`)
      if(userInfoResponse.status === 200){
        setUserPoints(userInfoResponse.data.overallPoints);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const retrieveCouponsList = async () => {
    try {
      setIsLoading(true);
      if(activeSubTab === ActiveSubTabNameEnum.SHOP){
        const shopCouponList = await instance.get('/user/coupons/available?couponStatus=active');
        if(shopCouponList.status === 404){
          setIsLoading(false);
          setErrorMessage(shopCouponList.data.message);
          setErrorAlert(true);
        } else if (shopCouponList.status === 200){
          setIsLoading(false);
          setAvailableCoupons(shopCouponList.data.data);
        }
      } else if(activeSubTab === ActiveSubTabNameEnum.MY_COUPONS){
        const userCouponsList = await instance.get(`/user/coupons/available?couponStatus=redeemed&userId=${userId}`);
        if(userCouponsList.status === 404){
          setIsLoading(false);
          setErrorMessage(userCouponsList.data.message);
          setErrorAlert(true);
        } else if (userCouponsList.status === 200){
          setIsLoading(false);
          setUserCoupons(userCouponsList.data.data);
        }
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("Failed to retrieve coupons list" + error);
      setErrorAlert(true);
    }
  }

  useEffect(() => {
    retrieveCouponsList();
  }, [activeSubTab, refreshKey]);

  useEffect(() => {
    retrieveUserInfo();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <MenuButton />
          <IonTitle>Coupons</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader class='content-header'>
          <div className='sub-tabs-container'>
              <IonButton 
                onClick={() => setActiveSubTab(ActiveSubTabNameEnum.SHOP)} 
                color={activeSubTab === ActiveSubTabNameEnum.SHOP ? 'secondary' : 'primary'}
              >
                Shop
              </IonButton>
              <IonButton 
                onClick={() => setActiveSubTab(ActiveSubTabNameEnum.MY_COUPONS)} 
                color={activeSubTab === ActiveSubTabNameEnum.MY_COUPONS ? 'secondary' : 'primary'}
              >
                My Coupons
              </IonButton>
          </div>
        </IonHeader>
        <IonLabel>Your Points: {userPoints}</IonLabel>
        <div className='content-container'>
          {activeSubTab === ActiveSubTabNameEnum.SHOP ? 
            <ShopSubTab 
              availableCoupons={availableCoupons}
              setErrorMessage={setErrorMessage}
              setErrorAlert={setErrorAlert}
              setIsLoading={setIsLoading}
              setCouponPurchasedAlert={setCouponPurchasedAlert}
              userPoints={userPoints}
            /> 
            : 
            <MyCouponsSubTab 
              userCoupons={userCoupons}
              setErrorMessage={setErrorMessage}  
              setErrorAlert={setErrorAlert}
              setCouponDeletedAlert={setCouponDeletedAlert}
              setIsLoading={setIsLoading}
            />}
        </div>
      </IonContent>
      <IonAlert 
        isOpen={errorAlert}
        message={errorMessage}
        title='Error'
        onDidDismiss={() => setErrorAlert(false)}
        buttons={['OK']}
      />
      <IonAlert 
        isOpen={couponPurchasedAlert}
        message={'Coupon purchased successfully. Head to my coupons tab to use it!'}
        title='Purchase Successful!'
        onDidDismiss={() => setCouponPurchasedAlert(false)}
        buttons={['OK']}
      />
      <IonAlert 
        isOpen={couponDeleted}
        message={'Coupon deleted successfully!'}
        title='Coupon Deleted'
        onDidDismiss={() => {
          setCouponDeletedAlert(false);
          retrieveCouponsList();
        }}
        buttons={['OK']}
      />
      <IonLoading 
        isOpen={isLoading}
        message={'Please wait...'}
      />
    </IonPage>
  );
};

