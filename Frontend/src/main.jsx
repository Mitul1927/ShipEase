import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routers/routes.jsx';
import { Provider } from 'react-redux';
import store from './reduxStore/store.js';
import './index.css'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <RouterProvider router={router}/>
  </Provider>
)
