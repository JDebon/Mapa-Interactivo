lugaresModulo = (function() {
    var servicioLugares; // Servicio para obtener lugares cercanos e información de lugares(como fotos, puntuación del lugar,etc).

    // Completa las direcciones ingresadas por el usuario a y establece los límites
    // con un círculo cuyo radio es de 20000 metros.
    function autocompletar() {
        /* Completar la función autocompletar(): autocompleta los 4 campos de texto de la
        página (las direcciones ingresables por el usuario).
        Para esto creá un círculo con radio de 20000 metros y usalo para fijar
        los límites de la búsqueda de dirección. El círculo no se debe ver en el mapa. */

        const radioAutocomplete = 20000;
        const MapCenter = mapa.getCenter();

        const area = new google.maps.Circle({
            center: MapCenter,
            radius: radioAutocomplete,
            map: mapa,
            strokeOpacity: 0,
            fillOpacity: 0
        });

        const autoCompleteBounds = area.getBounds();

        const options = {
            bounds: autoCompleteBounds,
            map: map
        };

        const autocompletadoDireccion = new google.maps.places.Autocomplete(
            document.getElementById("direccion"),
            options
        );
        const  autocompletadoDesde = new google.maps.places.Autocomplete(
            document.getElementById("desde"),
            options
        );
        const autocompletadoHasta = new google.maps.places.Autocomplete(
            document.getElementById("hasta"),
            options
        );
        const autocompletado4 = new google.maps.places.Autocomplete(
            document.getElementById("agregar"),
            options
        );
    }

    // Inicializo la variable servicioLugares y llamo a la función autocompletar
    function inicializar() {
        servicioLugares = new google.maps.places.PlacesService(mapa);
        autocompletar();
    }

    // Busca lugares con el tipo especificado en el campo de TipoDeLugar

    function buscarCerca(posicion) {
        /* Completar la función buscarCerca  que realice la búsqueda de los lugares
    del tipo (tipodeLugar) y con el radio indicados en el HTML cerca del lugar
    pasado como parámetro y llame a la función marcarLugares. */
        let radio = parseInt(document.getElementById("radio").value);
        let tipoLugar = document.getElementById("tipoDeLugar").value;
        let request = {
            location: posicion,
            radius: radio,
            type: tipoLugar
        };
        servicioLugares.nearbySearch(request, marcadorModulo.marcarLugares);
    }
    return {
        inicializar,
        buscarCerca
    };
})();
