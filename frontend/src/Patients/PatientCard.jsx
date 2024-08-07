import React, {useState} from 'react'
import './PatientCard.css'
import api from '../api'
import ConfirmModal from '../ConfirmModal/ConfirmModal'


export default function PatientCard({patient, onClick}) {
  const [notificationsOn, setNotificationsOn] = useState(patient.notificationsOn)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [conditions, setConditions] = useState(null);
  const [canTurnOff, setCanTurnOff] = useState(true);

  const toggleNotifications = async () => {
    try {
      const response = await api.put(`/api/user/patients/${patient.id}/toggle-notifications`, {}, { withCredentials: true });
      if (response.data.showConfirmationModal) {
        setConditions(response.data.conditions);
        setCanTurnOff(response.data.canTurnOff);
        setShowConfirmationModal(true);
      } else {
        setNotificationsOn(response.data.updatedPatient.notificationsOn);
      }
    } catch (error) {
      console.error('Error toggling notifications:', error.response ? error.response.data : error.message);
    }
  };

  const handleConfirmation = async (confirm) => {
    if (confirm && canTurnOff) {
      try {
        const response = await api.put(`/api/user/patients/${patient.id}/toggle-notifications`, {confirm: true}, { withCredentials: true });
        if (response.data.updatedPatient) {
          setNotificationsOn(response.data.updatedPatient.notificationsOn);
        }
      } catch (error) {
        console.error('Error confirming toggle notifications:', error.response ? error.response.data : error.message);
      }
    }
    setShowConfirmationModal(false);
  };

  const handleCardClick = (e) => {
    if (!showConfirmationModal) {
      onClick(patient.id);
    }
  };

  return (
    <div className='patient-card' onClick={handleCardClick} >
        <div className='profile-picture'>
        {patient.profileImage ? (
            <img src={patient.profileImage} alt="Patient" />
          ) : (
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" alt="Patient" />
          )}
        </div>

        <div className='patient-name'>
            <p>{patient.firstname} {patient.lastname}</p>
        </div>

        <div className='notification-controls'>
          <i className={`fa-regular ${notificationsOn ? 'fa-bell' : 'fa-bell-slash'}`} onClick={(e) => { e.stopPropagation(); toggleNotifications(); }}></i>
        </div>

        {showConfirmationModal && (
          <ConfirmModal
            patient={patient}
            conditions={conditions}
            onConfirm={handleConfirmation}
            canTurnOff={canTurnOff}
            onClose={() => setShowConfirmationModal(false)}
          />
      )}
    </div>
  )
}
