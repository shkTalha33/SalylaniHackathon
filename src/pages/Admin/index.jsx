import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Admin from './Admin'
import Courses from './Courses'
import Attendence from './Attendence'
import Students from './Students'
import Layout from "../../components/Layout"

export default function index() {
  return (
    <>
        <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Admin />} />
          <Route path='/students' element={<Students />} />
          <Route path='/courses' element={<Courses />} />
          <Route path='/attendence' element={<Attendence />} />
        </Route>  
        </Routes>
    </>
  )
}
