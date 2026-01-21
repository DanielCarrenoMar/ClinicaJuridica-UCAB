
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { UserModel } from '#domain/models/user.ts';
import type { StudentModel } from '#domain/models/student.ts';
import type { TeacherModel } from '#domain/models/teacher.ts';

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
});

const DisplayValue = ({ value }: { value?: string | number | null }) => {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '') || value === '—') {
        return <Text style={styles.noPresenta}>No presenta</Text>;
    }
    return <Text>{value}</Text>;
};

interface UserPdfDocumentProps {
    user: UserModel;
    student?: StudentModel;
    teacher?: TeacherModel;
}

const UserPdfDocument = ({ user, student, teacher }: UserPdfDocumentProps) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Información de Usuario</Text>
                    <Text style={styles.subtitle}>Detalles registrados en el sistema</Text>
                </View>
                <View style={{ textAlign: 'right' }}>
                    <Text style={{ fontSize: 10, color: '#666' }}>Fecha de Reporte: {new Date().toLocaleDateString()}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información General</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Nombre Completo:</Text>
                    <View style={styles.value}><DisplayValue value={user.fullName} /></View>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Cédula:</Text>
                    <View style={styles.value}><DisplayValue value={user.identityCard} /></View>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Correo Electrónico:</Text>
                    <View style={styles.value}><DisplayValue value={user.email} /></View>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Género:</Text>
                    <View style={styles.value}><DisplayValue value={user.gender} /></View>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Rol:</Text>
                    <View style={styles.value}><DisplayValue value={user.type} /></View>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Estado:</Text>
                    <View style={styles.value}><Text>{user.isActive ? 'Activo' : 'Inactivo'}</Text></View>
                </View>
            </View>

            {user.type === 'Estudiante' && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalles del Estudiante</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Tipo de Estudiante:</Text>
                        <View style={styles.value}><DisplayValue value={student?.type.toLowerCase()} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>NRC:</Text>
                        <View style={styles.value}><DisplayValue value={student?.nrc} /></View>
                    </View>
                </View>
            )}

            {user.type === 'Profesor' && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalles del Profesor</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Tipo de Profesor:</Text>
                        <View style={styles.value}><DisplayValue value={teacher?.type.toLowerCase()} /></View>
                    </View>
                </View>
            )}
        </Page>
    </Document>
);

export default UserPdfDocument;
