import React, { useEffect } from "react";

export const NewTrip: React.FC = () => {
    let tripCreatorId: number;
    
    useEffect(() => {
        const storedUserIdString = localStorage.getItem('userId');
        if( storedUserIdString !== null){
            const storedUserIdInt = parseInt(storedUserIdString, 10);

            if(storedUserIdInt){
                tripCreatorId = storedUserIdInt;
            } else {
                console.log("StoredUserInt doesnt exist from NewTrip component");
                
            }

        } else {
            console.log("Local storage is empty from NewTrip component");
        }
    },[]);

    return (
        <div>
            
        </div>
    );
}