import { useNavigate, useParams } from 'react-router'
import { UserCircle, User, Clock } from "flowbite-react-icons/outline"
import { File } from "flowbite-react-icons/solid"
import CaseActionCard from '#components/CaseActionCard.tsx'
import Tabs from '#components/Tabs.tsx'
import type { CaseActionModel } from '#domain/models/caseAction.ts'

const mockActions: CaseActionModel[] = [
  { 
    idCase: 1, 
    caseCompoundKey: 'GY_24_24_01', 
    actionNumber: 1, 
    description: 'Actualización de expediente: Incorporación de boleta de notificación.', 
    userId: '1', 
    userName: 'Pedro Enrrique Calderon Valencia', 
    registryDate: new Date('2024-10-10') 
  },
  { 
    idCase: 2, 
    caseCompoundKey: 'GY_24_24_02', 
    actionNumber: 1, 
    description: 'Actualización de expediente: Incorporación de boleta de notificación.', 
    userId: '1', 
    userName: 'Pedro Enrrique Calderon Valencia', 
    registryDate: new Date('2024-11-01') 
  },
  { 
    idCase: 3, 
    caseCompoundKey: 'GY_24_24_03', 
    actionNumber: 1, 
    description: 'Actualización de expediente: Incorporación de boleta de notificación.', 
    userId: '1', 
    userName: 'Pedro Enrrique Calderon Valencia', 
    registryDate: new Date('2024-11-01') 
  },
  { 
    idCase: 4, 
    caseCompoundKey: 'GY_24_24_04', 
    actionNumber: 1, 
    description: 'Actualización de expediente: Incorporación de boleta de notificación.', 
    userId: '1', 
    userName: 'Pedro Enrrique Calderon Valencia', 
    registryDate: new Date('2024-11-01') 
  },
  { 
    idCase: 5, 
    caseCompoundKey: 'GY_24_24_05', 
    actionNumber: 1, 
    description: 'Actualización de expediente: Incorporación de boleta de notificación.', 
    userId: '1', 
    userName: 'Pedro Enrrique Calderon Valencia', 
    registryDate: new Date('2024-11-01') 
  },
]

function AccionesRealizadas() {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()

  const handleActionClick = (action: CaseActionModel) => {
    console.log('Action clicked:', action.caseCompoundKey)
    navigate(`/caso/${action.idCase}`)
  }

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
      <div className="container mx-auto px-6 py-8 h-full flex flex-col">
        {/* Header - empty now that icons are removed */}
        <div className="flex justify-end items-center mb-8">
        </div>

        {/* User info header */}
        <div className="w-full p-4 bg-white/70 rounded-2xl mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCircle className="w-7 h-7 text-[#10141A]" />
              <div className="flex flex-col">
                <div className="text-[22px] font-normal text-[#10141A]">Pedro Enrrique Calderon Valencia</div>
                <div className="flex items-center gap-5">
                  <div className="text-[13px] font-medium text-[#10141A]">Cedula</div>
                  <div className="text-[13px] font-normal text-[#10141A]">{userId || '31552270'}</div>
                  <div className="text-[13px] font-medium text-[#10141A]">Rol</div>
                  <div className="text-[13px] font-normal text-[#10141A]">Profesor</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-[13px] font-medium text-[#10141A]">Estado:</div>
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-[13px] font-medium">
                Activo
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs 
          selectedId="acciones-realizadas"
          className="mb-6"
        >
          <Tabs.Item 
            id="general" 
            label="General" 
            icon={<User className="w-5 h-5" />}
            onClick={() => navigate(`/usuario/${userId}/general`)}
          />
          <Tabs.Item 
            id="casos-asociados" 
            label="Casos Asociados" 
            icon={<File className="w-5 h-5" />}
            onClick={() => navigate(`/usuario/${userId}/casos-asociados`)}
          />
          <Tabs.Item 
            id="acciones-realizadas" 
            label="Acciones Realizadas" 
            icon={<Clock className="w-5 h-5" />}
            onClick={() => navigate(`/usuario/${userId}/acciones-realizadas`)}
          />
        </Tabs>

        {/* Actions list */}
        <div className="flex-1 overflow-y-auto bg-white/40 rounded-xl p-4">
          <div className="grid grid-cols-1 gap-4">
            {mockActions.map((action) => (
              <CaseActionCard
                key={`${action.idCase}-${action.actionNumber}`}
                caseAction={action}
                onClick={() => handleActionClick(action)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccionesRealizadas
