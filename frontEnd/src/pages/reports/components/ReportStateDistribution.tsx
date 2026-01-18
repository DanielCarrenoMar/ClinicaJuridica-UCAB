import {
  Text,
  View,
} from "@react-pdf/renderer";
import BarChart from './BarChart';
import { styleDocument } from "./ReportDocument";

// Datos de prueba para distribución por estado
const mockStateData = [
  { label: 'Solicitantes Distrito Capital', value: 95, color: '#45B7D1' },
  { label: 'Solicitantes Miranda', value: 78, color: '#FF6B6B' },
  { label: 'Solicitantes Carabobo', value: 62, color: '#5DADE2' },
  { label: 'Solicitantes Aragua', value: 45, color: '#EC7063' },
  { label: 'Beneficiarios Distrito Capital', value: 112, color: '#48C9B0' },
  { label: 'Beneficiarios Miranda', value: 89, color: '#F1948A' },
  { label: 'Beneficiarios Carabobo', value: 73, color: '#76D7C4' },
  { label: 'Beneficiarios Aragua', value: 56, color: '#F5B7B1' },
];

// Calcular porcentajes dinámicamente
const totalPersonas = mockStateData.reduce((sum, item) => sum + item.value, 0);
const dataWithPercentages = mockStateData.map(item => ({
  ...item,
  porcentaje: (item.value / totalPersonas) * 100
}));

function ReportStateDistribution() {
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Solicitantes y Beneficiarios por Estado</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent", flexDirection: 'column', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 40 }}>
          <View style={{ alignItems: 'center' }}>
            <BarChart 
              data={mockStateData}
              width={400}
              height={280}
              barWidth={20}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'column', gap: 6, width: 400, flexShrink: 0, marginTop: 20 }}>
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

export default ReportStateDistribution;
