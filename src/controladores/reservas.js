const { estadosPermitidos } = require("../middleware/reservas");

function crearControladorReservas(servicio) {
  function inicio(req, res) {
    res.render("inicio", {
      titulo: "Reservas de salas de estudio",
    });
  }

  async function estado(req, res) {
    const cantidad = await servicio.contar();

    return res.json({
      servicio: "activo",
      reservas: cantidad,
      solicitudId: res.locals.solicitudId,
    });
  }

  async function listar(req, res) {
    const reservas = await servicio.listar();

    return res.render("reservas/lista", {
      titulo: "Reservas registradas",
      reservas,
    });
  }

  function nueva(req, res) {
    return res.render("reservas/nueva", {
      titulo: "Nueva reserva",
      errores: [],
      valores: {},
      salasPermitidas: servicio.obtenerSalasPermitidas(),
      turnosPermitidos: servicio.obtenerTurnosPermitidos(),
    });
  }

  function identificadorInvalido(res) {
    return res.status(400).render("no-encontrado", {
      titulo: "Identificador inválido",
      mensaje: "El identificador de la reserva no es válido.",
      codigo: 400,
    });
  }

  function reservaNoEncontrada(res) {
    return res.status(404).render("no-encontrado", {
      titulo: "Reserva no encontrada",
      mensaje: "La reserva solicitada no existe.",
      codigo: 404,
    });
  }

  async function detalle(req, res) {
    const id = req.params.id;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return identificadorInvalido(res);
    }

    const reserva = await servicio.buscarPorId(id);

    if (!reserva) {
      return reservaNoEncontrada(res);
    }

    return res.render("reservas/detalle", {
      titulo: "Detalle de la reserva",
      reserva,
    });
  }

  async function crear(req, res) {
    await servicio.crear(req.reservaValidada);

    return res.redirect(302, "/reservas");
  }

  async function editar(req, res) {
    const id = req.params.id;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return identificadorInvalido(res);
    }

    const reserva = await servicio.buscarPorId(id);

    if (!reserva) {
      return reservaNoEncontrada(res);
    }

    const valores = {
      estudiante: String(reserva.estudiante ?? ""),
      email: String(reserva.email ?? ""),
      sala: String(reserva.sala ?? ""),
      fecha: String(reserva.fecha ?? ""),
      turno: String(reserva.turno ?? ""),
      personas: String(reserva.personas ?? ""),
      estado: String(reserva.estado ?? ""),
    };

    return res.render("reservas/editar", {
      titulo: "Editar reserva",
      id,
      errores: [],
      valores,
      salasPermitidas: servicio.obtenerSalasPermitidas(),
      turnosPermitidos: servicio.obtenerTurnosPermitidos(),
      estadosPermitidos,
    });
  }

  async function guardarEdicion(req, res) {
    const id = req.params.id;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return identificadorInvalido(res);
    }

    const reserva = await servicio.reemplazar(id, req.reservaValidada);

    if (!reserva) {
      return reservaNoEncontrada(res);
    }

    return res.redirect(303, `/reservas/${id}`);
  }

  return {
    inicio,
    estado,
    listar,
    nueva,
    detalle,
    crear,
    editar,
    guardarEdicion,
  };
}

module.exports = crearControladorReservas;
