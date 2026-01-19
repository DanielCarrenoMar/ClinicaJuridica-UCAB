import {
  Text,
  View,
} from "@react-pdf/renderer";
import PieChart from './PieChart';
import { styleDocument } from "./ReportDocument";

// Datos de prueba para estudiantes involucrados por tipo
const mockStudentData = [
  { tipo: 'Asistente', cantidad: 167, color: '#FF6B6B' },
  { tipo: 'Investigador', cantidad: 94, color: '#4ECDC4' },
  { tipo: 'Redactor', cantidad: 52, color: '#45B7D1' },
  { tipo: 'Representante', cantidad: 33, color: '#96CEB4' },
];

// Calcular porcentajes dinámicamente
const totalEstudiantes = mockStudentData.reduce((sum, item) => sum + item.cantidad, 0);
const dataWithPercentages = mockStudentData.map(item => ({
  ...item,
  porcentaje: (item.cantidad / totalEstudiantes) * 100
}));

function ReportStudentInvolvement() {
  return (
    <>
      <Text style={styleDocument.title}>Estudiantes Involucrados por Tipo</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center' }}>
            <PieChart 
              data={mockStudentData.map(item => ({
                label: item.tipo,
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
                  {item.tipo}: {item.cantidad} ({item.porcentaje.toFixed(1)}%)
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

    </>
  );
}

export default ReportStudentInvolvement;
