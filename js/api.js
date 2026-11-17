const BASE_URL = "https://api-colombia.com/api/v1";

/**
 * Obtiene los datos generales de Colombia
 */
async function fetchColombiaData() {
    const response = await fetch(`${BASE_URL}/Country/Colombia`);
    if (!response.ok) {
        throw new Error(`Error al obtener datos del país (${response.status})`);
    }
    return await response.json();
}

/**
 * Obtiene la lista de atractivos turísticos de Colombia
 */
async function fetchTouristicAttractions() {
    const response = await fetch(`${BASE_URL}/TouristicAttraction`);
    if (!response.ok) {
        throw new Error(`Error al obtener atractivos turísticos (${response.status})`);
    }
    return await response.json();
}