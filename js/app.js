// ============================================================
// Buscador de episodios · Rick and Morty API
// Trabajo Práctico · Fundamentos de Desarrollo Web
// Variante C: /episode, filtro por temporada (parámetro episode)
// ============================================================

// ---------- 1. Configuración ----------
const URL_API = "https://rickandmortyapi.com/api/episode";
const CLAVE_BUSQUEDA = "tp-ultima-busqueda";
const TEXTO_DESCONOCIDO = "Desconocido";

// ---------- 2. Elementos del DOM ----------
const formulario = document.querySelector("#formulario-busqueda");
const campoNombre = document.querySelector("#campo-nombre");
const campoTemporada = document.querySelector("#campo-temporada");
const botonBuscar = document.querySelector("#boton-buscar");
const mensaje = document.querySelector("#mensaje");
const contenedorTarjetas = document.querySelector("#resultados");

// ---------- 3. Utilidades ----------
// Los datos vacíos, nulos o "unknown" se muestran como «Desconocido»
const textoOCompletar = (valor) => {
  if (valor === undefined || valor === null) {
    return TEXTO_DESCONOCIDO;
  }
  const texto = String(valor).trim();
  return texto === "" || texto.toLowerCase() === "unknown" ? TEXTO_DESCONOCIDO : texto;
};

const mostrarMensaje = (texto, tipo = "") => {
  mensaje.textContent = texto;
  mensaje.classList.remove("exito", "aviso", "error");
  if (tipo !== "") {
    mensaje.classList.add(tipo);
  }
};

// ---------- 4. Acceso a la API ----------
// Arma la URL con URL y searchParams: solo agrega los criterios que tienen valor
const construirUrl = (nombre, temporada) => {
  const url = new URL(URL_API);
  if (nombre !== "") {
    url.searchParams.set("name", nombre);
  }
  if (temporada !== "") {
    url.searchParams.set("episode", temporada);
  }
  return url;
};

// Pide los episodios. Un 404 no es un error: significa "sin coincidencias"
const pedirEpisodios = async (nombre, temporada) => {
  const respuesta = await fetch(construirUrl(nombre, temporada));

  if (respuesta.status === 404) {
    return { episodios: [], total: 0 };
  }
  if (!respuesta.ok) {
    throw new Error(`La API respondió con el código ${respuesta.status}`);
  }

  const datos = await respuesta.json();
  return { episodios: datos.results, total: datos.info.count };
};

// ---------- 5. Tarjetas ----------
const crearDato = (etiqueta, valor) => {
  const parrafo = document.createElement("p");
  parrafo.classList.add("tarjeta-dato");

  const textoEtiqueta = document.createElement("span");
  textoEtiqueta.classList.add("tarjeta-etiqueta");
  textoEtiqueta.textContent = etiqueta;

  const textoValor = document.createElement("span");
  textoValor.textContent = valor;

  parrafo.append(textoEtiqueta, textoValor);
  return parrafo;
};

const crearTarjeta = (episodio) => {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("tarjeta");

  const titulo = document.createElement("h3");
  titulo.textContent = textoOCompletar(episodio.name);

  const codigo = document.createElement("span");
  codigo.classList.add("tarjeta-codigo");
  codigo.textContent = textoOCompletar(episodio.episode);

  const cantidadPersonajes = Array.isArray(episodio.characters) ? episodio.characters.length : null;

  tarjeta.append(
    codigo,
    titulo,
    crearDato("Fecha de emisión", textoOCompletar(episodio.air_date)),
    crearDato("Personajes", textoOCompletar(cantidadPersonajes))
  );
  return tarjeta;
};

const mostrarTarjetas = (episodios) => {
  contenedorTarjetas.replaceChildren(...episodios.map(crearTarjeta));
};

// ---------- 6. Persistencia (localStorage) ----------
const guardarBusqueda = (nombre, temporada) => {
  try {
    localStorage.setItem(CLAVE_BUSQUEDA, JSON.stringify({ nombre, temporada }));
  } catch (error) {
    console.warn("No se pudo guardar la búsqueda:", error);
  }
};

const leerBusquedaGuardada = () => {
  try {
    const texto = localStorage.getItem(CLAVE_BUSQUEDA);
    return texto === null ? null : JSON.parse(texto);
  } catch (error) {
    console.warn("No se pudo leer la búsqueda guardada:", error);
    return null;
  }
};

// ---------- 7. Búsqueda y estados ----------
const describirError = (error) =>
  error instanceof TypeError
    ? "No se pudo conectar con la API. Revisa tu conexión a internet e inténtalo de nuevo."
    : "Ocurrió un error al buscar los episodios. Inténtalo de nuevo más tarde.";

const buscar = async (nombre, temporada) => {
  botonBuscar.disabled = true;
  mostrarMensaje("Buscando…");
  contenedorTarjetas.replaceChildren();

  try {
    const { episodios, total } = await pedirEpisodios(nombre, temporada);

    if (episodios.length === 0) {
      mostrarMensaje("Sin resultados: no hay episodios que coincidan con tu búsqueda.", "aviso");
      return;
    }

    mostrarTarjetas(episodios);
    const resumen =
      total > episodios.length
        ? `Mostrando ${episodios.length} de ${total} episodios.`
        : `Se encontraron ${total} episodio(s).`;
    mostrarMensaje(resumen, "exito");
  } catch (error) {
    console.warn(error);
    mostrarMensaje(describirError(error), "error");
  } finally {
    botonBuscar.disabled = false; // siempre se vuelve a habilitar
  }
};

// ---------- 8. Eventos e inicio ----------
const manejarEnvio = (evento) => {
  evento.preventDefault();
  if (botonBuscar.disabled) {
    return; // ya hay una búsqueda en curso
  }

  const nombre = campoNombre.value.trim();
  const temporada = campoTemporada.value;

  if (nombre === "" && temporada === "") {
    mostrarMensaje("Escribe un nombre o elige una temporada para buscar.", "aviso");
    return;
  }

  guardarBusqueda(nombre, temporada);
  buscar(nombre, temporada);
};

// Al cargar la página: restaura los campos y repite la última búsqueda
const restaurarUltimaBusqueda = () => {
  const guardada = leerBusquedaGuardada();
  if (guardada === null) {
    return;
  }

  const nombre = typeof guardada.nombre === "string" ? guardada.nombre : "";
  const temporada = typeof guardada.temporada === "string" ? guardada.temporada : "";
  campoNombre.value = nombre;
  campoTemporada.value = temporada;

  if (nombre !== "" || campoTemporada.value !== "") {
    buscar(nombre, campoTemporada.value);
  }
};

formulario.addEventListener("submit", manejarEnvio);
restaurarUltimaBusqueda();
