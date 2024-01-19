let turnos = [];

$(document).ready(function () {
    cargarDatosDesdeAPI();
    mostrarTurnos();

    const inputNombre = $('#nombrePacienteInput');
    const botonAgregar = $('#agregarBtn');
    const botonBuscarPorNombre = $('#buscarPorNombreBtn');

    botonAgregar.on('click', function () {
        agregarTurno(inputNombre.val())
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Turno Agregado!',
                    showConfirmButton: false,
                    timer: 1500
                });
                mostrarTurnos();
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error
                });
            });
    });

    botonBuscarPorNombre.on('click', function () {
        const nombreABuscar = inputNombre.val();
        buscarTurnosPorNombre(nombreABuscar)
            .then(resultadosNombre => mostrarResultados(resultadosNombre))
            .catch(error => {
                console.error('Error al buscar por nombre:', error);
            });
    });

    $(document).on('click', '.eliminarBtn', function () {
        const index = $(this).data('index');
        eliminarTurno(index);
    });

    function cargarDatosDesdeAPI() {
        const urlAPI = 'https://randomuser.me/api/';

        fetch(urlAPI)
            .then(response => response.json())
            .then(data => {
                console.log('Datos de la API:', data);
                const paciente = `${data.results[0].name.first} ${data.results[0].name.last}`;
                agregarTurno(paciente);
            })
            .catch(error => {
                console.error('Error al cargar datos desde la API:', error);
            });
    }
    
    function agregarTurno(nombrePaciente) {
        return new Promise((resolve, reject) => {
            if (nombrePaciente.trim() !== '') {
                const nuevoTurno = {
                    paciente: nombrePaciente,
                    hora: obtenerHoraActual(),
                    fecha: obtenerFechaActual(),
                    estado: 'Pendiente'
                };
                turnos.push(nuevoTurno);
                guardarTurnosEnJSONStorage()
                    .then(() => {
                        inputNombre.val('');
                        console.log('Nuevo turno agregado:', nuevoTurno);
                        mostrarTurnos();
                        resolve();
                    })
                    .catch(error => reject('Error al guardar en el almacenamiento: ' + error));
            } else {
                reject('Por favor ingresa un nombre de paciente válido.');
            }
        });
    }

    function eliminarTurno(index) {
        turnos.splice(index, 1);
        guardarTurnosEnJSONStorage()
            .then(() => {
                mostrarTurnos();
                Swal.fire({
                    icon: 'success',
                    title: '¡Turno Eliminado!',
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(error => {
                console.error('Error al guardar en el almacenamiento: ', error);
            });
    }

    function guardarTurnosEnJSONStorage() {
        return new Promise(resolve => {
            localStorage.setItem('turnos', JSON.stringify(turnos));
            resolve();
        });
    }

    function cargarTurnosDesdeJSONStorage() {
        return new Promise(resolve => {
            const turnosGuardados = localStorage.getItem('turnos');
            if (turnosGuardados) {
                turnos = JSON.parse(turnosGuardados);
            }
            resolve();
        });
    }

    function mostrarTurnos() {
        const lista = $('#turnoList');
        lista.empty();

        const template = $('#turnoTemplate').html();
        const compiledTemplate = Handlebars.compile(template);

        turnos.forEach((turno, index) => {
            const html = compiledTemplate({
                index: index + 1,
                paciente: turno.paciente,
                hora: turno.hora,
                fecha: turno.fecha,
                estado: turno.estado
            });
            lista.append(html);
        });
    }

    function obtenerHoraActual() {
        const fecha = new Date();
        const hora = fecha.getHours();
        const minutos = fecha.getMinutes();
        const minutosFormateados = (minutos < 10) ? '0' + minutos : minutos;
        return `${hora}:${minutosFormateados}`;
    }
    

    function obtenerFechaActual() {
        const fecha = new Date();
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const año = fecha.getFullYear();
        return `${dia}/${mes}/${año}`;
    }

    function mostrarResultados(resultados) {
        const listaResultados = $('#resultadosList');
        listaResultados.empty();

        if (resultados.length === 0) {
            const li = $('<li></li>').text('No se encontraron resultados');
            listaResultados.append(li);
        } else {
            resultados.forEach((turno, index) => {
                const li = $('<li></li>').text(`${index + 1}. Paciente: ${turno.paciente} - Fecha y hora: ${turno.fecha} ${turno.hora} - Estado: ${turno.estado}`);
                listaResultados.append(li);
            });
        }
    }

    function buscarTurnosPorNombre(nombre) {
        return turnos.filter(turno => turno.paciente.toLowerCase().includes(nombre.toLowerCase()));
    }

    function filtrarPorEstado() {
        const estado = $('#estadoFiltro').val();
        if (estado === '') {
            mostrarTurnos();
        } else {
            const turnosFiltrados = filtrarTurnosPorEstado(estado);
            mostrarTurnos(turnosFiltrados);
        }
    }

    function filtrarTurnosPorEstado(estado) {
        return turnos.filter(turno => turno.estado === estado);
    }
});
