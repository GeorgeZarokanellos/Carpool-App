import React, { useState } from "react";
import { Coupon } from "../../interfacesAndTypes/Types";
import { CCard, CCardBody, CCollapse } from "@coreui/react";
// import './ShopSubTab.scss';
import { IonButton } from "@ionic/react";
import instance from "../../AxiosConfig";

interface ShopTabProps {
    availableCoupons: Coupon[];
    setErrorMessage: (errorMessage: string) => void;
    setErrorAlert: (errorAlert: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    setCouponPurchasedAlert: (couponPurchasedAlert: boolean) => void;
    userPoints: number;
}

export const ShopSubTab: React.FC<ShopTabProps> = ({availableCoupons, setErrorMessage, setErrorAlert, setIsLoading, setCouponPurchasedAlert, userPoints}) => {
    const [isExpanded, setIsExpanded] = useState(new Array(availableCoupons.length).fill(false));
    const userId = localStorage.getItem('userId');
    let userIdInt: number;
    if(userId !== null)
        userIdInt = parseInt(userId, 10);
    else 
        console.log('userId is null', userId);

    const toggleExpansion = (index: number) => {
        setIsExpanded((prevState) => {
            const newState = [...prevState]; //creates a copy of the state of the array
            newState[index] = !newState[index]; //updates the state at the index by inverting
            return newState; //updates the state with the updated array
        });
    }
    
    const handlePurchase = async (userId: number, couponPointsCost: number, couponId: number) => {
        try {
            setIsLoading(true);
            const response = await instance.post(`/user/coupons/purchase/${couponId}`, {
              userId,
              couponPointsCost
            });
            console.log(response);
            
            if(response.status === 400){
                setErrorMessage(response.data.message);
                setIsLoading(false);
                setErrorAlert(true);
            } else if (response.status === 201){
                setIsLoading(false);
                setCouponPurchasedAlert(true);
            }
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
      }

    return(
        <div>
            {
                availableCoupons.map((coupon, index) => {
                    return (
                        <div key={index} className="list-item">
                            <label>{coupon.title}</label>
                            <IonButton onClick={() => toggleExpansion(index)}>See Details</IonButton>
                            <div className="extended-coupon-info">
                                <CCollapse visible={isExpanded[index]}>
                                    <CCard>
                                        <CCardBody>
                                            <p>Discount: {coupon.discountValue}%</p>
                                            <p>Description: {coupon.description}</p>
                                            <p>Cost: {coupon.pointsCost}</p>
                                            <IonButton 
                                                color={userPoints < coupon.pointsCost ? 'danger' : 'success'} 
                                                onClick={() => handlePurchase(userIdInt, coupon.pointsCost, coupon.couponId)}
                                                disabled={userPoints < coupon.pointsCost}
                                            >{userPoints < coupon.pointsCost ? 'Not enough points!' : 'Purchase Coupon'}</IonButton>
                                        </CCardBody>
                                    </CCard>
                                </CCollapse>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}