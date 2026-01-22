import React from 'react'


type AgregarListaModalProps = {
  onClose: () => void;
};

export const CrearCampaniaModal = ({ onClose }: AgregarListaModalProps) => {


  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-close" onClick={onClose}>X</div>
        <h2 className="modal-tabs">Crear Nueva Campaña</h2>
        <form className="modal-form">
          <label>Nombre de la Campaña:</label>
          <input type="text" name="nombre" className="modal-input" />
          <label>Descripción:</label>
          <textarea name="descripcion" className="modal-input"></textarea>
          <button type="submit" className="btn btn-primary btn-primary:focus btn-primary:hover mr-2 mb-2">Crear</button>
        </form>
      </div>
    </div>
  )
}
