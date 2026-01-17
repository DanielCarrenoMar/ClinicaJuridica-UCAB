import Box from '#components/Box.tsx';
import CaseCard from '#components/CaseCard.tsx'
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import SearchBar from '#components/SearchBar.tsx';
import type { UserTypeModel } from '#domain/models/user.ts';
import { useGetCasesByStudentId } from '#domain/useCaseHooks/useStudent.ts';
import { useGetCasesByTeacherId } from '#domain/useCaseHooks/useTeacher.ts';
import { useEffect } from 'react';

interface UserCasesProps {
  userId: string;
  userType: UserTypeModel
}

export default function UserCases({ userId, userType }: UserCasesProps) {
  const { cases: studentCases, loadCases: loadStudentCases, loading: studentLoading, error: studentError } = useGetCasesByStudentId()
  const { cases: teacherCases, loadCases: loadTeacherCases, loading: teacherLoading, error: teacherError } = useGetCasesByTeacherId()

  useEffect(() => {
    if (userType === 'Estudiante') {
      loadStudentCases(userId)
    } else if (userType === 'Profesor') {
      loadTeacherCases(userId)
    }
  }, [userId, userType, loadStudentCases, loadTeacherCases])

  const cases = userType === 'Estudiante' ? studentCases : teacherCases
  const loading = userType === 'Estudiante' ? studentLoading : teacherLoading
  const error = userType === 'Estudiante' ? studentError : teacherError

  return (
    <div className="flex flex-col h-full">
      <section className="flex-1">
        <div className="col-span-4 h-full flex flex-col gap-2">
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
            {!error && cases.map((caseItem) => (
              <CaseCard
                key={caseItem.idCase}
                caseData={caseItem}
              />
            ))}
        </div>
      </section>
    </div>
  )
}
