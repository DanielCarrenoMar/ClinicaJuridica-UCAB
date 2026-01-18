import {
  Text,
  View,
} from "@react-pdf/renderer";
import { styleDocument } from "./ReportDocument";

// Datos de prueba para estudiantes involucrados por tipo
const mockStudentData = [
  { tipo: 'Asistente', cantidad: 167, horasPromedio: 58 },
  { tipo: 'Investigador', cantidad: 94, horasPromedio: 72 },
  { tipo: 'Redactor', cantidad: 52, horasPromedio: 49 },
  { tipo: 'Representante', cantidad: 33, horasPromedio: 89 },
];

const totalEstudiantes = mockStudentData.reduce((sum, item) => sum + item.cantidad, 0);
const totalHoras = mockStudentData.reduce((sum, item) => sum + (item.cantidad * item.horasPromedio), 0);

function ReportStudentInvolvement() {
  return (
    <>
      <Text style={styleDocument.title}>Participación Estudiantil por Tipo de Involucramiento</Text>
      
      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Resumen General
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 5 }}>
          Total de estudiantes involucrados: {totalEstudiantes}
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 5 }}>
          Total de horas acumuladas: {totalHoras.toLocaleString()}
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 10 }}>
          Promedio general de horas por estudiante: {(totalHoras / totalEstudiantes).toFixed(1)}
        </Text>
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Distribución por Tipo de Involucramiento
        </Text>
        
        <View style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', borderBottom: '1pt solid #ccc', paddingBottom: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 2 }}>Tipo de Involucramiento</Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>Estudiantes</Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>Horas Promedio</Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'right' }}>Total Horas</Text>
        </View>
        
        {mockStudentData.map((item, index) => (
          <View key={index} style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, flex: 2 }}>
              {item.tipo}
            </Text>
            <Text style={{ fontSize: 12, flex: 1, textAlign: 'center' }}>
              {item.cantidad}
            </Text>
            <Text style={{ fontSize: 12, flex: 1, textAlign: 'center' }}>
              {item.horasPromedio}
            </Text>
            <Text style={{ fontSize: 12, flex: 1, textAlign: 'right' }}>
              {(item.cantidad * item.horasPromedio).toLocaleString()}
            </Text>
          </View>
        ))}
        
        <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', borderTop: '1pt solid #ccc', paddingTop: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 2 }}>Total General</Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
            {totalEstudiantes}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
            -
          </Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'right' }}>
            {totalHoras.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Gráfico de Participación Estudiantil
        </Text>
        <View style={{ flexDirection: 'column', gap: 8 }}>
          {mockStudentData.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 10, width: 80 }}>
                {item.tipo}
              </Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  height: 20,
                  width: `${(item.cantidad / totalEstudiantes) * 300}px`,
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][index],
                  borderRadius: 2,
                }} />
                <Text style={{ fontSize: 10, marginLeft: 8 }}>
                  {item.cantidad} estudiantes ({((item.cantidad / totalEstudiantes) * 100).toFixed(1)}%)
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{ marginTop: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {mockStudentData.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 5 }}>
              <View style={{
                width: 12,
                height: 12,
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][index],
                marginRight: 5
              }} />
              <Text style={{ fontSize: 10 }}>
                {item.tipo}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Análisis de Participación
        </Text>
        <Text style={styleDocument.parragraph}>
          La participación estudiantil muestra una distribución piramidal, con la mayor cantidad de estudiantes 
          en roles de Asistente (156 estudiantes, 48.4% del total), seguidos por Investigadores (89 estudiantes, 27.6%).
          Los roles de Redactor y Representante, que requieren mayor especialización, concentran a 67 y 34 estudiantes respectivamente.
        </Text>
        <Text style={styleDocument.parragraph}>
          En términos de dedicación, los Representantes lideran con un promedio de 95 horas por estudiante, 
          reflejando la mayor complejidad y responsabilidad de este rol. Los Investigadores siguen con 78 horas promedio,
          indicando un compromiso significativo en labores de investigación jurídica.
        </Text>
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Impacto Académico
        </Text>
        <Text style={styleDocument.parragraph}>
          La clínica jurídica ha facilitado la participación de {totalEstudiantes} estudiantes, 
          generando un total de {totalHoras.toLocaleString()} horas de experiencia práctica. 
          Esta actividad representa un componente fundamental en la formación profesional de los estudiantes,
          permitiéndoles aplicar conocimientos teóricos en casos reales bajo supervisión docente.
        </Text>
      </View>

      <View style={styleDocument.pageNumber}>
        <Text render={({pageNumber, totalPages}) => `${pageNumber}/${totalPages}`} />
      </View>
    </>
  );
}

export default ReportStudentInvolvement;
