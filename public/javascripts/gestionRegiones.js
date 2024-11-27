// URL base de la API
const API_BASE_URL = "http://127.0.0.1:3000/api"; // Cambia esto según tu configuración

// ===========================
// Funciones para Gestión de Regiones
// ===========================

// 1. Cargar regiones desde el servidor y mostrarlas en el modal de selección
async function cargarRegiones() {
    try {
        const response = await fetch(`${API_BASE_URL}/regiones`);
        const regiones = await response.json();

        const selectRegion = document.getElementById("selectRegion");
        selectRegion.innerHTML = ""; // Limpiar las opciones previas

        regiones.forEach((region) => {
            const option = document.createElement("option");
            option.value = region.id;
            option.textContent = region.nombre;
            selectRegion.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar las regiones:", error);
    }
}

// 2. Agregar una nueva región
async function agregarRegion() {
    const nombre = document.getElementById("municipio").value;
    const descripcion = document.getElementById("departamento").value;

    try {
        const response = await fetch(`${API_BASE_URL}/regiones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, descripcion }),
        });

        if (response.ok) {
            alert("Región agregada exitosamente");
            cargarRegiones(); // Refrescar la lista de regiones
        } else {
            throw new Error("No se pudo agregar la región");
        }
    } catch (error) {
        console.error("Error al agregar la región:", error);
    }
}

// 3. Editar una región existente
async function editarRegion() {
    const id = document.getElementById("selectRegion").value;
    const nombre = document.getElementById("editarMunicipio").value;
    const descripcion = document.getElementById("editarCoordenadas").value;

    try {
        const response = await fetch(`${API_BASE_URL}/regiones/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, descripcion }),
        });

        if (response.ok) {
            alert("Región editada exitosamente");
            cargarRegiones(); // Refrescar la lista de regiones
        } else {
            throw new Error("No se pudo editar la región");
        }
    } catch (error) {
        console.error("Error al editar la región:", error);
    }
}

// 4. Eliminar regiones seleccionadas
async function eliminarRegiones() {
    const checkboxes = document.querySelectorAll(".form-check-input:checked");
    const ids = Array.from(checkboxes).map((checkbox) => checkbox.value);

    if (ids.length === 0) {
        alert("Selecciona al menos una región para eliminar");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/regiones`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
        });

        if (response.ok) {
            alert("Región(es) eliminada(s) exitosamente");
            cargarRegiones(); // Refrescar la lista de regiones
        } else {
            throw new Error("No se pudo eliminar la(s) región(es)");
        }
    } catch (error) {
        console.error("Error al eliminar las regiones:", error);
    }
}

// ===========================
// Asignar Eventos a Botones
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    // Cargar las regiones al iniciar
    cargarRegiones();

    // Botón de agregar región
    document
        .querySelector("#modalAgregarRegion .btn-primary")
        .addEventListener("click", agregarRegion);

    // Botón de editar región
    document
        .querySelector("#modalEditarRegion .btn-primary")
        .addEventListener("click", editarRegion);

    // Botón de eliminar regiones
    document
        .querySelector("#modalEliminarRegion .btn-danger")
        .addEventListener("click", eliminarRegiones);
});

console.log("gestionRegiones.js está cargado y funcionando.");