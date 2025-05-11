"use client"

import { useState, useEffect } from "react"
import HotelList from "../components/HotelList.jsx"
import HotelForm from "../components/HotelForm.jsx"
import RoomConfig from "../components/RoomConfig.jsx"
import RoomTypeCards from "../components/RoomTypeCards.jsx"
import { getHotels } from "../services/HotelServices.js"
import "./css/HotelsPage.css"

const HotelsPage = () => {
  const [showModal, setShowModal] = useState(false)
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hotelToEdit, setHotelToEdit] = useState(null)
  const [showRoomConfig, setShowRoomConfig] = useState(false)

  const fetchHotels = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await getHotels()
      if (error) {
        setError(error)
      } else {
        setHotels(data || [])
      }
    } catch (err) {
      setError(err.message || "Error al cargar los hoteles")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [])

  const openModal = (hotel = null) => {
    setHotelToEdit(hotel)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setHotelToEdit(null)
  }

  const handleFormSuccess = () => {
    closeModal()
    fetchHotels() // Recargar la lista después de guardar o actualizar
  }

  const handleDeleteSuccess = () => {
    fetchHotels() // Recargar la lista después de eliminar
  }

  const toggleRoomConfig = () => {
    setShowRoomConfig(!showRoomConfig)
  }

  return (
    <div className="hotels-page-container">
      <div className="page-header-card">
        <div className="hotels-page-header">
          <div className="header-title">
            <svg
              className="header-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
              <path d="M1 21h22" />
              <path d="M7 10.5V7" />
              <path d="M17 10.5V7" />
              <path d="M12 10.5V7" />
              <path d="M7 14.5v-4" />
              <path d="M17 14.5v-4" />
              <path d="M12 14.5v-4" />
            </svg>
            <h1>Hotel Dashboard</h1>
          </div>
          <div className="header-actions">
            <button className="info-button" onClick={toggleRoomConfig}>
              <svg
                className="button-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Información del Sistema
            </button>
            <button className="add-hotel-button" onClick={() => openModal()}>
              <svg
                className="button-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Add New Hotel
            </button>
          </div>
        </div>
      </div>

      {/* Room Configuration Info */}
      {showRoomConfig && <RoomConfig onClose={toggleRoomConfig} />}

      {/* Room Type Cards - Always visible */}
      <div className="section-card">
        <div className="section-header">
          <svg
            className="section-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 4v16" />
            <path d="M22 4v16" />
            <path d="M2 8h20" />
            <path d="M2 16h20" />
            <path d="M12 4v16" />
          </svg>
          <h2>Tipos de Habitaciones Disponibles</h2>
        </div>
        <RoomTypeCards />
      </div>

      {/* Show Hotel List */}
      <div className="section-card">
        <div className="section-header">
          <svg
            className="section-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <h2>Lista de Hoteles</h2>
        </div>
        <div className="hotel-list-wrapper">
          <HotelList
            hotels={hotels}
            loading={loading}
            error={error}
            onEdit={openModal}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </div>
      </div>

      {/* Modal for Hotel Form - Now the form is directly the modal content */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content form-modal">
            <HotelForm hotel={hotelToEdit} onSuccess={handleFormSuccess} onCancel={closeModal} />
          </div>
        </div>
      )}
    </div>
  )
}

export default HotelsPage
