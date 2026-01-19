import { Document, Page, StyleSheet, View, Text, Image } from "@react-pdf/renderer";
import { formatReportTitle } from "../../../utils/dateUtils";
import ucabLogoTipo from "#assets/ucabLogoTipo.jpg";

export const styleDocument = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 12,
    justifyContent: "center",
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 16,
    letterSpacing: 0.6,
    lineHeight: 1.25,
  },
  logo: {
    width: 120,
    height: 40,
    marginRight: 12,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  subtitleText: {
    fontSize: 14,
    textAlign: "left",
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    margin: 15,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  parragraph: {
    fontSize: 11,
    textAlign: "justify",
    lineHeight: 1.6,
    margin: 10,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 10,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  }
});

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