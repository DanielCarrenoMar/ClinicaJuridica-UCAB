import { useNavigate, useParams } from 'react-router'
import { UserCircle, User, Clock } from "flowbite-react-icons/outline"
import { File } from "flowbite-react-icons/solid"
import CaseCard from '#components/CaseCard.tsx'
import Tabs from '#components/Tabs.tsx'
import type { CaseModel } from '#domain/models/case.ts'
import type { CaseStatusTypeModel } from '#domain/typesModel.ts'

const mockCases: CaseModel[] = [
  { 
    idCase: 1, 
    compoundKey: 'GY_24_24_01', 
    problemSummary: 'Descripccion del casos bla bla bla bla bla bla bla blabla bla bla bla bla blavbla ...', 
    createdAt: new Date('2024-10-10'), 
    caseStatus: 'Abierto' as CaseStatusTypeModel, 
    processType: 'Asesoría' as any, 
    applicantId: '1', 
    idNucleus: '1', 
    term: '2024-II', 
    idLegalArea: 1, 
    applicantName: 'Juan Pérez', 
    legalAreaName: 'Derecho Laboral', 
    teacherName: 'Pedro Enrrique Calderon Valencia', 
    lastActionDate: new Date('2024-11-01'), 
    lastActionDescription: 'Actualización de expediente', 
    subjectName: 'Despido injustificado', 
    subjectCategoryName: 'Laboral' 
  },
  { 
    idCase: 2, 
    compoundKey: 'GY_24_24_02', 
    problemSummary: 'Descripccion del casos bla bla bla bla bla bla bla blabla bla bla bla bla blavbla ...', 
    createdAt: new Date('2024-11-01'), 
    caseStatus: 'En Espera' as CaseStatusTypeModel, 
    processType: 'Asesoría' as any, 
    applicantId: '2', 
    idNucleus: '1', 
    term: '2024-II', 
    idLegalArea: 2, 
    applicantName: 'María González', 
    legalAreaName: 'Derecho Familiar', 
    teacherName: 'Pedro Enrrique Calderon Valencia', 
    lastActionDate: new Date('2024-11-01'), 
    lastActionDescription: 'Revisión de documentos', 
    subjectName: 'Pensión alimenticia', 
    subjectCategoryName: 'Familiar' 
  },
  { 
    idCase: 3, 
    compoundKey: 'GY_24_24_03', 
    problemSummary: 'Descripccion del casos bla bla bla bla bla bla bla blabla bla bla bla bla blavbla ...', 
    createdAt: new Date('2024-11-01'), 
    caseStatus: 'Abierto' as CaseStatusTypeModel, 
    processType: 'Asesoría' as any, 
    applicantId: '3', 
    idNucleus: '1', 
    term: '2024-II', 
    idLegalArea: 3, 
    applicantName: 'Carlos Rodríguez', 
    legalAreaName: 'Derecho Civil', 
    teacherName: 'Pedro Enrrique Calderon Valencia', 
    lastActionDate: new Date('2024-11-01'), 
    lastActionDescription: 'Citación a audiencia', 
    subjectName: 'Contrato incumplido', 
    subjectCategoryName: 'Civil' 
  },
  { 
    idCase: 4, 
    compoundKey: 'GY_24_24_04', 
    problemSummary: 'Descripccion del casos bla bla bla bla bla bla bla blabla bla bla bla bla blavbla ...', 
    createdAt: new Date('2024-11-01'), 
    caseStatus: 'Cerrado' as CaseStatusTypeModel, 
    processType: 'Asesoría' as any, 
    applicantId: '4', 
    idNucleus: '1', 
    term: '2024-II', 
    idLegalArea: 4, 
    applicantName: 'Ana Martínez', 
    legalAreaName: 'Derecho Penal', 
    teacherName: 'Pedro Enrrique Calderon Valencia', 
    lastActionDate: new Date('2024-11-01'), 
    lastActionDescription: 'Caso archivado', 
    subjectName: 'Defensa penal', 
    subjectCategoryName: 'Penal' 
  },
  { 
    idCase: 5, 
    compoundKey: 'GY_24_24_05', 
    problemSummary: 'Descripccion del casos bla bla bla bla bla bla bla blabla bla bla bla bla blavbla ...', 
    createdAt: new Date('2024-11-01'), 
    caseStatus: 'Pausado' as CaseStatusTypeModel, 
    processType: 'Asesoría' as any, 
    applicantId: '5', 
    idNucleus: '1', 
    term: '2024-II', 
    idLegalArea: 5, 
    applicantName: 'Luis Sánchez', 
    legalAreaName: 'Derecho Administrativo', 
    teacherName: 'Pedro Enrrique Calderon Valencia', 
    lastActionDate: new Date('2024-11-01'), 
    lastActionDescription: 'En espera de documentos', 
    subjectName: 'Recurso administrativo', 
    subjectCategoryName: 'Administrativo' 
  },
]

function CasosAsociados() {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()

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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs 
          selectedId="casos-asociados"
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

        {/* Cases list */}
        <div className="flex-1 overflow-y-auto bg-white/40 rounded-xl p-4">
          <div className="grid grid-cols-1 gap-4">
            {mockCases.map((caseItem) => (
              <CaseCard
                key={caseItem.idCase}
                caseData={caseItem}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CasosAsociados
