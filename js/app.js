//Variables
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const botonVaciarCarrito = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];

cargarEventListeners();

function cargarEventListeners() {
  //Cargar los cursos del carrito guardados en localStorage
  articulosCarrito = JSON.parse(localStorage.getItem("articulosCarrito")) || [];
  //Cargar el HTML del carrito
  carritoHTML();
  //Cuando se agrega un curso presionando "Agregar al Carrito"
  listaCursos.addEventListener("click", agregarCurso);
  //Eliminar cursos del carrito
  carrito.addEventListener("click", eliminarCurso);
  //Evento de vaciar carrito
  botonVaciarCarrito.addEventListener("click", vaciarCarrito);
}

//Funciones
//Agregar curso al carrito
function agregarCurso(evt) {
  evt.preventDefault();
  if (evt.target.classList.contains("agregar-carrito")) {
    let cursoSeleccionado = evt.target.parentElement;
    leerDatosCurso(cursoSeleccionado);
    mensajeEnPantalla("Se ha agregado un curso al carrito");
  }
}

// Leer datos del curso que seleccionamos
function leerDatosCurso(curso) {
  //crear objeto con el contenido del curso actual
  const infoCurso = {
    imagen: curso.parentElement.querySelector(".imagen-curso").src,
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector(".precio span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };
  //Verificar si ya existe el objeto en el carrito
  let existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
  if (existe) {
    //Si existe se aumenta la cantidad
    articulosCarrito.forEach((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
      }
    });
  } else {
    //Agregar elementos al arreglo del carrito
    articulosCarrito.push(infoCurso);
    //Tambien se puede hacer de esta forma
    // articulosCarrito = [...articulosCarrito, infoCurso]
  }

  //Guardar en el localStorage
  localStorage.setItem("articulosCarrito", JSON.stringify(articulosCarrito));

  //Cargar la informacion en el carrito
  carritoHTML();
}

//Mostrar el carrito de compras en el HTML
function carritoHTML() {
  //Limpiar el HTML
  limpiarHTML();

  //Recorre el carrito y genera el HTML
  articulosCarrito.forEach((curso) => {
    let { imagen, titulo, precio, cantidad, id } = curso;
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>
        <img src="${imagen}" alt="foto-alternativa" width="100">
        </td>
        <td>
            ${titulo}
        </td>
        <td>
            ${precio}
        </td>
        <td>
            ${cantidad}
        </td>
        <td>
            <a href="#" class="borrar-curso" data-id="${id}">X</a>
        </td>
        `;
    //Agrega el HTML del carrito al tbody
    contenedorCarrito.appendChild(row);
  });
}

//Eliminar los cursos del tbody
function limpiarHTML() {
  //Forma lenta
  // contenedorCarrito.innerHTML=""

  //Forma más rapida
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}

//Vaciar el carrito
function vaciarCarrito() {
  articulosCarrito = []; //limpiar el array de articulos del carrito
  localStorage.setItem("articulosCarrito", JSON.stringify(articulosCarrito));
  limpiarHTML(); //limpiar el html
  mensajeEnPantalla("Se ha limpiado el carrito");
}

//Obtener curso del carrito
function obtenerCantidadCurso(evt) {
  let curso = evt.target.parentElement.parentElement;
  let cantidad = parseInt(curso.children[3].textContent);
  return cantidad;
}

//Eliminar curso del carrito
function eliminarCurso(evt) {
  evt.preventDefault();
  let cantidadCurso = obtenerCantidadCurso(evt);
  if (evt.target.classList.contains("borrar-curso")) {
    let cursoId = evt.target.getAttribute("data-id");
    if (cantidadCurso > 1) {
      let pos = articulosCarrito.findIndex((curso) => curso.id === cursoId);
      articulosCarrito[pos].cantidad--;
    } else {
      //Eliminar del arreglo por el data-id
      articulosCarrito = articulosCarrito.filter(
        (curso) => curso.id !== cursoId
      );
    }
    if (articulosCarrito.length === 0) {
      mensajeEnPantalla("Se ha limpiado el carrito");
    }
    //Actualizar el localStorage
    localStorage.setItem("articulosCarrito", JSON.stringify(articulosCarrito));

    carritoHTML();
  }
}

//Mostrar mensaje de agregar y eliminar del CSS
function mensajeEnPantalla(mensaje) {
  //Obtener el contenedor donde se va a mostrar el mensaje
  const message = document.querySelector(".mensaje").children[0];
  //Ocultar por defecto el mensaje
  message.parentElement.style.display = "none";
  //Se modifica el texto que está dentro del span
  message.textContent = mensaje;
  setTimeout(hideMessage, 2000);
  message.parentElement.style.display = "flex";
}

//Ocultar el mensaje
function hideMessage() {
  const message = document.querySelector(".mensaje").children[0];
  message.parentElement.style.display = "none";
}
