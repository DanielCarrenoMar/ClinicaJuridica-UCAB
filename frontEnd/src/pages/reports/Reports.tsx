

import { useState, useMemo, Fragment, useRef } from 'react';
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
import ReportDocument from './components/ReportDocument';
import ReportCaseType from './components/ReportCaseType';
import ReportGenderDistribution from './components/ReportGenderDistribution';
import ReportStateDistribution from './components/ReportStateDistribution';
import ReportParishDistribution from './components/ReportParishDistribution';
import ReportCaseTypeDistribution from './components/ReportCaseTypeDistribution';
import ReportBeneficiaryParishDistribution from './components/ReportBeneficiaryParishDistribution';
import ReportProfessorInvolvement from './components/ReportProfessorInvolvement';
import ReportStudentInvolvement from './components/ReportStudentInvolvement';
import LinkButton from '#components/LinkButton.tsx';
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import DatePicker from '#components/DatePicker.tsx';
import { parseDate, validateDateRange } from '../../utils/dateUtils';

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
];

function Reports() {
    const [selectedReportIds, setSelectedReportIds] = useState<number[]>([1]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const pdfRef = useRef<string | null>(null);

    // Crear componentes frescos cada vez
    const createFreshComponent = (reportId: number) => {
        switch(reportId) {
            case 1:
                return <ReportCaseSubject key={`fresh-1-${Date.now()}`} />;
            case 2:
                return <ReportCaseSubjectScope key={`fresh-2-${Date.now()}`} />;
            case 3:
                return <ReportGenderDistribution key={`fresh-3-${Date.now()}`} />;
            case 4:
                return <ReportStateDistribution key={`fresh-4-${Date.now()}`} />;
            case 5:
                return <ReportParishDistribution key={`fresh-5-${Date.now()}`} />;
            case 6:
                return <ReportCaseType key={`fresh-6-${Date.now()}`} />;
            case 7:
                return <ReportBeneficiaryParishDistribution key={`fresh-7-${Date.now()}`} />;
            case 8:
                return <ReportStudentInvolvement key={`fresh-8-${Date.now()}`} />;
            case 9:
                return <ReportCaseTypeDistribution key={`fresh-9-${Date.now()}`} />;
            case 10:
                return <ReportProfessorInvolvement key={`fresh-10-${Date.now()}`} />;
            default:
                return null;
        }
    };

    const reportDoc = useMemo(() => {
        const selectedReports = reportOptions.filter(r => selectedReportIds.includes(r.id));
        const timestamp = Date.now();
        
        // Parse dates if available
        let parsedStartDate: Date | undefined;
        let parsedEndDate: Date | undefined;
        
        if (startDate && endDate) {
            try {
                parsedStartDate = parseDate(startDate);
                parsedEndDate = parseDate(endDate);
                
                if (!validateDateRange(parsedStartDate, parsedEndDate)) {
                    console.warn('Invalid date range: start date must be before end date');
                    parsedStartDate = undefined;
                    parsedEndDate = undefined;
                }
            } catch (error) {
                console.error('Error parsing dates:', error);
            }
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
    }, [selectedReportIds, startDate, endDate]);

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
                    <LinkButton to="#" onClick={handleDownloadPDF} download={generateFileName()} variant="outlined" icon={<FilePdf />}>
                        {isGenerating ? 'Generando...' : 'Exportar PDF'}
                    </LinkButton>
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
                                value={startDate}
                                onChange={setStartDate}
                                id="start-date"
                            />
                            <DatePicker
                                label="Fecha de fin"
                                value={endDate}
                                onChange={setEndDate}
                                id="end-date"
                                min={startDate}
                            />
                        </div>
                    </section>

                    <section className="flex flex-col gap-3 overflow-hidden h-full relative">
                        {isGenerating && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/50 backdrop-blur-sm">
                                <LoadingSpinner />
                            </div>
                        )}

                        {!isGenerating && (
                            <PDFViewer className="w-full h-full" showToolbar={false}>
                                {reportDoc}
                            </PDFViewer>
                        )}
                    </section>
                </div>
            </div>
        </Box>
    );
}
export default Reports;
