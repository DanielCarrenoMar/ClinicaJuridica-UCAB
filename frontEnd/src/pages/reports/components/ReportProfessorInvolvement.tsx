import {
  Text,
  View,
} from "@react-pdf/renderer";
import BarChart from './BarChart';
import { styleDocument } from "./ReportDocument";

// Datos de prueba para distribución de profesores involucrados por tipo
const mockProfessorData = [
  { label: 'Asesor', value: 34, color: '#45B7D1' },
  { label: 'Supervisor', value: 28, color: '#FF6B6B' },
  { label: 'Coordinador', value: 22, color: '#5DADE2' },
  { label: 'Tutor', value: 19, color: '#EC7063' },
  { label: 'Evaluador', value: 15, color: '#48C9B0' },
];

// Calcular porcentajes dinámicamente
const totalProfesores = mockProfessorData.reduce((sum, item) => sum + item.value, 0);
const dataWithPercentages = mockProfessorData.map(item => ({
  ...item,
  porcentaje: (item.value / totalProfesores) * 100
}));

function ReportProfessorInvolvement() {
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Profesores Involucrados por Tipo</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent", flexDirection: 'column', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 40 }}>
          <View style={{ alignItems: 'center' }}>
            <BarChart 
              data={mockProfessorData}
              width={320}
              height={220}
              barWidth={25}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'column', gap: 6, width: 320, flexShrink: 0, marginTop: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
            Leyenda
          </Text>
          {dataWithPercentages.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <View style={{
                width: 12,
                height: 12,
                backgroundColor: item.color,
                marginRight: 8,
                flexShrink: 0
              }} />
              <Text style={{ fontSize: 10, flex: 1 }}>
                {item.label}: {item.value} ({item.porcentaje.toFixed(1)}%)
              </Text>
            </View>
          ))}
        </View>
      </View>

    </>
  );
}

export default ReportProfessorInvolvement;
