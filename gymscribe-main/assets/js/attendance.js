import { isStorageExist, ATTENDANCE_KEY, ATTENDANCE_LAST_KEY } from './handler.js';

const blankData = {
  day1: { attended: 0, absence: 0 },
  day2: { attended: 0, absence: 0 },
  day3: { attended: 0, absence: 0 },
  day4: { attended: 0, absence: 0 },
  day5: { attended: 0, absence: 0 },
  day6: { attended: 0, absence: 0 },
  day7: { attended: 0, absence: 0 }
};

function cloneBlankData() {
  return JSON.parse(JSON.stringify(blankData));
}

function getAttendanceData() {
  try {
    if (!isStorageExist()) throw new Error('Storage is not available');
    
    const data = localStorage.getItem(ATTENDANCE_KEY);
    
    if (data) {
      return JSON.parse(data);
    } else {
      return cloneBlankData();
    }
  } catch (error) {
    console.error(error.message);
    
    return cloneBlankData();
  }
}

function isNewDay() {
  const lastUpdate = localStorage.getItem(ATTENDANCE_LAST_KEY);
  
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  if (lastUpdate !== todayString) {
    return true;
  }
  return false;
}

function shiftDays(oldData) {
  const newData = {
    day1: oldData.day2,
    day2: oldData.day3,
    day3: oldData.day4,
    day4: oldData.day5,
    day5: oldData.day6,
    day6: oldData.day7,
    day7: { attended: 0, absence: 0 }
  };
  
  return newData;
}

function saveTodayAttendance(attendedCount, absenceCount) {
  try {
    let data = getAttendanceData();
    
    if (isNewDay()) {
      data = shiftDays(data);
      
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      localStorage.setItem(ATTENDANCE_LAST_KEY, todayString);
    }
    
    data.day7.attended = attendedCount;
    data.day7.absence = absenceCount;
    
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data));
    
    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

function getChartData() {
  const data = getAttendanceData();
  
  const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'];
  
  const attended = [
    data.day1.attended,
    data.day2.attended,
    data.day3.attended,
    data.day4.attended,
    data.day5.attended,
    data.day6.attended,
    data.day7.attended
  ];
  
  return {
    labels: labels,
    attended: attended
  };
}

function createAttendanceChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  
  if (!canvas) {
    return null;
  }
  
  const chartData = getChartData();
  const xValues = chartData.labels;
  const yValues = chartData.attended;
  
  if (canvas.chart) {
    canvas.chart.destroy();
  }
  
  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: xValues,
      datasets: [{
        fill: false,
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderColor: "rgba(255, 255, 255, 0.4)",
        data: yValues
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {display: false},
        title: {
          display: true,
          text: "Last 7 Days Attendance",
          color: "rgba(255, 255, 255, 1)",
          font: {size: 28}
        }
      },
      scales: {
        x: {
          ticks: {
            font: {size: 28}
          }
        },
        y: {
          beginAtZero: true,
          grace: '10%',
          ticks: {
            stepSize: 1,
            font: {size: 28}
          }
        }
      }
    }
  });
  
  canvas.chart = chart;
  
  return chart;
}

function updateAttendanceChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  
  if (!canvas || !canvas.chart) {
    return createAttendanceChart(canvasId);
  }
  
  const chartData = getChartData();
  const xValues = chartData.labels;
  const yValues = chartData.attended;
  
  canvas.chart.data.labels = xValues;
  canvas.chart.data.datasets[0].data = yValues;
  
  canvas.chart.update();
  
  return canvas.chart;
}

function clearAttendanceData() {
  localStorage.removeItem(ATTENDANCE_KEY);
  localStorage.removeItem(ATTENDANCE_LAST_KEY);
}

export {
  saveTodayAttendance,
  getAttendanceData,
  getChartData,
  createAttendanceChart,
  updateAttendanceChart,
  clearAttendanceData
};