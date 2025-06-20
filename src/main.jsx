//  src/main.jsx

import React from 'react'
import ReactDom from "react-dom/client"
import App from "./App.jsx"
import './style.css';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store'


ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
       <App/>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)