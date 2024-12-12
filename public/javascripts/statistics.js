$(document).ready(function () {
  // Cargar estaciones al cargar la página
  fetch("http://localhost:3000/api/estaciones")
    .then((response) => response.json())
    .then((estaciones) => {
      console.log("Estaciones recibidas:", estaciones); // Verifica las estaciones recibidas

      // Verificar si las estaciones se han recibido correctamente
      if (Array.isArray(estaciones) && estaciones.length > 0) {
        // Selección del contenedor de estaciones
        const estacionesContainer = $("#estacionesContainer");
        estacionesContainer.empty(); // Limpiar las estaciones anteriores

        // Añadir las estaciones como botones pequeños
        estaciones.forEach((estacion) => {
          estacionesContainer.append(
            `<div class="col-md-3 mb-2">
                <button class="btn btn-outline-primary btn-block w-100" onclick="seleccionarEstacion(${estacion.id}, '${estacion.nombre}', this)">
                    ${estacion.nombre}
                </button>
            </div>`
          );
        });
        console.log("Estaciones agregadas como botones");
      } else {
        console.error("No se encontraron estaciones o el array está vacío");
      }
    })
    .catch((error) => console.error("Error al cargar estaciones:", error));

  // Cargar contaminantes
  fetch("http://localhost:3000/api/contaminantes")
    .then((response) => response.json())
    .then((contaminantes) => {
      const contaminantesContainer = $("#contaminante-checkboxes");
      contaminantes.forEach((contaminante) => {
        contaminantesContainer.append(`
          <div class="form-check">
              <input class="form-check-input" type="checkbox" value="${contaminante.id}" id="contaminante-${contaminante.id}">
              <label class="form-check-label" for="contaminante-${contaminante.id}">
                  ${contaminante.nombre}
              </label>
          </div>
        `);
      });
    })
    .catch((error) => console.error("Error al cargar contaminantes:", error));

  // Manejar el envío del formulario
  $("#analisis-form").on("submit", function (event) {
    event.preventDefault();

    const rangoFechas = {
      desde: $("#fechaInicio").val(),
      hasta: $("#fechaFin").val(),
    };

    const estaciones = $("#selectedEstacion").val();
    const contaminantes = $("input[type='checkbox']:checked")
      .map(function () {
        return $(this).val();
      })
      .get();

    const filtros = {
      contaminantes,
      estaciones,
      rangoFechas,
    };

    console.log("Filtros enviados al backend:", filtros); // Depura los filtros enviados

    // Llamada al backend
    fetch("http://localhost:3000/api/statistics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filtros),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Resultados obtenidos:", result);
        
        // Mostrar el resultado en el contenedor
        const resultadoContainer = $("#resultado-analisis");
        resultadoContainer.empty(); // Limpiar el contenedor de resultados previos
        
        if (result && result.length > 0) {
          // Aquí puedes formatear el resultado de la forma que necesites
          result.forEach((row) => {
            resultadoContainer.append(`
              <div class="card mb-3">
                <div class="card-body">
                  <h5 class="card-title">Contaminante: ${row.contaminante}</h5>
                  <p><strong>Estación:</strong> ${row.estacion}</p>
                  <p><strong>Promedio:</strong> ${row.promedio}</p>
                  <p><strong>Desviación Estándar:</strong> ${row.desviacion_estandar}</p>
                  <p><strong>Máximo:</strong> ${row.maximo}</p>
                  <p><strong>Mínimo:</strong> ${row.minimo}</p>
                  <p><strong>Rango:</strong> ${row.rango}</p>
                  <p><strong>Cuartil 1:</strong> ${row.cuartil_1}</p>
                  <p><strong>Mediana:</strong> ${row.mediana}</p>
                  <p><strong>Cuartil 3:</strong> ${row.cuartil_3}</p>
                </div>
              </div>
            `);
          });
        } else {
          resultadoContainer.append("<p>No se encontraron resultados para los filtros seleccionados.</p>");
        }
      })
      .catch((error) => console.error("Error al enviar datos:", error));
  });
});

// Función para seleccionar estación y deseleccionar otras
function seleccionarEstacion(id, nombre, boton) {
  const selectedEstacionInput = $("#selectedEstacion");

  // Primero desmarcar todos los botones
  $("button").removeClass("active");

  // Marcar el botón clicado
  $(boton).addClass("active");

  // Guardar el ID de la estación seleccionada en el campo oculto
  selectedEstacionInput.val(id);

  console.log("Estación seleccionada:", nombre);
}
