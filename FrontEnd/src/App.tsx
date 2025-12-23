import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useBeneficiary } from './domain/useCaseHooks/useBeneficiary'
import ButtonText from './components/ButtonText'
import { Button } from './components/Button'

function App() {
  const [count, setCount] = useState(0)
  
  // Usamos el Custom Hook que encapsula la lógica de Clean Architecture
  const { beneficiaries, loading, error } = useBeneficiary()

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
      <ButtonText title="Agregar Beneficiario"/>
      <ButtonText title="Agregar Beneficiario" variant="outlined" />
      <Button />
      <Button variant="outlined"/>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className="card">
      <h1>Lista de Beneficiarios</h1>
      
      {/* Renderizado condicional más limpio */}
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
