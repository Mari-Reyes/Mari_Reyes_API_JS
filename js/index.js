const loadingEl = document.getElementById("loading");
const flagHeroContainer = document.getElementById("hero-flag-container-1");
const arriveContainer = document.getElementById("arrive-information-index");
const showContainer = document.getElementById("show-information-index");

const IMAGEN_HERO_RESPALDO = "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80";

let diccionarioDatos = [];

async function initIndex() {
    try {
        const pais = await fetchColombiaData();

        // 1. Actualizar estado de carga
        loadingEl.textContent = "Información oficial lista para consultar";

        // 2. Cargar imagen en el Hero
        const banderaUrl = (pais.flags && pais.flags.length > 0) ? pais.flags[0] : IMAGEN_HERO_RESPALDO;
        flagHeroContainer.innerHTML = `
            <img src="${banderaUrl}" alt="Bandera de ${pais.name}" onerror="this.src='${IMAGEN_HERO_RESPALDO}'">
        `;

        // 3. Estructurar los datos disponibles de la API para búsqueda y visualización
        diccionarioDatos = [
            {
                clave: "capital",
                ejemplo: 'Ejemplo: "capital"',
                etiqueta: "Capital de Colombia:",
                valor: pais.stateCapital,
                esImagen: false
            },
            {
                clave: "bandera",
                ejemplo: 'Ejemplo: "bandera"',
                etiqueta: "Bandera de Colombia:",
                valor: banderaUrl,
                esImagen: true
            },
            {
                clave: "poblacion",
                ejemplo: 'Ejemplo: "población"',
                etiqueta: "Población total:",
                valor: `${pais.population.toLocaleString("es-CO")} habitantes`,
                esImagen: false
            },
            {
                clave: "superficie",
                ejemplo: 'Ejemplo: "superficie"',
                etiqueta: "Superficie territorial:",
                valor: `${pais.surface.toLocaleString("es-CO")} km²`,
                esImagen: false
            },
            {
                clave: "moneda",
                ejemplo: 'Ejemplo: "moneda"',
                etiqueta: "Moneda oficial:",
                valor: `${pais.currency} (${pais.currencyCode} - ${pais.currencySymbol})`,
                esImagen: false
            },
            {
                clave: "idiomas",
                ejemplo: 'Ejemplo: "idiomas"',
                etiqueta: "Idiomas oficiales:",
                valor: pais.languages.join(", "),
                esImagen: false
            },
            {
                clave: "region",
                ejemplo: 'Ejemplo: "región"',
                etiqueta: "Ubicación geográfica:",
                valor: `${pais.region} - ${pais.subRegion}`,
                esImagen: false
            },
            {
                clave: "descripcion",
                ejemplo: 'Ejemplo: "descripción"',
                etiqueta: "Descripción general:",
                valor: pais.description,
                esImagen: false
            }
        ];

        // 4. Construir el input buscador en #arrive-information-index (igual al boceto 1)
        arriveContainer.innerHTML = `
            <input 
                type="text" 
                id="search-country-input" 
                placeholder="Ingresa la información que deseas buscar... (ej. capital, bandera, moneda, población)"
                autocomplete="off"
            >
        `;

        // 5. Renderizar por defecto los ejemplos del boceto (Capital y Bandera)
        renderizarTarjetasDatos([diccionarioDatos[0], diccionarioDatos[1]]);

        // 6. Escuchar lo que escribe el usuario para filtrar en tiempo real
        const searchInput = document.getElementById("search-country-input");
        searchInput.addEventListener("input", (e) => {
            const texto = normalizarTexto(e.target.value);

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
                showContainer.innerHTML = `
                    <div class="result-box">
                        <div class="value">No se encontraron resultados para "${e.target.value}". Prueba con: capital, bandera, población, superficie, moneda o idiomas.</div>
                    </div>
                `;
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
            // Diseño vertical centrado para imágenes (como "Bandera de Colombia" en el boceto[cite: 16])
            box.className = "result-box vertical-center";
            box.innerHTML = `
                <div class="label">${item.etiqueta}</div>
                <div class="value-img">
                    <img src="${item.valor}" alt="${item.etiqueta}" onerror="this.src='${IMAGEN_HERO_RESPALDO}'">
                </div>
            `;
        } else {
            // Diseño horizontal en 2 columnas para texto (como "Capital de Colombia" en el boceto[cite: 16])
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
// Quita tildes y pasa a minúsculas para búsquedas cómodas
function normalizarTexto(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

initIndex();