import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { UserCircle, User, Clock, Close, FilePdf } from 'flowbite-react-icons/outline'
import { File } from 'flowbite-react-icons/solid'
import Tabs from '#components/Tabs.tsx'
import { useGetUserById, useUpdateUserById } from '#domain/useCaseHooks/useUser.ts'
import UserGeneral from './components/UserGeneral.tsx'
import UserCases from './components/UserCases.tsx'
import UserActions from './components/UserActions.tsx'
import { modelToUserDao, type UserModel } from '#domain/models/user.ts'
import Box from '#components/Box.tsx'
import DropdownOption from '#components/Dropdown/DropdownOption.tsx'
import Dropdown from '#components/Dropdown/Dropdown.tsx'
import Button from '#components/Button.tsx'
import { modelToTeacherDao, type TeacherModel } from '#domain/models/teacher.ts'
import { useGetTeacherById, useUpdateTeacherById } from '#domain/useCaseHooks/useTeacher.ts'
import { useGetStudentById, useUpdateStudentById } from '#domain/useCaseHooks/useStudent.ts'
import { modelToStudentDao, type StudentModel } from '#domain/models/student.ts'
import { useNotifications } from '#/context/NotificationsContext.tsx'

function UserInfo() {
  const { userId } = useParams<{ userId: string }>()
  
  const { user, loading: userLoading } = useGetUserById(userId ?? '')
  const { student, loading: studentLoading, loadStudent } = useGetStudentById()
  const { teacher, loading: teacherLoading, loadTeacher } = useGetTeacherById()
  const { updateUserById } = useUpdateUserById()
  const { updateStudentById } = useUpdateStudentById()
  const { updateTeacherById } = useUpdateTeacherById()

  const { notyError } = useNotifications()

  const [localUser, setLocalUser] = useState<UserModel>();
  const [localStudent, setLocalStudent] = useState<StudentModel>();
  const [localTeacher, setLocalTeacher] = useState<TeacherModel>();
  const [activeTab, setActiveTab] = useState('General')
  const [isDataModified, setIsDataModified] = useState(false)

  useEffect(() => {
    if (!user) return
    if (user.type === 'Estudiante') {
      loadStudent(user.identityCard)
    } else if (user.type === 'Profesor') {
      loadTeacher(user.identityCard)
    }
  }, [user, loadStudent, loadTeacher])

  useEffect(() => {
    if (user) setLocalUser(user)
  }, [user])

  useEffect(() => {
    if (student) {
      setLocalStudent(student)
    }
  }, [student])

  useEffect(() => {
    if (teacher) {
      setLocalTeacher(teacher)
    }
  }, [teacher])

  useEffect(() => {
    const isUserChanged = JSON.stringify(localUser) !== JSON.stringify(user);
    const isStudentChanged = student && localStudent ? JSON.stringify(localStudent) !== JSON.stringify(student) : false;
    const isTeacherChanged = teacher && localTeacher ? JSON.stringify(localTeacher) !== JSON.stringify(teacher) : false;

    const hasChanges = isUserChanged || isStudentChanged || isTeacherChanged;
    setIsDataModified(hasChanges);
  }, [localUser, user, localStudent, student, localTeacher, teacher])

  if (!userId) {
    return <div className='p-8 text-center text-error'>ID de usuario no proporcionado</div>
  }

  if (userLoading) return <div className='p-8 text-center text-gray-500'>Cargando informaci�n del usuario...</div>
  if (!user) return <div className='p-8 text-center text-red-500'>Usuario no encontrado</div>

  if (user.type === 'Estudiante' && !student && studentLoading) return <div className='p-8 text-center text-gray-500'>Cargando datos de estudiante...</div>
  if (user.type === 'Profesor' && !teacher && teacherLoading) return <div className='p-8 text-center text-gray-500'>Cargando datos de profesor...</div>


  function handleUserChange(updateField: Partial<UserModel>) {
    if (!localUser) return;
    const updatedUser = { ...localUser, ...updateField };
    setLocalUser(updatedUser);
    const { type, ...generalInfo } = updatedUser;
    setLocalStudent(prev => prev ? { ...prev, ...generalInfo } as StudentModel : undefined);
    setLocalTeacher(prev => prev ? { ...prev, ...generalInfo } as TeacherModel : undefined);
  }

  function handleStudentChange(updateField: Partial<StudentModel>) {
    if (!localStudent) return;
    const updatedStudent = { ...localStudent, ...updateField };
    setLocalStudent(updatedStudent);
  }

  function handleTeacherChange(updateField: Partial<TeacherModel>) {
    if (!localTeacher) return;
    const updatedTeacher = { ...localTeacher, ...updateField };
    setLocalTeacher(updatedTeacher);
  }

  function discardChanges() {
    setLocalUser(user ?? undefined);
    setLocalStudent(student ?? undefined);
    setLocalTeacher(teacher ?? undefined);
    setIsDataModified(false);
  }

  function saveChanges() {
    if (!localUser) return;
    if (!user) return;
    if (user.type === 'Estudiante' && localStudent) {
      updateStudentById(localStudent.identityCard, modelToStudentDao(localStudent)).catch(notyError)
      setIsDataModified(false);
      return
    } else if (user.type === 'Profesor' && localTeacher) {
      updateTeacherById(localTeacher.identityCard, modelToTeacherDao(localTeacher)).catch(notyError)
      setIsDataModified(false);
      return
    }
    updateUserById(localUser.identityCard, modelToUserDao(localUser)).catch(notyError)
    setIsDataModified(false);
  }

  let content = null;
  switch (activeTab) {
    case 'General':
      // Check if localUser is defined before rendering UserGeneral
      if (localUser) {
        content = (
          <UserGeneral
            localUser={localUser}
            localStudent={localStudent}
            localTeacher={localTeacher}
            handleUserChange={handleUserChange}
            handleTeacherChange={handleTeacherChange}
            handleStudentChange={handleStudentChange}
          />
        );
      }
      break;
    case 'Casos Asociados':
      content = (
        <UserCases userId={userId} userType={user.type ?? 'Estudiante'} />
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
    <Box className='p-0! h-full'>
      <header className='bg-surface/70 flex items-center justify-between px-4 rounded-t-xl h-16'>
        <span className='flex gap-3 items-center'>
          <UserCircle className='size-6' />
          <div className='flex flex-col'>
            <h1 className='text-label-small'>{user.fullName}</h1>
            <span className='flex gap-2'>
              <p className='text-body-small'> <strong className='text-body-medium'>Cedula:</strong> {user.identityCard}</p>
              <p className='text-body-small'> <strong className='text-body-medium'>Rol:</strong> {user.type}</p>
            </span>
          </div>
        </span>
        <Dropdown
          label={user?.isActive ? 'Activo' : 'Inactivo'}
          triggerClassName={''}
          selectedValue={user?.isActive ? 'Activo' : 'Inactivo'}
          onSelectionChange={() => { }}
        >
          <DropdownOption value='Activo'>Activo</DropdownOption>
          <DropdownOption value='Inactivo'>Inactivo</DropdownOption>
        </Dropdown>
        <div className='flex items-end gap-2.5'>
          {
            isDataModified && (
              <Button onClick={discardChanges} icon={<Close />} variant='outlined' className='h-10'>
                Cancelar Cambios
              </Button>
            )
          }
          {
            isDataModified ? (
              <Button
                onClick={saveChanges}
                variant='resalted'
                className='h-10 w-32'
              >
                Guardar
              </Button>
            ) : (
              <Button onClick={() => { }} icon={<FilePdf />} variant='outlined' className='h-10 w-32'>
                Exportar
              </Button>
            )
          }
        </div>
      </header>
      <section className='flex py-2'>
        <Tabs
          selectedId={activeTab}
          className='mb-6'
        >
          <Tabs.Item
            id='General'
            label='General'
            icon={<User className='w-5 h-5' />}
            onClick={() => setActiveTab('General')}
          />
          <Tabs.Item
            id='Casos Asociados'
            label='Casos Asociados'
            icon={<File className='w-5 h-5' />}
            onClick={() => setActiveTab('Casos Asociados')}
          />
          <Tabs.Item
            id='Acciones Realizadas'
            label='Acciones Realizadas'
            icon={<Clock className='w-5 h-5' />}
            onClick={() => setActiveTab('Acciones Realizadas')}
          />
        </Tabs>
      </section>
      <section className='px-4 pb-6 flex flex-col'>
        {content}
      </section>
    </Box>
  )
}

export default UserInfo
