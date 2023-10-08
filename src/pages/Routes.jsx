import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Admin from './Admin'
import Sidenav from '../components/Layout'

export default function Index() {
  return (
    <>
  
        <Routes>
            <Route path='/*' element={<Admin />} />
        </Routes>
    </>
  )
}

 