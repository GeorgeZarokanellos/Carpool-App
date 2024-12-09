import React, { useEffect, useState } from "react";
import instance from "../../AxiosConfig";
import { CouponDisplay } from "./components/CouponDisplay";
import { IonAlert, IonButton, IonLoading } from "@ionic/react";
import './Coupons.scss';
import { Pagination } from "@mui/material";
import { useForm } from "react-hook-form";

export enum CouponStatus {
    ACTIVE = 'active',
    REDEEMED = 'redeemed',
}

type Coupon = {
    couponId: number;
    title: string;
    description: string;
    code: string;
    discountValue: number;
    pointsCost: number;
    status: CouponStatus;
    createdAt: string;
}

interface CouponFormInputs {
    title: string;
    description: string;
    discountValue: number;
    pointsCost: number;
}

export const Coupons: React.FC = () => {

    const [couponsList, setCouponsList] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [couponActionAlert, setCouponActionAlert] = useState<boolean>(false);
    const [couponActionMessage, setCouponActionMessage] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const paginatedCoupons = couponsList.slice((page-1)*itemsPerPage, itemsPerPage*page);
    const {register, handleSubmit} = useForm<CouponFormInputs>();
    const [couponToBeDeleted, setCouponToBeDeleted] = useState<number>(0);

    const retrieveAllCoupons = async () => {
        try {
            setIsLoading(true);
            const coupons = await instance.get('/admin/coupons');
            console.log(coupons.data);
            setCouponsList(coupons.data);
            setIsLoading(false);

        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        if (page < 1 || page > Math.ceil(couponsList.length / itemsPerPage)) {
            return;
        }
        setPage(page);
    }

    const handleCouponCreation = async (data: CouponFormInputs) => {
        try {
            const coupon = await instance.post('/admin/coupon' , data);
            if (coupon.status === 200) {
                setCouponActionMessage('Coupon created successfully');
                setCouponActionAlert(true);
                retrieveAllCoupons();
            } else {
                setCouponActionMessage('Failed to create coupon');
                setCouponActionAlert(true);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleCouponDeletion = async (couponId: number) => {
        try {
            const coupon = await instance.delete(`/admin/coupon/${couponId}`);
            if (coupon.status === 200) {
                setCouponActionMessage('Coupon deleted successfully');
                setCouponActionAlert(true);
                retrieveAllCoupons();
            } else {
                setCouponActionMessage('Failed to delete coupon');
                setCouponActionAlert(true);
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        retrieveAllCoupons();
    }, []);

    useEffect(() => {
        handleCouponDeletion(couponToBeDeleted);
    }, [couponToBeDeleted])

    return(
        <div className="coupon-list-container">
            <h1>Coupons</h1>
            <div className="coupon-list-display">
                <div className="coupons-list">
                    <div className="list-header">
                        <label>Title</label>
                        <label>Code</label>
                        <label>Discount Value</label>
                        <label>Cost</label>
                        <label>Status</label>
                    </div>
                    {
                        couponsList != null && paginatedCoupons.map((coupon, index) => {
                            return (
                              <CouponDisplay
                                couponId={coupon.couponId} 
                                title={coupon.title}
                                description={coupon.description}
                                code={coupon.code}
                                value={coupon.discountValue}
                                cost={coupon.pointsCost}
                                status={coupon.status}
                                setCouponToBeDeleted={setCouponToBeDeleted}
                                key={index}
                              />  
                            )
                        })
                    }
                    <Pagination 
                        count={Math.ceil(couponsList?.length / itemsPerPage)}
                        page={page}
                        shape="rounded"
                        onChange={handlePageChange}
                    />
                </div>
            </div>
            <div className="create-coupon-container">
                <form  onSubmit={handleSubmit(handleCouponCreation)} >
                    <div className="create-coupon-grid">
                        <div className="stacked">
                            <label htmlFor="title">Title</label>
                            <input type="text" {...register('title')} />
                        </div>
                        <div className="side-by-side">
                            <div className="stacked">
                                <label htmlFor="discountValue">Discount Value</label>
                                <input type="number" {...register('discountValue')} />
                            </div>
                            <div className="stacked">
                                <label htmlFor="pointsCost">Points Cost</label>
                                <input type="number" {...register('pointsCost')} />
                            </div>
                        </div>
                        <div className="desc">
                            <label htmlFor="description">Description</label> 
                            <textarea {...register('description')} />
                        </div>
                    </div>
                    <IonButton color='primary' type="submit" className='submit-button'>Create Coupon</IonButton>
                </form>
            </div>
            <IonLoading isOpen={isLoading} message="Loading Coupons" />
            <IonAlert 
                isOpen={couponActionAlert}
                onDidDismiss={() => setCouponActionAlert(false)}
                message={couponActionMessage}
                buttons={['OK']}
            />
        </div>
    )
}