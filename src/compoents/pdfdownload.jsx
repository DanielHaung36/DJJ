import React from 'react'
import PDFDownloadLink from "@react-pdf/renderer"
import Quixote from './genneratepdf'
export default function pdfdownload() {
  return (
    <div>
    <PDFDownloadLink document={<Quixote />} fileName="somename.pdf">
      {({ loading }) => (loading ? "Loading document..." : "Download now!")}
    </PDFDownloadLink>
  </div>
  )
}
