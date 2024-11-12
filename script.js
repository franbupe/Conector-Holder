const apiKey = '41c0fff04435e0638a6406d64376d702'; // Coloca aquí tu API Key de Holded
const proyectoIdDeseado = '6673294de56217109c01baeb'; // ID de proyecto específico de Holded
const apiUrlBase = 'https://conector-holder.vercel.app/api/projects/v1'; // URL del proxy en Vercel

// Llama a cargarProyecto directamente para que cargue al inicio
cargarProyecto();

function cargarProyecto() {
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', key: apiKey }
    };

    fetch(`${apiUrlBase}/projects`, options)
        .then(response => response.json())
        .then(proyectos => {
            const proyecto = proyectos.find(p => p.id === proyectoIdDeseado);
            if (proyecto) {
                mostrarProyecto(proyecto);
                cargarTareasPorProyecto(proyecto);
            } else {
                document.getElementById('proyectoContainer').innerHTML = '<p>No se encontró el proyecto especificado.</p>';
            }
        })
        .catch(error => {
            console.error('Error al obtener el proyecto:', error);
            document.getElementById('proyectoContainer').innerHTML = '<p>No se pudo obtener el proyecto.</p>';
        });
}

function cargarTareasPorProyecto(proyecto) {
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', key: apiKey }
    };

    fetch(`${apiUrlBase}/tasks`, options)
        .then(response => response.json())
        .then(tareas => {
            const tareasFiltradas = tareas.filter(tarea => tarea.projectId === proyectoIdDeseado);
            mostrarTareasPorCategoria(tareasFiltradas, proyecto);

            // Código adicional para mostrar todos los estados en consola
            const estadosUnicos = [...new Set(tareasFiltradas.map(tarea => tarea.status))];
            console.log("Estados únicos devueltos por la API de Holded:", estadosUnicos);
        })
        .catch(error => {
            console.error('Error al obtener tareas:', error);
            document.getElementById(`tareas-${proyectoIdDeseado}`).innerHTML = '<p>No se pudieron obtener las tareas.</p>';
        });
}

// Función para mostrar el proyecto en la interfaz
function mostrarProyecto(proyecto) {
    const proyectoContainer = document.getElementById('proyectoContainer');
    proyectoContainer.innerHTML = `
        <h2>${proyecto.name}</h2>
        <p>ID del Proyecto: ${proyecto.id}</p>
        <p>Descripción: ${proyecto.description || 'No hay descripción disponible.'}</p>
    `;
}

// Función para mostrar tareas por categoría en la interfaz
function mostrarTareasPorCategoria(tareas, proyecto) {
    const tareasContainer = document.getElementById(`tareas-${proyectoIdDeseado}`);
    
    if (!tareasContainer) {
        console.error(`No se encontró el contenedor de tareas con id="tareas-${proyectoIdDeseado}".`);
        return;
    }

    tareasContainer.innerHTML = '';

    const estadoClases = {
        new: 'estado-nuevo',
        rejected: 'estado-rechazado',
        confirmadoparaimpresin: 'estado-confirmado',
        endiseo: 'estado-diseño',
        pedidoincompleto: 'estado-incompleto',
        in_progress: 'estado-en-proceso'
    };

    proyecto.lists.forEach(list => {
        const categoriaContainer = document.createElement('div');
        categoriaContainer.classList.add('columna-tareas');
        
        categoriaContainer.innerHTML = `
            <h6 class="categoria-titulo">${list.name}</h6>
            <div class="tareas-lista" id="tareas-lista-${list.id}"></div>
        `;
        tareasContainer.appendChild(categoriaContainer);

        const tareasEnCategoria = tareas.filter(tarea => tarea.listId === list.id);
        const tareasLista = document.getElementById(`tareas-lista-${list.id}`);
        
        tareasEnCategoria.forEach(tarea => {
            const productosRealizados = localStorage.getItem(`conteo_${tarea.id}`) || 0;
            const claseEstado = estadoClases[tarea.status] || '';
            
            const tareaHTML = `
                <div class="tarea-item ${claseEstado}" data-tarea-id="${tarea.id}" onclick="iniciarConteo('${tarea.id}', '${tarea.name}')">
                    <p><strong>${tarea.name}</strong></p>
                    <p class="productos-realizados">Productos realizados: <strong>${productosRealizados}</strong></p>
                    <p><strong>Estado:</strong> ${tarea.status}</p>
                </div>
            `;
            tareasLista.innerHTML += tareaHTML;
        });

        if (tareasEnCategoria.length === 0) {
            tareasLista.innerHTML = '<p>No hay tareas en esta categoría.</p>';
        }
    });
}


// Función para manejar el conteo de productos
function iniciarConteo(tareaId, tareaName) {
    document.getElementById('nombreTareaPopup').textContent = tareaName;
    document.getElementById('popupTitulo').textContent = `Conteo para la tarea: ${tareaName}`;
    
    const popup = document.getElementById('popupContador');
    const overlay = document.getElementById('overlay');
    popup.style.display = 'block';
    overlay.style.display = 'block';
    popup.classList.add('mostrar');

    // Extraer el número de productos del título de la tarea usando una expresión regular
    const match = tareaName.match(/\d+/);
    const objetivoProductos = match ? parseInt(match[0]) : 0;
    document.getElementById('objetivoProductosPopup').textContent = objetivoProductos;

    // Cargar el conteo actual de productos desde localStorage
    let contador = parseInt(localStorage.getItem(`conteo_${tareaId}`)) || 0;
    const contadorValor = document.getElementById('contadorValorPopup');
    contadorValor.textContent = contador;

    // Función para verificar si se ha alcanzado el objetivo
    function verificarObjetivo() {
        if (contador >= objetivoProductos && objetivoProductos > 0) {
            popup.classList.add('objetivo-alcanzado');
        }
    }

    document.getElementById('incrementarPopup').addEventListener('click', () => {
        const productosPorPlancha = parseInt(document.getElementById('productosPorPlanchaPopup').value) || 1;
        contador += productosPorPlancha;
        contadorValor.textContent = contador;
        verificarObjetivo();
    });

    document.getElementById('decrementarPopup').addEventListener('click', () => {
        if (contador > 0) {
            contador -= 1;
            contadorValor.textContent = contador;
        }
    });

    document.getElementById('finalizarConteoPopup').addEventListener('click', () => {
        localStorage.setItem(`conteo_${tareaId}`, contador);
        alert(`Conteo finalizado. Total productos: ${contador}`);
        popup.classList.remove('objetivo-alcanzado');
        cargarTareasPorProyecto(proyectoIdDeseado);
        cerrarPopup();
    });

    document.getElementById('cerrarPopup').addEventListener('click', cerrarPopup);
}

function cerrarPopup() {
    const popup = document.getElementById('popupContador');
    const overlay = document.getElementById('overlay');
    popup.style.display = 'none';
    overlay.style.display = 'none';
    popup.classList.remove('mostrar');
    popup.classList.remove('objetivo-alcanzado');
}
