document.addEventListener("DOMContentLoaded", () => {
    // Función para cargar contaminantes
    async function cargarContaminantes() {
        try {
            const response = await fetch("http://localhost:3000/api/contaminantes");
            const contaminantes = await response.json();

            // Actualizar select de eliminación
            const selectEliminar = document.getElementById("selectEliminarContaminante");
            const selectEditar = document.getElementById("selectContaminante");
            if (selectEliminar && selectEditar) {
                selectEliminar.innerHTML = ""; // Limpiar opciones
                selectEditar.innerHTML = ""; // Limpiar opciones

                // Agregar las opciones al select de eliminar y editar
                contaminantes.forEach((contaminante) => {
                    const option = document.createElement("option");
                    option.value = contaminante.id;
                    option.textContent = contaminante.nombre;
                    selectEliminar.appendChild(option);
                    selectEditar.appendChild(option.cloneNode(true));
                });
            }
        } catch (error) {
            console.error("Error al cargar los contaminantes:", error);
        }
    }

    // Cargar la información del contaminante a editar
    const selectContaminante = document.getElementById("selectContaminante");
    if (selectContaminante) {
        selectContaminante.addEventListener("change", async () => {
            const id = selectContaminante.value;
            if (id) {
                try {
                    const response = await fetch(`http://localhost:3000/api/contaminantes/${id}`);
                    const contaminante = await response.json();

                    // Mostrar los datos del contaminante en los campos de edición
                    document.getElementById("editarNombreContaminante").value = contaminante.nombre;
                    document.getElementById("editarDescripcionContaminante").value = contaminante.descripcion;
                } catch (error) {
                    console.error("Error al cargar el contaminante:", error);
                }
            }
        });
    }

    // Guardar un nuevo contaminante
    const btnGuardar = document.getElementById("btnGuardarContaminante");
    if (btnGuardar) {
        btnGuardar.addEventListener("click", async () => {
            const nombre = document.getElementById("nombreContaminante").value;
            const descripcion = document.getElementById("descripcionContaminante").value;

            try {
                const response = await fetch("http://localhost:3000/api/contaminantes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ nombre, descripcion }),
                });

                if (response.ok) {
                    alert("Contaminante agregado");
                    await cargarContaminantes();
                    $('#modalAgregarContaminante').modal('hide');
                } else {
                    alert("Error al agregar el contaminante.");
                }
            } catch (error) {
                console.error("Error al guardar el contaminante:", error);
            }
        });
    }

    // Guardar cambios en el contaminante editado
    const btnGuardarCambios = document.getElementById("btnGuardarCambiosContaminante");
    if (btnGuardarCambios) {
        btnGuardarCambios.addEventListener("click", async () => {
            const id = selectContaminante.value;
            const nombre = document.getElementById("editarNombreContaminante").value;
            const descripcion = document.getElementById("editarDescripcionContaminante").value;

            if (!id) {
                alert("Seleccione un contaminante para editar.");
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/contaminantes/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ nombre, descripcion }),
                });

                if (response.ok) {
                    alert("Contaminante actualizado");
                    await cargarContaminantes();
                    $('#modalEditarContaminante').modal('hide');
                } else {
                    alert("Error al actualizar el contaminante.");
                }
            } catch (error) {
                console.error("Error al actualizar el contaminante:", error);
            }
        });
    }

    // Eliminar un contaminante
    const btnEliminar = document.getElementById("btnEliminarContaminante");
    if (btnEliminar) {
        btnEliminar.addEventListener("click", async () => {
            const id = document.getElementById("selectEliminarContaminante").value;

            if (!id) {
                alert("Seleccione un contaminante para eliminar.");
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/contaminantes/${id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert("Contaminante eliminado");
                    await cargarContaminantes();
                    $('#modalEliminarContaminante').modal('hide');
                } else {
                    alert("Error al eliminar el contaminante.");
                }
            } catch (error) {
                console.error("Error al eliminar el contaminante:", error);
            }
        });
    }

    // Inicializar la carga de contaminantes al cargar la página
    cargarContaminantes();
});
