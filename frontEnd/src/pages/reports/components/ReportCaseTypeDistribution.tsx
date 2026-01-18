import {
  Text,
  View,
} from "@react-pdf/renderer";
import BarChart from './BarChart';
import { styleDocument } from "./ReportDocument";

// Datos de prueba para distribución por tipo de caso
const mockCaseTypeData = [
  { label: 'Consulta', value: 245, color: '#45B7D1' },
  { label: 'Asesoría', value: 189, color: '#FF6B6B' },
  { label: 'Representación', value: 156, color: '#5DADE2' },
  { label: 'Mediación', value: 134, color: '#EC7063' },
  { label: 'Defensa', value: 98, color: '#48C9B0' },
  { label: 'Peritación', value: 67, color: '#F1948A' },
];

// Calcular porcentajes dinámicamente
const totalCasos = mockCaseTypeData.reduce((sum, item) => sum + item.value, 0);
const dataWithPercentages = mockCaseTypeData.map(item => ({
  ...item,
  porcentaje: (item.value / totalCasos) * 100
}));

function ReportCaseTypeDistribution() {
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Casos por Tipo</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent", flexDirection: 'column', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 40 }}>
          <View style={{ alignItems: 'center' }}>
            <BarChart 
              data={mockCaseTypeData}
              width={350}
              height={250}
              barWidth={25}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'column', gap: 6, width: 350, flexShrink: 0, marginTop: 20 }}>
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

export default ReportCaseTypeDistribution;
