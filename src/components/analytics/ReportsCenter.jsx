import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function ReportsCenter() {
  const [isGenerating, setIsGenerating] = useState(false);

  const mockData = [
    { id: 'W-1001', name: 'Ramesh Kumar', category: 'Delivery', state: 'MH', status: 'Verified', loan: 'Approved' },
    { id: 'W-1002', name: 'Sita Devi', category: 'Domestic Worker', state: 'UP', status: 'Pending', loan: 'N/A' },
    { id: 'W-1003', name: 'Abdul Khan', category: 'Construction', state: 'DL', status: 'Verified', loan: 'Rejected' },
    { id: 'W-1004', name: 'Priya Sharma', category: 'Gig Worker', state: 'KA', status: 'Verified', loan: 'Approved' },
    { id: 'W-1005', name: 'Kishore Bhai', category: 'Street Vendor', state: 'GJ', status: 'Verified', loan: 'Approved' },
  ];

  const generatePDF = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const doc = new jsPDF();
      
      // Professional Header
      doc.setFontSize(22);
      doc.setTextColor(37, 99, 235); // Blue
      doc.text('SAHAYATA ENTERPRISE PLATFORM', 14, 22);
      
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 100);
      doc.text('Executive Impact Report', 14, 32);
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 40);
      
      // AutoTable
      doc.autoTable({
        startY: 50,
        head: [['ID', 'Name', 'Category', 'State', 'Status', 'Loan']],
        body: mockData.map(item => [item.id, item.name, item.category, item.state, item.status, item.loan]),
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] },
        styles: { font: 'helvetica', fontSize: 10 }
      });
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text('Confidential - For Government & Enterprise Partners Only', 14, doc.internal.pageSize.height - 10);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
      }

      doc.save('Sahayata_Executive_Report.pdf');
      setIsGenerating(false);
    }, 800);
  };

  const generateExcel = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const worksheet = XLSX.utils.json_to_sheet(mockData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Worker_Data");
      XLSX.writeFile(workbook, "Sahayata_Data_Export.xlsx");
      setIsGenerating(false);
    }, 500);
  };

  const generateCSV = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const worksheet = XLSX.utils.json_to_sheet(mockData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'Sahayata_Data_Export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsGenerating(false);
    }, 300);
  };

  return (
    <div className="analytics-card" style={{ marginBottom: '2rem' }}>
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Reports Center</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Download official enterprise records and summaries</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <button 
          onClick={generatePDF}
          disabled={isGenerating}
          className="analytics-btn analytics-btn-secondary" 
          style={{ justifyContent: 'center', height: '60px', flexDirection: 'column', gap: '4px' }}
        >
          <FileText size={20} color="#ef4444" />
          <span style={{ fontSize: '0.875rem' }}>Export PDF Report</span>
        </button>

        <button 
          onClick={generateExcel}
          disabled={isGenerating}
          className="analytics-btn analytics-btn-secondary" 
          style={{ justifyContent: 'center', height: '60px', flexDirection: 'column', gap: '4px' }}
        >
          <FileSpreadsheet size={20} color="#10b981" />
          <span style={{ fontSize: '0.875rem' }}>Export Excel (XLSX)</span>
        </button>

        <button 
          onClick={generateCSV}
          disabled={isGenerating}
          className="analytics-btn analytics-btn-secondary" 
          style={{ justifyContent: 'center', height: '60px', flexDirection: 'column', gap: '4px' }}
        >
          <File size={20} color="#38bdf8" />
          <span style={{ fontSize: '0.875rem' }}>Export Raw CSV</span>
        </button>

        <button 
          onClick={() => window.print()}
          className="analytics-btn analytics-btn-secondary" 
          style={{ justifyContent: 'center', height: '60px', flexDirection: 'column', gap: '4px' }}
        >
          <Printer size={20} color="#6b7280" />
          <span style={{ fontSize: '0.875rem' }}>Print Dashboard</span>
        </button>
      </div>
    </div>
  );
}
