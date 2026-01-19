import CaseCard from '#components/CaseCard.tsx'
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import type { UserTypeModel } from '#domain/models/user.ts';
import { useGetCasesByStudentId } from '#domain/useCaseHooks/useStudent.ts';
import { useGetCasesByTeacherId } from '#domain/useCaseHooks/useTeacher.ts';
import { useEffect, useState } from 'react';
import Button from '#components/Button.tsx';
import { ArrowLeft, ArrowRight } from 'flowbite-react-icons/outline';

interface UserCasesProps {
  userId: string;
  userType: UserTypeModel
}

export default function UserCases({ userId, userType }: UserCasesProps) {
  const { cases: studentCases, loadCases: loadStudentCases, loading: studentLoading, error: studentError } = useGetCasesByStudentId()
  const { cases: teacherCases, loadCases: loadTeacherCases, loading: teacherLoading, error: teacherError } = useGetCasesByTeacherId()
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    if (userType === 'Estudiante') {
      loadStudentCases(userId, { page, limit: pageSize })
    } else if (userType === 'Profesor') {
      loadTeacherCases(userId, { page, limit: pageSize })
    }
  }, [userId, userType, loadStudentCases, loadTeacherCases, page, pageSize])

  useEffect(() => {
    setPage(1);
  }, [userId, userType])

  const cases = userType === 'Estudiante' ? studentCases : teacherCases
  const loading = userType === 'Estudiante' ? studentLoading : teacherLoading
  const error = userType === 'Estudiante' ? studentError : teacherError
  const canGoPrev = page > 1;
  const canGoNext = !loading && !error && cases.length === pageSize;

  return (
    <div className="flex flex-1 flex-col h-full">
      <section className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto">
        {loading &&
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        }
        {
          error &&
          <p className="text-error text-center">Error al cargar las acciones de casos.</p>
        }
        {
          cases.length === 0 && !loading && !error &&
          <p className="text-body-medium text-onSurface/70 text-center">No hay casos disponibles.</p>
        }
        <ul className='flex flex-col gap-2'>
          {!error && cases.map((caseItem) => (
            <li className='shrink-0'>

              <CaseCard
                key={caseItem.idCase}
                caseData={caseItem}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 flex items-center justify-between max-w-5xl">
        <Button
          variant="outlined"
          icon={<ArrowLeft />}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={!canGoPrev || loading}
        >
          Anterior
        </Button>
        <span className="text-body-small text-onSurface/70">Página {page}</span>
        <Button
          variant="outlined"
          icon={<ArrowRight />}
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!canGoNext || loading}
        >
          Siguiente
        </Button>
      </section>
    </div>
  )
}
