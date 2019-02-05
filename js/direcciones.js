direccionesModulo = (function() {
    var servicioDirecciones; // Servicio que calcula las direcciones
    var mostradorDirecciones; // Servicio muestra las direcciones

    // Calcula las rutas cuando se cambian los lugares de desde, hasta o algun punto intermedio
    function calcularRutasConClic() {
        document
            .getElementById("comoIr")
            .addEventListener("change", function() {
                direccionesModulo.calcularYMostrarRutas();
            });

        document
            .getElementById("calcularMuchos")
            .addEventListener("click", function() {
                direccionesModulo.calcularYMostrarRutas();
            });

        var listasLugares = document.getElementsByClassName("lugares");
        for (var j = 0; j < listasLugares.length; j++) {
            listasLugares[j].addEventListener("change", function() {
                if (
                    document.getElementById("desde").value != "" &&
                    document.getElementById("desde").value != ""
                ) {
                    direccionesModulo.calcularYMostrarRutas();
                }
            });
        }
    }

    // Agrega la dirección en las lista de Lugares Intermedios en caso de que no estén
    function agregarDireccionEnLista(direccion, coord) {
        var lugaresIntermedios = document.getElementById("puntosIntermedios");

        var haceFaltaAgregar = true;
        for (i = 0; i < lugaresIntermedios.length; ++i) {
            if (
                lugaresIntermedios.options[i].text.replace(/\r?\n|\r/g, " ") ===
                direccion.replace(/\r?\n|\r/g, " ")
            ) {
                haceFaltaAgregar = false;
            }
        }
        if (haceFaltaAgregar) {
            var opt = document.createElement("option");
            opt.value = coord;
            opt.innerHTML = direccion;
            lugaresIntermedios.appendChild(opt);
        }
    }

    // Agrega la dirección en las listas de puntos intermedios y lo muestra con el street view
    function agregarDireccionYMostrarEnMapa(direccion, ubicacion) {
        that = this;
        var ubicacionTexto = ubicacion.lat() + "," + ubicacion.lng();
        agregarDireccionEnLista(direccion, ubicacionTexto);
        mapa.setCenter(ubicacion);
        streetViewModulo.fijarStreetView(ubicacion);
        marcadorModulo.mostrarMiMarcador(ubicacion);
    }

    function agregarDireccion(direccion, ubicacion) {
        that = this;
        var ubicacionTexto = ubicacion.lat() + "," + ubicacion.lng();
        agregarDireccionEnLista(direccion, ubicacionTexto);
        mapa.setCenter(ubicacion);
    }

    // Inicializo las variables que muestra el panel y el que calcula las rutas//
    function inicializar() {
        calcularRutasConClic();
        // Agrega la direccion cuando se presioná enter en el campo agregar
        $("#agregar").keypress(function(e) {
            if (e.keyCode == 13) {
                var direccion = document.getElementById("agregar").value;
                geocodificadorModulo.usaDireccion(
                    direccion,
                    direccionesModulo.agregarDireccion
                );
            }
        });
        // Calcula las rutas cuando se presioná enter en el campo desde y hay un valor disitnto a vacío en 'hasta'
        $("#desde").keypress(function(e) {
            if (
                e.keyCode == 13 &&
                document.getElementById("hasta").value != ""
            ) {
                direccionesModulo.calcularYMostrarRutas();
            }
        });

        // Calcula las rutas cuando se presioná enter en el campo hasta y hay un valor disitnto a vacío en 'desde'
        $("#hasta").keypress(function(e) {
            if (
                e.keyCode == 13 &&
                document.getElementById("desde").value != ""
            ) {
                direccionesModulo.calcularYMostrarRutas();
            }
        });
        servicioDirecciones = new google.maps.DirectionsService();
        mostradorDirecciones = new google.maps.DirectionsRenderer({
            draggable: true,
            map: mapa,
            panel: document.getElementById("directions-panel-summary"),
            suppressMarkers: true
        });
    }

    // Calcula la ruta entre los puntos Desde y Hasta con los puntosIntermedios
    // dependiendo de la formaDeIr que puede ser Caminando, Auto o Bus/Subterraneo/Tren
    function calcularYMostrarRutas() {
        /* Completar la función calcularYMostrarRutas , que dependiendo de la forma en que el
        usuario quiere ir de un camino al otro, calcula la ruta entre esas dos posiciones
        y luego muestra la ruta. */
        const from = document.getElementById("desde").value;
        const to = document.getElementById("hasta").value;
        const metodoDeTransporte = document.getElementById("comoIr").value;

        let Transportreq;

        switch (metodoDeTransporte) {
            case "Auto":
                Transportreq = "DRIVING";
                break;

            case "Caminando":
                Transportreq = "WALKING";
                break;

            case "Bus/Subterraneo/Tren":
                Transportreq = "TRANSIT";
                break;
        }

        let waypoints = [];
        const puntosIntermediosEl = document.getElementById("puntosIntermedios");

        for (let i = 0; i < puntosIntermediosEl.length; i++) {
            if (puntosIntermediosEl.options[i].selected) {
                waypoints.push({
                    location: puntosIntermediosEl[i].text,
                    stopover: true
                });
            }
        }

        const request = {
            origin: from,
            destination: to,
            travelMode: Transportreq,
            waypoints: waypoints
        };

        mostradorDirecciones.setMap(mapa);
        const directions = document.getElementsByClassName("directions");
        servicioDirecciones.route(request, function(result, status) {
            if (status == "OK") {
                mostradorDirecciones.setDirections(result);
                mostradorDirecciones.setPanel(directions[0]);
            }
        });
    }

    return {
        inicializar,
        agregarDireccion,
        agregarDireccionEnLista,
        agregarDireccionYMostrarEnMapa,
        calcularYMostrarRutas
    };
})();
