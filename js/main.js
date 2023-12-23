let turnos = [];

window.onload = function () {
    cargarTurnosDesdeLocalStorage();
    mostrarTurnos();

    document.addEventListener('DOMContentLoaded', function() {
        const inputNombre = document.getElementById('nombrePacienteInput');
        const botonAgregar = document.getElementById('agregarBtn');

        botonAgregar.addEventListener('click', function() {
            agregarTurno(inputNombre.value);
        });

        function agregarTurno(nombrePaciente) {
            if (nombrePaciente.trim() !== '') {
                const nuevoTurno = {
                    paciente: nombrePaciente,
                    hora: obtenerHoraActual(),
                    fecha: obtenerFechaActual(),
                    estado: 'Pendiente'
                };
                turnos.push(nuevoTurno);
                guardarTurnosEnLocalStorage();
                inputNombre.value = '';
                console.log('Nuevo turno agregado:', nuevoTurno);
                mostrarTurnos();
            } else {
                alert('Por favor ingresa un nombre de paciente válido.');
            }
        }

    });
};

function guardarTurnosEnLocalStorage() {
    localStorage.setItem('turnos', JSON.stringify(turnos));
}

function cargarTurnosDesdeLocalStorage() {
    const turnosGuardados = localStorage.getItem('turnos');
    if (turnosGuardados) {
        turnos = JSON.parse(turnosGuardados);
    }
}

function mostrarTurnos() {
    const lista = document.getElementById('turnoList');
    lista.innerHTML = ''; // Limpiamos la lista antes de agregar los nuevos turnos

    turnos.forEach((turno, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. Paciente: ${turno.paciente} - Hora: ${turno.hora} - Fecha: ${turno.fecha} - Estado: ${turno.estado}`;
        lista.appendChild(li); // Agregamos el nuevo turno a la lista
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

function mostrarResultados(resultados) {
    const listaResultados = document.getElementById('resultadosList');
    listaResultados.innerHTML = '';
    
    if (resultados.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No se encontraron resultados';
        listaResultados.appendChild(li);
    } else {
        resultados.forEach((turno, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. Paciente: ${turno.paciente} - Fecha y hora: ${turno.fecha} ${turno.hora} - Estado: ${turno.estado}`;
            listaResultados.appendChild(li);
        });
    }
}

function buscarTurnoPorNombre(nombre) {
    return turnos.filter(turno => turno.paciente.toLowerCase().includes(nombre.toLowerCase()));
}

function filtrarPorEstado(estado) {
    if (estado === '') {
        return turnos;
    } else {
        return turnos.filter(turno => turno.estado === estado);
    }
}
