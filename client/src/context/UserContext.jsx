import { createContext, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider( {children} ){

    // const [ userInfo , setUserInfo ] = useState( { username : 'Vikas' , id : '3kdsjfkjs3i' , avatar : 'avatar.jpg'} );
    const [ userInfo , setUserInfo ] = useState( null );

    const value = {
        userInfo,
        setUserInfo
    }
    
    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}