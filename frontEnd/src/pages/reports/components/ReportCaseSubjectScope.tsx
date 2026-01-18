import {
  Text,
  View,
} from "@react-pdf/renderer";
import PieChart from './PieChart';
import { styleDocument } from "./ReportDocument";

// Datos de prueba para distribución de casos por materia y ámbito
const mockCaseSubjectScopeData = [
  { materia: 'Derecho Civil', ambito: 'Judicial', cantidad: 45, color: '#90EE90' },
  { materia: 'Derecho Civil', ambito: 'Extrajudicial', cantidad: 22, color: '#87CEEB' },
  { materia: 'Derecho Laboral', ambito: 'Judicial', cantidad: 38, color: '#4169E1' },
  { materia: 'Derecho Laboral', ambito: 'Extrajudicial', cantidad: 14, color: '#6495ED' },
  { materia: 'Derecho Familiar', ambito: 'Judicial', cantidad: 32, color: '#9370DB' },
  { materia: 'Derecho Familiar', ambito: 'Extrajudicial', cantidad: 16, color: '#BA55D3' },
  { materia: 'Derecho Penal', ambito: 'Judicial', cantidad: 35, color: '#FF6347' },
  { materia: 'Derecho Administrativo', ambito: 'Judicial', cantidad: 18, color: '#FFD700' },
  { materia: 'Derecho Administrativo', ambito: 'Extrajudicial', cantidad: 5, color: '#FFA500' },
  { materia: 'Derecho Mercantil', ambito: 'Judicial', cantidad: 8, color: '#8B4513' },
  { materia: 'Derecho Mercantil', ambito: 'Extrajudicial', cantidad: 3, color: '#D2691E' },
];

// Calcular porcentajes dinámicamente
const totalCasos = mockCaseSubjectScopeData.reduce((sum, item) => sum + item.cantidad, 0);
const dataWithPercentages = mockCaseSubjectScopeData.map(item => ({
  ...item,
  porcentaje: (item.cantidad / totalCasos) * 100
}));

function ReportCaseSubjectScope() {
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Casos por Materia y Ámbito</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center' }}>
            <PieChart 
              data={mockCaseSubjectScopeData.map(item => ({
                label: `${item.materia} - ${item.ambito}`,
                value: item.cantidad,
                color: item.color
              }))}
              size={150}
              is3D={false}
              showLabels={false}
            />
          </View>
          <View style={{ flexDirection: 'column', gap: 8, maxWidth: 200 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>
              Leyenda
            </Text>
            {dataWithPercentages.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 5 }}>
                <View style={{
                  width: 12,
                  height: 12,
                  backgroundColor: item.color,
                  marginRight: 8
                }} />
                <Text style={{ fontSize: 10 }}>
                  {item.materia} ({item.ambito}): {item.cantidad} ({item.porcentaje.toFixed(1)}%)
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

    </>
  );
}

export default ReportCaseSubjectScope;
