import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { UserCircle, User, Clock, Close, FilePdf } from 'flowbite-react-icons/outline'
import { File } from 'flowbite-react-icons/solid'
import Tabs from '#components/Tabs.tsx'
import { useGetAllUsers, useGetUserById, useUpdateUserById } from '#domain/useCaseHooks/useUser.ts'
import UserGeneral from './components/UserGeneral.tsx'
import UserCases from './components/UserCases.tsx'
import UserActions from './components/UserActions.tsx'
import { modelToUserDto, type UserModel } from '#domain/models/user.ts'
import Box from '#components/Box.tsx'
import DropdownOption from '#components/Dropdown/DropdownOption.tsx'
import Dropdown from '#components/Dropdown/Dropdown.tsx'
import Button from '#components/Button.tsx'
import { modelToTeacherDao, type TeacherModel } from '#domain/models/teacher.ts'
import { useGetTeacherById, useUpdateTeacherById } from '#domain/useCaseHooks/useTeacher.ts'
import { useGetStudentById, useUpdateStudentById } from '#domain/useCaseHooks/useStudent.ts'
import { modelToStudentDao, type StudentModel } from '#domain/models/student.ts'
import { useNotifications } from '#/context/NotificationsContext.tsx'
import { useAuth } from '#/context/AuthContext.tsx'
import { PDFDownloadLink } from '@react-pdf/renderer'
import UserPdfDocument from './components/UserPdfDocument.tsx'

function UserInfo() {
  const { userId } = useParams<{ userId: string }>()
  const { user: currentUser, permissionLevel } = useAuth()

  const { user, loading: userLoading } = useGetUserById(userId ?? '')
  const { users } = useGetAllUsers()
  const { student, loading: studentLoading, loadStudent } = useGetStudentById()
  const { teacher, loading: teacherLoading, loadTeacher } = useGetTeacherById()
  const { updateUserById } = useUpdateUserById()
  const { updateStudentById } = useUpdateStudentById()
  const { updateTeacherById } = useUpdateTeacherById()

  const { notyError } = useNotifications()

  const [localUser, setLocalUser] = useState<UserModel>();
  const [localStudent, setLocalStudent] = useState<StudentModel>();
  const [localTeacher, setLocalTeacher] = useState<TeacherModel>();
  const [newPassword, setNewPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
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
    if (user) {
      setLocalUser(user)
      setNewPassword('')
    }
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
    if (user) {
      setLocalUser(user)
      setNewPassword('') // Reset password field
    }
  }, [user])

  // ... other useEffects

  // Data modified check needed. Include newPassword check.
  useEffect(() => {
    const isUserChanged = JSON.stringify(localUser) !== JSON.stringify(user);
    const isStudentChanged = student && localStudent ? JSON.stringify(localStudent) !== JSON.stringify(student) : false;
    const isTeacherChanged = teacher && localTeacher ? JSON.stringify(localTeacher) !== JSON.stringify(teacher) : false;
    const isPasswordChanged = newPassword !== '';

    const hasChanges = isUserChanged || isStudentChanged || isTeacherChanged || isPasswordChanged;
    setIsDataModified(hasChanges);
  }, [localUser, user, localStudent, student, localTeacher, teacher, newPassword])

  useEffect(() => {
    if (!localUser) return;
    if (!users?.length) {
      setValidationErrors({});
      return;
    }

    const normalizedId = localUser.identityCard?.trim();

    if (normalizedId.length === 0) {
      setValidationErrors((prev) => ({
        ...prev,
        identityCard: 'La cédula no puede estar vacía.'
      }));
      return;
    }

    const isDuplicate = users.some((existingUser) => {
      if (existingUser.identityCard === user?.identityCard) return false;
      return existingUser.identityCard === normalizedId;
    });

    setValidationErrors((prev) => ({
      ...prev,
      identityCard: isDuplicate ? 'La cédula ya está registrada para otro usuario.' : ''
    }));
  }, [localUser, user?.identityCard, users])

  if (!userId) {
    return <div className='p-8 text-center text-error'>ID de usuario no proporcionado</div>
  }

  if (userLoading) return <div className='p-8 text-center text-gray-500'>Cargando información del usuario...</div>
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
    setNewPassword('');
    setIsDataModified(false);
  }

  function saveChanges() {
    if (!localUser) return;
    if (!user) return;
    if (validationErrors.identityCard) return;

    // Prepare password update
    // We modify localUser temporarily or create a special payload
    let finalUserDto = modelToUserDto(localUser);

    // Student/Teacher updates don't involve password usually, but User update does.

    if (user.type === 'Estudiante' && localStudent) {

      const studentDao: any = modelToStudentDao(localStudent);
      // Merge user fields into studentDao just in case localUser has changes (fullName etc)
      studentDao.fullName = localUser.fullName;
      studentDao.email = localUser.email;
      studentDao.gender = modelToUserDto(localUser).gender; // use helper

      if (newPassword) studentDao.password = newPassword;
      else delete studentDao.password;

      updateStudentById(localStudent.identityCard, studentDao).catch(notyError)
      setIsDataModified(false);
      return
    } else if (user.type === 'Profesor' && localTeacher) {
      // Similar logic for teacher
      const teacherDao: any = modelToTeacherDao(localTeacher);
      teacherDao.fullName = localUser.fullName;
      teacherDao.email = localUser.email;
      teacherDao.gender = modelToUserDto(localUser).gender;

      if (newPassword) teacherDao.password = newPassword;
      else delete teacherDao.password;

      updateTeacherById(localTeacher.identityCard, teacherDao).catch(notyError)
      setIsDataModified(false);
      return
    }

    // Regular User / Coordinator / direct User update
    updateUserById(localUser.identityCard, finalUserDto).catch(notyError)
    setIsDataModified(false);
  }

  const canEditPassword = currentUser?.identityCard === user?.identityCard;

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
            validationErrors={validationErrors}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            canEditPassword={canEditPassword}
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

  const getActiveColor = (active: boolean) => active ? "bg-success! text-white border-0" : "bg-onSurface! text-white border-0";

  return (
    <Box className='p-0! min-h-full flex flex-col h-full'>
      <header className='bg-surface/70 flex items-center justify-between px-4 rounded-t-xl h-16'>
        <span className='flex gap-3 items-center'>
          <UserCircle className='size-6!' />
          <div className='flex flex-col'>
            <h1 className='text-label-small'>{user.fullName}</h1>
            <span className='flex gap-2'>
              <p className='text-body-small'> <strong className='text-body-medium'>Cedula:</strong> {user.identityCard}</p>
              <p className='text-body-small'> <strong className='text-body-medium'>Rol:</strong> {user.type}</p>
            </span>
          </div>
        </span>

        <span className='flex flex-1 justify-end items-center gap-4 h-full'>
          {
            isDataModified && (
              <Button onClick={discardChanges} icon={<Close />} variant='outlined'>
                Cancelar Cambios
              </Button>
            )
          }
          <div>
            <Dropdown
              label={localUser?.isActive ? 'Activo' : 'Inactivo'}
              triggerClassName={getActiveColor(localUser?.isActive ?? false)}
              selectedValue={localUser?.isActive ? 'Activo' : 'Inactivo'}
              onSelectionChange={(result) => { handleUserChange({ isActive: result === 'Activo' }) }}
              disabled={permissionLevel > 2}
            >
              <DropdownOption value='Activo'>Activo</DropdownOption>
              <DropdownOption value='Inactivo'>Inactivo</DropdownOption>
            </Dropdown>
          </div>
          {
            isDataModified ? (
              <Button
                onClick={saveChanges}
                variant='resalted'
                className='w-32'
                disabled={Boolean(validationErrors.identityCard)}
              >
                Guardar
              </Button>
            ) : (
              <PDFDownloadLink
                document={
                  <UserPdfDocument
                    user={localUser ?? user}
                    student={localStudent ?? student ?? undefined}
                    teacher={localTeacher ?? teacher ?? undefined}
                  />
                }
                fileName={`usuario_${localUser?.identityCard || user.identityCard}.pdf`}
              >
                <Button onClick={() => { }} icon={<FilePdf />} variant='outlined' className='w-32'>
                  Exportar
                </Button>
              </PDFDownloadLink>
            )
          }
        </span>
      </header>
      <section className='flex py-2'>
        <Tabs
          selectedId={activeTab}
          className='pb-2'
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
      <section className='px-4 pb-6 flex flex-col flex-1 min-h-0'>
        {content}
      </section>
    </Box>
  )
}

export default UserInfo
