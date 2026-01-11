import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { UserCircle, User, Clock } from "flowbite-react-icons/outline"
import { File } from "flowbite-react-icons/solid"
import Tabs from '#components/Tabs.tsx'
import { useGetUserById } from '#domain/useCaseHooks/useUser.ts'
import { useGetStudentById, useGetCasesByStudentId } from '#domain/useCaseHooks/useStudent.ts'
import { useGetTeacherById, useGetCasesByTeacherId } from '#domain/useCaseHooks/useTeacher.ts'
import { useGetAllCaseActions } from '#domain/useCaseHooks/useCaseActions.ts'
import type { CaseActionModel } from '#domain/models/caseAction.ts'
import UserGeneral, { type UserInfo } from './components/UserGeneral.tsx'
import UserCases from './components/UserCases.tsx'
import UserActions from './components/UserActions.tsx'

function InfoUser() {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  if (!userId) {
    return <div className="p-8 text-center text-error">ID de usuario no proporcionado</div>
  }

  // Data Fetching
  const { user, loading: userLoading } = useGetUserById(userId)
  const { student } = useGetStudentById(userId)
  const { teacher } = useGetTeacherById(userId)
  

  const { caseActions } = useGetAllCaseActions()
  
  const [activeTab, setActiveTab] = useState("General")
  const [isEditing, setIsEditing] = useState(false)
  const [editedInfo, setEditedInfo] = useState<UserInfo | null>(null)

  // Combined User Info Logic
  const userData: UserInfo | null = useMemo(() => {
    if (!user) return null;
    
    let role: 'profesor' | 'estudiante' | 'coordinador' = 'coordinador';
    let semester = '';
    
    if (user.type === 'Profesor') role = 'profesor';
    if (user.type === 'Estudiante') role = 'estudiante';

    if (user.type === 'Estudiante' && student) {
        semester = student.term;
    } else if (user.type === 'Profesor' && teacher) {
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

  const relevantActions = useMemo(() => {
    // Filter case actions by current user ID
    // Note: userId in CaseActionModel is a string propery
    return caseActions.filter(a => a.userId === userId)
  }, [caseActions, userId])

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
            <UserGeneral 
                userInfo={editedInfo}
                isEditing={isEditing}
                onInputChange={handleInputChange}
            />
        );
        break;
    case 'Casos Asociados':
        content = (
            <UserCases userId={userId} userType={userData.userType ?? "Estudiante"} />
        );
        break;
    case 'Acciones Realizadas':
        content = (
            <UserActions 
                actions={relevantActions}
                onActionClick={handleActionClick}
            />
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

export default InfoUser
