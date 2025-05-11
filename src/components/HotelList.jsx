"use client"

import { useState } from "react"
import { deleteHotel } from "../services/hotelServices"
import "./css/HotelList.css"

const HotelList = ({ hotels = [], loading, error, onEdit, onDeleteSuccess }) => {
  const [expandedHotelId, setExpandedHotelId] = useState(null)
  const [deletingHotelId, setDeletingHotelId] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [hotelToDelete, setHotelToDelete] = useState(null)

  const handleRowClick = (hotelId) => {
    setExpandedHotelId((prevId) => (prevId === hotelId ? null : hotelId))
  }

  const handleEditClick = (hotel, e) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(hotel)
    }
  }

  const confirmDelete = (hotel, e) => {
    e.stopPropagation()
    setHotelToDelete(hotel)
    setShowConfirmation(true)
  }

  const cancelDelete = () => {
    setShowConfirmation(false)
    setHotelToDelete(null)
  }

  const handleDelete = async () => {
    if (!hotelToDelete) return

    setDeletingHotelId(hotelToDelete.id)
    setDeleteError(null)

    try {
      const { error } = await deleteHotel(hotelToDelete.id)
      if (error) {
        setDeleteError(`Error al eliminar: ${error}`)
      } else {
        if (onDeleteSuccess) {
          onDeleteSuccess()
        }
      }
    } catch (err) {
      setDeleteError(`Error al eliminar: ${err.message}`)
    } finally {
      setDeletingHotelId(null)
      setShowConfirmation(false)
      setHotelToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando hoteles...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <svg
            className="error-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <h4>Error al cargar los hoteles</h4>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (deleteError) {
    return (
      <div className="error-container">
        <div className="error-content">
          <svg
            className="error-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <h4>Error</h4>
            <p>{deleteError}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="hotel-list-container">

      {showConfirmation && hotelToDelete && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Estás seguro de que deseas eliminar el hotel <strong>{hotelToDelete.name}</strong>?
            </p>
            <p className="warning-text">Esta acción no se puede deshacer.</p>
            <div className="confirmation-actions">
              <button className="cancel-button" onClick={cancelDelete}>
                Cancelar
              </button>
              <button className="delete-confirm-button" onClick={handleDelete} disabled={deletingHotelId !== null}>
                {deletingHotelId === hotelToDelete.id ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="hotel-cards">
        {hotels.length === 0 ? (
          <div className="empty-state">
            <svg
              className="empty-icon"
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
            <p>No hay hoteles disponibles</p>
          </div>
        ) : (
          hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-card-header">
                <div className="hotel-info">
                  <h3 className="hotel-name">{hotel.name}</h3>
                  <div className="hotel-address">
                    <svg
                      className="address-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>
                      {hotel.address}, {hotel.city}
                    </span>
                  </div>
                  <p className="hotel-nit">NIT: {hotel.id}</p>
                </div>
                <div className="hotel-meta">
                  <div className="hotel-rooms-badge">
                    Habitaciones: <span>{hotel.roomLimit}</span>
                  </div>
                  <div className="hotel-actions">
                    <button
                      className="btn btn-details"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRowClick(hotel.id)
                      }}
                    >
                      {expandedHotelId === hotel.id ? (
                        <>
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
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                          Ocultar
                        </>
                      ) : (
                        <>
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
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                          Ver Detalles
                        </>
                      )}
                    </button>
                    <button className="btn btn-edit" onClick={(e) => handleEditClick(hotel, e)}>
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
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={(e) => confirmDelete(hotel, e)}
                      disabled={deletingHotelId === hotel.id}
                    >
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
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                      {deletingHotelId === hotel.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </div>
              </div>

              {expandedHotelId === hotel.id && (
                <div className="hotel-rooms-container">
                  <div className="rooms-header">
                    <svg
                      className="rooms-icon"
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
                    </svg>
                    <h4 className="rooms-title">Habitaciones</h4>
                  </div>
                  <div className="rooms-table-container">
                    <table className="rooms-table">
                      <thead>
                        <tr>
                          <th>Tipo de Habitación</th>
                          <th>Acomodación</th>
                          <th>Cantidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hotel.rooms && hotel.rooms.length > 0 ? (
                          hotel.rooms.map((room) => (
                            <tr key={room.id}>
                              <td className="room-type">{room.roomType?.name}</td>
                              <td>{room.accommodation?.name}</td>
                              <td className="quantity-cell">{room.quantity}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="no-rooms">
                              No hay habitaciones disponibles
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default HotelList
