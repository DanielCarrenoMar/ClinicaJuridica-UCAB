

import { useState, useMemo, Fragment, useRef, useCallback } from 'react';
import Box from '#components/Box.tsx';
import OptionCard from '#components/OptionCard.tsx';
import {
    FilePdf,
    ChartPie,
} from 'flowbite-react-icons/outline';
import {
    FileChartBar,
    CalendarEdit,
} from 'flowbite-react-icons/solid';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import ReportCaseSubject from './components/ReportCaseSubject';
import ReportCaseSubjectScope from './components/ReportCaseSubjectScope';
import ReportGenderDistribution from './components/ReportGenderDistribution';
import ReportStateDistribution from './components/ReportStateDistribution';
import ReportParishDistribution from './components/ReportParishDistribution';
import ReportCaseType from './components/ReportCaseType';
import ReportBeneficiaryParishDistribution from './components/ReportBeneficiaryParishDistribution';
import ReportStudentInvolvement from './components/ReportStudentInvolvement';
import ReportCaseTypeDistribution from './components/ReportCaseTypeDistribution';
import ReportProfessorInvolvement from './components/ReportProfessorInvolvement';
import ReportBeneficiaryTypeDistribution from './components/ReportBeneficiaryTypeDistribution';
import ReportDocument from './components/ReportDocument';
import Button from '#components/Button.tsx';
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import DatePicker from '#components/DatePicker.tsx';
import { parseDate, validateDateRange } from '../../utils/dateUtils';
import {
    useAllStats,
} from '#domain/useCaseHooks/useAllStats.ts';

const reportOptions = [
    {
        id: 1,
        title: 'Casos por materia',
        description: 'Cantidad de casos separados por materia',
        icon: <ChartPie />,
        component: <ReportCaseSubject />
    },
    {
        id: 2,
        title: 'Casos por materia y ambito',
        description: 'Cantidad de casos agrupados por materia y separados en ambito',
        icon: <ChartPie />,
        component: <ReportCaseSubjectScope />
    },
    {
        id: 3,
        title: 'Solicitantes y beneficiarios por sexo',
        description: 'Cantidad de solicitantes y beneficiarios separados por sexo',
        icon: <ChartPie />,
        component: <ReportGenderDistribution />
    },
    {
        id: 4,
        title: 'Solicitantes y beneficiarios por estado',
        description: 'Cantidad de solicitantes y beneficiarios separados por estado',
        icon: <ChartPie />,
        component: <ReportStateDistribution />
    },
    {
        id: 5,
        title: 'Solicitantes y beneficiarios por parroquia',
        description: 'Cantidad de solicitantes y beneficiarios separados por parroquia',
        icon: <ChartPie />,
        component: <ReportParishDistribution />
    },
    {
        id: 6,
        title: 'Casos por tipo',
        description: 'Cantidad de casos separados por tipo',
        icon: <ChartPie />,
        component: <ReportCaseType />
    },
    {
        id: 7,
        title: 'Beneficiarios directos por parroquia',
        description: 'Cantidad de beneficiarios separados por parroquia',
        icon: <ChartPie />,
        component: <ReportBeneficiaryParishDistribution />
    },
    {
        id: 8,
        title: 'Estudiantes involucrados por tipo',
        description: 'Cantidad de estudiantes involucrados separados por tipo',
        icon: <ChartPie />,
        component: <ReportStudentInvolvement />
    },
    {
        id: 9,
        title: 'Casos por tipo de servicio',
        description: 'Cantidad de casos separados por tipo de servicio legal',
        icon: <ChartPie />,
        component: <ReportCaseTypeDistribution />
    },
    {
        id: 10,
        title: 'Profesores involucrados por tipo',
        description: 'Cantidad de profesores involucrados separados por tipo',
        icon: <ChartPie />,
        component: <ReportProfessorInvolvement />
    },
    {
        id: 11,
        title: 'Beneficiarios directos e indirectos',
        description: 'Distribución de beneficiarios por tipo (directos e indirectos)',
        icon: <ChartPie />,
        component: <ReportBeneficiaryTypeDistribution />
    },
];

function Reports() {
    const [selectedReportIds, setSelectedReportIds] = useState<number[]>([]);
    const [startDate, setStartDate] = useState<Date | undefined>(new Date("2023-01-01"));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date());
    const [isGenerating, setIsGenerating] = useState(false);
    const pdfRef = useRef<string | null>(null);

    const allStats = useAllStats(undefined, undefined);

    // Crear componentes frescos cada vez con datos
    const createFreshComponent = useCallback((reportId: number) => {
        const reportData = allStats.getReportData(reportId);
        
        if (reportId === 1) {
            return <ReportCaseSubject key={`fresh-1-${Date.now()}`} data={reportData.data} loading={reportData.loading} error={reportData.error} />;
        }
        if (reportId === 2) {
            return <ReportCaseSubjectScope key={`fresh-2-${Date.now()}`} data={reportData.data} loading={reportData.loading} error={reportData.error} />;
        }
        if (reportId === 3) {
            return <ReportGenderDistribution key={`fresh-3-${Date.now()}`} data={reportData.data} loading={reportData.loading} error={reportData.error} />;
        }
        if (reportId === 4) {
            return <ReportStateDistribution key={`fresh-4-${Date.now()}`} data={reportData.data} loading={reportData.loading} error={reportData.error} />;
        }
        if (reportId === 5) {
            return <ReportParishDistribution key={`fresh-5-${Date.now()}`} data={reportData.data} loading={reportData.loading} error={reportData.error} />;
        }
        if (reportId === 6) {
            return <ReportCaseType key={`fresh-6-${Date.now()}`} data={reportData.data} loading={reportData.loading} error={reportData.error} />;
        }
        if (reportId === 7) {
            return <ReportBeneficiaryParishDistribution key={`fresh-7-${Date.now()}`} data={reportData.data} loading={reportData.loading} error={reportData.error} />;
        }
        if (reportId === 8) {
            return <ReportStudentInvolvement key={`fresh-8-${Date.now()}`} data={reportData.data} loading={reportData.loading} error={reportData.error} />;
        }
        if (reportId === 9) {
            return <ReportCaseTypeDistribution key={`fresh-9-${Date.now()}`} data={reportData.data} loading={reportData.loading} error={reportData.error} />;
        }
        if (reportId === 10) {
            return <ReportProfessorInvolvement key={`fresh-10-${Date.now()}`} data={reportData.data} loading={reportData.loading} error={reportData.error} />;
        }
        if (reportId === 11) {
            return <ReportBeneficiaryTypeDistribution key={`fresh-11-${Date.now()}`} data={reportData.data} loading={reportData.loading} error={reportData.error} />;
        }
        
        return null;
    }, [allStats]);

    const reportDoc = useMemo(() => {
        if (!startDate || !endDate || selectedReportIds.length === 0) {
            return null;
        }

        const selectedReports = reportOptions.filter(r => selectedReportIds.includes(r.id));
        const timestamp = Date.now();
        
        // Parse dates if available
        let parsedStartDate: Date | undefined;
        let parsedEndDate: Date | undefined;
        
        try {
            
            if (!validateDateRange(startDate, endDate)) {
                console.warn('Invalid date range: start date must be before end date');
                return null;
            }
        } catch (error) {
            console.error('Error parsing dates:', error);
            return null;
        }
        
        return (
            <ReportDocument key={`doc-${timestamp}`} startDate={parsedStartDate} endDate={parsedEndDate}>
                {selectedReports.map(report => (
                    <Fragment key={`frag-${report.id}-${timestamp}`}>
                        {createFreshComponent(report.id)}
                    </Fragment>
                ))}
            </ReportDocument>
        );
    }, [selectedReportIds, startDate, endDate, allStats, createFreshComponent]);

    const handleReportSelect = (id: number) => {
        const newSelection = selectedReportIds.includes(id) 
            ? selectedReportIds.filter(item => item !== id) 
            : [...selectedReportIds, id];
        setSelectedReportIds(newSelection);
        // Limpiar PDF cacheado cuando cambia la selección
        pdfRef.current = null;
    };

    const generateFileName = () => {
        const selectedReports = reportOptions.filter(r => selectedReportIds.includes(r.id));
        const reportTitles = selectedReports.map(r => r.title.replace(/\s+/g, '_').toLowerCase());
        const timestamp = new Date().toISOString().slice(0, 10);
        return `reporte_${reportTitles.join('_')}_${timestamp}.pdf`;
    };

    const handleDownloadPDF = async () => {
        if (isGenerating) return;
        
        // Validar que ambas fechas estén seleccionadas
        if (!startDate || !endDate) {
            return;
        }

        // Validar que haya reportes seleccionados
        if (selectedReportIds.length === 0) {
            return;
        }

        // Validar que el documento esté disponible
        if (!reportDoc) {
            return;
        }
        
        setIsGenerating(true);
        try {
            // Generar PDF fresh cada vez
            const blob = await pdf(reportDoc).toBlob();
            const url = URL.createObjectURL(blob);
            
            // Forzar descarga
            const link = document.createElement('a');
            link.href = url;
            link.download = generateFileName();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Limpiar URL object
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generando PDF:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Box className="p-0! h-full overflow-y-auto flex flex-col">
            <header className="bg-surface/70 flex items-center justify-between px-4 rounded-xl h-16">
                <span className="flex gap-3 items-center">
                    <FileChartBar className="size-6!" />
                    <div>
                        <h1 className="text-label-small">Generar Informe</h1>
                    </div>
                </span>
                <span className="flex items-center gap-4 h-full">
                    <Button 
                        onClick={handleDownloadPDF} 
                        variant="outlined" 
                        icon={<FilePdf />}
                        disabled={!startDate || !endDate || selectedReportIds.length === 0 || isGenerating || allStats.isAnyLoading}
                    >
                        {isGenerating ? 'Generando...' : 'Exportar PDF'}
                    </Button>
                </span>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-3 p-4 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
                    {reportOptions.map((option) => (
                        <OptionCard
                            className='h-32'
                            key={option.id}
                            title={option.title}
                            description={option.description}
                            icon={option.icon}
                            selected={selectedReportIds.includes(option.id)}
                            onClick={() => handleReportSelect(option.id)}
                        />
                    ))}
                </div>

                <div className="flex-2 p-6 pt-5 flex flex-col gap-3 border-l border-onSurface/10 bg-surface/20">
                    <section className="flex flex-col gap-3">
                        <div className="flex gap-2 items-center text-onSurface">
                            <CalendarEdit className="w-6 h-6" />
                            <h3 className="text-label-small font-normal">Rango del informe</h3>
                        </div>

                        <div className="w-full space-y-3">
                            <DatePicker
                                label="Fecha de inicio"
                                value={startDate?.toLocaleDateString() || undefined}
                                onChange={(date) => setStartDate(new Date(date))}
                                id="start-date"
                            />
                            <DatePicker
                                label="Fecha de fin"
                                value={endDate?.toLocaleDateString() || undefined}
                                onChange={(date) => setEndDate(new Date(date))}
                                id="end-date"
                                min={startDate?.toLocaleDateString() || undefined}
                            />
                        </div>
                    </section>

                    <section className="flex flex-col gap-3 overflow-hidden h-full relative">
                        {/* Mostrar estado de carga general de todas las estadísticas */}
                        {allStats.isAnyLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/50 backdrop-blur-sm">
                                <div className="text-center">
                                    <LoadingSpinner />
                                    <p className="text-body-medium text-onSurface/70 mt-3">
                                        Cargando estadísticas...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Mostrar errores si los hay */}
                        {/*!isGenerating && !allStats.isAnyLoading && allStats.hasAnyError && (
                            <div className="w-full h-full flex items-center justify-center bg-surface/30 rounded-xl">
                                <div className="text-center p-6">
                                    <div className="text-red-500 mb-3">
                                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-body-medium text-onSurface/70">
                                        Error al cargar algunas estadísticas. Por favor, intenta nuevamente.
                                    </p>
                                </div>
                            </div>
                        )*/}

                        {!isGenerating && !allStats.isAnyLoading && !startDate && !endDate && (
                            <div className="w-full h-full flex items-center justify-center bg-surface/30 rounded-xl">
                                <div className="text-center p-6">
                                    <CalendarEdit className="w-12 h-12 mx-auto mb-3 text-onSurface/50" />
                                    <p className="text-body-medium text-onSurface/70">
                                        Selecciona las fechas de inicio y fin para visualizar los reportes
                                    </p>
                                </div>
                            </div>
                        )}

                        {!isGenerating && (startDate || endDate) && (!startDate || !endDate) && (
                            <div className="w-full h-full flex items-center justify-center bg-surface/30 rounded-xl">
                                <div className="text-center p-6">
                                    <CalendarEdit className="w-12 h-12 mx-auto mb-3 text-onSurface/50" />
                                    <p className="text-body-medium text-onSurface/70">
                                        Por favor, completa ambas fechas (inicio y fin) para visualizar los reportes
                                    </p>
                                </div>
                            </div>
                        )}

                        {!isGenerating && !allStats.isAnyLoading && startDate && endDate && reportDoc && (
                            <PDFViewer className="w-full h-full" showToolbar={false}>
                                {reportDoc}
                            </PDFViewer>
                        )}

                        {!isGenerating && !allStats.isAnyLoading && startDate && endDate && !reportDoc && (
                            <div className="w-full h-full flex items-center justify-center bg-surface/30 rounded-xl">
                                <div className="text-center p-6">
                                    <p className="text-body-medium text-onSurface/70">
                                        Selecciona al menos un reporte para visualizar
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </Box>
    );
}
export default Reports;
