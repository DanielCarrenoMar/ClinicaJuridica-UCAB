import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useGetCaseById, useUpdateCase } from '#domain/useCaseHooks/useCase.ts';
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import Button from '#components/Button.tsx';
import TextInput from '#components/TextInput.tsx';

export default function CaseInfo() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { caseData, loading, error, loadCase } = useGetCaseById();
    const { editCase, loading: updating } = useUpdateCase();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (id) {
            loadCase(id);
        }
    }, [id, loadCase]);

    useEffect(() => {
        if (caseData) {
            setFormData(caseData);
        }
    }, [caseData]);

    const handleSave = async () => {
        if (!id) return;
        try {
            await editCase(id, formData);
            setIsEditing(false);
            loadCase(id); // Reload to get fresh data
        } catch (e) {
            console.error("Failed to update case", e);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    if (loading) return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    if (error) return <div className="text-error">Error al cargar el caso: {error.message}</div>;
    if (!caseData) return <div className="text-onSurface">No se encontró el caso</div>;

    return (
        <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto">
            <header className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="text-onSurface hover:bg-surface/50 p-2 rounded-full transition-colors">
                </button>
                <div className="flex-1">
                    <h1 className="text-headline-medium text-primary font-bold">{caseData.compoundKey}</h1>
                    <p className="text-body-medium text-onSurfaceVariant">Estado: {caseData.caseStatus}</p>
                </div>
                {isEditing ? (
                    <div className="flex gap-2">
                        <Button variant="outlined" onClick={() => setIsEditing(false)}>Cancelar</Button>
                        <Button variant="filled" onClick={handleSave} disabled={updating}>
                            {updating ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                ) : (
                    <Button variant="outlined" onClick={() => setIsEditing(true)}>Editar Caso</Button>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-surface rounded-3xl p-6 shadow-sm">
                    <h2 className="text-title-large text-primary mb-4">Información General</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-label-large text-secondary">Resumen del Problema</label>
                            {isEditing ? (
                                <TextInput
                                    multiline
                                    defaultText={formData.problemSummary}
                                    onChangeText={(val) => handleChange('problemSummary', val)}
                                />
                            ) : (
                                <p className="text-body-large text-onSurface mt-1">{caseData.problemSummary}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-label-large text-secondary">Área Legal</label>
                                <p className="text-body-large text-onSurface mt-1">{caseData.legalAreaName}</p>
                            </div>
                            <div>
                                <label className="block text-label-large text-secondary">Fecha de Creación</label>
                                <p className="text-body-large text-onSurface mt-1">{caseData.createdAt.toLocaleDateString("es-ES")}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-label-large text-secondary">Núcleo</label>
                                <p className="text-body-large text-onSurface mt-1">{caseData.idNucleus}</p>
                            </div>
                            <div>
                                <label className="block text-label-large text-secondary">Periodo</label>
                                <p className="text-body-large text-onSurface mt-1">{caseData.term}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-surface rounded-3xl p-6 shadow-sm">
                    <h2 className="text-title-large text-primary mb-4">Participantes</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-label-large text-secondary">Solicitante</label>
                            <p className="text-body-large text-onSurface mt-1">{caseData.applicantName} (ID: {caseData.applicantId})</p>
                        </div>
                        <div>
                            <label className="block text-label-large text-secondary">Profesor Asignado</label>
                            <p className="text-body-large text-onSurface mt-1">{caseData.teacherName || "Sin asignar"} {caseData.teacherTerm ? `(${caseData.teacherTerm})` : ""}</p>
                        </div>
                        {caseData.courtName && (
                            <div>
                                <label className="block text-label-large text-secondary">Tribunal</label>
                                {isEditing ? (
                                    <TextInput
                                        defaultText={formData.courtName}
                                        onChangeText={(val) => handleChange('courtName', val)}
                                    />
                                ) : (
                                    <p className="text-body-large text-onSurface mt-1">{caseData.courtName}</p>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                <section className="bg-surface rounded-3xl p-6 shadow-sm md:col-span-2">
                    <h2 className="text-title-large text-primary mb-4">Estado y Seguimiento</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-label-large text-secondary">Tipo de Proceso</label>
                            <p className="text-body-large text-onSurface mt-1">{caseData.processType}</p>
                        </div>
                        <div>
                            <label className="block text-label-large text-secondary">Última Acción</label>
                            <p className="text-body-large text-onSurface mt-1">
                                {caseData.lastActionDescription || "Sin acciones registradas"}
                                {caseData.lastActionDate && <span className="text-body-small text-onSurfaceVariant ml-2">({caseData.lastActionDate.toLocaleDateString("es-ES")})</span>}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}