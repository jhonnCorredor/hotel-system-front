"use client"
import "./css/RoomConfig.css"

const RoomConfig = ({ onClose }) => {
  return (
    <div className="room-config-container">
      <div className="room-config-header">
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
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <h2>Información del Sistema</h2>
        </div>
        <button className="close-button" onClick={onClose}>
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

      <div className="room-config-info">
        <div className="info-card">
          <div className="info-icon">
            <svg
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
          </div>
          <div className="info-content">
            <h3>¿Cómo funciona el sistema?</h3>
            <p>
              Este sistema permite gestionar hoteles y sus habitaciones. Cada hotel tiene un límite máximo de
              habitaciones que puede configurar. Las habitaciones se definen por su tipo y acomodación.
            </p>
            <p>
              <strong>Reglas importantes:</strong>
            </p>
            <ul>
              <li>No se puede superar el límite de habitaciones configurado para el hotel.</li>
              <li>No se pueden repetir combinaciones de tipo de habitación y acomodación.</li>
              <li>
                Solo se permiten las combinaciones de tipo y acomodación mostradas en las tarjetas de tipos de
                habitaciones.
              </li>
            </ul>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <svg
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
          </div>
          <div className="info-content">
            <h3>Instrucciones de uso</h3>
            <p>Para gestionar los hoteles de manera efectiva, siga estas instrucciones:</p>
            <ol>
              <li>Utilice el botón "Add New Hotel" para crear un nuevo hotel.</li>
              <li>Complete todos los campos requeridos en el formulario.</li>
              <li>Configure las habitaciones según los tipos y acomodaciones permitidos.</li>
              <li>Puede editar o eliminar hoteles existentes desde la lista de hoteles.</li>
              <li>Verifique que la cantidad total de habitaciones no supere el límite establecido.</li>
            </ol>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <svg
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
          </div>
          <div className="info-content">
            <h3>Sobre los tipos de habitaciones</h3>
            <p>
              Los tipos de habitaciones y sus acomodaciones permitidas están predefinidos en el sistema. Cada tipo de
              habitación puede tener una o más acomodaciones permitidas.
            </p>
            <p>
              Al configurar un hotel, solo podrá seleccionar las combinaciones de tipo de habitación y acomodación que
              se muestran en las tarjetas de tipos de habitaciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomConfig
