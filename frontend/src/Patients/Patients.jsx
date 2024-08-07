import './Patients.css'
import Navbar from '../Navbar/Navbar'
import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from '../UserContext'
import PatientCard from './PatientCard'
import PatientProfileModal from './PatientProfileModal'
import api from '../api'
import HeroSection from '../HeroSection'
import Footer from '../Footer/Footer'

export default function Patients() {
  const {user} = useContext(UserContext)
  const [patients, setPatients] = useState([])
  const [isProfileModalOpen, setProfileModalOpen] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState(null)
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  //fetching all patients from the DB & necessary filtering
  useEffect(() => {
    const fetchPatients = async () => {
      try{
        const response = await api.get('api/user/patients', {withCredentials: true})
        setPatients(response.data)
        setFilteredPatients(response.data);
      } catch (error){
        console.error('Error fetching patients:', error.response ? ErrorEvent.response.data : error.message)
      }
    }
    fetchPatients()
  }, [])

  useEffect(() => {
    const results = patients.filter(patient =>
      `${patient.firstname} ${patient.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(results);
  }, [searchQuery, patients]);

  const handlePatientEdit = (patient) => {
    setSelectedPatientId(patient.id);
    setProfileModalOpen(true);
  };

  const handlePatientClick = (id) => {
    setSelectedPatientId(id);
    setProfileModalOpen(true);
  };

  return (
    <>
        <Navbar />

        <main>
            <HeroSection title={`HEY DR. ${user.username}!`} />

            <div className='PatientSearch'>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                placeholder='Find a patient'
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <section className='patientlist'>
              <div className='patientHeadline'>
                <h3>Your Patients</h3>
              </div>

              {filteredPatients.map((patient) => (
                <PatientCard
                  key ={patient.id}
                  patient={patient}
                  onClick={handlePatientClick}
                  onEdit={handlePatientEdit}/>
              ))}

              <PatientProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setProfileModalOpen(false)}
                    patientId={selectedPatientId}
              />
            </section>

            <Footer/>
      </main>
    </>
  )
}
