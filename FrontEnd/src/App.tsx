import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useBeneficiary } from './domain/useCaseHooks/useBeneficiary'
import type { Beneficiary } from "./domain/models/beneficiary";

function App() {
  const [count, setCount] = useState(0)
  
  // Extraemos addBeneficiary del hook
  const { beneficiaries, loading, error, addBeneficiary } = useBeneficiary()

  //Ejemplo de enviar información a express.
  const handleCreate = async () => {
    let nuevo: Beneficiary = {
      idBeneficiary: "V19332190",
      name: "Juan",
      lastName: "Manual",
      sex: "M"
    };

    try {
      await addBeneficiary(nuevo);
      console.log("¡Agregado!");
    } catch (err) {
      console.error("Fallo al agregar", err);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>

      <div className="card">
        <h1>Lista de Beneficiarios</h1>

        {/* BOTÓN PARA AGREGAR DIRECTAMENTE */}
        <button 
          onClick={handleCreate} 
          style={{ marginBottom: '20px', backgroundColor: '#646cff', color: 'white' }}
        >
          + Agregar Beneficiario de Prueba
        </button>
        
        {loading && <p>Cargando...</p>}
        {error && <p style={{color: 'red'}}>Error: {error.message}</p>}
      
        {!loading && !error && (
          <ul>
            {beneficiaries.map((beneficiary) => (
              <li key={beneficiary.idBeneficiary} style={{ textAlign: 'left', marginBottom: '10px' }}>
                <strong>{beneficiary.name} {beneficiary.lastName}</strong>
                <br />
                <small>ID: {beneficiary.idBeneficiary} | Sexo: {beneficiary.sex}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default App