import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { formatReportTitle } from "../../../utils/dateUtils";
import ucabLogoTipo from "#assets/ucabLogoTipo.jpg";
import { styleDocument } from "./styleData";

interface DocumentProps {
  startDate?: Date;
  endDate?: Date;
  children?: React.ReactNode;
}

export default function ReportDocument({ children, startDate, endDate }: DocumentProps) {
  const childrenArray = Array.isArray(children) ? children : [children];
  const reportTitle = startDate && endDate ? formatReportTitle(startDate, endDate) : "ESTADÍSTICAS CCJ";

  return (
    <Document>
      <Page style={styleDocument.page} size="A4" orientation="landscape">
        <View style={styleDocument.header}>
          <Text style={styleDocument.mainTitle}>{reportTitle}</Text>
          <View style={styleDocument.subtitleRow}>
            <Image style={styleDocument.logo} src={ucabLogoTipo} />
            <Text style={styleDocument.subtitleText}>CENTRO{"\n"}DE CLÍNICA JURÍDICA</Text>
          </View>
        </View>
      </Page>
      {childrenArray.map((child, index) => (
        <Page key={index} style={styleDocument.page} size="A4" orientation="landscape">

          {child}

          <View style={styleDocument.pageNumber}>
            <Text render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`} />
          </View>
        </Page>
      ))}
    </Document>
  )
}