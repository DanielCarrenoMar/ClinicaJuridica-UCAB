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
import Box from '#components/Box.tsx'
import DropdownOption from '#components/Dropdown/DropdownOption.tsx'
import Dropdown from '#components/Dropdown/Dropdown.tsx'

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
    <Box className="p-0!">
      <header className='bg-surface/70 flex items-center justify-between px-4 rounded-t-xl h-16'>
        <span className='flex gap-3 items-center'>
          <UserCircle className="size-6" />
          <div className="flex flex-col">
            <h1 className="text-label-small">{user.fullName}</h1>
            <span className='flex gap-2'>
                <p className="text-body-small"> <strong className='text-body-medium'>Cedula:</strong> {user.identityCard}</p>
                <p className="text-body-small"> <strong className='text-body-medium'>Rol:</strong> {user.type}</p>
            </span>
          </div>
        </span>
        <Dropdown
          label={user?.isActive ? "Activo" : "Inactivo"}
          triggerClassName={""}
          selectedValue={user?.isActive ? "Activo" : "Inactivo"}
          onSelectionChange={() => { }}
        >
          <DropdownOption value="Activo">Activo</DropdownOption>
          <DropdownOption value="Inactivo">Inactivo</DropdownOption>
        </Dropdown>
      </header>
      <section className="flex py-2">
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
      </section>
      <section className="px-4 pb-6 flex flex-col">
        {content}
      </section>
    </Box>
  )
}

export default InfoUser
