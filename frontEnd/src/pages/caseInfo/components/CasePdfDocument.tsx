
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { CaseModel } from '#domain/models/case.ts';
import type { StudentModel } from '#domain/models/student.ts';
import type { CaseBeneficiaryModel } from '#domain/models/caseBeneficiary.ts';
import type { SupportDocumentModel } from '#domain/models/supportDocument.ts';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#333',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0056b3',
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    section: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#2c3e50',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 2,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        width: '35%',
        fontWeight: 'bold',
        color: '#555',
    },
    value: {
        flex: 1,
        color: '#000',
    },
    noPresenta: {
        fontStyle: 'italic',
        color: '#888',
    },
    tableContainer: {
        flexDirection: 'column',
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#eee',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#e6e6e6',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tableCell: {
        flex: 1,
    },
    tableCellWide: {
        flex: 2,
    },
    textSmall: {
        fontSize: 9,
    },
});

interface CasePdfDocumentProps {
    caseData: CaseModel;
    students: StudentModel[];
    beneficiaries: CaseBeneficiaryModel[];
    documents: SupportDocumentModel[];
}

const DisplayValue = ({ value }: { value?: string | number | null }) => {
    if (value === undefined || value === null || value === '' || value === '—') {
        return <Text style={styles.noPresenta}>No presenta</Text>;
    }
    return <Text>{value}</Text>;
};

const DateValue = ({ date }: { date?: Date | string | null }) => {
    if (!date) return <Text style={styles.noPresenta}>No presenta</Text>;
    const d = new Date(date);
    return <Text>{d.toLocaleDateString("es-ES")}</Text>;
}

export default function CasePdfDocument({ caseData, students, beneficiaries, documents }: CasePdfDocumentProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Ficha del Caso</Text>
                        <Text style={styles.subtitle}>{caseData.compoundKey}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 9 }}>Generado el: {new Date().toLocaleDateString("es-ES")}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información General</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Resumen del Problema:</Text>
                        <View style={{ flex: 1 }}>
                            <DisplayValue value={caseData.problemSummary} />
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Estado:</Text>
                        <View style={styles.value}><DisplayValue value={caseData.caseStatus} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Tipo de Proceso:</Text>
                        <View style={styles.value}><DisplayValue value={caseData.processType} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Materia:</Text>
                        <View style={styles.value}><DisplayValue value={caseData.subjectName} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Categoria de Materia:</Text>
                        <View style={styles.value}><DisplayValue value={caseData.subjectCategoryName} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Área Legal:</Text>
                        <View style={styles.value}><DisplayValue value={caseData.legalAreaName} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Periodo:</Text>
                        <View style={styles.value}><DisplayValue value={caseData.term} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Núcleo:</Text>
                        <View style={styles.value}><DisplayValue value={caseData.idNucleus} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Solicitante:</Text>
                        <View style={styles.value}><DisplayValue value={caseData.applicantName} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Profesor Asignado:</Text>
                        <View style={styles.value}><DisplayValue value={caseData.teacherName} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Profesor Periodo:</Text>
                        <View style={styles.value}><DisplayValue value={caseData.teacherTerm} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Tribunal:</Text>
                        <View style={styles.value}><DisplayValue value={caseData.courtName} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Fecha Creación:</Text>
                        <View style={styles.value}><DateValue date={caseData.createdAt} /></View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Involucrados: Estudiantes</Text>
                    {students.length > 0 ? (
                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableCell}>Cédula</Text>
                                <Text style={styles.tableCellWide}>Nombre Completo</Text>
                                <Text style={styles.tableCell}>Correo</Text>
                                <Text style={styles.tableCell}>Tipo</Text>
                            </View>
                            {students.map((student, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, styles.textSmall]}>{student.identityCard}</Text>
                                    <Text style={[styles.tableCellWide, styles.textSmall]}>{student.fullName}</Text>
                                    <Text style={[styles.tableCell, styles.textSmall]}>{student.email}</Text>
                                    <Text style={[styles.tableCell, styles.textSmall]}>{student.type}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.noPresenta}>No presenta estudiantes asignados.</Text>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Involucrados: Beneficiarios</Text>
                    {beneficiaries.length > 0 ? (
                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableCell}>Cédula</Text>
                                <Text style={styles.tableCellWide}>Nombre Completo</Text>
                                <Text style={styles.tableCell}>Relación</Text>
                                <Text style={styles.tableCell}>Tipo</Text>
                            </View>
                            {beneficiaries.map((b, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, styles.textSmall]}>{b.identityCard}</Text>
                                    <Text style={[styles.tableCellWide, styles.textSmall]}>{b.fullName}</Text>
                                    <Text style={[styles.tableCell, styles.textSmall]}>{b.relationship}</Text>
                                    <Text style={[styles.tableCell, styles.textSmall]}>{b.caseType}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.noPresenta}>No presenta beneficiarios asignados.</Text>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Documentos y Recaudos</Text>
                    {documents.length > 0 ? (
                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableCellWide}>Título</Text>
                                <Text style={styles.tableCellWide}>Descripción</Text>
                                <Text style={styles.tableCell}>Fecha</Text>
                            </View>
                            {documents.map((doc, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.tableCellWide, styles.textSmall]}>{doc.title}</Text>
                                    <Text style={[styles.tableCellWide, styles.textSmall]}>{doc.description}</Text>
                                    <Text style={[styles.tableCell, styles.textSmall]}>{new Date(doc.submissionDate).toLocaleDateString("es-ES")}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.noPresenta}>No presenta documentos cargados.</Text>
                    )}
                </View>
            </Page>
        </Document>
    );
}
