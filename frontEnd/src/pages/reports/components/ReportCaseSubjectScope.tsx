import {
  Text,
  View,
} from "@react-pdf/renderer";
import { styleDocument } from "./ReportDocument";

// Datos de prueba para distribución de casos por materia y ámbito
const mockCaseSubjectScopeData = [
  { materia: 'Derecho Civil', ambito: 'Judicial', cantidad: 45, porcentaje: 19.1 },
  { materia: 'Derecho Civil', ambito: 'Extrajudicial', cantidad: 22, porcentaje: 9.4 },
  { materia: 'Derecho Laboral', ambito: 'Judicial', cantidad: 38, porcentaje: 16.2 },
  { materia: 'Derecho Laboral', ambito: 'Extrajudicial', cantidad: 14, porcentaje: 6.0 },
  { materia: 'Derecho Familiar', ambito: 'Judicial', cantidad: 32, porcentaje: 13.6 },
  { materia: 'Derecho Familiar', ambito: 'Extrajudicial', cantidad: 16, porcentaje: 6.8 },
  { materia: 'Derecho Penal', ambito: 'Judicial', cantidad: 35, porcentaje: 14.9 },
  { materia: 'Derecho Administrativo', ambito: 'Judicial', cantidad: 18, porcentaje: 7.7 },
  { materia: 'Derecho Administrativo', ambito: 'Extrajudicial', cantidad: 5, porcentaje: 2.1 },
  { materia: 'Derecho Mercantil', ambito: 'Judicial', cantidad: 8, porcentaje: 3.4 },
  { materia: 'Derecho Mercantil', ambito: 'Extrajudicial', cantidad: 3, porcentaje: 1.3 },
];

const totalCasos = mockCaseSubjectScopeData.reduce((sum, item) => sum + item.cantidad, 0);

// Agrupar por materia para mostrar totales
const groupedByMateria = mockCaseSubjectScopeData.reduce((acc, item) => {
  if (!acc[item.materia]) {
    acc[item.materia] = { judicial: 0, extrajudicial: 0, total: 0 };
  }
  acc[item.materia][item.ambito.toLowerCase() === 'judicial' ? 'judicial' : 'extrajudicial'] = item.cantidad;
  acc[item.materia].total += item.cantidad;
  return acc;
}, {} as Record<string, { judicial: number; extrajudicial: number; total: number }>);

function ReportCaseSubjectScope() {
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Casos por Materia y Ámbito</Text>
      
      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Resumen General
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 5 }}>
          Total de casos: {totalCasos}
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 5 }}>
          Período: Enero - Diciembre 2024
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 10 }}>
          Materias atendidas: {Object.keys(groupedByMateria).length}
        </Text>
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Distribución por Materia y Ámbito
        </Text>
        
        <View style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', borderBottom: '1pt solid #ccc', paddingBottom: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 2 }}>Materia</Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>Judicial</Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>Extrajudicial</Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'right' }}>Total</Text>
        </View>
        
        {Object.entries(groupedByMateria).map(([materia, data], index) => (
          <View key={index} style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, flex: 2 }}>
              {materia}
            </Text>
            <Text style={{ fontSize: 12, flex: 1, textAlign: 'center' }}>
              {data.judicial}
            </Text>
            <Text style={{ fontSize: 12, flex: 1, textAlign: 'center' }}>
              {data.extrajudicial}
            </Text>
            <Text style={{ fontSize: 12, flex: 1, textAlign: 'right', fontWeight: 'bold' }}>
              {data.total}
            </Text>
          </View>
        ))}
        
        <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', borderTop: '1pt solid #ccc', paddingTop: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 2 }}>Total General</Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
            {Object.values(groupedByMateria).reduce((sum, data) => sum + data.judicial, 0)}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
            {Object.values(groupedByMateria).reduce((sum, data) => sum + data.extrajudicial, 0)}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'right' }}>
            {totalCasos}
          </Text>
        </View>
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Análisis por Ámbito
        </Text>
        <Text style={styleDocument.parragraph}>
          El ámbito judicial concentra la mayor parte de los casos con {Object.values(groupedByMateria).reduce((sum, data) => sum + data.judicial, 0)} 
          atenciones ({((Object.values(groupedByMateria).reduce((sum, data) => sum + data.judicial, 0) / totalCasos) * 100).toFixed(1)}%), 
          mientras que el ámbito extrajudicial registra {Object.values(groupedByMateria).reduce((sum, data) => sum + data.extrajudicial, 0)} 
          casos ({((Object.values(groupedByMateria).reduce((sum, data) => sum + data.extrajudicial, 0) / totalCasos) * 100).toFixed(1)}%).
        </Text>
        <Text style={styleDocument.parragraph}>
          Esta distribución indica que la mayoría de los conflictos requieren intervención formal en el sistema judicial, 
          aunque una porción significativa se resuelve mediante métodos alternativos y negociaciones extrajudiciales.
        </Text>
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Observaciones por Materia
        </Text>
        {Object.entries(groupedByMateria).map(([materia, data], index) => (
          <View key={index} style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
              {materia}:
            </Text>
            <Text style={{ fontSize: 11, marginLeft: 10 }}>
              • Judicial: {data.judicial} casos ({((data.judicial / data.total) * 100).toFixed(1)}%)
            </Text>
            <Text style={{ fontSize: 11, marginLeft: 10 }}>
              • Extrajudicial: {data.extrajudicial} casos ({((data.extrajudicial / data.total) * 100).toFixed(1)}%)
            </Text>
          </View>
        ))}
      </View>

    </>
  );
}

export default ReportCaseSubjectScope;
