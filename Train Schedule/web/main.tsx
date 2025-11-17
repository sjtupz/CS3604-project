import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { TicketList } from '../src/pages/TicketList/TicketList';
import Login from '../src/pages/Auth/Login';
import Register from '../src/pages/Auth/Register';
import Orders from '../src/pages/Orders/Orders';
import { RootLayout } from '../src/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <TicketList /> },
      { path: 'tickets', element: <TicketList /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'orders', element: <Orders /> },
    ],
  },
]);

const root = createRoot(document.getElementById('root')!);
root.render(<RouterProvider router={router} />);