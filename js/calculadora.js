"use strict";

const materiales = [
  { id: 'teja', nombre: 'Teja de barro', coef: 0.90 },
  { id: 'lamina', nombre: 'Lámina metálica', coef: 0.85 },
  { id: 'concreto', nombre: 'Concreto', coef: 0.60 }
];

const LITROS_POR_MM_M2 = 1;

const materialSelect = document.getElementById('material');
materiales.forEach(m => {
  const opt = document.createElement('option');
  opt.value = m.id;
  opt.textContent = `${m.nombre} (coef ${m.coef})`;
  materialSelect.appendChild(opt);
});

function validatePositiveNumber(value) {
  const n = Number(value);
  return !Number.isNaN(n) && n > 0;
}

function showError(msg) {
  const el = document.getElementById('errors');
  el.textContent = msg;
}

function clearError() {
  document.getElementById('errors').textContent = '';
}

function calcularVolumen({ area, precipitacion, coef, eficiencia }) {
  const eficienciaFrac = eficiencia / 100;
  return area * precipitacion * coef * eficienciaFrac * LITROS_POR_MM_M2;
}

function renderResultados(volumenLitros) {
  const panel = document.getElementById('result-panel');
  if (!volumenLitros || volumenLitros <= 0) {
    panel.innerHTML = `<p style="color:var(--muted)">No hay resultados válidos. Ajusta los valores e intenta de nuevo.</p>`;
    return;
  }

  const litrosDiarios = volumenLitros.toFixed(1);
  const recomendado = Math.ceil(volumenLitros / 500) * 500;

  panel.innerHTML = `
    <div style="background:var(--card);padding:.75rem;border-radius:8px;border:1px solid rgba(15,23,42,0.03)">
      <div><strong>Volumen estimado:</strong> ${litrosDiarios} L</div>
      <div style="color:var(--muted);margin-top:.35rem">(Estimación para el periodo de precipitación ingresado)</div>
      <div style="margin-top:.6rem"><strong>Tanque recomendado:</strong> ${recomendado} L</div>
    </div>
  `;
}

const form = document.getElementById('calc-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearError();

  const area = document.getElementById('area').value;
  const precip = document.getElementById('precipitacion').value;
  const mat = document.getElementById('material').value;
  const eficiencia = document.getElementById('eficiencia').value;

  if (!validatePositiveNumber(area)) {
    showError('Ingresa un área válida mayor que 0.');
    return;
  }

  if (!validatePositiveNumber(precip)) {
    showError('Ingresa una precipitación válida mayor que 0.');
    return;
  }

  if (!eficiencia || Number(eficiencia) <= 0 || Number(eficiencia) > 100) {
    showError('La eficiencia debe estar entre 0 y 100.');
    return;
  }

  const materialObj = materiales.find(m => m.id === mat);
  if (!materialObj) {
    showError('Selecciona un material de techo válido.');
    return;
  }

  const volumen = calcularVolumen({
    area: Number(area),
    precipitacion: Number(precip),
    coef: materialObj.coef,
    eficiencia: Number(eficiencia)
  });

  renderResultados(volumen);
});


document.getElementById('limpiar').addEventListener('click', () => {
  form.reset();
  clearError();
  document.getElementById('result-panel').innerHTML =
    `<p style="color:var(--muted)">Aquí se mostrarán los resultados una vez que completes el formulario.</p>`;
});

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("calc-form");
    const resultPanel = document.getElementById("result-panel");
    const chartWrap = document.querySelector(".chart-wrap");
    const ctx = document.getElementById("resultsChart").getContext("2d");
    const errors = document.getElementById("errors");

    let myChart;

    function mostrarResultados(datos) {
        const { litrosCaptados, ahorroAnual, tiempoRecuperacion } = datos;

        resultPanel.innerHTML = `
            <h3>Resultados</h3>
            <p>Litros captados: <strong>${litrosCaptados.toFixed(2)} L</strong></p>
            <p>Ahorro aproximado por año: <strong>$${ahorroAnual.toFixed(2)}</strong></p>
            <p>Tiempo estimado para recuperar inversión: <strong>${tiempoRecuperacion} años</strong></p>
            <p>Comparte tu resultado:</p>
            <button id="shareFacebook">Facebook</button>
            <button id="shareWhatsApp">WhatsApp</button>
        `;
        const usos = ["Riego Jardín", "Limpieza", "Lavado de Autos", "Sanitario"];
        const cantidades = [
            litrosCaptados * 0.4,
            litrosCaptados * 0.3,
            litrosCaptados * 0.2,
            litrosCaptados * 0.1
        ];

        chartWrap.style.display = "block";
        if (myChart) myChart.destroy();
        myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: usos,
                datasets: [{
                    label: 'Uso del agua captada (litros)',
                    data: cantidades,
                    backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0']
                }]
            },
            options: {
                responsive: true
            }
        });
        document.getElementById("shareWhatsApp").addEventListener("click", () => {
            const mensaje = `He calculado que puedo captar ${litrosCaptados.toFixed(2)} L de agua de lluvia, ahorrando aproximadamente $${ahorroAnual.toFixed(2)} al año. ¡Tú también puedes hacerlo!`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`, '_blank');
        });

        document.getElementById("shareFacebook").addEventListener("click", () => {
            const url = `https://www.facebook.com/sharer/sharer.php?u=&quote=He calculado que puedo captar ${litrosCaptados.toFixed(2)} L de agua de lluvia, ahorrando aproximadamente $${ahorroAnual.toFixed(2)} al año. ¡Tú también puedes hacerlo!`;
            window.open(url, '_blank');
        });
    }
    const datosGuardados = localStorage.getItem("resultadosAgua");
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        mostrarResultados(datos);
    }
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const area = parseFloat(document.getElementById("area").value);
        const precipitacion = parseFloat(document.getElementById("precipitacion").value);
        const eficiencia = parseFloat(document.getElementById("eficiencia").value) / 100;
        const presupuesto = parseFloat(document.getElementById("presupuesto").value);

        if (isNaN(area) || isNaN(precipitacion) || isNaN(eficiencia) || isNaN(presupuesto) ||
            area <= 0 || precipitacion <= 0 || eficiencia <= 0 || presupuesto <= 0) {
            errors.innerText = "Todos los campos deben ser mayores a cero.";
            return;
        } else {
            errors.innerText = "";
        }

        const litrosCaptados = area * precipitacion * eficiencia;
        const metrosCubicos = litrosCaptados / 1000;
        const precioAgua = 20;
        const ahorroAnual = metrosCubicos * precioAgua;
        const tiempoRecuperacion = ahorroAnual > 0 ? (presupuesto / ahorroAnual).toFixed(1) : "∞";

        const resultados = { litrosCaptados, ahorroAnual, tiempoRecuperacion };

        localStorage.setItem("resultadosAgua", JSON.stringify(resultados));
        mostrarResultados(resultados);
    });
    document.getElementById("limpiar").addEventListener("click", function () {
        form.reset();
        resultPanel.innerHTML = '<p style="color:var(--muted)">Aquí se mostrarán los resultados una vez que completes el formulario.</p>';
        chartWrap.style.display = "none";
        if (myChart) myChart.destroy();
        localStorage.removeItem("resultadosAgua");
    });

});
