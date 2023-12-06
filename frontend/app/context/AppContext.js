import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = (props) => {
    const [isReRender, setIsReRender] = useState(false);
    return <AppContext.Provider value={{ isReRender, setIsReRender }} {...props}></AppContext.Provider>;
};
