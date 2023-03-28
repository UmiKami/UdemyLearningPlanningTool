import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './views/Home'
import "bootstrap/dist/css/bootstrap.min.css";

document.title = "Udemy Lessons Planning"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
)
