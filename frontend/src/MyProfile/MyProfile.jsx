import './MyProfile.css'
import Navbar from '../Navbar/Navbar'
import {UserContext} from '../UserContext'
import ProfileCard from './ProfileCard'
import React, { useContext, useState } from 'react'
import ProfileModal from './ProfileModal'
import api from '../api';

export default function MyProfile() {
  const {user, updateUser} = useContext(UserContext)
  const [isModalOpen, setModalOpen] = useState(false);
  const [profileCreated, setProfileCreated] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleSubmitPatientInfo = async (e, formData) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/user/myprofile', formData, { withCredentials: true });
      updateUser({ ...user, patient: response.data });
      setProfileCreated(true);
      handleModalClose();
      alert('Profile Created Successfully')
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };


  return (
    <>
      <Navbar/>

      <main>
        <section className="myprofilehero">
            <video className="video-background" autoPlay loop muted>
              <source src="../images/hero.mp4" type="video/mp4" />
            </video>
            <div className="hero-content">
              {user ? <h1>HEY {user.username} !</h1>: ''}
            </div>
        </section>

        <section className='myinfo'>
          <ProfileCard/>
          {!profileCreated && <button onClick={handleModalOpen}>Create Profile</button>}
          <ProfileModal isOpen={isModalOpen} onClose={handleModalClose} handleSubmitPatientInfo={handleSubmitPatientInfo}/>
            {/* TODO: Add form for patients to enter personal info */}
        </section>

        <section className='calender'>
            {/* TODO: Integrate Calender API */}
        </section>

      </main>
    </>
  )
}
