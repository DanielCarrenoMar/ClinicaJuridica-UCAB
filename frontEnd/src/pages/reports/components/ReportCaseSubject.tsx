import {
  Text,
  View,
} from "@react-pdf/renderer";
import PieChart from './PieChart';
import { styleDocument } from "./ReportDocument";

// Datos de prueba para distribución de casos por materia
const mockCaseSubjectData = [
  { materia: 'Materia Civil', cantidad: 1099, porcentaje: 81.1, color: '#90EE90' },
  { materia: 'Otros', cantidad: 187, porcentaje: 13.8, color: '#4169E1' },
  { materia: 'Materia Penal', cantidad: 41, porcentaje: 3.0, color: '#9370DB' },
  { materia: 'Materia Mercantil', cantidad: 18, porcentaje: 1.3, color: '#FFD700' },
  { materia: 'Materia Laboral', cantidad: 10, porcentaje: 0.7, color: '#8B4513' },
];

function ReportCaseSubject() {
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Casos por Materia Jurídica</Text>
      
      <View style={styleDocument.section}>
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
            {mockCaseSubjectData.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 5 }}>
                <View style={{
                  width: 12,
                  height: 12,
                  backgroundColor: item.color,
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

    </>
  );
}

export default ReportCaseSubject;