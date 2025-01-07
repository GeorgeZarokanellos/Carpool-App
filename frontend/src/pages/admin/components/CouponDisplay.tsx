import React, { useState } from "react";
import { IonButton } from "@ionic/react";
import './CouponDisplay.scss';
import { CCard, CCardBody, CCollapse } from "@coreui/react";

interface CouponDisplayInterface {
    couponId: number;
    title: string;
    description: string;
    code: string;
    value: number;
    cost: number;
    setCouponToBeDeleted: (couponId: number) => void;
}

export const CouponDisplay: React.FC<CouponDisplayInterface> = (
    { couponId, title, description, code, value, cost, setCouponToBeDeleted }
) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);


    return(
        <div className="coupon-list-row">
            <label>{title}</label>
            <label>{code}</label>
            <label>{value} %</label>
            <label>{cost} points</label>
            <IonButton color='primary' onClick={() => setIsExpanded(!isExpanded)}>See Details</IonButton>
            <IonButton color='danger' onClick={() => setCouponToBeDeleted(couponId)}>Delete Coupon</IonButton>
            <div className="extend-coupon-info-container">
                <CCollapse visible={isExpanded} className="coupon-detailed-info" >
                    <CCard >
                        <CCardBody>
                            <p>Description: {description}</p>
                        </CCardBody>
                    </CCard>
                </CCollapse>
            </div>
        </div>
    )
}