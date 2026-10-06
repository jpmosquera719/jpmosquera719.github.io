// Año del pie de página
document.getElementById("anio").textContent = new Date().getFullYear();

const contenedor = document.getElementById("lista-proyectos");
const filtros = document.getElementById("filtros");
let proyectos = [];

// Carga los proyectos desde el JSON
fetch("data/proyectos.json")
  .then((respuesta) => respuesta.json())
  .then((datos) => {
    proyectos = datos;
    crearFiltros();
    mostrarProyectos("Todos");
  })
  .catch(() => {
    contenedor.textContent = "No se pudieron cargar los proyectos.";
  });

function crearFiltros() {
  const categorias = ["Todos", ...new Set(proyectos.map((p) => p.categoria))];
  categorias.forEach((categoria) => {
    const boton = document.createElement("button");
    boton.textContent = categoria;
    boton.addEventListener("click", () => mostrarProyectos(categoria));
    filtros.appendChild(boton);
  });
}

function mostrarProyectos(categoria) {
  filtros.querySelectorAll("button").forEach((boton) => {
    boton.classList.toggle("activo", boton.textContent === categoria);
  });

  const lista = categoria === "Todos"
    ? proyectos
    : proyectos.filter((p) => p.categoria === categoria);

  contenedor.innerHTML = "";
  lista.forEach((p) => contenedor.appendChild(crearTarjeta(p)));
}

function crearTarjeta(p) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta";

  p.imagenes.forEach((ruta) => {
    const img = document.createElement("img");
    img.src = ruta;
    img.alt = p.titulo;
    img.loading = "lazy";
    tarjeta.appendChild(img);
  });

  const titulo = document.createElement("h3");
  titulo.textContent = p.titulo;
  tarjeta.appendChild(titulo);

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = `${p.categoria} · ${p.anio}`;
  tarjeta.appendChild(meta);

  const resumen = document.createElement("p");
  resumen.textContent = p.resumen;
  tarjeta.appendChild(resumen);

  if (p.herramientas.length) {
    const herramientas = document.createElement("p");
    herramientas.className = "meta";
    herramientas.textContent = "Herramientas: " + p.herramientas.join(", ");
    tarjeta.appendChild(herramientas);
  }

  if (p.video_youtube) {
    const video = document.createElement("iframe");
    video.src = `https://www.youtube.com/embed/${p.video_youtube}`;
    video.title = p.titulo;
    video.loading = "lazy";
    video.allowFullscreen = true;
    tarjeta.appendChild(video);
  }

  if (p.pdf) tarjeta.appendChild(crearEnlace(p.pdf, "Ver PDF"));
  if (p.enlace) tarjeta.appendChild(crearEnlace(p.enlace, "Ver proyecto"));

  return tarjeta;
}

function crearEnlace(url, texto) {
  const parrafo = document.createElement("p");
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.textContent = texto;
  enlace.target = "_blank";
  enlace.rel = "noopener";
  parrafo.appendChild(enlace);
  return parrafo;
}
