import {
  Text,
  View,
} from "@react-pdf/renderer";
import BarChart from './BarChart';
import { styleDocument } from "./ReportDocument";

// Datos de prueba para distribución de beneficiarios
const mockBeneficiaryData = [
  { label: 'Beneficiarios Directos', value: 245, color: '#3498DB' },
  { label: 'Beneficiarios Indirectos', value: 189, color: '#E74C3C' },
];

// Calcular porcentajes dinámicamente
const totalBeneficiarios = mockBeneficiaryData.reduce((sum, item) => sum + item.value, 0);
const dataWithPercentages = mockBeneficiaryData.map(item => ({
  ...item,
  porcentaje: (item.value / totalBeneficiarios) * 100
}));

function ReportBeneficiaryTypeDistribution() {
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Beneficiarios por Tipo</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 40 }}>
          <View style={{ alignItems: 'center' }}>
            <BarChart 
              data={mockBeneficiaryData}
              width={350}
              height={220}
              barWidth={40}
            />
          </View>
          <View style={{ flexDirection: 'column', gap: 8, width: 300, flexShrink: 0 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
              Resumen de Beneficiarios
            </Text>
            {dataWithPercentages.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <View style={{
                  width: 16,
                  height: 16,
                  backgroundColor: item.color,
                  marginRight: 10,
                  flexShrink: 0,
                  borderRadius: 2
                }} />
                <Text style={{ fontSize: 11, flex: 1 }}>
                  {item.label}: {item.value} ({item.porcentaje.toFixed(1)}%)
                </Text>
              </View>
            ))}
            <View style={{ marginTop: 15, padding: 10, backgroundColor: '#F8F9FA', borderRadius: 4 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>
                Total General:
              </Text>
              <Text style={{ fontSize: 12 }}>
                {totalBeneficiarios} beneficiarios
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
          Descripción
        </Text>
        <Text style={{ fontSize: 10, lineHeight: 1.5, textAlign: 'justify' }}>
          Este reporte muestra la distribución de beneficiarios atendidos por el Centro de Clínica Jurídica, 
          clasificados en dos categorías principales: beneficiarios directos, que son aquellos que reciben 
          asistencia legal personalizada, y beneficiarios indirectos, que son las personas que se benefician 
          de manera secundaria a través de los casos atendidos. La visualización permite identificar el alcance 
          real del impacto del servicio legal proporcionado por la clínica.
        </Text>
      </View>

    </>
  );
}

export default ReportBeneficiaryTypeDistribution;
