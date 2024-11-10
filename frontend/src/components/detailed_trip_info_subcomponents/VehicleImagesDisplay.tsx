import { IonLabel } from "@ionic/react";
import React from "react";
import { Swiper,SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface VehicleImagesDisplayProps {
    vehicleImages: string[];
}

export const VehicleImagesDisplay: React.FC<VehicleImagesDisplayProps> = ({vehicleImages}) => {
    return (
        <div className="vehicle-images">
            <IonLabel class="ion-text-center">Driver&apos;s vehicle images</IonLabel>
            <Swiper
              slidesPerView={1}
            >
              {
                vehicleImages.map((url, index) => {
                  return (
                  <SwiperSlide key={index} >
                    <img src={url} alt="" style={{height: '100%', width: '100%'}}/>
                  </SwiperSlide>
                )})
              }
            </Swiper>
        </div>
    )
}