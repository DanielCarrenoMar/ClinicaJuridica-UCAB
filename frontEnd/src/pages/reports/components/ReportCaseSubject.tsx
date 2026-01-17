import {
  Text,
  View,
} from "@react-pdf/renderer";
import PieChart from './PieChart';
import { styleDocument } from "./ReportDocument";

// Datos de prueba para distribución de casos por materia
const mockCaseSubjectData = [
  { materia: 'Materia Civil', cantidad: 1099, color: '#90EE90' },
  { materia: 'Otros', cantidad: 187, color: '#4169E1' },
  { materia: 'Materia Penal', cantidad: 41, color: '#9370DB' },
  { materia: 'Materia Mercantil', cantidad: 18, color: '#FFD700' },
  { materia: 'Materia Laboral', cantidad: 10, color: '#8B4513' },
];

// Calcular porcentajes dinámicamente
const totalCasos = mockCaseSubjectData.reduce((sum, item) => sum + item.cantidad, 0);
const dataWithPercentages = mockCaseSubjectData.map(item => ({
  ...item,
  porcentaje: (item.cantidad / totalCasos) * 100
}));

function ReportCaseSubject() {
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Casos por Materia Jurídica</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center' }}>
            <PieChart 
              data={mockCaseSubjectData.map(item => ({
                label: item.materia,
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
                  {item.materia}: {item.cantidad} ({item.porcentaje.toFixed(1)}%)
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

    </>
  );
}

export default ReportCaseSubject;