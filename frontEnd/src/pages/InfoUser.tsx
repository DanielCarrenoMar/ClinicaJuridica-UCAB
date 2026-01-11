import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { UserCircle, User, Clock } from "flowbite-react-icons/outline"
import { File } from "flowbite-react-icons/solid"
import Tabs from '#components/Tabs.tsx'
import CaseCard from '#components/CaseCard.tsx'
import CaseActionCard from '#components/CaseActionCard.tsx'
import { useGetUserById } from '#domain/useCaseHooks/useUser.ts'
import { useGetStudentById, useGetCasesByStudentId } from '#domain/useCaseHooks/useStudent.ts'
import { useGetTeacherById, useGetCasesByTeacherId } from '#domain/useCaseHooks/useTeacher.ts'
import { useGetAllCaseActions } from '#domain/useCaseHooks/useCaseActions.ts'
import type { CaseActionModel } from '#domain/models/caseAction.ts'

interface UserInfo {
  name: string
  identityCard: string
  userType: 'profesor' | 'estudiante' | 'coordinador'
  semester: string
  email: string
  phone?: string
}

function General() {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const safeId = userId || ''

  // Data Fetching
  const { user, loading: userLoading } = useGetUserById(safeId)
  const { student } = useGetStudentById(safeId)
  const { teacher } = useGetTeacherById(safeId)
  
  const { cases: studentCases } = useGetCasesByStudentId(safeId)
  const { cases: teacherCases } = useGetCasesByTeacherId(safeId)
  const { caseActions } = useGetAllCaseActions()
  
  const [activeTab, setActiveTab] = useState("General")
  const [isEditing, setIsEditing] = useState(false)
  const [editedInfo, setEditedInfo] = useState<UserInfo | null>(null)

  // Combined User Info Logic
  const userData: UserInfo | null = useMemo(() => {
    if (!user) return null;
    
    let role: 'profesor' | 'estudiante' | 'coordinador' = 'coordinador';
    let semester = '';
    
    if (user.type === 'teacher') role = 'profesor';
    if (user.type === 'student') role = 'estudiante';

    if (user.type === 'student' && student) {
        semester = student.term;
    } else if (user.type === 'teacher' && teacher) {
        semester = teacher.term;
    }

    return {
        name: user.fullName,
        identityCard: user.identityCard,
        userType: role,
        semester: semester,
        email: user.email,
        phone: undefined 
    }
  }, [user, student, teacher])

  useEffect(() => {
    if (userData) { 
        setEditedInfo(userData)
    }
  }, [userData])

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    if (!editedInfo) return
    setEditedInfo(prev => prev ? ({ ...prev, [field]: value }) : null)
  }

  const getUserTypeColor = (type?: UserInfo['userType']) => {
    return type === 'profesor' ? 'text-blue-600' : 'text-green-600'
  }

  const relevantCases = useMemo(() => {
    if (userData?.userType === 'estudiante') return studentCases
    if (userData?.userType === 'profesor') return teacherCases
    return []
  }, [userData, studentCases, teacherCases])

  const relevantActions = useMemo(() => {
    // Filter case actions by current user ID
    // Note: userId in CaseActionModel is a string propery
    return caseActions.filter(a => a.userId === safeId)
  }, [caseActions, safeId])

  const handleActionClick = (action: CaseActionModel) => {
      navigate(`/caso/${action.idCase}`)
  }

  if (userLoading) return <div className="p-8 text-center text-gray-500">Cargando información del usuario...</div>
  // Wait for initial data load to avoid flashing "User not found" if loading states are slightly desynced
  if (!user) return <div className="p-8 text-center text-red-500">Usuario no encontrado</div>
  if (!editedInfo) return null; // Should be set immediately after userData is memoized

  let content = null;
  switch (activeTab) {
    case 'General':
        content = (
             <div className="flex-1 overflow-y-auto bg-white/40 rounded-xl p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-white/70 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-onSurface mb-4">Información Básica</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-onSurface mb-2">Nombre Completo</label>
                        <input
                          type="text"
                          value={editedInfo.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-onSurface mb-2">Cédula</label>
                        <input
                          type="text"
                          value={editedInfo.identityCard}
                          onChange={(e) => handleInputChange('identityCard', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-onSurface mb-2">Correo Electrónico</label>
                        <input
                          type="email"
                          value={editedInfo.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      {editedInfo.phone && (
                        <div>
                          <label className="block text-sm font-medium text-onSurface mb-2">Teléfono</label>
                          <input
                            type="tel"
                            value={editedInfo.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/70 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-onSurface mb-4">Información Académica</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-onSurface mb-2">Tipo de Usuario</label>
                        <div className="flex items-center gap-4">
                           <span className={`text-sm ${getUserTypeColor(editedInfo.userType)} capitalize font-medium`}>{editedInfo.userType}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-onSurface mb-2">Semestre Asignado</label>
                        <input
                          type="text"
                          value={editedInfo.semester || 'N/A'}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-onSurface mb-4">Información Adicional</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-onSurface">Estado del Usuario</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Activo
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-onSurface">Fecha de Registro</span>
                        <span className="text-sm text-onSurface">--/--/----</span>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
        );
        break;
    case 'Casos Asociados':
        content = (
             <div className="flex-1 overflow-y-auto bg-white/40 rounded-xl p-4">
              <div className="grid grid-cols-1 gap-4">
                {relevantCases.length > 0 ? relevantCases.map((caseItem) => (
                  <CaseCard
                    key={caseItem.idCase}
                    caseData={caseItem}
                  />
                )) : <div className="text-center p-4 text-gray-500">No hay casos asociados</div>}
              </div>
            </div>
        );
        break;
    case 'Acciones Realizadas':
        content = (
             <div className="flex-1 overflow-y-auto bg-white/40 rounded-xl p-4">
              <div className="grid grid-cols-1 gap-4">
                {relevantActions.length > 0 ? relevantActions.map((action) => (
                    <CaseActionCard
                    key={`${action.idCase}-${action.actionNumber}`}
                    caseAction={action}
                    onClick={() => handleActionClick(action)}
                  />
                )) : <div className="text-center p-4 text-gray-500">No hay acciones realizadas</div>}
              </div>
            </div>
        );
        break;
  }

  return (
    <div className="w-full h-full relative from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
        <div className="container mx-auto px-6 py-8 h-full flex flex-col">
          <div className="w-full p-4 bg-white/70 rounded-2xl mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCircle className="w-7 h-7 text-onSurface" />
                <div className="flex flex-col">
                  <div className="text-[22px] font-normal text-onSurface">{editedInfo.name}</div>
                  <div className="flex items-center gap-5">
                    <div className="text-[13px] font-medium text-onSurface">Cedula</div>
                    <div className="text-[13px] font-normal text-onSurface">{editedInfo.identityCard}</div>
                    <div className="text-[13px] font-medium text-onSurface">Rol</div>
                    <div className="text-[13px] font-normal text-onSurface capitalize">{editedInfo.userType}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[13px] font-medium text-onSurface">Estado:</div>
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-[13px] font-medium">
                  Activo
                </div>
              </div>
            </div>
          </div>

          <Tabs 
            selectedId={activeTab}
            className="mb-6"
          >
            <Tabs.Item 
              id="General" 
              label="General" 
              icon={<User className="w-5 h-5" />}
              onClick={() => setActiveTab('General')}
            />
            <Tabs.Item 
              id="Casos Asociados" 
              label="Casos Asociados" 
              icon={<File className="w-5 h-5" />}
              onClick={() => setActiveTab('Casos Asociados')}
            />
            <Tabs.Item 
              id="Acciones Realizadas" 
              label="Acciones Realizadas" 
              icon={<Clock className="w-5 h-5" />}
              onClick={() => setActiveTab('Acciones Realizadas')}
            />
          </Tabs>

          {content}

        </div>
    </div>
  )
}

export default General
