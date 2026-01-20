import {
  Text,
  View,
} from "@react-pdf/renderer";
import { styleDocument } from "./styleData";

interface NotImplementedReportProps {
  reportId: number;
}

function NotImplementedReport({ reportId }: NotImplementedReportProps) {
  return (
    <>
      <Text style={styleDocument.title}>Reporte #{reportId}</Text>
      <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
        <Text style={{ fontSize: 12, textAlign: 'center' }}>
          Este reporte aún no ha sido implementado en el nuevo sistema.
        </Text>
      </View>
    </>
  );
}

export default NotImplementedReport;
