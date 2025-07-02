//  src/main.jsx

import React from 'react'
import ReactDom from "react-dom/client"
import App from "./App.jsx"
import './style.css';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { GoogleOAuthProvider } from '@react-oauth/google';


ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    < GoogleOAuthProvider clientId="334440568550-hafj55daekpjkuc29ev8t0pfjp6mvi4b.apps.googleusercontent.com" >
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider >
  </React.StrictMode >
)