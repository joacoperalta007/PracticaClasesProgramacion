// server.js (Servidor Simulado para el Examen)
const httpServer = require("http").createServer();
const io = new require("socket.io")(httpServer, { cors: { origin: "*" } });

console.log("Servidor SIMULADO de Turnos iniciado...");

// Datos de ejemplo que cambian
let turnoActual = 1;
let pacienteActual = 'Nadie';
let cantidadReservas = 0;
const especialidad = "Clínica Médica (Simulada)";

// Lógica de Socket.IO
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado:', socket.id);

    // Evento: Alguien quiere unirse
    socket.on('join_turnos', (data) => {
        console.log('Cliente quiere unirse:', data);
        // Respondemos con los datos actuales
        socket.emit('joined_OK_turnos', {
            especialidad: especialidad,
            turnoActual: turnoActual,
            cantidadReservas: cantidadReservas,
            pacienteActual: pacienteActual
        });
    });

    // Evento: Alguien realiza una reserva
    socket.on('realizar_reserva', (data) => {
        console.log('Reserva recibida:', data);

        turnoActual = data.numeroTurno;
        pacienteActual = data.paciente;
        cantidadReservas++;

        const dataActualizado = {
            especialidad: especialidad,
            turnoActual: turnoActual,
            cantidadReservas: cantidadReservas,
            pacienteActual: pacienteActual,
            numeroTurno: data.numeroTurno,
            paciente: data.paciente,
            timestamp: Date.now()
        };
        io.emit('nueva_reserva', dataActualizado);

        // Simulación de "turnos completos" (después de 5 reservas)
        if (cantidadReservas >= 5) {
            console.log("Simulando turnos completos...");
            io.emit('turnos_completos', { message: "Simulación completa" });
            turnoActual = 1;
            pacienteActual = 'Nadie';
            cantidadReservas = 0;
        }
    });
});

// El servidor escucha en el puerto 4000
httpServer.listen(4000, () => console.log('Servidor SIMULADO escuchando en puerto 4000'));