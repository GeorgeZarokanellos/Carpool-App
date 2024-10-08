import React from "react";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HailIcon from '@mui/icons-material/Hail';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import { IonText } from "@ionic/react";
import { TripStops } from "../../interfacesAndTypes/Types";


interface StopsDisplayProps {
    stopLocationStart: string;
    stopLocationEnd: string;
    tripStops: TripStops;
}

export const StopsDisplay: React.FC<StopsDisplayProps> = ({stopLocationStart, stopLocationEnd, tripStops}) => {
    return (
        <div className="stops-display" style={{ overflowY: 'auto', maxHeight: '100%' }}>
            <LocationOnIcon />
            <IonText style={{textAlign: 'center'}}>{stopLocationStart}</IonText>
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="80px" viewBox="6 6 20 20">
              <g transform="scale(1.4)">
                {/* used to scale only the arrow and not the rectangle around it */}
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m8 18l4 4m0 0l4-4m-4 4V2" />
              </g>
            </svg>
            <HailIcon />
            {
              tripStops.length > 0 ?
                tripStops.map((stop, index) => {
                  if(index === 0){
                    return (
                      <IonText key={index} style={{textAlign: 'center'}}>
                        {stop.details.stopLocation}
                      </IonText>
                    )
                  } else {
                    return (
                      <React.Fragment key={index}>
                        <HailIcon />
                        <IonText style={{textAlign: 'center'}}>
                          {stop.details.stopLocation}
                        </IonText>
                      </React.Fragment>
                    )
                  }
                }
                  
                )
              : 'No stops'
            }
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="80px" viewBox="6 6 20 20">
              <g transform="scale(1.4)">
                {/* used to scale only the arrow and not the rectangle around it */}
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m8 18l4 4m0 0l4-4m-4 4V2" />
              </g>
            </svg>
            <SportsScoreIcon />
            <IonText style={{textAlign: 'center'}}>{stopLocationEnd}</IonText>
        </div>
    )
}