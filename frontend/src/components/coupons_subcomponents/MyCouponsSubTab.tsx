import React, { useState } from "react";
import { UserCoupon } from "../../interfacesAndTypes/Types";
import { IonButton } from "@ionic/react";
import { CCard, CCardBody, CCollapse } from "@coreui/react";
import instance from "../../AxiosConfig";

interface MyCouponsTabProps {
    userCoupons: UserCoupon[];
    setErrorMessage: (errorMessage: string) => void;
    setErrorAlert: (errorAlert: boolean) => void;
    setCouponDeletedAlert: (couponDeleted: boolean) => void;
    setIsLoading: (isLoading: boolean) => void
}

export const MyCouponsSubTab: React.FC<MyCouponsTabProps> = ({userCoupons, setErrorMessage, setErrorAlert, setCouponDeletedAlert, setIsLoading}) => {

    const [isExpanded, setIsExpanded] = useState(new Array(userCoupons.length).fill(false));
    const userId = localStorage.getItem('userId');
    let userIdInt: number;
    if(userId)
        userIdInt = parseInt(userId, 10)
    else 
        console.log('User id is null', userId);
        
    const toggleExpansion = (index: number) => {
        setIsExpanded((prevState) => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    }

    const handleCouponDelete = async (couponId: number) => {
        try {
            setIsLoading(true);
            const response = await instance.delete(`/user/coupons/remove/${couponId}?userId=${userIdInt}`);
            if(response.status === 404){
                setErrorMessage(response.data.message);
                setErrorAlert(true);
                setIsLoading(false);
            } else if (response.status === 200){
                setIsLoading(false);
                setCouponDeletedAlert(true);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    return (
        <div>
            {
                userCoupons.map((userCoupon, index) => {
                    
                    return (
                        <div key={index} className="list-item">
                            <label>{userCoupon.coupon.title}</label>
                            <IonButton onClick={() => toggleExpansion(index)}>See Details</IonButton>
                            <div className="extended-coupon-info">
                                <CCollapse visible={isExpanded[index]}>
                                    <CCard>
                                        <CCardBody>
                                            <p>Code: {userCoupon.coupon.code}</p>
                                            <p>Discount: {userCoupon.coupon.discountValue}%</p>
                                            <p>Description: {userCoupon.coupon.description}</p>
                                            <IonButton color="danger" onClick={() => handleCouponDelete(userCoupon.couponId)}>Delete Coupon</IonButton>
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