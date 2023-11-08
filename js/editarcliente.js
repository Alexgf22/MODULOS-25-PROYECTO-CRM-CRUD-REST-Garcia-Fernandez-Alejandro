import { modificarCliente} from './basededatos.js'
import {actualizarFilaEnTabla} from './nuevocliente.js'

document.addEventListener("DOMContentLoaded", () => {

    const idCliente = obtenerIdClienteDesdeURL()
    const formulario = document.querySelector("#formulario")

    cargarDatosCliente(idCliente)

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault()

        const nuevoNombre = document.querySelector("#nombre").value
        const nuevoEmail = document.querySelector("#email").value
        const nuevoTelefono = document.querySelector("#telefono").value
        const nuevaEmpresa = document.querySelector("#empresa").value

        await modificarCliente(idCliente, nuevoNombre, nuevoEmail, nuevoTelefono, nuevaEmpresa)

        window.location.href = "index.html"
    })

    const btnGuardarCambios = document.querySelector('#formulario button[type="submit"]')

    const nombreInput = document.querySelector("#nombre")
    const emailInput = document.querySelector("#email")
    const telefonoInput = document.querySelector("#telefono")
    const empresaInput = document.querySelector("#empresa")

    nombreInput.addEventListener("input", validarFormulario)
    emailInput.addEventListener("input", validarFormulario)
    telefonoInput.addEventListener("input", validarFormulario)
    empresaInput.addEventListener("input", validarFormulario)
    
    btnGuardarCambios.addEventListener("click", async function (event) {
        event.preventDefault()
    
        const clienteID = obtenerIdClienteDesdeURL()
        const nuevoNombre = nombreInput.value
        const nuevoEmail = emailInput.value
        const nuevoTelefono = telefonoInput.value
        const nuevaEmpresa = empresaInput.value
    
        await modificarCliente(clienteID, nuevoNombre, nuevoEmail, nuevoTelefono, nuevaEmpresa)
    
        actualizarFilaEnTabla(clienteID, nuevoNombre, nuevoTelefono, nuevaEmpresa)
    
        window.location.href = "index.html"
    })

    // Funciones
    function cargarDatosCliente(idCliente) {
        console.log('ID del Cliente:', idCliente)
        const request = indexedDB.open('MiBaseDeDatos', 1)
    
        request.onsuccess = function(event) {
            const db = event.target.result
            const transaction = db.transaction(['clientes'], 'readonly')
            const objectStore = transaction.objectStore('clientes')
            const request = objectStore.get(idCliente)
    
            request.onsuccess = function(event) {
                const cliente = event.target.result
                if (cliente) {
                    document.querySelector("#nombre").value = cliente.nombre
                    document.querySelector("#email").value = cliente.email
                    document.querySelector("#telefono").value = cliente.telefono
                    document.querySelector("#empresa").value = cliente.empresa
                    document.querySelector("#id").value = cliente.id
                } else {
                    console.error('El cliente con ID ' + idCliente + ' no fue encontrado.')
                }
            }
    
            request.onerror = function(event) {
                console.error('Error al obtener el cliente:', event.target.errorCode)
            }
        }
    
        request.onerror = function(event) {
            console.error('Error al abrir la base de datos:', event.target.errorCode)
        }
    }

    function obtenerIdClienteDesdeURL() {
        const params = new URLSearchParams(window.location.search)
        const idCliente = params.get('id')
        console.log('ID del cliente desde URL:', idCliente);
        return idCliente
    }
    

    function validarFormulario() {
        const nuevoNombre = nombreInput.value
        const nuevoEmail = emailInput.value
        const nuevoTelefono = telefonoInput.value
        const nuevaEmpresa = empresaInput.value

        const nombreEsValido = validarNombre(nuevoNombre)
        const emailEsValido = validarEmail(nuevoEmail)
        const telefonoEsValido = validarTelefono(nuevoTelefono)
        const empresaEsValida = validarEmpresa(nuevaEmpresa)

        const formularioEsValido = nombreEsValido && emailEsValido && telefonoEsValido && empresaEsValida

        if (!nombreEsValido) {
            mostrarAlerta("Nombre inválido", nombreInput)
        } else {
            limpiarAlerta(nombreInput)
        } 
        
        if (!emailEsValido) {
            mostrarAlerta("Email inválido", emailInput)
        } else {
            limpiarAlerta(emailInput)
        }
        
        if (!telefonoEsValido) {
            mostrarAlerta("Teléfono inválido", telefonoInput)
        } else {
            limpiarAlerta(telefonoInput)
        } 
        
        if (!empresaEsValida) {
            mostrarAlerta("Empresa inválida", empresaInput)
        } else {
            limpiarAlerta(empresaInput)
        } 
        
        if (formularioEsValido) {
            btnGuardarCambios.classList.remove("opacity-50")
            btnGuardarCambios.disabled = false
        } else {
            btnGuardarCambios.classList.add("opacity-50")
            btnGuardarCambios.disabled = true
        }
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

    function validarTelefono(telefono) {
        const regex = /^[0-9]{9}$/
        return regex.test(telefono)
    }

    function validarEmpresa(empresa) {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s']+$/
        const longitudMinima = 2
        const longitudMaxima = 120
    
        if (empresa.length < longitudMinima || empresa.length > longitudMaxima) {
            return false
        }
    
        return regex.test(empresa)
    }

    function validarEmail(email) {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
        return regex.test(email)
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

})