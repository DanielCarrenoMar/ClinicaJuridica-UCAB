import {
  Text,
  View,
} from "@react-pdf/renderer";
import BarChart from './BarChart';
import { styleDocument } from "./ReportDocument";

// Datos de prueba para distribución por parroquia
const mockParishData = [
  { label: 'Solicitantes Altagracia', value: 42, color: '#45B7D1' },
  { label: 'Solicitantes Catedral', value: 38, color: '#FF6B6B' },
  { label: 'Solicitantes San José', value: 35, color: '#5DADE2' },
  { label: 'Solicitantes Santa Teresa', value: 28, color: '#EC7063' },
  { label: 'Solicitantes San Juan', value: 31, color: '#48C9B0' },
  { label: 'Beneficiarios Altagracia', value: 48, color: '#F1948A' },
  { label: 'Beneficiarios Catedral', value: 45, color: '#76D7C4' },
  { label: 'Beneficiarios San José', value: 41, color: '#F5B7B1' },
  { label: 'Beneficiarios Santa Teresa', value: 33, color: '#85C1E2' },
  { label: 'Beneficiarios San Juan', value: 36, color: '#F8C471' },
];

// Calcular porcentajes dinámicamente
const totalPersonas = mockParishData.reduce((sum, item) => sum + item.value, 0);
const dataWithPercentages = mockParishData.map(item => ({
  ...item,
  porcentaje: (item.value / totalPersonas) * 100
}));

function ReportParishDistribution() {
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Solicitantes y Beneficiarios por Parroquia</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent", flexDirection: 'column', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 40 }}>
          <View style={{ alignItems: 'center' }}>
            <BarChart 
              data={mockParishData}
              width={480}
              height={320}
              barWidth={16}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'column', gap: 6, width: 450, flexShrink: 0, marginTop: 20 }}>
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

export default ReportParishDistribution;
