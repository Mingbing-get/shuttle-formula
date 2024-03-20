import React from 'react'
import ReactDOM from 'react-dom/client'

import Main from './main'

ReactDOM.createRoot(document.getElementById('root') ?? document.body).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
)
