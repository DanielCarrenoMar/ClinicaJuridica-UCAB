import {
  Text,
  View,
} from "@react-pdf/renderer";
import PieChart from './PieChart';
import { styleDocument } from "./ReportDocument";

// Datos de prueba para distribución de casos por materia
const mockCaseSubjectData = [
  { materia: 'Derecho Civil', cantidad: 67, porcentaje: 28.5 },
  { materia: 'Derecho Laboral', cantidad: 52, porcentaje: 22.1 },
  { materia: 'Derecho Familiar', cantidad: 48, porcentaje: 20.4 },
  { materia: 'Derecho Penal', cantidad: 35, porcentaje: 14.9 },
  { materia: 'Derecho Administrativo', cantidad: 23, porcentaje: 9.8 },
  { materia: 'Derecho Mercantil', cantidad: 11, porcentaje: 4.3 },
];

const totalCasos = mockCaseSubjectData.reduce((sum, item) => sum + item.cantidad, 0);

function ReportCaseSubject() {
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Casos por Materia Jurídica</Text>
      
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
          Materias atendidas: {mockCaseSubjectData.length}
        </Text>
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Distribución por Materia
        </Text>
        
        <View style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', borderBottom: '1pt solid #ccc', paddingBottom: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 2 }}>Materia</Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>Casos</Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'right' }}>Porcentaje</Text>
        </View>
        
        {mockCaseSubjectData.map((item, index) => (
          <View key={index} style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, flex: 2 }}>
              {item.materia}
            </Text>
            <Text style={{ fontSize: 12, flex: 1, textAlign: 'center' }}>
              {item.cantidad}
            </Text>
            <Text style={{ fontSize: 12, flex: 1, textAlign: 'right' }}>
              {item.porcentaje.toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Gráfico de Distribución
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center' }}>
            <PieChart 
              data={mockCaseSubjectData.map(item => ({
                label: item.materia,
                value: item.cantidad,
                color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][mockCaseSubjectData.indexOf(item)]
              }))}
              size={150}
            />
          </View>
          <View style={{ flexDirection: 'column', gap: 8, maxWidth: 200 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>
              Leyenda
            </Text>
            {mockCaseSubjectData.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 5 }}>
                <View style={{
                  width: 12,
                  height: 12,
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][index],
                  marginRight: 8
                }} />
                <Text style={{ fontSize: 10 }}>
                  {item.materia}: {item.porcentaje.toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Análisis Detallado
        </Text>
        <Text style={styleDocument.parragraph}>
          El Derecho Civil concentra la mayor cantidad de casos con 67 atenciones (28.5%), seguido por 
          Derecho Laboral con 52 casos (22.1%) y Derecho Familiar con 48 casos (20.4%). 
          Estas tres áreas jurídicas representan conjuntamente el 71% del total de casos atendidos.
        </Text>
        <Text style={styleDocument.parragraph}>
          La distribución refleja las necesidades más comunes de la comunidad, donde los conflictos 
          civiles, laborales y familiares constituyen la principal demanda de servicios legales. 
          El Derecho Penal, aunque con menor incidencia (14.9%), mantiene una presencia significativa 
          en el portafolio de servicios de la clínica.
        </Text>
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Recomendaciones
        </Text>
        <Text style={styleDocument.parragraph}>
          Considerando la alta demanda en Derecho Civil y Laboral, se recomienda fortalecer los recursos 
          y capacitaciones en estas áreas. Additionally, la creciente demanda en Derecho Familiar sugiere 
          la necesidad de especializar más estudiantes en esta materia para mejorar la calidad del servicio.
        </Text>
      </View>

    </>
  );
}

export default ReportCaseSubject;