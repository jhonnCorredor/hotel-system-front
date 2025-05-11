"use client"

import { useState, useEffect } from "react"
import { saveOrUpdateHotel } from "../services/hotelServices.js"
import { getAllowedAccommodations } from "../services/AllowedAccommodationService.js"
import "./css/HotelForm.css"

const HotelForm = ({ hotel = null, onSuccess, onCancel }) => {
  const [hotelData, setHotelData] = useState({
    name: "",
    address: "",
    city: "",
    taxId: "",
    roomLimit: 0,
    rooms: [],
  })

  const [allowedAccommodations, setAllowedAccommodations] = useState([])
  const [selectedRoomType, setSelectedRoomType] = useState("")
  const [selectedAccommodation, setSelectedAccommodation] = useState("")
  const [quantity, setQuantity] = useState(0)

  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Cargar datos del hotel si estamos en modo edición
  useEffect(() => {
    if (hotel) {
      setHotelData({
        id: hotel.id,
        name: hotel.name || "",
        address: hotel.address || "",
        city: hotel.city || "",
        taxId: hotel.taxId || "",
        roomLimit: hotel.roomLimit || 0,
        rooms: hotel.rooms || [],
      })
    }
  }, [hotel])

  useEffect(() => {
    const fetchAllowedAccommodations = async () => {
      const response = await getAllowedAccommodations()
      if (response.error) {
        setError(response.error)
      } else {
        setAllowedAccommodations(response.data || [])
      }
    }

    fetchAllowedAccommodations()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    // Validación específica para roomLimit (solo números)
    if (name === "roomLimit") {
      const numericValue = value === "" ? 0 : Number.parseInt(value, 10)
      if (isNaN(numericValue)) return

      setHotelData({
        ...hotelData,
        [name]: numericValue,
      })

      // Validar si el límite es menor que las habitaciones configuradas
      validateRoomLimit(numericValue)
    } else {
      setHotelData({
        ...hotelData,
        [name]: value,
      })
    }
  }

  const validateRoomLimit = (limit) => {
    const totalRooms = hotelData.rooms.reduce((sum, room) => sum + room.quantity, 0)

    if (totalRooms > limit) {
      setValidationErrors({
        ...validationErrors,
        roomLimit: `El límite de habitaciones (${limit}) es menor que el total configurado (${totalRooms})`,
      })
    } else {
      const newErrors = { ...validationErrors }
      delete newErrors.roomLimit
      setValidationErrors(newErrors)
    }
  }

  const handleRoomTypeChange = (e) => {
    setSelectedRoomType(e.target.value)
    setSelectedAccommodation("")
  }

  const handleAccommodationChange = (e) => {
    setSelectedAccommodation(e.target.value)
  }

  const handleQuantityChange = (e) => {
    const value = e.target.value
    // Solo permitir números
    if (value === "" || /^\d+$/.test(value)) {
      setQuantity(value === "" ? "" : Number(value))
    }
  }

  const validateNewRoom = () => {
    if (!selectedRoomType) {
      return "Debe seleccionar un tipo de habitación"
    }
    if (!selectedAccommodation) {
      return "Debe seleccionar una acomodación"
    }
    if (!quantity || quantity <= 0) {
      return "La cantidad debe ser mayor a 0"
    }

    // Verificar si ya existe la combinación de tipo y acomodación
    const isDuplicate = hotelData.rooms.some(
      (room) =>
        room.roomType.id === Number.parseInt(selectedRoomType) &&
        room.accommodation.id === Number.parseInt(selectedAccommodation),
    )

    if (isDuplicate) {
      return "Ya existe esta combinación de tipo de habitación y acomodación"
    }

    // Verificar si supera el límite de habitaciones
    const totalRooms = hotelData.rooms.reduce((sum, room) => sum + room.quantity, 0) + Number(quantity)
    if (totalRooms > hotelData.roomLimit) {
      return `El total de habitaciones (${totalRooms}) supera el límite configurado (${hotelData.roomLimit})`
    }

    return null
  }

  const addRoom = () => {
    const validationError = validateNewRoom()
    if (validationError) {
      setError(validationError)
      setTimeout(() => setError(null), 3000)
      return
    }

    const newRoom = {
      roomType: { id: Number.parseInt(selectedRoomType) },
      accommodation: { id: Number.parseInt(selectedAccommodation) },
      quantity: Number(quantity),
    }

    setHotelData({
      ...hotelData,
      rooms: [...hotelData.rooms, newRoom],
    })

    setSelectedRoomType("")
    setSelectedAccommodation("")
    setQuantity("")
  }

  const removeRoom = (index) => {
    const updatedRooms = hotelData.rooms.filter((_, i) => i !== index)
    setHotelData({
      ...hotelData,
      rooms: updatedRooms,
    })

    // Revalidar el límite de habitaciones
    validateRoomLimit(hotelData.roomLimit)
  }

  const validateForm = () => {
    const errors = {}

    if (!hotelData.name.trim()) {
      errors.name = "El nombre del hotel es requerido"
    }

    if (!hotelData.address.trim()) {
      errors.address = "La dirección es requerida"
    }

    if (!hotelData.city.trim()) {
      errors.city = "La ciudad es requerida"
    }

    if (!hotelData.taxId.trim()) {
      errors.taxId = "El NIT/ID Fiscal es requerido"
    }

    if (!hotelData.roomLimit || hotelData.roomLimit <= 0) {
      errors.roomLimit = "El límite de habitaciones debe ser mayor a 0"
    }

    const totalRooms = hotelData.rooms.reduce((sum, room) => sum + room.quantity, 0)
    if (totalRooms > hotelData.roomLimit) {
      errors.roomLimit = `El total de habitaciones (${totalRooms}) supera el límite configurado (${hotelData.roomLimit})`
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar el formulario
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setValidationErrors(formErrors)
      return
    }

    setValidationErrors({})
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await saveOrUpdateHotel(hotelData)
      if (response.error) {
        setError(response.error)
      } else {
        setShowSuccessModal(true)
      }
    } catch (err) {
      setError(err.message || "Error al guardar el hotel")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false)
    if (onSuccess) onSuccess()
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
  }

  const uniqueRoomTypes = [...new Set(allowedAccommodations.map((item) => item?.roomType?.id).filter(Boolean))]

  const filteredAccommodations = allowedAccommodations.filter(
    (item) => item?.roomType?.id === Number.parseInt(selectedRoomType),
  )

  // Helper function to get room type name by ID
  const getRoomTypeName = (id) => {
    const roomType = allowedAccommodations.find((item) => item?.roomType?.id === id)?.roomType
    return roomType ? roomType.name : id
  }

  // Helper function to get accommodation name by ID
  const getAccommodationName = (id) => {
    const accommodation = allowedAccommodations.find((item) => item?.accommodation?.id === id)?.accommodation
    return accommodation ? accommodation.name : id
  }

  return (
    <div className="hotel-form-container">
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-icon-container">
              <svg
                className="success-icon"
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
            </div>
            <h3>¡Operación exitosa!</h3>
            <p>
              {hotel
                ? `El hotel "${hotelData.name}" ha sido actualizado correctamente.`
                : `El hotel "${hotelData.name}" ha sido registrado correctamente.`}
            </p>
            <div className="success-actions">
              <button className="success-confirm-button" onClick={handleSuccessConfirm}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="hotel-card">
        <div className="hotel-card-header">
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
              <path d="M3 14l.5-.5 3-3 .5-.5 1 1-.5.5-3 3-.5.5-1-1z" />
              <path d="M10 10l.5-.5 3-3 .5-.5 1 1-.5.5-3 3-.5.5-1-1z" />
              <rect x="2" y="16" width="20" height="6" rx="2" />
              <path d="M4 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8" />
            </svg>
            <h2 className="card-title">{hotel ? "Editar Hotel" : "Registro de Hotel"}</h2>
          </div>
          <p className="card-description">
            {hotel ? `Editando hotel: ${hotel.name}` : "Ingrese los datos del hotel y configure sus habitaciones"}
          </p>
          <button className="close-form-button" onClick={handleCancel}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="card-content">
          {error && (
            <div className="alert error-alert">
              <h4>Error</h4>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <svg
                    className="label-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                    <path d="M9 18V9" />
                    <path d="M15 18V9" />
                  </svg>
                  Nombre del hotel
                </label>
                <input
                  id="name"
                  name="name"
                  value={hotelData.name}
                  onChange={handleChange}
                  placeholder="Ej: Hotel Decameron Cartagena"
                  className={`form-input ${validationErrors.name ? "input-error" : ""}`}
                  required
                />
                {validationErrors.name && <div className="error-message">{validationErrors.name}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  <svg
                    className="label-icon"
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
                  Dirección
                </label>
                <input
                  id="address"
                  name="address"
                  value={hotelData.address}
                  onChange={handleChange}
                  placeholder="Ej: Calle 23 58-25"
                  className={`form-input ${validationErrors.address ? "input-error" : ""}`}
                  required
                />
                {validationErrors.address && <div className="error-message">{validationErrors.address}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="city" className="form-label">
                  <svg
                    className="label-icon"
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
                  Ciudad
                </label>
                <input
                  id="city"
                  name="city"
                  value={hotelData.city}
                  onChange={handleChange}
                  placeholder="Ej: Cartagena"
                  className={`form-input ${validationErrors.city ? "input-error" : ""}`}
                  required
                />
                {validationErrors.city && <div className="error-message">{validationErrors.city}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="taxId" className="form-label">
                  <svg
                    className="label-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  NIT / ID Fiscal
                </label>
                <input
                  id="taxId"
                  name="taxId"
                  value={hotelData.taxId}
                  onChange={handleChange}
                  placeholder="Ej: 12345678-9"
                  className={`form-input ${validationErrors.taxId ? "input-error" : ""}`}
                  required
                />
                {validationErrors.taxId && <div className="error-message">{validationErrors.taxId}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="roomLimit" className="form-label">
                  <svg
                    className="label-icon"
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
                  Límite de habitaciones
                </label>
                <input
                  id="roomLimit"
                  name="roomLimit"
                  type="number"
                  value={hotelData.roomLimit || ""}
                  onChange={handleChange}
                  placeholder="Ej: 42"
                  className={`form-input ${validationErrors.roomLimit ? "input-error" : ""}`}
                  min="1"
                  required
                />
                {validationErrors.roomLimit && <div className="error-message">{validationErrors.roomLimit}</div>}
              </div>
            </div>

            <div className="separator"></div>

            <div className="rooms-section">
              <h3 className="section-title">
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
                Configuración de Habitaciones
              </h3>

              <div className="rooms-grid">
                <div className="form-group">
                  <label htmlFor="roomType" className="form-label">
                    Tipo de habitación
                  </label>
                  <select
                    id="roomType"
                    value={selectedRoomType}
                    onChange={handleRoomTypeChange}
                    className="form-select"
                  >
                    <option value="">Seleccionar tipo</option>
                    {uniqueRoomTypes.map((roomTypeId) => {
                      const roomType = allowedAccommodations.find((item) => item?.roomType?.id === roomTypeId)?.roomType
                      if (!roomType) return null
                      return (
                        <option key={roomType.id} value={roomType.id.toString()}>
                          {roomType.name}
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="accommodation" className="form-label">
                    Acomodación
                  </label>
                  <select
                    id="accommodation"
                    value={selectedAccommodation}
                    onChange={handleAccommodationChange}
                    disabled={!selectedRoomType}
                    className="form-select"
                  >
                    <option value="">Seleccionar acomodación</option>
                    {filteredAccommodations.map((item) => (
                      <option key={item.accommodation.id} value={item.accommodation.id.toString()}>
                        {item.accommodation.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="quantity" className="form-label">
                    Cantidad
                  </label>
                  <div className="quantity-container">
                    <input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      placeholder="Cantidad"
                      min="1"
                      className="form-input"
                    />
                    <button type="button" onClick={addRoom} className="add-button">
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
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {hotelData.rooms.length > 0 && (
              <div className="table-container">
                <table className="rooms-table">
                  <caption>Habitaciones configuradas</caption>
                  <thead>
                    <tr>
                      <th>Tipo de Habitación</th>
                      <th>Acomodación</th>
                      <th className="quantity-column">Cantidad</th>
                      <th className="actions-column">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotelData.rooms.map((room, index) => (
                      <tr key={index}>
                        <td className="room-type-cell">{getRoomTypeName(room.roomType.id)}</td>
                        <td>{getAccommodationName(room.accommodation.id)}</td>
                        <td className="quantity-column">{room.quantity}</td>
                        <td className="actions-column">
                          <button
                            type="button"
                            onClick={() => removeRoom(index)}
                            className="delete-button"
                            aria-label="Eliminar habitación"
                          >
                            <svg
                              className="delete-icon"
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
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="card-footer">
              <button type="button" className="cancel-button" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : hotel ? "Actualizar Hotel" : "Guardar Hotel"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default HotelForm

