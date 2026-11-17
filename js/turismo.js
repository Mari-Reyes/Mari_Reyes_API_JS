const loadingTurismo = document.getElementById("loading");
const heroImgTurismo = document.getElementById("hero-flag-container-2");
const arriveTurismo = document.getElementById("arrive-information-turismo");
const showTurismo = document.getElementById("show-information-turismo");
const tablaSection = document.querySelector(".tabla-places");

const IMAGEN_TURISMO_RESPALDO = "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80";

let top20Lugares = [];

async function initTurismo() {
    try {
        const todosLosLugares = await fetchTouristicAttractions();

        // Tomamos los primeros 20 elementos (cumple requisito de min. 15 + extra de 20)
        top20Lugares = todosLosLugares.slice(0, 20);

        loadingTurismo.textContent = `Mostrando ${top20Lugares.length} atractivos turísticos destacados`;

        // 1. Poner imagen en el Hero
        const primeraFoto = obtenerFotoLugar(top20Lugares[0]);
        heroImgTurismo.innerHTML = `
            <img src="${primeraFoto}" alt="${top20Lugares[0].name}" onerror="this.src='${IMAGEN_TURISMO_RESPALDO}'">
        `;

        // 2. Crear buscador en #arrive-information-turismo (igual al boceto 2)
        arriveTurismo.innerHTML = `
            <input 
                type="text" 
                id="search-place-input" 
                placeholder="Ingresa el lugar que deseas buscar..."
                autocomplete="off"
            >
        `;

        // 3. Mostrar el primer lugar por defecto en #show-information-turismo
        renderizarTarjetaLugar(top20Lugares[0]);

        // 4. Escuchar búsqueda del usuario
        const searchPlaceInput = document.getElementById("search-place-input");
        searchPlaceInput.addEventListener("input", (e) => {
            const query = normalizarTexto(e.target.value);

            if (!query) {
                renderizarTarjetaLugar(top20Lugares[0]);
                return;
            }

            const encontrado = top20Lugares.find(lugar =>
                normalizarTexto(lugar.name).includes(query) ||
                (lugar.city && normalizarTexto(lugar.city.name).includes(query))
            );

            if (encontrado) {
                renderizarTarjetaLugar(encontrado);
            } else {
                showTurismo.innerHTML = `
                    <div class="result-box">
                        <div class="value">No encontramos "${e.target.value}" en el Top 20. Haz clic en cualquier lugar de la tabla inferior para verlo aquí.</div>
                    </div>
                `;
            }
        });

        // 5. Construir la tabla Top 20 en .tabla-places (igual al boceto 2)
        renderizarTablaTop20(top20Lugares);

    } catch (error) {
        console.error(error);
        loadingTurismo.textContent = "Error al cargar los atractivos turísticos";
        showTurismo.innerHTML = `
            <div class="result-box">
                <div class="label" style="text-align:center;">No se pudo conectar con la API de turismo. Intenta recargar la página.</div>
            </div>
        `;
    }
}

function renderizarTarjetaLugar(lugar) {
    const foto = obtenerFotoLugar(lugar);
    const ciudad = lugar.city ? lugar.city.name : "Colombia";
    const descripcion = lugar.description || "Atractivo turístico destacado de Colombia.";

    // Diseño vertical centrado: Título rojo -> Descripción amarilla -> Imagen centrada (igual al boceto[cite: 15])
    showTurismo.innerHTML = `
        <article class="result-box vertical-center">
            <div class="label">"${lugar.name}" - ${ciudad}</div>
            <div class="value">${descripcion}</div>
            <div class="value-img">
                <img src="${foto}" alt="${lugar.name}" onerror="this.onerror=null; this.src='${IMAGEN_TURISMO_RESPALDO}';">
            </div>
        </article>
    `;
}

function renderizarTablaTop20(lugares) {
    const tabla = document.createElement("table");

    tabla.innerHTML = `
        <thead>
            <tr>
                <th>#</th>
                <th>Nombre del sitio turístico</th>
                <th>Lugar / Ubicación</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = tabla.querySelector("tbody");

    lugares.forEach((lugar, index) => {
        const fila = document.createElement("tr");
        const ubicacion = lugar.city ? lugar.city.name : "Colombia";
        fila.style.cursor = "pointer";
        fila.title = "Haz clic para ver detalle arriba";

        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${lugar.name}</td>
            <td>${ubicacion}</td>
        `;

        // Extra interactivo: al hacer clic en una fila de la tabla, se muestra su ficha arriba
        fila.addEventListener("click", () => {
            renderizarTarjetaLugar(lugar);
            document.getElementById("show-information-turismo").scrollIntoView({ behavior: "smooth" });
        });

        tbody.appendChild(fila);
    });

    tablaSection.appendChild(tabla);
}

function obtenerFotoLugar(lugar) {
    return (lugar.images && lugar.images.length > 0 && lugar.images[0])
        ? lugar.images[0]
        : IMAGEN_TURISMO_RESPALDO;
}

function normalizarTexto(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

initTurismo();