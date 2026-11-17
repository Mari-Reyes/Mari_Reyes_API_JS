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

        if (!Array.isArray(todosLosLugares) || !todosLosLugares.length) {
            throw new Error("La API no devolvió atractivos turísticos.");
        }

        top20Lugares = todosLosLugares.slice(0, 20);

        loadingTurismo.textContent = `Mostrando ${top20Lugares.length} atractivos turísticos destacados`;

        const primeraFoto = obtenerFotoLugar(top20Lugares[0]);
        heroImgTurismo.innerHTML = `
            <img src="${primeraFoto}" alt="${top20Lugares[0].name}" onerror="this.onerror=null; this.src='${IMAGEN_TURISMO_RESPALDO}';">
        `;

        arriveTurismo.innerHTML = `
            <input 
                type="text" 
                id="search-place-input" 
                placeholder="Ingresa el lugar que deseas buscar..."
                autocomplete="off"
            >
        `;

        renderizarTarjetaLugar(top20Lugares[0]);

        const searchPlaceInput = document.getElementById("search-place-input");
        searchPlaceInput.addEventListener("input", (e) => {
            const valorCrudo = e.target.value;
            const query = normalizarTexto(valorCrudo);

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
                mostrarMensajeSinResultados(
                    showTurismo,
                    `No encontramos "${valorCrudo}" en el Top 20. Haz clic en cualquier lugar de la tabla inferior para verlo aquí.`
                );
            }
        });

        renderizarTablaTop20(top20Lugares);

    } catch (error) {
        console.error(error);
        loadingTurismo.textContent = error.message || "Error al cargar los atractivos turísticos";
        showTurismo.innerHTML = `
            <div class="result-box">
                <div class="label" style="text-align:center;">No se pudieron obtener los atractivos turísticos. Intenta recargar la página.</div>
            </div>
        `;
    }
}

function renderizarTarjetaLugar(lugar) {
    const foto = obtenerFotoLugar(lugar);
    const ciudad = lugar.city ? lugar.city.name : "Colombia";
    const descripcion = lugar.description || "Atractivo turístico destacado de Colombia.";

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
    // Limpiar contenido previo por si se recarga (conservando el <h2>)
    const listaAnterior = tablaSection.querySelector(".places-list");
    if (listaAnterior) listaAnterior.remove();

    const listaContainer = document.createElement("div");
    listaContainer.className = "places-list";

    // Encabezado de referencia (igual al boceto)
    listaContainer.innerHTML = `
        <div class="place-header">
            <span class="col-num"></span>
            <span class="col-name">Nombre del sitio turístico</span>
            <span class="col-loc">Lugar / ubicación</span>
        </div>
    `;

    lugares.forEach((lugar, index) => {
        const item = document.createElement("article");
        item.className = "place-item";

        const ciudad = lugar.city ? lugar.city.name : "Colombia";
        const departamento = (lugar.city && lugar.city.department) ? `, ${lugar.city.department.name}` : "";
        const ubicacion = `${ciudad}${departamento}`;
        const descripcion = lugar.description || "Sin descripción disponible para este atractivo turístico.";
        const foto = obtenerFotoLugar(lugar);

        // Creamos la estructura segura usando DOM
        const rowTop = document.createElement("div");
        rowTop.className = "place-row-top";
        rowTop.title = "Haz clic para ver en el buscador superior";

        const numSpan = document.createElement("span");
        numSpan.className = "col-num";
        numSpan.textContent = index + 1;

        const nameSpan = document.createElement("span");
        nameSpan.className = "col-name";
        nameSpan.textContent = lugar.name;

        const locSpan = document.createElement("span");
        locSpan.className = "col-loc";
        locSpan.textContent = ubicacion;

        rowTop.append(numSpan, nameSpan, locSpan);

        // Bloque inferior con descripción e imagen (visible desde el inicio)
        const detailsDiv = document.createElement("div");
        detailsDiv.className = "place-details";

        const descP = document.createElement("p");
        descP.className = "place-desc";
        descP.textContent = descripcion;

        const imgBox = document.createElement("div");
        imgBox.className = "place-img-box";

        const img = document.createElement("img");
        img.src = foto;
        img.alt = lugar.name;
        img.loading = "lazy";
        img.onerror = function () {
            this.onerror = null;
            this.src = IMAGEN_TURISMO_RESPALDO;
        };

        imgBox.appendChild(img);
        detailsDiv.append(descP, imgBox);

        item.append(rowTop, detailsDiv);

        // Mantiene la interactividad de subirlo al visor principal al hacer clic
        rowTop.addEventListener("click", () => {
            renderizarTarjetaLugar(lugar);
            document.getElementById("show-information-turismo").scrollIntoView({ behavior: "smooth" });
        });

        listaContainer.appendChild(item);
    });

    tablaSection.appendChild(listaContainer);
}

function mostrarMensajeSinResultados(contenedor, mensaje) {
    contenedor.innerHTML = "";
    const box = document.createElement("div");
    box.className = "result-box";

    const valueDiv = document.createElement("div");
    valueDiv.className = "value";
    valueDiv.textContent = mensaje;

    box.appendChild(valueDiv);
    contenedor.appendChild(box);
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