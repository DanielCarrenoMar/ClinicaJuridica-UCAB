import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useBeneficiary } from './domain/useCaseHooks/useBeneficiary'

function App() {
  const [count, setCount] = useState(0)
  
  // Extraemos addBeneficiary del hook
  const { beneficiaries, loading, error, addBeneficiary } = useBeneficiary()

  const handleCreate = async () => {
  // Ajustamos los campos para que coincidan con la validación del backend
  const nuevo: any = {
    idBeneficiary: "V19332190",
    firstName: "Juan", // Antes era 'name'
    lastName: "Manual",
    email: "juan.manual@example.com", // Campo obligatorio en el controlador
    sex: "M"
  };

  try {
    await addBeneficiary(nuevo);
    console.log("¡Enviado al servidor profesional!");
  } catch (err) {
    console.error("Error en la petición", err);
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