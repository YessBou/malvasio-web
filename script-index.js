const seSuscribio = true;
const seMostroPopup = true;

window.onload = function () {
    let seSuscribioLocal = JSON.parse(localStorage.getItem("seSuscribio"));
    let seMostroPopupLocal = JSON.parse(sessionStorage.getItem("seMostroPopup"));

    if (seSuscribioLocal || seMostroPopupLocal) {
        return;
    }

    document.querySelector(".overlay").style.display = "block";
    setTimeout(() => {
        document.getElementById("popup").style.display = "block";
        sessionStorage.setItem("seMostroPopup", JSON.stringify(seMostroPopup));
    }, 1000);
};

function cerrarPopup() {
    document.getElementById("popup").style.display = "none";
    document.querySelector(".overlay").style.display = "none";
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validarCampo(id) {
    let valor = document.getElementById(id).value.trim();
    let errorCampo = document.getElementById(`error${id.charAt(0).toUpperCase() + id.slice(1)}`);
    let boton = document.querySelector(".boton-principal");

    if (id === "email") {
        if (valor === "") {
            errorCampo.innerText = "Campo obligatorio";
            errorCampo.style.visibility = "visible";
        } else if (!emailRegex.test(valor)) {
            errorCampo.innerText = "Email inválido";
            errorCampo.style.visibility = "visible";
        } else {
            errorCampo.style.visibility = "hidden";
        }
    } else {
        errorCampo.innerText = "Campo obligatorio";
        errorCampo.style.visibility = valor === "" ? "visible" : "hidden";
    }

    validarBoton();
}

function validarBoton() {
    let nombre = document.getElementById("nombre").value.trim();
    let email = document.getElementById("email").value.trim();
    let boton = document.querySelector(".boton-principal");

    if (nombre !== "" && emailRegex.test(email)) {
        boton.removeAttribute("disabled");
    } else {
        boton.setAttribute("disabled", "true");
    }
}

function enviarSuscripcion() {
    let nombre = document.getElementById("nombre").value.trim();
    let email = document.getElementById("email").value.trim();
    let boton = document.querySelector(".boton-principal");
    let spinner = document.querySelector("img[alt='']");
    let mensaje = document.createElement("p");

    // Validación antes de enviar
    if (nombre === "" || !emailRegex.test(email)) {
        return;
    }

    // Deshabilitar botón y mostrar spinner
    boton.setAttribute("disabled", "true");
    spinner.style.display = "inline-block";

    let scriptUrl = "https://script.google.com/macros/s/AKfycbyC_G5nfRD74ygzn0_SidawIgknBcExvU7iKYaOndi-_0SdtYlAKa-V8ZpiM65Xw6J5gg/exec"
        + "?nombre=" + encodeURIComponent(nombre)
        + "&email=" + encodeURIComponent(email);

        fetch(scriptUrl)
        .then(response => response.text())
        .then(data => {
            console.log("Gracias por suscribirte!");
            localStorage.setItem('seSuscribio', JSON.stringify(seSuscribio));
    
            mostrarMensaje("¡Suscripción exitosa!", true); // Éxito
        })
        .catch(error => {
            console.error("Error:", error);
            mostrarMensaje("Error al suscribirse. Intente nuevamente.", false); // Error
        })    
        .finally(() => {
            spinner.style.display = "none";
        });
}

function mostrarMensaje(mensajeTexto, esExito) {
    let mensaje = document.getElementById("mensajeResultado");

    // Seteamos el texto
    mensaje.innerText = mensajeTexto;

    // Aplicamos color según el tipo de mensaje
    mensaje.style.color = esExito ? "green" : "red";
    
    // Mostramos el mensaje
    mensaje.style.visibility = "visible";

    // Ocultar después de unos segundos
    setTimeout(() => {
        mensaje.style.visibility = "hidden";
        cerrarPopup();
    }, 3000);
}

