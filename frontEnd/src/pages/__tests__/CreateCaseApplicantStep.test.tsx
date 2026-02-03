import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, Outlet } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CreateCaseApplicantStep from '#pages/CreateCaseApplicantStep.tsx';
import type { ApplicantModel } from '#domain/models/applicant.ts';
import { useState } from 'react';
import { type CaseOutletContext } from '#pages/CreateCase.tsx';

vi.mock("#domain/useCaseHooks/useBeneficiaryApplicant.ts", () => ({
    useGetApplicantOrBeneficiaryById: () => ({
        getApplicantOrBeneficiaryById: vi.fn().mockResolvedValue(null),
        loading: false
    })
}));

// Variable global para capturar el contexto
let testContext: CaseOutletContext;

function TestWrapper() {
    // Initial minimal state
    const [applicantModel, setApplicantModel] = useState<Partial<ApplicantModel>>({
        identityCard: '',
    });
    const [isApplicantExisting, setIsApplicantExisting] = useState(false);
    const [dbOriginalData, setDbOriginalData] = useState<Partial<ApplicantModel> | null>(null);

    // Mock update function
    const updateApplicantModel = (updates: Partial<ApplicantModel>) => {
        setApplicantModel(prev => ({ ...prev, ...updates }));
    };

    const ctx = {
        applicantModel: applicantModel as ApplicantModel,
        setApplicantModel,
        updateApplicantModel,
        isApplicantExisting,
        setIsApplicantExisting,
        dbOriginalData,
        setDbOriginalData,
        // Mock other unused context parts
        caseDAO: {} as any,
        setCaseDAO: vi.fn(),
        updateCaseDAO: vi.fn(),
        caseBeneficiaries: [],
        setCaseBeneficiaries: vi.fn(),
        submitCreateCase: vi.fn(),
        isSubmittingCreateCase: false
    } as CaseOutletContext;

    testContext = ctx;

    return <Outlet context={ctx} />;
}

describe('CreateCaseApplicantStep', () => {
    
    // Función auxiliar para configurar cada test individualmente
    const setup = () => {
        vi.useFakeTimers();

        const router = createMemoryRouter([
            {
                element: <TestWrapper />,
                children: [
                    {
                        path: '/crearCaso/solicitante',
                        element: <CreateCaseApplicantStep />
                    }
                ]
            }
        ], {
            initialEntries: ['/crearCaso/solicitante']
        });

        render(<RouterProvider router={router} />);

        // Simular interacción requerida con la cédula (dispara debounce)
        const inputCedula = screen.getByRole('textbox', { name: /Cédula/i });
        fireEvent.change(inputCedula, { target: { value: '12345678' } });

        // Avanzar el tiempo para completar el debounce
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        // Volvemos a timers reales para que las esperas (waitFor) del test funcionen normal
        vi.useRealTimers();

        if (!testContext) throw new Error("testContext no ha sido inicializado.");

        return {
            inputCedula,
            nextButton: screen.getByRole('button', { name: /Siguiente/i }),
            // Helper para actualizar el modelo rápidamente
            updateModel: (data: Partial<ApplicantModel>) => {
                act(() => {
                    testContext.updateApplicantModel(data);
                });
            }
        };
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('Habilita el botón con datos válidos (Mayor de edad, con sexo y nacionalidad)', async () => {
        const { updateModel, nextButton } = setup();

        updateModel({
            fullName: 'Juan Perez',
            birthDate: new Date('1990-01-01'), // Mayor de edad
            gender: 'Masculino',
            idNationality: 'V',
        });

        await waitFor(() => {
            expect(nextButton).toBeEnabled();
        });
    });

    it('Mantiene el botón Deshabilitado si es menor de edad', async () => {
        const { updateModel, nextButton } = setup();

        // Ponemos una fecha de nacimiento que le de 10 años
        const today = new Date();
        const minorDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());

        updateModel({
            fullName: 'Niño Perez',
            birthDate: minorDate,
            gender: 'Masculino',
            idNationality: 'V',
        });

        // Esperamos un poco para asegurar que React procesó cambios
        await waitFor(() => {
            expect(nextButton).toBeDisabled();
        });
    });

    it('Mantiene el botón Deshabilitado si falta el nombre', async () => {
        const { updateModel, nextButton } = setup();

        updateModel({
            fullName: '', // Nombre vacío
            birthDate: new Date('1990-01-01'),
            gender: 'Masculino',
            idNationality: 'V',
        });

        await waitFor(() => {
            expect(nextButton).toBeDisabled();
        });
    });
});