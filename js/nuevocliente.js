import { agregarCliente, eliminarCliente } from './basededatos.js'

var listadoClientes = []

// Objeto con los datos del cliente
let clienteOBJ = {
    nombre: "",
    email: "",
    telefono: "",
    empresa: ""
}

function actualizarFilaEnTabla(idCliente, nuevoNombre, nuevoTelefono, nuevaEmpresa) {
    const fila = document.querySelector(`tr[data-id="${idCliente}"]`)
    if (fila) {
        fila.querySelector("td:nth-child(1)").textContent = nuevoNombre
        fila.querySelector("td:nth-child(2)").textContent = nuevoTelefono
        fila.querySelector("td:nth-child(3)").textContent = nuevaEmpresa
    }
}

// Selectores y Listeners
document.addEventListener("DOMContentLoaded", () => {

    // Selectores
    const inputNombre = document.querySelector("#nombre")
    const inputCorreo = document.querySelector("#email")
    const inputTelefono = document.querySelector("#telefono")
    const inputEmpresa = document.querySelector("#empresa")
    const formulario = document.querySelector("#formulario")
    const btnSubmit = document.querySelector('#formulario button[type = "submit"]')
    const spinner = document.querySelector("#spinner")
    let tablaDeClientes = document.querySelector("#listado-clientes")

    
    btnSubmit.disabled = true
    btnSubmit.classList.add("opacity-50")

    cargarClientesDesdeDB()

    // Listeners
    btnSubmit.addEventListener("click", () => {
        anadirHTML()
    })
    inputNombre.addEventListener("focus", resaltarCampoActivo)
    inputCorreo.addEventListener("focus", resaltarCampoActivo)
    inputTelefono.addEventListener("focus", resaltarCampoActivo)
    inputEmpresa.addEventListener("focus", resaltarCampoActivo)

    inputNombre.addEventListener("blur", (e) => {
        quitarResaltadoCampo(e)
        validar(e)
    })
    inputCorreo.addEventListener("blur", (e) => {
        quitarResaltadoCampo(e)
        validar(e)
    })
    inputTelefono.addEventListener("blur", (e) => {
        quitarResaltadoCampo(e)
        validar(e)
    })
    inputEmpresa.addEventListener("blur", (e) => {
        quitarResaltadoCampo(e)
        validar(e)
    })
    formulario.addEventListener("submit", activarSpinner)

    // Funciones
    function anadirHTML() {

        const id = generarIdUnico()

        if (clienteOBJ.nombre !== "" && clienteOBJ.email !== "" && clienteOBJ.telefono !== "" && clienteOBJ.empresa !== "") {
            const fila = document.createElement("tr")
            fila.dataset.id = id
        
            const nombreCliente = document.createElement("td")
            nombreCliente.textContent = clienteOBJ.nombre
            fila.appendChild(nombreCliente)
        
            const telefonoCliente = document.createElement("td")
            telefonoCliente.textContent = clienteOBJ.telefono
            fila.appendChild(telefonoCliente)
        
            const empresaCliente = document.createElement("td")
            empresaCliente.textContent = clienteOBJ.empresa
            fila.appendChild(empresaCliente)

            const acciones = document.createElement("td")

            const contenedorBotones = document.createElement("div")
        
            const botonEditar = document.createElement("button")
            botonEditar.textContent = "Editar Cliente"

            botonEditar.classList.add("bg-teal-600")
            botonEditar.classList.add("mt-5")
            botonEditar.classList.add("p-2")
            botonEditar.classList.add("text-white")
            botonEditar.classList.add("uppercase")
            botonEditar.classList.add("font-bold")

            botonEditar.addEventListener("click", (e) => {
                const idCliente = fila.dataset.id
                
                const url = `editar-cliente.html?id=${idCliente}`
                window.location.href = url
            })
            
            const espacio = document.createTextNode(" ")
        
            const botonBorrar = document.createElement("button")
            botonBorrar.textContent = "Borrar Cliente"

            botonBorrar.classList.add("bg-teal-600")
            botonBorrar.classList.add("mt-5")
            botonBorrar.classList.add("p-2")
            botonBorrar.classList.add("text-white")
            botonBorrar.classList.add("uppercase")
            botonBorrar.classList.add("font-bold")

            botonBorrar.addEventListener("click", (e) => {
                const fila = e.target.parentElement.parentElement.parentElement
                const indiceFila = fila.rowIndex - 1
                const idCliente = fila.dataset.id
                console.log("ID del cliente a eliminar:", idCliente)
                eliminarCliente(idCliente)
                
                fila.remove()
                
                listadoClientes.splice(indiceFila, 1)
                localStorage.setItem("Clientes", JSON.stringify(listadoClientes))
            })
            

            contenedorBotones.appendChild(botonEditar)
            contenedorBotones.appendChild(espacio)
            contenedorBotones.appendChild(botonBorrar)
        
            acciones.appendChild(contenedorBotones)
        
            fila.appendChild(acciones)
        
            tablaDeClientes.appendChild(fila)

            let copiaClienteOBJ = { ...clienteOBJ, id }

            listadoClientes.push(copiaClienteOBJ)

            agregarCliente(copiaClienteOBJ)

            clienteOBJ.nombre = ""
            clienteOBJ.email = ""
            clienteOBJ.telefono = ""
            clienteOBJ.empresa = "" 
            formulario.reset()
            comprobarFormulario()

            localStorage.setItem("Clientes", JSON.stringify(listadoClientes))
        }
    }

    function generarIdUnico() {
        const timestamp = Date.now()
        const numeroAleatorio = Math.floor(Math.random() * 10000) 
        return `${timestamp}-${numeroAleatorio}`
    }

    function cargarClientesDesdeDB() {
        const request = indexedDB.open('MiBaseDeDatos', 1)

        request.onsuccess = function(event) {
            const db = event.target.result
            const transaction = db.transaction(['clientes'], 'readonly')
            const objectStore = transaction.objectStore('clientes')
            const getAllRequest = objectStore.getAll()

            getAllRequest.onsuccess = function(event) {
                const clientes = event.target.result
                if (clientes && clientes.length > 0) {
                    clientes.forEach(cliente => {
                        regresarClienteAlHtml(cliente)
                    })
                }
            }
        }

        request.onerror = function(event) {
            console.error('Error al abrir la base de datos:', event.target.errorCode)
        }
    }

    function regresarClienteAlHtml(cliente) {
        const fila = document.createElement("tr")
        
        const nombreCliente = document.createElement("td")
        nombreCliente.textContent = cliente.nombre
        fila.appendChild(nombreCliente)
    
        const telefonoCliente = document.createElement("td")
        telefonoCliente.textContent = cliente.telefono
        fila.appendChild(telefonoCliente)
    
        const empresaCliente = document.createElement("td")
        empresaCliente.textContent = cliente.empresa
        fila.appendChild(empresaCliente)

        const acciones = document.createElement("td")

        const contenedorBotones = document.createElement("div")
    
        const botonEditar = document.createElement("button")
        botonEditar.textContent = "Editar Cliente"

        botonEditar.classList.add("bg-teal-600")
        botonEditar.classList.add("mt-5")
        botonEditar.classList.add("p-2")
        botonEditar.classList.add("text-white")
        botonEditar.classList.add("uppercase")
        botonEditar.classList.add("font-bold")

        botonEditar.addEventListener("click", (e) => {
            const idCliente = fila.dataset.id
            
            const url = `editar-cliente.html?id=${idCliente}`
            window.location.href = url
        })
        
        const espacio = document.createTextNode(" ")
    
        const botonBorrar = document.createElement("button")
        botonBorrar.textContent = "Borrar Cliente"

        botonBorrar.classList.add("bg-teal-600")
        botonBorrar.classList.add("mt-5")
        botonBorrar.classList.add("p-2")
        botonBorrar.classList.add("text-white")
        botonBorrar.classList.add("uppercase")
        botonBorrar.classList.add("font-bold")

        botonBorrar.addEventListener("click", (e) => {
            const fila = e.target.parentElement.parentElement.parentElement
            const indiceFila = fila.rowIndex - 1

            // Eliminamos el cliente de la lista y del DOM
            listadoClientes.splice(indiceFila, 1)
            fila.remove()
            localStorage.setItem("Clientes", JSON.stringify(listadoClientes))
        }) 

        contenedorBotones.appendChild(botonEditar)
        contenedorBotones.appendChild(espacio)
        contenedorBotones.appendChild(botonBorrar)
    
        acciones.appendChild(contenedorBotones)
    
        fila.appendChild(acciones)
    
        tablaDeClientes.appendChild(fila)
    }

    function resaltarCampoActivo(e) {
        e.target.style.borderColor = "#3498db"
        e.target.style.boxShadow = "0 0 10px rgba(52, 152, 219, 0.7)"
    }

    function quitarResaltadoCampo(e) {
        e.target.style.borderColor = ""
        e.target.style.boxShadow = ""
    }

    function activarSpinner(e) {
        e.preventDefault()
        spinner.classList.remove("hidden")
        spinner.classList.add("flex")
        
        setTimeout(() => {
            spinner.classList.add("hidden")
            spinner.classList.remove("flex")
            resetForm()

            const alerta = document.createElement("p")
            alerta.classList.add("bg-green-500", "text-white", "text-center",
            "rounded-lg", "mt-10", "text-sm")
            alerta.textContent = "El mensaje se ha mandado con éxito"
            formulario.appendChild(alerta)

            setTimeout(() => {
                alerta.remove()
            }, 3000)

        }, 3000)

    }

    function resetForm() {
        clienteOBJ.nombre = ""
        clienteOBJ.email = ""
        clienteOBJ.telefono = ""
        clienteOBJ.empresa = "" 
        formulario.reset()
        comprobarFormulario()
    }

    function validar(e) {
        if(e.target.value.trim() === "") {
            mostrarAlerta(`el campo ${e.target.id} es obligatorio`, e.target.parentElement)
            clienteOBJ[e.target.name] = ""
            comprobarFormulario()
            return 
        }
        if (e.target.id === "email" && !validarEmail(e.target.value)) {
            mostrarAlerta("El email no es válido", e.target.parentElement)
            clienteOBJ[e.target.name] = ""
            comprobarFormulario() 
            return 
        }
        if (e.target.id === "telefono" && !validarTelefono(e.target.value)) {
            mostrarAlerta("El teléfono no es válido", e.target.parentElement)
            clienteOBJ[e.target.name] = ""
            comprobarFormulario() 
            return 
        }
        if (e.target.id === "nombre" && !validarNombre(e.target.value)) {
            mostrarAlerta("El nombre no es válido", e.target.parentElement)
            clienteOBJ[e.target.name] = ""
            comprobarFormulario() 
            return 
        }
        if (e.target.id === "empresa" && !validarEmpresa(e.target.value)) {
            mostrarAlerta("La empresa cliente no es válida", e.target.parentElement)
            clienteOBJ[e.target.name] = ""
            comprobarFormulario() 
            return 
        }

        limpiarAlerta(e.target.parentElement)

        clienteOBJ[e.target.name] = capitalizarNombreCompleto(e.target.value.trim())
        comprobarFormulario(clienteOBJ)        
    }

    function capitalizarNombreCompleto(nombreCompleto) {
        const palabras = nombreCompleto.split(' ')
        const nombreCapitalizado = palabras.map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1)).join(' ')
        return nombreCapitalizado
    }

    function comprobarFormulario() {
        const values = Object.values(clienteOBJ)
    
        const campoVacio = values.includes("")
        const formularioValido = values.every(value => value !== "")
    
        if (campoVacio || !formularioValido) {
            btnSubmit.classList.add("opacity-50")
            btnSubmit.disabled = true
        } else {
            btnSubmit.classList.remove("opacity-50")
            btnSubmit.disabled = false
        }
    }
    
    function limpiarAlerta(referencia) {
        const alerta = referencia.querySelector(".bg-red-600")
        if (alerta) {
            alerta.remove()
        }
    }

    function mostrarAlerta(mensaje, referencia) {

        limpiarAlerta(referencia)
        const error = document.createElement("p")
        error.textContent = mensaje
        error.classList.add("bg-red-600", "text-center", "text-white", "p-2")
        referencia.appendChild(error)
    }

    function validarEmail(email) {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
        return regex.test(email)
    }

    function validarTelefono(telefono) {
        const regex = /^[0-9]{9}$/
        return regex.test(telefono)
    }

    function validarNombre(nombre) {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s']+$/
        const longitudMinima = 2
        const longitudMaxima = 50
    
        if (nombre.length < longitudMinima || nombre.length > longitudMaxima) {
            return false
        }
    
        return regex.test(nombre)
    }

    function validarEmpresa(empresa) {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s']+$/
        const longitudMinima = 2
        const longitudMaxima = 120
    
        if (nombre.length < longitudMinima || nombre.length > longitudMaxima) {
            return false
        }
    
        return regex.test(empresa)
    }

    

})

export{actualizarFilaEnTabla}

