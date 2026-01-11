import { useState } from 'react'
import { useParams } from 'react-router'
import { UserCircle, User, Clock } from "flowbite-react-icons/outline"
import { File } from "flowbite-react-icons/solid"
import Tabs from '#components/Tabs.tsx'
import { useGetUserById } from '#domain/useCaseHooks/useUser.ts'
import UserGeneral from './components/UserGeneral.tsx'
import UserCases from './components/UserCases.tsx'
import UserActions from './components/UserActions.tsx'
import type { UserModel } from '#domain/models/user.ts'

function InfoUser() {
  const { userId } = useParams<{ userId: string }>()
  if (!userId) {
    return <div className="p-8 text-center text-error">ID de usuario no proporcionado</div>
  }

  const { user, loading: userLoading } = useGetUserById(userId)
  
  const [activeTab, setActiveTab] = useState("General")
  const [isEditing, setIsEditing] = useState(false)
  const [editedInfo, setEditedInfo] = useState<UserModel | null>(null)

  const handleInputChange = (field: keyof UserModel, value: string) => {
    if (!editedInfo) return
    setEditedInfo(prev => prev ? ({ ...prev, [field]: value }) : null)
  }

  if (userLoading) return <div className="p-8 text-center text-gray-500">Cargando información del usuario...</div>
  if (!user) return <div className="p-8 text-center text-red-500">Usuario no encontrado</div>

  let content = null;
  switch (activeTab) {
    case 'General':
        content = (
            <UserGeneral 
                userModel={user}
                isEditing={isEditing}
                onInputChange={handleInputChange}
            />
        );
        break;
    case 'Casos Asociados':
        content = (
            <UserCases userId={userId} userType={user.type ?? "Estudiante"} />
        );
        break;
    case 'Acciones Realizadas':
        content = (
            <UserActions 
                userId={userId}
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
                  <div className="text-[22px] font-normal text-onSurface">{user.fullName}</div>
                  <div className="flex items-center gap-5">
                    <div className="text-[13px] font-medium text-onSurface">Cedula</div>
                    <div className="text-[13px] font-normal text-onSurface">{user.identityCard}</div>
                    <div className="text-[13px] font-medium text-onSurface">Rol</div>
                    <div className="text-[13px] font-normal text-onSurface capitalize">{user.type}</div>
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
