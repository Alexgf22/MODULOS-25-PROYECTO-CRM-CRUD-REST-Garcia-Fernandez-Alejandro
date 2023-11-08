const request = indexedDB.open('MiBaseDeDatos', 1)

let db

request.onupgradeneeded = function(event) {
  console.log('onupgradeneeded')
  db = event.target.result
  const objectStore = db.createObjectStore('clientes', { keyPath: 'id' })

  objectStore.createIndex('nombre', 'nombre', { unique: false })
  objectStore.createIndex('email', 'email', { unique: false })
  objectStore.createIndex('telefono', 'telefono', { unique: false })
  objectStore.createIndex('empresa', 'empresa', { unique: false })
}

request.onsuccess = function(event) {
  console.log('onsuccess')
  db = event.target.result
  if (!db) {
    console.error('La base de datos no está inicializada correctamente.')
    return
  }

  /*obtenerClientes(function(clientes) {
    console.log(clientes)
  })
  */
}

request.onerror = function(event) {
  console.error('Error al abrir la base de datos:', event.target.errorCode)
}

function agregarCliente(cliente) {
  let transaction = db.transaction(["clientes"], "readwrite")
  let objectStore = transaction.objectStore("clientes")

  let addRequest = objectStore.add(cliente)
  addRequest.onsuccess = function(event) {
    console.log("Cliente añadido correctamente. ID:", event.target.result)
  }
  addRequest.onerror = function(event) {
    console.error("Error al añadir el cliente:", event.target.error)
  }
}

function modificarCliente(id, nuevoNombre, nuevoEmail, nuevoTelefono, nuevaEmpresa) {
  const transaction = db.transaction(['clientes'], 'readwrite')
  const objectStore = transaction.objectStore('clientes')
  const request = objectStore.get(id)

  request.onsuccess = function(event) {
    const cliente = request.result
    if (cliente) {
      cliente.nombre = nuevoNombre
      cliente.email = nuevoEmail
      cliente.telefono = nuevoTelefono
      cliente.empresa = nuevaEmpresa

      const requestUpdate = objectStore.put(cliente)

      requestUpdate.onsuccess = function(event) {
        console.log('Cliente modificado correctamente.')
      }

      requestUpdate.onerror = function(event) {
        console.error('Error al modificar el cliente:', event.target.errorCode)
      }
    } else {
      console.error('El cliente con ID ' + id + ' no fue encontrado.')
    }
  }

  request.onerror = function(event) {
    console.error('Error al obtener el cliente:', event.target.errorCode)
  }
}

function obtenerClientes(callback) {
  const transaction = db.transaction(['clientes'], 'readonly')
  const objectStore = transaction.objectStore('clientes')
  const request = objectStore.getAll()

  request.onsuccess = function(event) {
    const clientes = event.target.result
    callback(clientes)
  }

  request.onerror = function(event) {
    console.error('Error al obtener los clientes:', event.target.errorCode)
  }
}

function eliminarCliente(id) {
  let transaction = db.transaction(["clientes"], "readwrite")
  let objectStore = transaction.objectStore("clientes")

  let request = objectStore.delete(id)

  request.onsuccess = function(event) {
      console.log("Cliente eliminado correctamente")
  }

  request.onerror = function(event) {
      console.error("Error al eliminar el cliente:", event.target.error)
  }
}


export{agregarCliente, modificarCliente, eliminarCliente, obtenerClientes}
