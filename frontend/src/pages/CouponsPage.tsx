import React, { useState } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './CouponsPage.scss';
import { MenuButton } from '../components/MenuButton';
import { ShopSubTab } from '../components/coupons_subcomponents/ShopSubTab';
import { MyCouponsSubTab } from '../components/coupons_subcomponents/MyCouponsSubTab';

interface CouponsPageProps {
  refreshKey: number;
}

enum ActiveSubTabNameEnum {
  SHOP = 'shop',
  MY_COUPONS = 'myCoupons'
}

export const CouponsPage: React.FC<CouponsPageProps> = ({refreshKey}) => {

  const [activeSubTab, setActiveSubTab] = useState<ActiveSubTabNameEnum>(ActiveSubTabNameEnum.SHOP);

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
              <IonButton onClick={() => setActiveSubTab(ActiveSubTabNameEnum.SHOP)} color={activeSubTab === ActiveSubTabNameEnum.SHOP ? 'secondary' : 'primary'}>Shop</IonButton>
              <IonButton onClick={() => setActiveSubTab(ActiveSubTabNameEnum.MY_COUPONS)} color={activeSubTab === ActiveSubTabNameEnum.MY_COUPONS ? 'secondary' : 'primary'}>My Coupons</IonButton>
          </div>
        </IonHeader>
        <div className='content-container'>
          {activeSubTab === ActiveSubTabNameEnum.SHOP ? <ShopSubTab /> : <MyCouponsSubTab />}
        </div>
      </IonContent>
    </IonPage>
  );
};

