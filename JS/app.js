const resultados = document.getElementById("resultados");
const btnBuscar = document.getElementById("btnBuscar");
const searchInput = document.getElementById("searchInput");
const alfabeto = document.getElementById("alfabeto");
const mapaPaises = {
    American: "us",
    British: "gb",
    Canadian: "ca",
    Chinese: "cn",
    Croatian: "hr",
    Dutch: "nl",
    Egyptian: "eg",
    French: "fr",
    Greek: "gr",
    Indian: "in",
    Irish: "ie",
    Italian: "it",
    Jamaican: "jm",
    Japanese: "jp",
    Kenyan: "ke",
    Malaysian: "my",
    Mexican: "mx",
    Moroccan: "ma",
    Polish: "pl",
    Portuguese: "pt",
    Russian: "ru",
    Spanish: "es",
    Thai: "th",
    Tunisian: "tn",
    Turkish: "tr",
    Vietnamese: "vn"
};


if (btnBuscar) {
    btnBuscar.addEventListener("click", buscarRecetas);
}

function buscarRecetas() {
    const query = searchInput.value.trim();
    if (!query) return;

    resultados.innerHTML = "<p class='text-center'>Cargando...</p>";

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(res => res.json())
        .then(data => {
            mostrarRecetas(data.meals);
        })
        .catch(() => {
            resultados.innerHTML = "<p>Error al cargar recetas</p>"
        });
}

function mostrarRecetas(recetas) {
    resultados.innerHTML = "";
    if (!recetas) {
        resultados.innerHTML = "<p class='text-center'>No se encontraron recetas</p>";
        return;
    }

    recetas.forEach(receta => {
        const col = document.createElement("div");
        col.className = "col-md-3 mb-4";

        col.innerHTML = `
            <div class="card h-100">
                <img src="${receta.strMealThumb}" class="card-img-top">
                <div class="card-body text-center">
                    <h6>${receta.strMeal}</h6>
                    <button class="btn btn-sm btn-outline-primary mt-2">Ver detalles</button>
                </div>
            </div>
        `;

        col.querySelector("button").addEventListener("click", () => {
            verDetalles(receta);
        });

        resultados.appendChild(col);
    });
}

function verDetalles(receta) {
    document.getElementById("modalTitulo").textContent = receta.strMeal;

    let ingredientes = "";
    for (let i = 1; i <= 20; i++) {
        if (receta[`strIngredient${i}`]) {
            ingredientes += `<li>${receta[`strIngredient${i}`]} - ${receta[`strMeasure${i}`]}</li>`
        }
    }

    const paisHTML = obtenerPais(receta);

    document.getElementById("modalBody").innerHTML = `
        <img src="${receta.strMealThumb}" class="img-fluid mb-3 d-block mx-auto"> 
        ${paisHTML}      
        <h6>Ingredientes</h6>
        <ul>${ingredientes}</ul>
        <h6>Preparación</h6>
        <p>${receta.strInstructions}</p>
        
    `;

    new bootstrap.Modal(document.getElementById("modalReceta")).show();
}

function crearAlfabeto() {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    letras.forEach(letra => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-secondary btn-sm";
        btn.textContent = letra;

        btn.addEventListener("click", () => {
            buscarPorLetra(letra);
        });

        alfabeto.appendChild(btn);
    });
}

function buscarPorLetra(letra) {
    resultados.innerHTML = `
        <p class="text-center">
            Buscando recetas con la letra <strong>${letra}</strong>...
        </p>
    `;

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letra}`)
        .then(res => res.json())
        .then(data => {
            mostrarRecetas(data.meals);
        })
        .catch(() => {
            resultados.innerHTML = "<p>Error al cargar recetas</p>"
        });
}

function obtenerPais(receta) {
    const area = receta.strArea;
    const codigo = mapaPaises[area] || null;

    if (!codigo) {
        return `
            <div class="text-center mb-3">
            <span class="badge bg-secondary">Origen desconocido</span>
            <div class="text-center mb-3">
        `;
    }
    return `
        <div class="d-flex justify-content-center align-items-center gap-2 mb-3">
            <img 
                src="https://flagcdn.com/w40/${codigo}.png"
                alt="${area}"
                style="width: 32px"
            >
            <span class="fw-semibold">${area}</span>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", crearAlfabeto);