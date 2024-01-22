import React, { useState } from 'react'
import axios from 'axios'
import {
  Button, Container, Form, Nav, Navbar
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import Driver from './components/Driver.jsx'
import DriverDashboard from './components/DriverDashboard.jsx'
import DriverDetail from './components/DriverDetail.jsx'
import Landing from './components/Landing.jsx'
import LogIn from './components/LogIn.jsx'
import Rider from './components/Rider.jsx'
import RiderDashboard from './components/RiderDashboard.jsx'
import RiderDetail from './components/RiderDetail.jsx'
import RiderRequest from './components/RiderRequest.jsx'
import SignUp from './components/SignUp.jsx'
import { isRider } from './services/AuthService.js'

import 'react-toastify/dist/ReactToastify.css'
import './App.css'

export default function App () {
  const [isLoggedIn, setLoggedIn] = useState(() => {
    return window.localStorage.getItem('taxi.auth') !== null
  })

  const logIn = async (username, password) => {
    const url = `${import.meta.env.VITE_BASE_URL}/api/log_in/`
    try {
      const response = await axios.post(url, { username, password })
      window.localStorage.setItem(
        'taxi.auth', JSON.stringify(response.data)
      )
      setLoggedIn(true)
      return { response, isError: false }
    }
    catch (error) {
      console.error(error)
      return { response: error, isError: true }
    }
  }

  const logOut = () => {
    window.localStorage.removeItem('taxi.auth')
    setLoggedIn(false)
  }

  const router = createHashRouter([
    {
      path: '/',
      element: <Layout isLoggedIn={isLoggedIn} logOut={logOut} />,
      children: [
        {
          path: '',
          element: <Landing isLoggedIn={isLoggedIn} />,
        },
        {
          path: 'sign-up',
          element: <SignUp isLoggedIn={isLoggedIn} />,
        },
        {
          path: 'log-in',
          element: <LogIn isLoggedIn={isLoggedIn} logIn={logIn} />,
        },
        {
          path: 'rider',
          element: <Rider />,
          children: [
            {
              path: '',
              element: <RiderDashboard />,
            },
            {
              path: 'request',
              element: <RiderRequest />,
            },
            {
              path: ':id',
              element: <RiderDetail />,
            },
          ],
        },
        {
          path: 'driver',
          element: <Driver />,
          children: [
            {
              path: '',
              element: <DriverDashboard />,
            },
            {
              path: ':id',
              element: <DriverDetail />,
            },
          ],
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}

function Layout ({ isLoggedIn, logOut }) {
  return (
    <>
      <Navbar bg='light' expand='lg' variant='light'>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand className='logo'>Taxi</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse>
            {/* new */}
            {
              isRider() && (
                <Nav className='me-auto'>
                  <LinkContainer to='/rider/request'>
                    <Nav.Link data-cy='request-trip'>Request a trip</Nav.Link>
                  </LinkContainer>
                </Nav>
              )
            }
            {
              isLoggedIn && (
                <Form className='ms-auto'>
                  <Button type='button' onClick={() => logOut()}>Log out</Button>
                </Form>
              )
            }
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className='pt-3'>
        <Outlet />
      </Container>
      <ToastContainer />
    </>
  )
}
