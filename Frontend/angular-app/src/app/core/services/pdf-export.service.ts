import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  constructor() {}

  /**
   * Export Global Analytics to PDF
   */
  exportGlobalAnalyticsPDF(data: any): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(37, 99, 235); // Blue
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Logo/Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SMARTEK', 15, 20);
    
    doc.setFontSize(16);
    doc.text('Global Analytics Report', 15, 32);
    
    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(`Generated on: ${currentDate}`, pageWidth - 15, 32, { align: 'right' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Summary Statistics
    let yPos = 55;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary Statistics', 15, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const stats = [
      ['Total Skill Evidence', data.totalEvidence || 0],
      ['Pending Review', data.pendingCount || 0],
      ['Approved', data.approvedCount || 0],
      ['Rejected', data.rejectedCount || 0],
      ['Total Learners', data.totalLearners || 0],
      ['Average Score', data.averageScore ? data.averageScore.toFixed(2) : 'N/A']
    ];
    
    autoTable(doc, {
      startY: yPos,
      head: [['Metric', 'Value']],
      body: stats,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      margin: { left: 15, right: 15 }
    });
    
    // Status Distribution
    yPos = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Status Distribution', 15, yPos);
    
    yPos += 10;
    const statusData = [
      ['Pending', data.pendingCount || 0, `${data.pendingPercentage || 0}%`],
      ['Approved', data.approvedCount || 0, `${data.approvedPercentage || 0}%`],
      ['Rejected', data.rejectedCount || 0, `${data.rejectedPercentage || 0}%`]
    ];
    
    autoTable(doc, {
      startY: yPos,
      head: [['Status', 'Count', 'Percentage']],
      body: statusData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      margin: { left: 15, right: 15 }
    });
    
    // Category Distribution (if available)
    if (data.categoryDistribution && data.categoryDistribution.length > 0) {
      yPos = (doc as any).lastAutoTable.finalY + 15;
      
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Category Distribution', 15, yPos);
      
      yPos += 10;
      const categoryData = data.categoryDistribution.map((cat: any) => [
        cat.category,
        cat.count,
        `${cat.percentage}%`
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Category', 'Count', 'Percentage']],
        body: categoryData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        margin: { left: 15, right: 15 }
      });
    }
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
      doc.text(
        '© SMARTEK - Confidential',
        15,
        doc.internal.pageSize.getHeight() - 10
      );
    }
    
    // Save PDF
    doc.save(`Global_Analytics_Report_${new Date().getTime()}.pdf`);
  }

  /**
   * Export Learner Analytics to PDF
   */
  exportLearnerAnalyticsPDF(data: any, learnerName: string): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SMARTEK', 15, 20);
    
    doc.setFontSize(16);
    doc.text('Learner Analytics Report', 15, 32);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(`Generated on: ${currentDate}`, pageWidth - 15, 32, { align: 'right' });
    
    doc.setTextColor(0, 0, 0);
    
    // Learner Info
    let yPos = 55;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Learner: ${learnerName}`, 15, yPos);
    
    // Summary Statistics
    yPos += 15;
    doc.setFontSize(12);
    doc.text('Performance Summary', 15, yPos);
    
    yPos += 10;
    const stats = [
      ['Total Submissions', data.totalEvidence || 0],
      ['Approved', data.approvedCount || 0],
      ['Pending Review', data.pendingCount || 0],
      ['Rejected', data.rejectedCount || 0],
      ['Average Score', data.averageScore ? data.averageScore.toFixed(2) : 'N/A'],
      ['Success Rate', data.successRate ? `${data.successRate.toFixed(1)}%` : 'N/A']
    ];
    
    autoTable(doc, {
      startY: yPos,
      head: [['Metric', 'Value']],
      body: stats,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      margin: { left: 15, right: 15 }
    });
    
    // Category Performance
    if (data.categoryPerformance && data.categoryPerformance.length > 0) {
      yPos = (doc as any).lastAutoTable.finalY + 15;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Performance by Category', 15, yPos);
      
      yPos += 10;
      const categoryData = data.categoryPerformance.map((cat: any) => [
        cat.category,
        cat.count,
        cat.approved,
        `${cat.successRate}%`
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Category', 'Total', 'Approved', 'Success Rate']],
        body: categoryData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        margin: { left: 15, right: 15 }
      });
    }
    
    // Recent Activity
    if (data.recentActivity && data.recentActivity.length > 0) {
      yPos = (doc as any).lastAutoTable.finalY + 15;
      
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Recent Activity', 15, yPos);
      
      yPos += 10;
      const activityData = data.recentActivity.slice(0, 10).map((activity: any) => [
        new Date(activity.submittedAt).toLocaleDateString(),
        activity.category,
        activity.status,
        activity.score || 'N/A'
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Date', 'Category', 'Status', 'Score']],
        body: activityData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        margin: { left: 15, right: 15 },
        styles: { fontSize: 9 }
      });
    }
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
      doc.text(
        '© SMARTEK - Confidential',
        15,
        doc.internal.pageSize.getHeight() - 10
      );
    }
    
    // Save PDF
    doc.save(`${learnerName}_Analytics_Report_${new Date().getTime()}.pdf`);
  }
}
