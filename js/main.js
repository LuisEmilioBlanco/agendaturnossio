
let turnos = [];

function agregarTurno() {
    const input = document.getElementById('turnoInput');
    const nombrePaciente = input.value;

if (nombrePaciente !== '') {
    const nuevoTurno = {
        paciente: nombrePaciente,
        hora: obtenerHoraActual(),
        fecha: obtenerFechaActual(),
        estado: 'Pendiente'
    };
    turnos.push(nuevoTurno);
    input.value = '';
    mostrarTurnos();
    }
}

function mostrarTurnos() {
    const lista = document.getElementById('turnoList');
    lista.innerHTML = ''; 
    turnos.forEach((turno, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. Paciente: ${turno.paciente} - Hora: ${turno.hora} - Fecha: ${turno.fecha} - Estado: ${turno.estado}`;
    lista.appendChild(li);
    });
}

function obtenerHoraActual() {
    const fecha = new Date();
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    return `${hora}:${minutos < 10 ? '0' + minutos : minutos}`;
}

function obtenerFechaActual() {
    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
}

function buscarPorNombre() {
    const nombreABuscar = document.getElementById('busquedaNombreInput').value;
    const resultados = buscarTurnoPorNombre(nombreABuscar);
    mostrarResultados(resultados);
}

function filtrarPorEstado() {
    const estadoSeleccionado = document.getElementById('estadoFiltro').value;
    const resultados = filtrarPorEstado(estadoSeleccionado);
    mostrarResultados(resultados);
}

function mostrarResultados(resultados) {
    const listaTurnos = document.getElementById('listaTurnos');
    listaTurnos.innerHTML = '';
    resultados.forEach((turno, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. Paciente: ${turno.paciente} - Fecha y hora: ${turno.fechaHora} - Estado: ${turno.estado}`;
        listaTurnos.appendChild(li);
    });
}