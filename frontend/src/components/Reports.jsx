import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Chart from 'chart.js/auto'; // Importamos Chart.js

const History = () => {
  const userRole = useSelector((state) => state.user.role);
  const userId = useSelector((state) => state.user.userId);
  const [reportData, setReportData] = useState([]);
  const chartSalesRef = useRef(null);
  const chartQuantityRef = useRef(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getReportTopBooks');
        setReportData(response.data);
      } catch (error) {
        console.error('Error fetching report data:', error);
        // Manejo de errores con SweetAlert2 u otra biblioteca
      }
    };

    fetchReportData();
  }, []);

  useEffect(() => {
    // Destruir los gráficos anteriores antes de renderizar uno nuevo
    if (chartSalesRef.current) {
      chartSalesRef.current.destroy();
    }
    if (chartQuantityRef.current) {
      chartQuantityRef.current.destroy();
    }

    // Renderizar el gráfico de ventas por libro
    const salesCtx = document.getElementById('bar-chart-sales');
    if (salesCtx && reportData.length > 0) {
      chartSalesRef.current = new Chart(salesCtx, {
        type: 'bar',
        data: {
          labels: reportData.map(item => item.title),
          datasets: [
            {
              label: 'Ventas por Libro',
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
              hoverBorderColor: 'rgba(54, 162, 235, 1)',
              data: reportData.map(item => item.totalSales),
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 50,
              },
              title: {
                display: true,
                text: 'Ventas',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Títulos de Libros',
              },
            },
          },
        },
      });
    }

    // Renderizar el gráfico de cantidad vendida por libro
    const quantityCtx = document.getElementById('bar-chart-quantity');
    if (quantityCtx && reportData.length > 0) {
      chartQuantityRef.current = new Chart(quantityCtx, {
        type: 'bar',
        data: {
          labels: reportData.map(item => item.title),
          datasets: [
            {
              label: 'Cantidad Vendida por Libro',
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(255, 99, 132, 0.8)',
              hoverBorderColor: 'rgba(255, 99, 132, 1)',
              data: reportData.map(item => item.totalQuantitySold),
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
              title: {
                display: true,
                text: 'Cantidad Vendida',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Títulos de Libros',
              },
            },
          },
        },
      });
    }

    return () => {
      // Limpiar al desmontar el componente
      if (chartSalesRef.current) {
        chartSalesRef.current.destroy();
      }
      if (chartQuantityRef.current) {
        chartQuantityRef.current.destroy();
      }
    };
  }, [reportData]);

  return (
    <div className="author-container">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-400 to-red-500 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">¡Bienvenido al Área de Reportes!</h1>
          <p className="text-lg">Aquí puedes ver tus reportes actuales.</p>
        </div>
        <div className="p-6">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4">
              <canvas id="bar-chart-sales"></canvas>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6">
            <div className="p-4">
              <canvas id="bar-chart-quantity"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
