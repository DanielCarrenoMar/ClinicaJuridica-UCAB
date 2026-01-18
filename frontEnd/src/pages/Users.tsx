import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import { Plus } from "flowbite-react-icons/outline"
import { Upload } from "flowbite-react-icons/solid"
import SearchBar from '#components/SearchBar.tsx'
import { useGetAllUsers } from '#domain/useCaseHooks/useUser.ts'
import { useImportStudents } from '#domain/useCaseHooks/useStudent.ts'
import Button from '#components/Button.tsx'
import LoadingSpinner from '#components/LoadingSpinner.tsx'
import UserListRow from '#components/UserListRow.tsx'
import ImportStudentsDialog from '#components/dialogs/ImportStudentsDialog.tsx'
import { useNotifications } from '#/context/NotificationsContext'

function Users() {
  const { users, loading, error, refresh } = useGetAllUsers()
  const { importStudents, loading: importLoading } = useImportStudents()
  const { notyError, notyMessage } = useNotifications()
  const [searchValue, setSearchValue] = useState('')
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  const filteredUsers = useMemo(() => {
    if (searchValue === '') return users

    const fuse = new Fuse(users, {
      keys: [
        'identityCard',
        'fullName',
        'email',
        'type'
      ]
    })

    return fuse.search(searchValue).map((result) => result.item)
  }, [users, searchValue])

  const handleLoadUsers = () => {
    setIsImportDialogOpen(true)
  }

  const handleAddUser = () => {
    console.log('Adding new user...')
  }

  const handleImport = async (file: File) => {
    importStudents(file).then((result) => {
      refresh()
      setIsImportDialogOpen(false)
      notyMessage(result.data.success + ' Estudiantes importados exitosamente.' + (result.data.failed && result.data.failed.length > 0 ? ` ${result.data.failed.length} fallidos.` : ''))
    }).catch((err) => {
      notyError('Error al importar estudiantes: ' + err.message)
    })
  }

  return (
    <div className="flex flex-col h-full min-h-0 max-w-5xl">
      <section className="mb-4 flex items-center justify-between gap-6">
        <SearchBar
          isOpen={true}
          placeholder="Buscar usuario..."
          onChange={setSearchValue}
        />
        <div className="flex items-center gap-3">
          <Button
            icon={< Plus />}
            onClick={handleAddUser}
            variant='outlined'
          >
            Añadir
          </Button>
          <Button
            icon={< Upload />}
            onClick={handleLoadUsers}
            variant='outlined'
          >
            Cargar
          </Button>
        </div>
      </section>
      <section className="flex-1 min-h-0">
        <div className="col-span-4 h-full flex flex-col gap-2 overflow-y-auto">
          {loading && <div className='flex justify-center'><LoadingSpinner /></div>}
          {error && <div className='text-error'>Error al cargar los usuarios.</div>}
          {!error && filteredUsers.map((user) => (
            <UserListRow key={user.identityCard} user={user} />
          ))}
        </div>
      </section>

      <ImportStudentsDialog
        open={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImport}
        isLoading={importLoading}
      />
    </div>
  )
}

export default Users
