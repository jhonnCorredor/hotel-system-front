"use client"

import { useState, useEffect } from "react"
import { getAllowedAccommodations } from "../services/AllowedAccommodationService"
import "./css/RoomTypeCards.css"

const RoomTypeCards = () => {
  const [allowedAccommodations, setAllowedAccommodations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAllowedAccommodations = async () => {
      setLoading(true)
      try {
        const response = await getAllowedAccommodations()
        if (response.error) {
          setError(response.error)
        } else {
          setAllowedAccommodations(response.data || [])
        }
      } catch (err) {
        setError(err.message || "Error al cargar las configuraciones")
      } finally {
        setLoading(false)
      }
    }

    fetchAllowedAccommodations()
  }, [])

  const groupedByRoomType = allowedAccommodations.reduce((acc, item) => {
    if (!item.roomType) return acc

    const roomTypeId = item.roomType.id
    if (!acc[roomTypeId]) {
      acc[roomTypeId] = {
        roomType: item.roomType,
        accommodations: [],
      }
    }

    if (item.accommodation) {
      acc[roomTypeId].accommodations.push(item.accommodation)
    }

    return acc
  }, {})

  if (loading) {
    return (
      <div className="room-types-loading">
        <div className="loading-spinner"></div>
        <p>Cargando tipos de habitaciones...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="room-types-error">
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
            <h4>Error al cargar los tipos de habitaciones</h4>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="room-types-grid">
      {Object.values(groupedByRoomType).map((group) => (
        <div key={group.roomType.id} className="room-type-card">
          <div className="room-type-header">
            <svg
              className="room-type-icon"
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
            <h3>{group.roomType.name}</h3>
          </div>
          <div className="accommodations-list">
            <h4>Acomodaciones permitidas:</h4>
            <ul>
              {group.accommodations.map((accommodation) => (
                <li key={accommodation.id}>
                  <svg
                    className="accommodation-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  {accommodation.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RoomTypeCards
