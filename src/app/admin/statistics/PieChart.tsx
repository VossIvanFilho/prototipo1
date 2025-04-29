"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = {
        labels: ['January', 'February', 'March', 'April'],
        datasets: [
          {
            label: 'Sales',
            data: [50, 100, 150, 200],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
            ],
          },
        ],
      };
      setChartData(data);
    };

    fetchData();
  }, []);

  const exportToPDF = async () => {
    const doc = new jsPDF();
    const chartElement = document.querySelector('canvas');
    if (chartElement) {
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL('image/png');

      // Add title and subtitle
      doc.setFontSize(18);
      doc.text('Sales Statistics Report', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text('Generated on April 29, 2025', 105, 30, { align: 'center' });

      // Add chart image
      doc.addImage(imgData, 'PNG', 15, 40, 180, 90);

      // Add data table
      doc.setFontSize(10);
      doc.text('Data Summary:', 15, 140);
      chartData.labels.forEach((label, index) => {
        doc.text(`${label}: ${chartData.datasets[0].data[index]}`, 15, 150 + index * 10);
      });

      // Add footer
      doc.setFontSize(8);
      doc.text('Page 1 of 1', 105, 290, { align: 'center' });

      doc.save('statistics_report.pdf');
    }
  };

  return (
    <div>
      <Pie data={chartData} options={{ maintainAspectRatio: true, responsive: true }} />
      <button onClick={exportToPDF} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Export to PDF
      </button>
    </div>
  );
}