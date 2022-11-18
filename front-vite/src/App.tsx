import './App.css';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import StreetsConfiguration from './view/SteetsConfiguration';
import Main from './view/Main';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
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
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
