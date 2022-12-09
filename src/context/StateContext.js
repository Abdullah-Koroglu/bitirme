import React , {useState, createContext} from "react";

export const StateContext = createContext ();

export const StateProvider = ({children}) => {
  const [eventId, setEventId] = useState ();
  const [howtoId, setHowtoId] = useState ();
  const [routes, setRoutes] = useState ();

  return (
    <StateContext.Provider value={[setEventId, eventId, setHowtoId, howtoId, setRoutes, routes]}>
      {children}
    </StateContext.Provider>
  )
}