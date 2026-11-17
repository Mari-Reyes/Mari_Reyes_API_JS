const loadingEl = document.getElementById("loading");
const flagHeroContainer = document.getElementById("hero-flag-container-1");
const arriveContainer = document.getElementById("arrive-information-index");
const showContainer = document.getElementById("show-information-index");

const IMAGEN_HERO_RESPALDO = "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80";

let diccionarioDatos = [];

async function initIndex() {
    try {
        const pais = await fetchColombiaData();

        loadingEl.textContent = "Información oficial lista para consultar";

        const banderaUrl = (pais.flags && pais.flags.length > 0) ? pais.flags[0] : IMAGEN_HERO_RESPALDO;
        flagHeroContainer.innerHTML = `
            <img src="${banderaUrl}" alt="Bandera de ${pais.name}" onerror="this.onerror=null; this.src='${IMAGEN_HERO_RESPALDO}';">
        `;

        diccionarioDatos = [
            {
                clave: "capital",
                etiqueta: "Capital de Colombia:",
                valor: pais.stateCapital,
                esImagen: false
            },
            {
                clave: "bandera",
                etiqueta: "Bandera de Colombia:",
                valor: banderaUrl,
                esImagen: true
            },
            {
                clave: "poblacion",
                etiqueta: "Población total:",
                valor: `${pais.population.toLocaleString("es-CO")} habitantes`,
                esImagen: false
            },
            {
                clave: "superficie",
                etiqueta: "Superficie territorial:",
                valor: `${pais.surface.toLocaleString("es-CO")} km²`,
                esImagen: false
            },
            {
                clave: "moneda",
                etiqueta: "Moneda oficial:",
                valor: `${pais.currency} (${pais.currencyCode} - ${pais.currencySymbol})`,
                esImagen: false
            },
            {
                clave: "idiomas",
                etiqueta: "Idiomas oficiales:",
                valor: pais.languages.join(", "),
                esImagen: false
            },
            {
                clave: "region",
                etiqueta: "Ubicación geográfica:",
                valor: `${pais.region} - ${pais.subRegion}`,
                esImagen: false
            },
            {
                clave: "descripcion",
                etiqueta: "Descripción general:",
                valor: pais.description,
                esImagen: false
            }
        ];

        arriveContainer.innerHTML = `
            <input 
                type="text" 
                id="search-country-input" 
                placeholder="Ingresa la información que deseas buscar... (ej. capital, bandera, moneda, población)"
                autocomplete="off"
            >
        `;

        renderizarTarjetasDatos([diccionarioDatos[0], diccionarioDatos[1]]);

        const searchInput = document.getElementById("search-country-input");
        searchInput.addEventListener("input", (e) => {
            const valorCrudo = e.target.value;
            const texto = normalizarTexto(valorCrudo);

            if (!texto) {
                renderizarTarjetasDatos([diccionarioDatos[0], diccionarioDatos[1]]);
                return;
            }

            const filtrados = diccionarioDatos.filter(item =>
                normalizarTexto(item.clave).includes(texto) ||
                normalizarTexto(item.etiqueta).includes(texto)
            );

            if (filtrados.length > 0) {
                renderizarTarjetasDatos(filtrados);
            } else {
                mostrarMensajeSinResultados(
                    showContainer,
                    `No se encontraron resultados para "${valorCrudo}". Prueba con: capital, bandera, población, superficie, moneda o idiomas.`
                );
            }
        });

    } catch (error) {
        console.error(error);
        loadingEl.textContent = "Error al conectar con la API de Colombia";
        showContainer.innerHTML = `
            <div class="result-box">
                <div class="label" style="text-align:center;">No se pudo cargar la información. Verifica tu conexión e intenta nuevamente.</div>
            </div>
        `;
    }
}

function renderizarTarjetasDatos(lista) {
    showContainer.innerHTML = "";

    lista.forEach((item) => {
        const box = document.createElement("article");

        if (item.esImagen) {
            box.className = "result-box vertical-center";
            box.innerHTML = `
                <div class="label">${item.etiqueta}</div>
                <div class="value-img">
                    <img src="${item.valor}" alt="${item.etiqueta}" onerror="this.onerror=null; this.src='${IMAGEN_HERO_RESPALDO}';">
                </div>
            `;
        } else {
            box.className = "result-box";
            box.innerHTML = `
                <div class="result-row">
                    <div class="label">${item.etiqueta}</div>
                    <div class="value">${item.valor}</div>
                </div>
            `;
        }

        showContainer.appendChild(box);
    });
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

function normalizarTexto(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

initIndex();