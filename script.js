let usuarioActual = null;

// =========================
// MENSAJES
// =========================

function mostrarMensaje(texto, tipo){

    let mensaje = document.getElementById("mensaje");

    mensaje.innerHTML = texto;

    mensaje.className = tipo;

    mensaje.style.display = "block";

    setTimeout(() => {

        mensaje.style.display = "none";

    }, 3000);
}

// =========================
// CAMBIAR PANTALLAS
// =========================

function mostrarRegistro(){

    document.getElementById("registroBox")
    .classList.remove("oculto");

    document.getElementById("loginBox")
    .classList.add("oculto");
}

function mostrarLogin(){

    document.getElementById("loginBox")
    .classList.remove("oculto");

    document.getElementById("registroBox")
    .classList.add("oculto");
}

// =========================
// LOCAL STORAGE
// =========================

function obtenerUsuarios(){

    return JSON.parse(
        localStorage.getItem("usuarios")
    ) || [];
}

function guardarUsuarios(usuarios){

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );
}

// =========================
// ACTUALIZAR SALDO FIJO
// =========================

function actualizarSaldo(){

    document.getElementById("saldoFijo")
    .innerHTML =

    "💰 Saldo: $" +

    usuarioActual.saldo.toLocaleString()

    + " COP";
}

// =========================
// FECHA
// =========================

function obtenerFecha(){

    return new Date().toLocaleString();
}

// =========================
// REGISTRO
// =========================

function registrar(){

    let usuario = document
    .getElementById("registroUsuario")
    .value
    .trim();

    let password = document
    .getElementById("registroPassword")
    .value
    .trim();

    if(usuario === "" || password === ""){

        mostrarMensaje(
            "Complete todos los campos",
            "error"
        );

        return;
    }

    let usuarios = obtenerUsuarios();

    let existe = usuarios.find(
        u => u.usuario === usuario
    );

    if(existe){

        mostrarMensaje(
            "Ese usuario ya existe",
            "error"
        );

        return;
    }

    let nuevoUsuario = {

        usuario: usuario,

        password: password,

        saldo: 200000,

        movimientos: [
            "[" + obtenerFecha() + "] Cuenta creada con saldo inicial de $200.000"
        ]
    };

    usuarios.push(nuevoUsuario);

    guardarUsuarios(usuarios);

    mostrarMensaje(
        "Usuario registrado correctamente",
        "exito"
    );

    document.getElementById("registroUsuario").value = "";

    document.getElementById("registroPassword").value = "";
}

// =========================
// LOGIN
// =========================

function login(){

    let usuario = document
    .getElementById("loginUsuario")
    .value
    .trim();

    let password = document
    .getElementById("loginPassword")
    .value
    .trim();

    let usuarios = obtenerUsuarios();

    let encontrado = usuarios.find(

        u =>

        u.usuario === usuario &&

        u.password === password
    );

    if(!encontrado){

        mostrarMensaje(
            "Usuario o contraseña incorrectos",
            "error"
        );

        return;
    }

    usuarioActual = encontrado;

    document.getElementById("panel")
    .classList.remove("oculto");

    document.getElementById("loginBox")
    .classList.add("oculto");

    document.getElementById("registroBox")
    .classList.add("oculto");

    document.querySelector(".menuBotones")
    .style.display = "none";

    document.getElementById("bienvenida")
    .innerHTML =
    "Bienvenido " + usuarioActual.usuario;

    actualizarSaldo();

    mostrarMensaje(
        "Inicio de sesión exitoso",
        "exito"
    );

    document.getElementById("loginUsuario").value = "";

    document.getElementById("loginPassword").value = "";
}

// =========================
// VER SALDO
// =========================

function verSaldo(){

    actualizarSaldo();

    document.getElementById("resultado")
    .innerHTML =

    "<h2>Saldo disponible:</h2><br><h1>$" +

    usuarioActual.saldo.toLocaleString()

    + " COP</h1>";
}

// =========================
// CONSIGNAR
// =========================

function consignar(){

    document.getElementById("formularioOperacion")
    .innerHTML = `

        <h3>Consignar Dinero</h3>

        <input
            type="number"
            id="valorConsignar"
            placeholder="Ingrese valor"
        >

        <button onclick="confirmarConsignacion()">
            Confirmar Consignación
        </button>
    `;
}

function confirmarConsignacion(){

    let valor = parseInt(

        document.getElementById("valorConsignar").value
    );

    if(isNaN(valor) || valor <= 0){

        mostrarMensaje(
            "Ingrese un valor válido",
            "error"
        );

        return;
    }

    let usuarios = obtenerUsuarios();

    let usuario = usuarios.find(
        u => u.usuario === usuarioActual.usuario
    );

    usuario.saldo += valor;

    usuario.movimientos.push(

        "[" + obtenerFecha() + "] Consignó $" +

        valor.toLocaleString()
    );

    guardarUsuarios(usuarios);

    usuarioActual = usuario;

    actualizarSaldo();

    document.getElementById("formularioOperacion")
    .innerHTML = "";

    mostrarMensaje(
        "Consignación exitosa",
        "exito"
    );
}

// =========================
// RETIRAR
// =========================

function retirar(){

    document.getElementById("formularioOperacion")
    .innerHTML = `

        <h3>Retirar Dinero</h3>

        <input
            type="number"
            id="valorRetirar"
            placeholder="Ingrese valor"
        >

        <button onclick="confirmarRetiro()">
            Confirmar Retiro
        </button>
    `;
}

function confirmarRetiro(){

    let valor = parseInt(

        document.getElementById("valorRetirar").value
    );

    if(isNaN(valor) || valor <= 0){

        mostrarMensaje(
            "Ingrese un valor válido",
            "error"
        );

        return;
    }

    if(valor > usuarioActual.saldo){

        mostrarMensaje(
            "Saldo insuficiente",
            "error"
        );

        return;
    }

    let usuarios = obtenerUsuarios();

    let usuario = usuarios.find(
        u => u.usuario === usuarioActual.usuario
    );

    usuario.saldo -= valor;

    usuario.movimientos.push(

        "[" + obtenerFecha() + "] Retiró $" +

        valor.toLocaleString()
    );

    guardarUsuarios(usuarios);

    usuarioActual = usuario;

    actualizarSaldo();

    document.getElementById("formularioOperacion")
    .innerHTML = "";

    mostrarMensaje(
        "Retiro exitoso",
        "exito"
    );
}

// =========================
// TRANSFERIR
// =========================

function transferir(){

    document.getElementById("formularioOperacion")
    .innerHTML = `

        <h3>Transferir Dinero</h3>

        <input
            type="text"
            id="usuarioDestino"
            placeholder="Usuario destino"
        >

        <input
            type="number"
            id="valorTransferencia"
            placeholder="Valor"
        >

        <button onclick="confirmarTransferencia()">
            Confirmar Transferencia
        </button>
    `;
}

function confirmarTransferencia(){

    let destino = document
    .getElementById("usuarioDestino")
    .value
    .trim();

    let valor = parseInt(

        document.getElementById("valorTransferencia").value
    );

    if(destino === usuarioActual.usuario){

        mostrarMensaje(
            "No puede transferirse a sí mismo",
            "error"
        );

        return;
    }

    if(isNaN(valor) || valor <= 0){

        mostrarMensaje(
            "Ingrese un valor válido",
            "error"
        );

        return;
    }

    if(valor > usuarioActual.saldo){

        mostrarMensaje(
            "Saldo insuficiente",
            "error"
        );

        return;
    }

    let usuarios = obtenerUsuarios();

    let usuarioDestino = usuarios.find(
        u => u.usuario === destino
    );

    if(!usuarioDestino){

        mostrarMensaje(
            "Usuario destino no existe",
            "error"
        );

        return;
    }

    let usuarioOrigen = usuarios.find(
        u => u.usuario === usuarioActual.usuario
    );

    usuarioOrigen.saldo -= valor;

    usuarioDestino.saldo += valor;

    usuarioOrigen.movimientos.push(

        "[" + obtenerFecha() + "] Transferencia enviada de $" +

        valor.toLocaleString() +

        " a " +

        usuarioDestino.usuario
    );

    usuarioDestino.movimientos.push(

        "[" + obtenerFecha() + "] Transferencia recibida de $" +

        valor.toLocaleString() +

        " de " +

        usuarioOrigen.usuario
    );

    guardarUsuarios(usuarios);

    usuarioActual = usuarioOrigen;

    actualizarSaldo();

    document.getElementById("formularioOperacion")
    .innerHTML = "";

    mostrarMensaje(
        "Transferencia exitosa",
        "exito"
    );
}

// =========================
// MOVIMIENTOS
// =========================

function verMovimientos(){

    let html = "<h2>Movimientos</h2><br>";

    usuarioActual.movimientos.forEach(m => {

        html += "<p>• " + m + "</p><br>";
    });

    document.getElementById("resultado")
    .innerHTML = html;
}

// =========================
// CERRAR SESION
// =========================

function cerrarSesion(){

    usuarioActual = null;

    document.getElementById("panel")
    .classList.add("oculto");

    document.querySelector(".menuBotones")
    .style.display = "flex";

    mostrarLogin();

    document.getElementById("resultado")
    .innerHTML = "";

    document.getElementById("formularioOperacion")
    .innerHTML = "";

    mostrarMensaje(
        "Sesión cerrada",
        "exito"
    );
}