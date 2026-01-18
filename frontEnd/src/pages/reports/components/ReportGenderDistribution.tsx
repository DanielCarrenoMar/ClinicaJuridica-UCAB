import {
  Text,
  View,
} from "@react-pdf/renderer";
import BarChart from './BarChart';
import { styleDocument } from "./ReportDocument";

// Datos de prueba para distribución por género
const mockGenderData = [
  { label: 'Solicitantes Hombres', value: 85, color: '#45B7D1' },
  { label: 'Solicitantes Mujeres', value: 120, color: '#FF6B6B' },
  { label: 'Beneficiarios Hombres', value: 92, color: '#5DADE2' },
  { label: 'Beneficiarios Mujeres', value: 143, color: '#EC7063' },
];

// Calcular porcentajes dinámicamente
const totalPersonas = mockGenderData.reduce((sum, item) => sum + item.value, 0);
const dataWithPercentages = mockGenderData.map(item => ({
  ...item,
  porcentaje: (item.value / totalPersonas) * 100
}));

function ReportGenderDistribution() {
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Solicitantes y Beneficiarios por Género</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 40 }}>
          <View style={{ alignItems: 'center' }}>
            <BarChart 
              data={mockGenderData}
              width={300}
              height={200}
              barWidth={25}
            />
          </View>
          <View style={{ flexDirection: 'column', gap: 6, width: 280, flexShrink: 0 }}>
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
      </View>

    </>
  );
}

export default ReportGenderDistribution;
