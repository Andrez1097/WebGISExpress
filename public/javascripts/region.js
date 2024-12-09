async function cargarRegiones() {
    try {
        const response = await fetch("http://localhost:3000/api/regiones");
        if (!response.ok) {
            throw new Error("Error al cargar las regiones");
        }
        const regiones = await response.json();

        // Actualizar el select del modal "Editar Región"
        const selectEditar = document.getElementById("selectRegion");
        selectEditar.innerHTML = ""; // Limpiar opciones existentes
        regiones.forEach(region => {
            const option = document.createElement("option");
            option.value = region.id;
            option.textContent = region.nombre;
            selectEditar.appendChild(option);
        });

        // Actualizar el select del modal "Eliminar Región"
        const selectEliminar = document.getElementById("selectEliminarRegion");
        selectEliminar.innerHTML = ""; // Limpiar opciones existentes
        regiones.forEach(region => {
            const option = document.createElement("option");
            option.value = region.id;
            option.textContent = region.nombre;
            selectEliminar.appendChild(option);
        });

    } catch (error) {
        console.error("Error al cargar las regiones:", error);
        alert("No se pudieron cargar las regiones");
    }
}

// Event listeners para cargar regiones y manejar acciones
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("modalEditarRegion").addEventListener("show.bs.modal", cargarRegiones);
    document.getElementById("modalEliminarRegion").addEventListener("show.bs.modal", cargarRegiones);

    // Agregar nueva región
    document.getElementById("btnGuardarRegion").addEventListener("click", async () => {
        const nombre = document.getElementById("nombre").value;
        const descripcion = document.getElementById("descripcion").value;

        if (!nombre || !descripcion) {
            alert("Por favor, ingresa el nombre y la descripción de la región.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/regiones", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, descripcion }),
            });
            if (response.ok) {
                alert("Región creada con éxito");
                cargarRegiones();
            } else {
                throw new Error("Error al crear la región");
            }
        } catch (error) {
            console.error(error);
            alert("No se pudo crear la región");
        }
    });

    // Editar región existente
    document.getElementById("btnGuardarCambios").addEventListener("click", async () => {
        const id = document.getElementById("selectRegion").value;
        const nombre = document.getElementById("editarNombre").value;
        const descripcion = document.getElementById("editarDescripcion").value;

        if (!id || !nombre || !descripcion) {
            alert("Por favor, selecciona una región y completa los campos de nombre y descripción.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/regiones/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, descripcion }),
            });
            if (response.ok) {
                alert("Región actualizada con éxito");
                cargarRegiones();
            } else {
                throw new Error("Error al actualizar la región");
            }
        } catch (error) {
            console.error(error);
            alert("No se pudo actualizar la región");
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
            cargarRegiones();
        } catch (error) {
            console.error(error);
            alert("No se pudieron eliminar las regiones seleccionadas.");
        }
    });
});
