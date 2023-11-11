import { eliminarCliente } from './basededatos.js'

document.addEventListener("DOMContentLoaded", () => {

    const tablaDeClientes = document.querySelector("#listado-clientes")

    cargarClientesDesdeDB()

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
        console.log("Añadiendo cliente:", cliente)

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

        botonEditar.classList.add("bg-teal-600", "mt-5", "p-2", "text-white", "uppercase", "font-bold")

        botonEditar.addEventListener("click", () => {
            const url = `editar-cliente.html?id=${cliente.id}`
            window.location.href = url
        })

        const espacio = document.createTextNode(" ")

        const botonBorrar = document.createElement("button")
        botonBorrar.textContent = "Borrar Cliente"

        botonBorrar.classList.add("bg-teal-600", "mt-5", "p-2", "text-white", "uppercase", "font-bold")

        botonBorrar.addEventListener("click", () => {
            eliminarCliente(cliente.id)
            fila.remove()
        })

        contenedorBotones.appendChild(botonEditar)
        contenedorBotones.appendChild(espacio)
        contenedorBotones.appendChild(botonBorrar)

        acciones.appendChild(contenedorBotones)

        fila.appendChild(acciones)

        if (tablaDeClientes) {
            tablaDeClientes.appendChild(fila)
        } else {
            console.error("No se pudo encontrar el elemento 'tablaDeClientes'.")
        } 
    }

})
