import Button from '#components/Button.tsx'
import './App.css'
import { useBeneficiary } from './domain/useCaseHooks/useBeneficiary'
import LateralMenuLayer from './layers/LateralMenuLayer'

function App() {
  
  // Usamos el Custom Hook que encapsula la lógica de Clean Architecture
  const { beneficiaries, loading, error } = useBeneficiary()

  return (
    <LateralMenuLayer locationId='home'>
      <Button />
      <Button variant="outlined"/>
      <Button variant="active"/>
      
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
    </LateralMenuLayer>
  )
}

export default App
