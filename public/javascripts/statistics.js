
$(document).ready(function () {
    $("#analisis-form").on("submit", function (event) {
      event.preventDefault(); // Evitar que el formulario recargue la página
  
      // Obtenemos los valores seleccionados
      const selectedYears = $("input[name='year']:checked")
        .map(function () {
          return $(this).val();
        })
        .get(); // Obtener valores seleccionados de checkboxes
  
      const selectedStation = $("select[name='station']").val(); // Obtener valor del select
  
      const selectedPollutants = $("input[name='pollutant']:checked")
        .map(function () {
          return $(this).val();
        })
        .get(); // Obtener valores seleccionados de checkboxes
  
      const selectedStatistic = $("select[name='statistic']").val(); // Obtener valor del select
  
      // Mostrar los valores seleccionados en la consola
      console.log("Años seleccionados:", selectedYears);
      console.log("Estación seleccionada:", selectedStation);
      console.log("Contaminantes seleccionados:", selectedPollutants);
      console.log("Estadística seleccionada:", selectedStatistic);

      // Construimos el objeto chartFiltros para enviar al backend
      const chartFiltros = {
        contaminantes: selectedPollutants, // Array de contaminantes seleccionados
        estaciones: selectedStation ? [selectedStation] : [], // Convertimos en array para cumplir con el backend
        regiones: [], // Puedes agregar regiones si las tienes en el formulario
        rangoFechas: {
          desde: "2024-01-01", // Sustituye con el rango de fechas deseado
          hasta: "2024-12-31", // Puedes obtener esto de inputs de tipo fecha
        },
      };
  
      getStatistics(chartFiltros).then((result) => {
        console.log(result); 
        // TODO llamar al chart para pintarlo, pendiente
      });
      
    });
  });


// Función para hacer la solicitud POST al backend
async function getStatistics(chartFiltros) {
    const apiUrl = "http://localhost:3000/api/statistics"; 
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chartFiltros),
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      const result = await response.json(); 
      return result;

    } catch (error) {
      console.error("Error al obtener las estadísticas:", error);
    }
  }
