// Función para cargar estaciones y agregarlas a los selects correspondientes
async function cargarEstaciones() {
  try {
    const response = await fetch("http://localhost:3000/api/estaciones");
    const estaciones = await response.json();

    // Actualizar el select del modal "Editar Estación"
    const selectEditar = document.getElementById("selectEstacion");
    if (!selectEditar) {
      console.error("Elemento 'selectEstacion' no encontrado.");
      return;
    }
    selectEditar.innerHTML = ""; // Limpiar opciones existentes
    estaciones.forEach((estacion) => {
      const option = document.createElement("option");
      option.value = estacion.id;
      option.textContent = estacion.nombre;
      selectEditar.appendChild(option);
    });

    // Actualizar el formulario del modal "Eliminar Estación"
    const formEliminar = document.getElementById("formEliminarEstaciones");
    if (!formEliminar) {
      console.error("Elemento 'formEliminarEstaciones' no encontrado.");
      return;
    }
    formEliminar.innerHTML = ""; // Limpiar opciones existentes
    estaciones.forEach((estacion) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = estacion.id;
      checkbox.id = `estacion-${estacion.id}`;

      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.textContent = estacion.nombre;

      const div = document.createElement("div");
      div.appendChild(checkbox);
      div.appendChild(label);

      formEliminar.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar las estaciones:", error);
  }
}

// Función para cargar regiones y agregarlas al select de "Agregar Estación" y "Editar Región"
async function cargarRegiones() {
  try {
    const response = await fetch("http://localhost:3000/api/regiones");
    const regiones = await response.json();

    // Actualizar el select de "Agregar Estación"
    const selectRegionEstacion = document.getElementById("regionEstacion");
    if (selectRegionEstacion) {
      selectRegionEstacion.innerHTML = ""; // Limpiar opciones existentes
      regiones.forEach((region) => {
        const option = document.createElement("option");
        option.value = region.id;
        option.textContent = region.nombre;
        selectRegionEstacion.appendChild(option);
      });
    }

    // Actualizar el select del modal "Editar Región"
    const selectRegionEditar = document.getElementById("selectRegion");
    if (selectRegionEditar) {
      selectRegionEditar.innerHTML = ""; // Limpiar opciones existentes
      regiones.forEach((region) => {
        const option = document.createElement("option");
        option.value = region.id;
        option.textContent = region.nombre;
        selectRegionEditar.appendChild(option);
      });
    }

    // Actualizar el select del modal "Eliminar Región"
    const selectEliminar = document.getElementById("selectEliminarRegion");
    if (selectEliminar) {
      selectEliminar.innerHTML = ""; // Limpiar opciones existentes
      regiones.forEach((region) => {
        const option = document.createElement("option");
        option.value = region.id;
        option.textContent = region.nombre;
        selectEliminar.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error al cargar las regiones:", error);
  }
}

// Cargar estaciones y regiones al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  cargarEstaciones(); // Cargar estaciones inicialmente
  cargarRegiones();   // Cargar regiones inicialmente

  const modalAgregarEstacion = document.getElementById("modalAgregarEstacion");
  if (modalAgregarEstacion) {
    modalAgregarEstacion.addEventListener("show.bs.modal", () => {
      cargarRegiones(); // Cargar las regiones cada vez que se abra el modal
    });
  }

  // Agregar estación
  document.getElementById("btnGuardarEstacion").addEventListener("click", async () => {
    const nombre = document.getElementById("nombreEstacion").value;
    const descripcion = document.getElementById("descripcionEstacion").value;
    const latitud = document.getElementById("latitudEstacion").value;
    const longitud = document.getElementById("longitudEstacion").value;
    const region_id = document.getElementById("regionEstacion").value;

    console.log({ nombre, descripcion, latitud, longitud, region_id }); // Verificar datos antes de enviar

    try {
      const response = await fetch("http://localhost:3000/api/estaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, latitud, longitud, region_id }),
      });
      if (response.ok) {
        alert("Estación creada con éxito");
        cargarEstaciones(); // Recargar estaciones
      } else {
        throw new Error("Error al crear la estación");
      }
    } catch (error) {
      console.error(error);
      alert("No se pudo crear la estación");
    }
  });

  // Editar estación
  document.getElementById("btnGuardarCambiosEstacion").addEventListener("click", async () => {
    const id = document.getElementById("selectEstacion").value;
    const nombre = document.getElementById("editarNombreEstacion").value;
    const descripcion = document.getElementById("editarDescripcionEstacion").value;
    const latitud = document.getElementById("editarLatitudEstacion").value;
    const longitud = document.getElementById("editarLongitudEstacion").value;

    try {
      const response = await fetch(`http://localhost:3000/api/estaciones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, latitud, longitud }),
      });
      if (response.ok) {
        alert("Estación actualizada con éxito");
        cargarEstaciones(); // Recargar estaciones
      } else {
        throw new Error("Error al actualizar la estación");
      }
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar la estación");
    }
  });

  // Eliminar estaciones seleccionadas
  document.getElementById("btnEliminarEstaciones").addEventListener("click", async () => {
    const checkboxes = Array.from(
      document.querySelectorAll("#formEliminarEstaciones input[type='checkbox']:checked")
    );
    const idsToDelete = checkboxes.map((checkbox) => checkbox.value);

    if (idsToDelete.length === 0) {
      alert("Por favor, selecciona al menos una estación para eliminar.");
      return;
    }

    try {
      for (const id of idsToDelete) {
        const response = await fetch(`http://localhost:3000/api/estaciones/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Error al eliminar la estación con ID ${id}`);
        }
      }
      alert("Estación(es) eliminada(s) con éxito");
      cargarEstaciones(); // Recargar estaciones
    } catch (error) {
      console.error(error);
      alert("No se pudieron eliminar las estaciones seleccionadas.");
    }
  });

  // Eliminar regiones seleccionadas
  document.getElementById("btnEliminarRegiones").addEventListener("click", async () => {
    const selectEliminar = document.getElementById("selectEliminarRegion");
    const selectedOptions = Array.from(selectEliminar.selectedOptions);
    const idsToDelete = selectedOptions.map(option => option.value);

    if (idsToDelete.length === 0) {
      alert("Por favor, selecciona al menos una región para eliminar.");
      return;
    }

    try {
      for (const id of idsToDelete) {
        const response = await fetch(`http://localhost:3000/api/regiones/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Error al eliminar la región con ID ${id}`);
        }
      }
      alert("Región(es) eliminada(s) con éxito");
      cargarRegiones(); // Recargar regiones
    } catch (error) {
      console.error(error);
      alert("No se pudieron eliminar las regiones seleccionadas.");
    }
  });
});
