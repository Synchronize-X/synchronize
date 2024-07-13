import './Navbar.css'
import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../UserContext'
import api from '../api'
import NotificationCard from '../Notifications/NotificationCard'
import { WebSocketContext } from '../contexts/WebSocketContext'

export default function Navbar() {
  const { user, updateUser } = useContext(UserContext);
  const { notification } = useContext(WebSocketContext);
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/api/user/logout', {}, { withCredentials: true });
      updateUser(null);
      navigate('/');
      alert("Successfully Logged Out")
    } catch (error) {
      console.error('Error logging out:', error.response ? error.response.data : error.message);
    }
  };


  return (
    <nav className='navbar'>
      {user ? (
        <>
          <Link to="/" onClick={handleLogout}>Sign Out</Link>
          <Link to="/">Home</Link>
          {user.role === 'patient' && <Link to="/myprofile">My Profile</Link>}
          {user.role !== 'patient' && <Link to="/patients">Patients</Link>}
          <Link to="/notifications">Notifications
            {notification ?
              <span className='notificationAlert'>{notification.message.slice(0, 10)}...</span>
              : null
            }
          </Link>
          <Link to="/discover">Discover</Link>
        </>
      ) : (
        <>
          <Link to="/login">Sign In</Link>
          <Link to="/">Home</Link>
          <Link to="/discover">Discover</Link>
        </>
      )}

    </nav>
  )
}
