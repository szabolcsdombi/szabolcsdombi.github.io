import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { TopBar } from './topbar';
import { Footer } from './footer';
import { Home } from './home';

export const Root = ({ children }) => {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#181818',
      }}
    >
      <TopBar />
      {children}
      <div style={{ flexGrow: 1 }} />
      <Footer />
    </main>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Root>
        <Outlet />
      </Root>
    ),
    errorElement: (
      <Root>
        Not found
      </Root>
    ),
    children: [
      {
        path: '',
        element: <Home />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render((
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
));
