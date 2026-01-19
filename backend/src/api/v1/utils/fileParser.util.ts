import * as XLSX from 'xlsx';

export interface StudentImportData {
    identityCard: string;
    fullName: string;
    email: string;
    gender?: string | null;
    nrc: string;
    term: string;
    type?: string;
}

class FileParserUtil {
    parseStudentFile(buffer: Buffer): StudentImportData[] {
        // 1. Read the workbook from buffer
        // For CSV, try to detect if it uses semicolon as delimiter
        let content = buffer.toString('utf-8');
        let options: XLSX.ParsingOptions = { type: 'buffer' };

        if (content.includes(';')) {
            options = { ...options, FS: ';' };
        }

        const workbook = XLSX.read(buffer, options);

        // 2. Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // 3. Convert to JSON
        const rawData = XLSX.utils.sheet_to_json(worksheet) as any[];

        // 4. Map UCAB columns to our domain model
        return rawData.map(row => {
            const rawGender = String(row.SEXO || row.sexo || row.GENDER || row.gender || row.GENERO || row.genero || '').trim().toUpperCase();
            // Map common values to 'M' or 'F', otherwise null
            let gender: string | null = null;
            if (['M', 'MASCULINO', 'HOMBRE'].includes(rawGender)) gender = 'M';
            else if (['F', 'FEMENINO', 'MUJER'].includes(rawGender)) gender = 'F';

            return {
                identityCard: String(row.CEDULA || row.cedula || row.identityCard || '').trim(),
                fullName: String(row.NOMBRE_ESTUDIANTE || row.nombre || row.fullName || '').trim(),
                email: String(row.ESTU_EMAIL_ADDRESS || row.email || '').trim(),
                gender: gender,
                nrc: String(row.CRN || row.nrc || '').trim(),
                term: String(row.YEAR_TERM || row.semestre || row.term || '').trim(),
                type: 'Regular' // Defaulting to Regular
            };
        }).filter(student => student.identityCard && student.fullName && student.term); // Basic validation
    }
}

export default new FileParserUtil();
