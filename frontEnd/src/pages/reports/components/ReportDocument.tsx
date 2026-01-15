import { Document, Page, StyleSheet } from "@react-pdf/renderer";

export const styleDocument = StyleSheet.create({
  page: {
    backgroundColor: "#E4E4E4",
    padding: 30,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    display: "flex",
    flexDirection: "row",
    margin: 10,
    padding: 10,
  },
  parragraph: {
    fontSize: 12,
    textAlign: "justify",
    lineHeight: 1.5,
    margin: 10,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  }
});

interface DocumentProps {
    
    children?: React.ReactNode;
}

export default function ReportDocument({children}: DocumentProps) {
    return (
        <Document>
              <Page style={styleDocument.page}>
                    {children}
              </Page>
        </Document>
    )
}