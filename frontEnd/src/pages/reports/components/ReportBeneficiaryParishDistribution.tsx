import {
  Text,
  View,
} from "@react-pdf/renderer";
import BarChart from './BarChart';
import { styleDocument } from "./ReportDocument";

// Datos de prueba para distribución de beneficiarios por parroquia
const mockBeneficiaryParishData = [
  { label: 'Altagracia', value: 48, color: '#45B7D1' },
  { label: 'Catedral', value: 45, color: '#FF6B6B' },
  { label: 'San José', value: 41, color: '#5DADE2' },
  { label: 'Santa Teresa', value: 33, color: '#EC7063' },
  { label: 'San Juan', value: 36, color: '#48C9B0' },
  { label: 'San Pedro', value: 29, color: '#F1948A' },
  { label: 'Santa Rosalía', value: 27, color: '#76D7C4' },
];

// Calcular porcentajes dinámicamente
const totalBeneficiarios = mockBeneficiaryParishData.reduce((sum, item) => sum + item.value, 0);
const dataWithPercentages = mockBeneficiaryParishData.map(item => ({
  ...item,
  porcentaje: (item.value / totalBeneficiarios) * 100
}));

function ReportBeneficiaryParishDistribution() {
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Beneficiarios por Parroquia</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent", flexDirection: 'column', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 40 }}>
          <View style={{ alignItems: 'center' }}>
            <BarChart 
              data={mockBeneficiaryParishData}
              width={380}
              height={250}
              barWidth={22}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'column', gap: 6, width: 380, flexShrink: 0, marginTop: 20 }}>
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

export default ReportBeneficiaryParishDistribution;
