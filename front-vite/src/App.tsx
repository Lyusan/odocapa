import './App.css';
import React, { useCallback, useMemo, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import StreetsConfiguration from './view/SteetsConfiguration';
import Main from './view/Main';
import Login from './view/Login';
import UserContext from './context/UserContext';
import { firebaseAuth, getCurrentUserMeta } from './service/firestore.service';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <div>Error 404</div>,
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <div>Error 404</div>,
  },
  {
    path: '/config',
    element: <StreetsConfiguration />,
    errorElement: <div>Error 404</div>,
  },
  {
    path: '/config/:streetId',
    element: <StreetsConfiguration />,
    errorElement: <div>Error 404</div>,
  },
]);

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const login = useCallback((response: any) => {
    setCurrentUser(response);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      currentUser,
      login,
      logout,
    }),
    [currentUser, login, logout],
  );

  onAuthStateChanged(firebaseAuth, async (user) => {
    if (user) {
      if (user.email !== currentUser?.email) {
        const fullUser = await getCurrentUserMeta();
        if (fullUser) setCurrentUser(fullUser);
      }
    } else {
      setCurrentUser(null);
    }
  });

  return (
    <UserContext.Provider value={contextValue}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </UserContext.Provider>
  );
}

export default App;
