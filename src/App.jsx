import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Activity, BedDouble, Pill, Siren, Bell, LayoutGrid, Clock,
  CheckCircle2, AlertTriangle, ChevronRight, Plus, X, CalendarDays,
  ClipboardList, Sparkles, Send, Loader2, ShieldAlert, FileText,
  User, Camera, ArrowRight, Accessibility, Search, PhoneCall,
  MessageCircle, Paperclip, Image as ImageIcon, Inbox, Info,
  HeartHandshake, Lock, Lightbulb, Zap, MapPin, Navigation, Stethoscope,
  Building2, ExternalLink, Search as SearchIcon
} from "lucide-react";

/* =========================================================================
   DATOS DE REFERENCIA
   - Hospital: Hospital Nacional Arzobispo Loayza (HNAL), Av. Alfonso Ugarte 848,
     Lima. Categoría III-1, MINSA. Fundado en 1549. Director General: Dr. Eduardo
     Franklin Yong Motta (fuente: gob.pe/institucion/hospitalloayza).
   - Medicamentos: nombres, concentraciones y formas farmacéuticas tomados del
     Petitorio Nacional Único de Medicamentos Esenciales (PNUME), Anexo del
     Decreto de Urgencia N° 005-2024 (DIGEMID - MINSA). Los niveles de stock
     y alertas son ILUSTRATIVOS para esta demo, no datos reales de almacén.
   - Médicos: los nombres y especialidades fueron proporcionados por el usuario
     de esta demo. Turnos, horarios, asistencia y guardias son ILUSTRATIVOS,
     generados para poder mostrar el funcionamiento de AFINTY, y no reflejan
     el rol de guardia real del hospital.
   ========================================================================= */

// Paleta de acento — cálida y clínica a la vez, inspirada en apps de salud
const PALETTE = {
  bgApp: "linear-gradient(160deg, #EAFBF7 0%, #FDF3E9 55%, #FDEBE1 100%)",
  headerGrad: "linear-gradient(100deg, #0A3E44 0%, #0E7C86 55%, #1FBFA0 100%)",
  navActiveGrad: "linear-gradient(120deg, #0E7C86 0%, #1FBFA0 100%)",
  ctaGrad: "linear-gradient(120deg, #0E7C86 0%, #1FBFA0 100%)",
  ctaCoralGrad: "linear-gradient(120deg, #E8553D 0%, #FF8A5C 100%)",
  logoGrad: "linear-gradient(135deg, #0E7C86 0%, #1FBFA0 100%)",
};

const HOSPITAL = {
  nombre: "Hospital Nacional Arzobispo Loayza",
  siglas: "HNAL",
  direccion: "Av. Alfonso Ugarte 848, Cercado de Lima",
  categoria: "III-1 · MINSA",
  fundado: 1549,
  director: "Dr. Eduardo Franklin Yong Motta — Director General",
};

const MEDICAMENTOS_REALES = [
  { nombre: "Paracetamol 500mg TAB", cat: "Analgésico", stock: 8, estado: "crítico" },
  { nombre: "Paracetamol 120mg/5mL LIQ ORAL", cat: "Analgésico", stock: 34, estado: "bajo" },
  { nombre: "Ácido acetilsalicílico 500mg TAB", cat: "Analgésico", stock: 61, estado: "normal" },
  { nombre: "Tramadol clorhidrato 50mg TAB", cat: "Analgésico opioide", stock: 22, estado: "bajo" },
  { nombre: "Morfina clorhidrato 10mg/mL INY 1mL", cat: "Analgésico opioide", stock: 15, estado: "atención" },
  { nombre: "Metamizol sódico (Dipirona) 500mg/mL INY 2mL", cat: "Analgésico", stock: 47, estado: "normal" },
  { nombre: "Amoxicilina 500mg TAB", cat: "Antibiótico", stock: 72, estado: "normal" },
  { nombre: "Ceftriaxona (sal sódica) 1g INY", cat: "Antibiótico", stock: 19, estado: "bajo" },
  { nombre: "Ciprofloxacino 500mg TAB", cat: "Antibiótico", stock: 55, estado: "normal" },
  { nombre: "Azitromicina 500mg TAB", cat: "Antibiótico", stock: 12, estado: "crítico" },
  { nombre: "Vancomicina (clorhidrato) 500mg INY", cat: "Antibiótico", stock: 9, estado: "crítico" },
  { nombre: "Meropenem 500mg INY", cat: "Antibiótico", stock: 26, estado: "bajo" },
  { nombre: "Losartán potásico 50mg TAB", cat: "Antihipertensivo", stock: 88, estado: "normal" },
  { nombre: "Enalapril maleato 20mg TAB", cat: "Antihipertensivo", stock: 66, estado: "normal" },
  { nombre: "Amlodipino (besilato) 10mg TAB", cat: "Antihipertensivo", stock: 70, estado: "normal" },
  { nombre: "Furosemida 40mg TAB", cat: "Diurético", stock: 41, estado: "normal" },
  { nombre: "Insulina isofana humana (NPH) 100UI/mL INY 10mL", cat: "Metabólico", stock: 17, estado: "atención" },
  { nombre: "Metformina clorhidrato 850mg TAB", cat: "Metabólico", stock: 58, estado: "normal" },
  { nombre: "Dexametasona fosfato 4mg INY", cat: "Corticoide", stock: 30, estado: "normal" },
  { nombre: "Hidrocortisona (succinato sódico) 100mg INY", cat: "Corticoide", stock: 21, estado: "bajo" },
  { nombre: "Diazepam 10mg TAB", cat: "Sistema nervioso", stock: 44, estado: "normal" },
  { nombre: "Midazolam (clorhidrato) 5mg/mL INY 10mL", cat: "Sistema nervioso", stock: 13, estado: "atención" },
  { nombre: "Fenitoína sódica 100mg TAB", cat: "Sistema nervioso", stock: 39, estado: "normal" },
  { nombre: "Haloperidol 5mg TAB", cat: "Sistema nervioso", stock: 27, estado: "normal" },
  { nombre: "Sodio cloruro 0.9% INY 1L", cat: "Soluciones IV", stock: 95, estado: "normal" },
  { nombre: "Glucosa en agua 33.3% INY 20mL", cat: "Soluciones IV", stock: 52, estado: "normal" },
  { nombre: "Solución polielectrolítica INY 1L", cat: "Soluciones IV", stock: 6, estado: "crítico" },
  { nombre: "Ondansetrón (clorhidrato) 8mg TAB", cat: "Antiemético", stock: 33, estado: "normal" },
  { nombre: "Omeprazol (sal sódica) 40mg INY", cat: "Gastrointestinal", stock: 24, estado: "bajo" },
  { nombre: "Ranitidina (clorhidrato) 150mg TAB", cat: "Gastrointestinal", stock: 49, estado: "normal" },
  { nombre: "Epinefrina (clorhidrato) 1mg/mL INY 1mL", cat: "Emergencia", stock: 11, estado: "crítico" },
  { nombre: "Atropina sulfato 1mg/mL INY", cat: "Emergencia", stock: 20, estado: "bajo" },
  { nombre: "Norepinefrina (tartrato ácido) 1mg/mL INY 4mL", cat: "Emergencia", stock: 14, estado: "atención" },
  { nombre: "Bencilpenicilina benzatínica 2 400 000UI INY", cat: "Antibiótico", stock: 36, estado: "normal" },
  { nombre: "Salbutamol (sulfato) SOL NBZ 5mg/mL", cat: "Respiratorio", stock: 29, estado: "normal" },
  { nombre: "Propofol 1% INY 20mL", cat: "Anestésico", stock: 18, estado: "atención" },
  { nombre: "Bupivacaína clorhidrato + preservante 0.005 INY 20mL", cat: "Anestésico", stock: 25, estado: "normal" },
  { nombre: "Sulfadiazina de plata 1% CRM TOP 400-500g", cat: "Dermatológico", stock: 10, estado: "crítico" },
  { nombre: "Heparina sódica 5 000UI/mL INY 5mL", cat: "Anticoagulante", stock: 31, estado: "normal" },
  { nombre: "Warfarina sódica 5mg TAB", cat: "Anticoagulante", stock: 45, estado: "normal" },
];

// Nivel de stock (unidades) que se considera seguro. Por debajo de esto,
// el medicamento necesita reposición.
const META_STOCK = 80;
function unidadesFaltantes(stock) {
  return Math.max(0, META_STOCK - stock);
}
// Ubicación de almacén por categoría (dato ilustrativo para la demo).
const AREA_ALMACEN_POR_CATEGORIA = {
  "Analgésico": "Almacén Central — Sección Analgésicos",
  "Analgésico opioide": "Almacén Central — Sección Controlados",
  "Antibiótico": "Almacén Central — Sección Antibióticos",
  "Antihipertensivo": "Almacén Central — Sección Cardiovascular",
  "Diurético": "Almacén Central — Sección Cardiovascular",
  "Metabólico": "Almacén Central — Sección Metabólico",
  "Corticoide": "Almacén Central — Sección Corticoides",
  "Sistema nervioso": "Almacén Central — Sección Neurología",
  "Soluciones IV": "Almacén Central — Sección Soluciones",
  "Antiemético": "Almacén Central — Sección Gastrointestinal",
  "Gastrointestinal": "Almacén Central — Sección Gastrointestinal",
  "Emergencia": "Farmacia de Emergencias",
  "Respiratorio": "Almacén Central — Sección Respiratorio",
  "Anestésico": "Farmacia de Sala de Operaciones",
  "Dermatológico": "Almacén Central — Sección Dermatológico",
  "Anticoagulante": "Almacén Central — Sección Hematología",
};
function areaDe(cat) {
  return AREA_ALMACEN_POR_CATEGORIA[cat] || "Almacén Central";
}

// Ventana de asistencia: 14 días hasta hoy (patrones generados para la demo)
function ultimosDias(n) {
  const dias = [];
  const hoy = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - i);
    dias.push(d);
  }
  return dias;
}
const DIAS = ultimosDias(14);
const fmtDia = (d) => d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit" });
const fmtDiaSemana = (d) => d.toLocaleDateString("es-PE", { weekday: "short" });

function construirAsistencia(patron) {
  return DIAS.map((fecha, i) => {
    const p = patron[i] || "-";
    const estado = p === "T" ? "a-tiempo" : p === "R" ? "tardanza" : p === "F" ? "falta" : "libre";
    const hora = estado === "a-tiempo" ? "07:00" : estado === "tardanza" ? `07:${18 + (i % 4) * 5}` : null;
    return { fecha, estado, hora };
  });
}

// Generador determinístico (mismo médico siempre produce el mismo patrón),
// para no tener que escribir 48 calendarios de asistencia a mano.
function pseudoRandom(x) {
  const s = Math.sin(x * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}
function generarPatronAuto(seed, esGuardia) {
  return DIAS.map((fecha, i) => {
    const dow = fecha.getDay();
    if (!esGuardia && (dow === 0 || dow === 6)) return "-";
    const r = pseudoRandom(seed * 7.13 + i * 3.71);
    if (r < 0.06) return "F";
    if (r < 0.18) return "R";
    return "T";
  });
}

// Especialidades cuyo personal cumple guardia rotativa de 24 horas en vez de
// horario fijo de consulta externa.
const ESPECIALIDADES_GUARDIA = new Set([
  "Emergencia y Cuidados Críticos",
  "Cuidados Intensivos y Cuidados Intermedios",
  "Reanimación",
]);
const TURNOS_FIJOS = [
  "Lunes a Viernes · 07:00–13:00",
  "Lunes a Viernes · 08:00–14:00",
  "Lunes a Viernes · 14:00–20:00",
];
function construirDoctor(id, nombre, esp) {
  const guardia = ESPECIALIDADES_GUARDIA.has(esp);
  const turno = guardia ? "Guardia rotativa · 24 horas" : TURNOS_FIJOS[id % TURNOS_FIJOS.length];
  return { id, nombre, esp, turno, guardia, asistencia: construirAsistencia(generarPatronAuto(id, guardia)) };
}

// Plana de médicos (nombres y especialidades proporcionados por el usuario).
const DOCTORES_BASE = [
  [1, "Aldo Belly Vivar Mendoza", "Medicina Interna 8-I"],
  [2, "Alexander Adonias Espinoza Vargas", "Cirugía 6-III"],
  [3, "Ana María Del Carmen Paredes Pérez", "Ecografía"],
  [4, "Carlos Homero Otiniano Alvarado", "Cirugía General, Aparato Digestivo y Pared Abdominal"],
  [5, "Daniel Andrés Caceres Alpaca", "Medicina Interna 1-II"],
  [6, "Eduardo Demetrio Matos Prado", "Infectología"],
  [7, "Eduardo Franklin Yong Motta", "Dirección General"],
  [8, "Federico Efrain Elguera Falcón", "Medicina Interna 4-II"],
  [9, "Freddy Edmundo García Ramos", "Endocrinología"],
  [10, "Freddy Rafael Piaggio Fernandez", "Ortopedia y Traumatología"],
  [11, "Gerber Hernan Flores Ccosi", "Urología"],
  [12, "Gilberto Fernando Torres Vega", "Cardiología y Cuidados Coronarios"],
  [13, "Graciela Celina Priale Priale", "Hematología"],
  [14, "Helmund Mariano Manza Diaz", "Otorrinolaringología"],
  [15, "Iván Bernuy Rodríguez", "Emergencia y Cuidados Críticos"],
  [16, "Jorge Aquiles Orna Costa", "Oftalmología"],
  [17, "Jorge Aysanoa Ballester", "Cirugía Vascular Periférico y Angiología"],
  [18, "Jorge Luis Garavito Rentería", "Gastroenterología"],
  [19, "Juan Antonio Allemant Mori", "Reproducción Humana"],
  [20, "Juan Carlos Samame Perez Vargas", "Oncohematología"],
  [21, "Juan Ismael Villarreal Menchola", "Medicina Interna 3-I"],
  [22, "Juan Marcos Villón Almendras", "Geriatría"],
  [23, "José Alberto Rojas Jaimes", "Ginecología y Obstetricia"],
  [24, "José Antonio Novoa Pérez", "Cirugía de Cabeza y Cuello"],
  [25, "José Ignacio Vladimiro Caballero López", "Medicina Interna 4-I"],
  [26, "Julio Cesar Ricardo Castillo Garagate", "Cirugía Torácica y Cardiovascular"],
  [27, "Leónidas Chang Carrillo Ñañez", "Medicina Interna 2-I"],
  [28, "Luis Alberto Maya Pérez", "Medicina Interna"],
  [29, "Luis Sandro Florian Tutaya", "Pediatría"],
  [30, "Lily Nera Asencios Trujillo", "Estomatología"],
  [31, "Marco Antonio Limache Tueros", "Consulta Externa y Hospitalización / Salud Mental"],
  [32, "Mario Daniel Danilla Dávila", "Neumología"],
  [33, "Mario Roberto Cavero Cueva", "Radiología"],
  [34, "Marsi Mónica Larragán Rodríguez", "Pediatría"],
  [35, "Martin Diego Sanchez Sanguinetti", "Neurología"],
  [36, "Mijahil Pavel Cornejo Ortega", "Inmunoreumatología"],
  [37, "Oswaldo Ángelo Granados Huaynates", "Reanimación"],
  [38, "Pedro Cesar Ciudad Cruz", "Cirugía Plástica y Quemados"],
  [39, "Pedro Ernesto Castillo Chirinos", "Especialidades Quirúrgicas"],
  [40, "Percy Genaro Salas Ponce", "Patología Clínica y Banco de Sangre / Bioquímica"],
  [41, "Roberto Eduardo Avila Matos", "Ginecología"],
  [42, "Ronald Arnaldo Ore De La Cruz", "Cirugía 6-I"],
  [43, "Ronny Mitchel Mercado Lopez", "Cuidados Intensivos y Cuidados Intermedios"],
  [44, "Silvia Patricia Martina Zamudio Romero", "Medicina Interna 3-II"],
  [45, "Víctor Alfonso Valencia Caballero", "Medicina Interna 1-I"],
  [46, "Víctor Vladimir Torres Pérez", "Neurocirugía"],
  [47, "Wenceslao Javier Castillo Farneschi", "Dermatología"],
  [48, "Zandra Judith Moncada Vilela", "Medicina Interna 2-II"],
];
const DOCTORES = DOCTORES_BASE.map(([id, nombre, esp]) => construirDoctor(id, nombre, esp));

/* -------------------------------------------------------------------------
   ÁREAS DEL HOSPITAL
   Cada especialidad pertenece a un área o departamento. Las vistas de turnos
   y la mensajería interna agrupan a los médicos por estas áreas, para que
   sea fácil encontrar a quién escribir sin recorrer una lista de 48 nombres.
   ------------------------------------------------------------------------- */
const AREAS_MEDICAS = [
  {
    area: "Dirección y Gestión",
    color: "#0A3E44",
    especialidades: ["Dirección General"],
  },
  {
    area: "Medicina Interna",
    color: "#0E7C86",
    especialidades: [
      "Medicina Interna", "Medicina Interna 1-I", "Medicina Interna 1-II",
      "Medicina Interna 2-I", "Medicina Interna 2-II", "Medicina Interna 3-I",
      "Medicina Interna 3-II", "Medicina Interna 4-I", "Medicina Interna 4-II",
      "Medicina Interna 8-I",
    ],
  },
  {
    area: "Cirugía y Especialidades Quirúrgicas",
    color: "#1F7A52",
    especialidades: [
      "Cirugía 6-I", "Cirugía 6-III", "Cirugía General, Aparato Digestivo y Pared Abdominal",
      "Cirugía Vascular Periférico y Angiología", "Cirugía de Cabeza y Cuello",
      "Cirugía Torácica y Cardiovascular", "Cirugía Plástica y Quemados",
      "Especialidades Quirúrgicas", "Neurocirugía", "Ortopedia y Traumatología",
    ],
  },
  {
    area: "Emergencia y Cuidados Críticos",
    color: "#E8553D",
    especialidades: [
      "Emergencia y Cuidados Críticos", "Cuidados Intensivos y Cuidados Intermedios", "Reanimación",
    ],
  },
  {
    area: "Especialidades Médicas",
    color: "#2F9E6E",
    especialidades: [
      "Cardiología y Cuidados Coronarios", "Neumología", "Gastroenterología",
      "Endocrinología", "Neurología", "Dermatología", "Hematología",
      "Oncohematología", "Infectología", "Inmunoreumatología", "Geriatría", "Urología",
    ],
  },
  {
    area: "Cabeza, Cuello y Sentidos",
    color: "#D98E2B",
    especialidades: ["Otorrinolaringología", "Oftalmología", "Estomatología"],
  },
  {
    area: "Materno Infantil",
    color: "#C05A8C",
    especialidades: ["Ginecología y Obstetricia", "Ginecología", "Reproducción Humana", "Pediatría"],
  },
  {
    area: "Diagnóstico y Apoyo Clínico",
    color: "#5B6B76",
    especialidades: ["Ecografía", "Radiología", "Patología Clínica y Banco de Sangre / Bioquímica"],
  },
  {
    area: "Salud Mental",
    color: "#7A5BD9",
    especialidades: ["Consulta Externa y Hospitalización / Salud Mental"],
  },
];

const AREA_POR_ESPECIALIDAD = {};
AREAS_MEDICAS.forEach((a) => a.especialidades.forEach((e) => { AREA_POR_ESPECIALIDAD[e] = a.area; }));
function areaMedicaDe(esp) {
  return AREA_POR_ESPECIALIDAD[esp] || "Otras especialidades";
}
const COLOR_POR_AREA = Object.fromEntries(AREAS_MEDICAS.map((a) => [a.area, a.color]));
function colorDeArea(area) {
  return COLOR_POR_AREA[area] || "#5B6B76";
}
// Cada doctor lleva su área resuelta desde el inicio.
DOCTORES.forEach((d) => { d.area = areaMedicaDe(d.esp); });

// Lista de áreas con sus médicos dentro, ordenada como AREAS_MEDICAS.
function agruparDoctoresPorArea(lista) {
  const orden = AREAS_MEDICAS.map((a) => a.area).concat("Otras especialidades");
  const mapa = new Map(orden.map((a) => [a, []]));
  lista.forEach((d) => {
    if (!mapa.has(d.area)) mapa.set(d.area, []);
    mapa.get(d.area).push(d);
  });
  return orden
    .map((area) => ({ area, color: colorDeArea(area), doctores: mapa.get(area) || [] }))
    .filter((g) => g.doctores.length > 0);
}

const UMBRAL_ALERTA = 2;

// Hora de entrada programada por médico, derivada de su turno.
function horaInicioDeTurno(turno) {
  const m = turno.match(/(\d{2}:\d{2})/);
  return m ? m[1] : "07:00";
}
const HORA_PROGRAMADA_POR_DOCTOR = Object.fromEntries(DOCTORES.map((d) => [d.id, horaInicioDeTurno(d.turno)]));

function horaAMinutos(h) {
  const [hh, mm] = h.split(":").map(Number);
  return hh * 60 + mm;
}
function esTarde(horaReal, horaProgramada) {
  return horaAMinutos(horaReal) > horaAMinutos(horaProgramada);
}

// Alertas operativas generales (no relacionadas a asistencia médica)
const alertasBase = [
  { id: "op-1", sev: "alta", area: "Cirugía", msg: "Equipo de monitoreo #EQ-14 reporta falla intermitente", time: "Hace 18 min" },
  { id: "op-2", sev: "media", area: "Farmacia", msg: "Azitromicina 500mg: stock crítico (12%)", time: "Hace 12 min" },
  { id: "op-3", sev: "baja", area: "Consulta externa", msg: "3 citas sin confirmar para mañana", time: "Hace 26 min" },
  { id: "op-4", sev: "media", area: "Hospitalización", msg: "Cama 214 pendiente de limpieza hace 40 min", time: "Hace 40 min" },
];

// Genera una alerta por cada tardanza/falta reciente de un médico, con su
// nombre y la fecha exacta en la que ocurrió — lo que dispara la sanción
// / escalamiento a Jefatura de Personal.
function generarAlertasDoctores(ventanaDias = 3) {
  const out = [];
  DOCTORES.forEach((d) => {
    const recientes = d.asistencia.slice(-ventanaDias);
    recientes.forEach((a) => {
      if (a.estado === "falta" || a.estado === "tardanza") {
        out.push({
          id: `doc-${d.id}-${fmtDia(a.fecha)}-${a.estado}`,
          sev: a.estado === "falta" ? "alta" : "media",
          area: d.esp,
          msg: `${d.nombre} — ${a.estado === "falta" ? "no asistió" : "llegó tarde"} el ${fmtDia(a.fecha)}${a.hora ? ` (${a.hora})` : ""}`,
          time: a.estado === "falta" ? "Falta registrada · sujeto a sanción" : "Tardanza registrada",
        });
      }
    });
  });
  return out;
}

const AREAS_CAMAS_BASE = [
  { area: "Emergencias", total: 14, libresInicial: 2 },
  { area: "Hospitalización A", total: 30, libresInicial: 6 },
  { area: "Hospitalización B", total: 30, libresInicial: 11 },
  { area: "UCI", total: 10, libresInicial: 1 },
  { area: "Pediatría", total: 16, libresInicial: 5 },
];

// Cada cama ahora guarda si está ocupada y, de estarlo, el DNI y nombre del
// paciente — así una cama se puede ubicar buscando por DNI.
function construirCamasIniciales() {
  const obj = {};
  AREAS_CAMAS_BASE.forEach((a) => {
    obj[a.area] = Array.from({ length: a.total }, (_, i) => ({
      ocupada: i < a.total - a.libresInicial,
      dni: null,
      nombre: null,
    }));
  });
  // Dos camas de ejemplo con paciente identificado, para poder demostrar
  // la búsqueda por DNI desde la interfaz de familiares.
  if (obj["Hospitalización A"]?.[0]) {
    obj["Hospitalización A"][0] = { ocupada: true, dni: "70844839", nombre: "Abel Andrés Zegarra Villanueva" };
  }
  if (obj["UCI"]?.[0]) {
    obj["UCI"][0] = { ocupada: true, dni: "45119203", nombre: "Rosa Elena Quinteros Palacios" };
  }
  return obj;
}

// Horarios de consulta disponibles por día para cada médico de consulta externa
const HORAS_CITAS = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

// Especialidades sin consulta externa programable (diagnóstico, guardia,
// gestión, etc.) — se excluyen de la agenda de citas.
const EXCLUIDAS_DE_CITAS = new Set([
  "Dirección General",
  "Ecografía",
  "Radiología",
  "Patología Clínica y Banco de Sangre / Bioquímica",
  "Emergencia y Cuidados Críticos",
  "Reanimación",
  "Cuidados Intensivos y Cuidados Intermedios",
]);
const DOCTORES_CITAS_IDS = DOCTORES.filter((d) => !EXCLUIDAS_DE_CITAS.has(d.esp)).map((d) => d.id);
const ESPECIALIDADES_CON_CITAS = Array.from(
  new Set(DOCTORES.filter((d) => DOCTORES_CITAS_IDS.includes(d.id)).map((d) => d.esp))
).sort((a, b) => a.localeCompare(b, "es"));

function manana() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

// Pacientes de ejemplo con distintos formatos de DNI, para poblar algunas
// citas ya asignadas y mostrar cómo se ve la información al costado del casillero.
const PACIENTES_EJEMPLO = [
  { docId: 10, slot: 0, nombre: "Abel Andrés Zegarra Villanueva", dni: "70844839", celular: "987654321" },
  { docId: 23, slot: 2, nombre: "Luisa Villanueva Vásquez", dni: "10287579", celular: "" },
  { docId: 29, slot: 1, nombre: "Billy André Garro Flores", dni: "10288161", celular: "" },
  { docId: 4, slot: 4, nombre: "Rosa Elena Quinteros Palacios", dni: "45119203", celular: "" },
  { docId: 9, slot: 3, nombre: "Jorge Luis Prado Salcedo", dni: "08765432", celular: "" },
];

function construirCitasIniciales() {
  const obj = {};
  DOCTORES_CITAS_IDS.forEach((id) => {
    obj[id] = Array.from({ length: HORAS_CITAS.length }, () => null);
  });
  PACIENTES_EJEMPLO.forEach((p) => {
    obj[p.docId][p.slot] = { nombre: p.nombre, dni: p.dni, celular: p.celular, fecha: manana(), nueva: false };
  });
  return obj;
}

// Pasos de trámite documentario que la IA mueve entre áreas sin que el
// paciente tenga que desplazarse — solo firma al final, en el área de entrega.
const TRAMITE_TEMPLATE = [
  { area: "Admisión", tiempoMin: 5 },
  { area: "Seguros / SOAT", tiempoMin: 8 },
  { area: "Historia Clínica", tiempoMin: 6 },
  { area: "Farmacia", tiempoMin: 4 },
];

const sevStyles = {
  alta: { bg: "#FDEDEA", fg: "#C0392B", dot: "#E8553D", label: "Alta" },
  media: { bg: "#FBF3E4", fg: "#95651A", dot: "#D98E2B", label: "Media" },
  baja: { bg: "#EAF6F0", fg: "#1F7A52", dot: "#2F9E6E", label: "Baja" },
};

const estadoAsistCfg = {
  "a-tiempo": { color: "#2F9E6E", bg: "#EAF6F0", label: "A tiempo" },
  tardanza: { color: "#D98E2B", bg: "#FBF3E4", label: "Tardanza" },
  falta: { color: "#E8553D", bg: "#FDEDEA", label: "Falta" },
  libre: { color: "#B7C1C9", bg: "#F1F4F6", label: "Libre / no le tocaba" },
};

const NAV = [
  { key: "resumen", label: "Resumen", icon: LayoutGrid },
  { key: "hospital", label: "Hospital y médicos", icon: Building2 },
  { key: "turnos", label: "Turnos médicos", icon: Clock },
  { key: "mensajes", label: "Mensajes", icon: Inbox },
  { key: "camas", label: "Camas", icon: BedDouble },
  { key: "citas", label: "Citas", icon: User },
  { key: "insumos", label: "Medicamentos y equipos", icon: Pill },
  { key: "documentos", label: "Documentos", icon: FileText },
  { key: "emergencias", label: "Emergencias", icon: Siren },
  { key: "reportes", label: "Inasistencias y reportes", icon: ClipboardList },
  { key: "alertas", label: "Alertas", icon: Bell },
  { key: "ia", label: "Asistente IA", icon: Sparkles },
  { key: "nosotros", label: "Nosotros", icon: Info },
];

// Roles disponibles al registrarse en AFINTY
const ROLES = ["Paciente o familia", "Doctor", "Almacén", "Vigilante", "Jefatura"];

// Personal de Almacén (nombres proporcionados por el usuario). Se registran
// igual que los médicos: eligen quién son de una lista, en vez de escribirlo.
const ALMACEN_STAFF = [
  "José Luis Quispe Huamán",
  "María Fernanda Torres Castillo",
  "Carlos Alberto Flores Mendoza",
  "Andrea Valentina Ramos Paredes",
  "Luis Ángel Condori Mamani",
  "Gabriela Alejandra Vargas Salazar",
  "Miguel Eduardo Chávez Rojas",
  "Daniela Sofía Huerta Cárdenas",
  "Juan Carlos Apaza Choque",
  "Valeria Nicole García Espinoza",
  "Pedro Antonio Medina Torres",
  "Camila Fernanda Navarro Ruiz",
  "Diego Sebastián Yupanqui Flores",
  "Lucía Isabel Mendoza Cueva",
  "Ricardo Andrés Palomino Sánchez",
  "Ana Paula Vilca Huamán",
  "Fernando Javier Paredes León",
  "Mariana Elizabeth Soto Quispe",
  "Jorge Luis Cárdenas Vargas",
  "Fiorella Alessandra Mamani Condori",
  "César Augusto Rojas Gutiérrez",
  "Patricia Milagros Salinas Chávez",
  "Óscar Daniel Huamán Quispe",
  "Renata Gabriela Castillo Ramos",
  "Víctor Manuel Espinoza Medina",
  "Claudia Beatriz Flores Salazar",
  "Martín Alejandro Choque Apaza",
  "Rosa Elena Cueva Paredes",
  "Sebastián Nicolás León Vargas",
  "Karla Michelle Sánchez Yupanqui",
].map((nombre, i) => ({ id: i + 1, nombre }));

/* -------------------------------------------------------------------------
   MENSAJERÍA INTERNA
   Los adjuntos se guardan en memoria como data URL: la foto o el documento
   nunca sale del dispositivo en esta demo. En producción irían a un
   repositorio clínico con control de acceso por historia clínica.
   ------------------------------------------------------------------------- */
const MAX_ADJUNTO_MB = 5;
const ID_JEFATURA = 0;

function esImagen(tipo) {
  return typeof tipo === "string" && tipo.startsWith("image/");
}
function pesoLegible(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function fmtFechaHora(iso) {
  return new Date(iso).toLocaleString("es-PE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function PantallaAuth({ usuarios, onRegistrar, onLogin }) {
  const [modo, setModo] = useState("login"); // "login" | "registro"
  const [form, setForm] = useState({ nombre: "", usuario: "", contrasena: "", rol: ROLES[0], doctorId: DOCTORES[0].id, almacenId: ALMACEN_STAFF[0].id });
  const [error, setError] = useState("");

  function limpiar() {
    setForm({ nombre: "", usuario: "", contrasena: "", rol: ROLES[0], doctorId: DOCTORES[0].id, almacenId: ALMACEN_STAFF[0].id });
    setError("");
  }

  function cambiarModo(m) {
    setModo(m);
    limpiar();
  }

  function enviarLogin() {
    const encontrado = usuarios.find((u) => u.usuario === form.usuario.trim() && u.contrasena === form.contrasena);
    if (!encontrado) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }
    onLogin(encontrado);
  }

  function enviarRegistro() {
    if (!form.nombre.trim() || !form.usuario.trim() || !form.contrasena) {
      setError("Completa nombre, usuario y contraseña.");
      return;
    }
    if (usuarios.some((u) => u.usuario === form.usuario.trim())) {
      setError("Ese usuario ya existe, elige otro.");
      return;
    }
    const nuevo = { nombre: form.nombre.trim(), usuario: form.usuario.trim(), contrasena: form.contrasena, rol: form.rol };
    if (form.rol === "Doctor") nuevo.doctorId = form.doctorId;
    if (form.rol === "Almacén") nuevo.almacenId = form.almacenId;
    onRegistrar(nuevo);
    onLogin(nuevo);
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#04171B", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", padding: 20 }}>
      {/* Malla de datos: retícula técnica que se desvanece hacia los bordes */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(31,191,160,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(31,191,160,0.09) 1px, transparent 1px)",
        backgroundSize: "52px 52px",
        maskImage: "radial-gradient(ellipse at 50% 45%, #000 0%, #000 45%, transparent 85%)",
        WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, #000 0%, #000 45%, transparent 85%)",
      }} />

      {/* Focos de luz: dan profundidad sin saturar la retícula */}
      <div style={{ position: "absolute", width: 680, height: 680, borderRadius: "50%", top: -260, left: -180, background: "radial-gradient(circle, rgba(31,191,160,0.20) 0%, rgba(31,191,160,0) 70%)" }} />
      <div style={{ position: "absolute", width: 720, height: 720, borderRadius: "50%", bottom: -300, right: -200, background: "radial-gradient(circle, rgba(14,124,134,0.34) 0%, rgba(14,124,134,0) 70%)" }} />

      {/* Trazo de monitor cardiaco recorriendo el fondo */}
      <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 120, marginTop: -60, overflow: "hidden", opacity: 0.5 }}>
        <svg width="200%" height="120" viewBox="0 0 1600 120" preserveAspectRatio="none" className="afinty-auth-ecg" style={{ position: "absolute", left: 0, top: 0 }}>
          <polyline fill="none" stroke="#1FBFA0" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"
            points="0,60 220,60 250,60 268,20 284,100 300,60 560,60 600,60 618,44 636,76 654,60 800,60" />
          <polyline fill="none" stroke="#1FBFA0" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"
            points="800,60 1020,60 1050,60 1068,20 1084,100 1100,60 1360,60 1400,60 1418,44 1436,76 1454,60 1600,60" />
        </svg>
      </div>

      {/* Nodos de la red hospitalaria */}
      <div style={{ position: "absolute", inset: 0 }}>
        {[
          { top: "18%", left: "14%", d: "0s" },
          { top: "32%", left: "82%", d: "1.1s" },
          { top: "68%", left: "9%", d: "2.2s" },
          { top: "78%", left: "74%", d: "0.6s" },
          { top: "12%", left: "62%", d: "1.7s" },
        ].map((n, i) => (
          <span key={i} className="afinty-auth-nodo" style={{ position: "absolute", top: n.top, left: n.left, width: 6, height: 6, borderRadius: "50%", background: "#4FD1C5", animationDelay: n.d }} />
        ))}
      </div>

      <style>{`
        .afinty-auth-ecg { animation: afinty-auth-scroll 14s linear infinite; }
        @keyframes afinty-auth-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .afinty-auth-nodo { animation: afinty-auth-latido 4s ease-in-out infinite; }
        @keyframes afinty-auth-latido {
          0%, 100% { opacity: 0.25; box-shadow: 0 0 0 0 rgba(79,209,197,0); }
          50% { opacity: 1; box-shadow: 0 0 0 7px rgba(79,209,197,0.10); }
        }
        @media (prefers-reduced-motion: reduce) {
          .afinty-auth-ecg, .afinty-auth-nodo { animation: none !important; }
          .afinty-auth-nodo { opacity: 0.6; }
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, background: "#fff", borderRadius: 18, padding: 32, width: 400, maxWidth: "92vw", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 30px 80px -30px rgba(0,0,0,0.75), 0 0 0 1px rgba(31,191,160,0.14)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, justifyContent: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: PALETTE.logoGrad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Activity size={20} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: "#0F172A" }}>AFINTY</span>
        </div>

        <div style={{ display: "flex", background: "#F1F4F6", borderRadius: 10, padding: 4, marginBottom: 20 }}>
          <button onClick={() => cambiarModo("login")} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, background: modo === "login" ? "#fff" : "transparent", color: modo === "login" ? "#0F172A" : "#8492A0" }}>Iniciar sesión</button>
          <button onClick={() => cambiarModo("registro")} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, background: modo === "registro" ? "#fff" : "transparent", color: modo === "registro" ? "#0F172A" : "#8492A0" }}>Registrarse</button>
        </div>

        {modo === "registro" && (
          <>
            <label style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#5B6B76", marginBottom: 4, display: "block" }}>Nombre completo</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 12, boxSizing: "border-box" }} />

            <label style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#5B6B76", marginBottom: 4, display: "block" }}>Tipo de usuario</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {ROLES.map((r) => (
                <button key={r} onClick={() => setForm({ ...form, rol: r })} style={{
                  padding: "9px 6px", borderRadius: 8, cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600,
                  border: `1.5px solid ${form.rol === r ? "#0E7C86" : "#E2E8ED"}`,
                  background: form.rol === r ? "#F0FBFA" : "#fff", color: form.rol === r ? "#0E7C86" : "#5B6B76",
                }}>{r}</button>
              ))}
            </div>

            {form.rol === "Doctor" && (
              <>
                <label style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#5B6B76", marginBottom: 4, display: "block" }}>¿Cuál eres?</label>
                <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: Number(e.target.value) })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 12, boxSizing: "border-box" }}>
                  {agruparDoctoresPorArea(DOCTORES).map((g) => (
                    <optgroup key={g.area} label={g.area}>
                      {g.doctores.map((d) => <option key={d.id} value={d.id}>{d.nombre} · {d.esp}</option>)}
                    </optgroup>
                  ))}
                </select>
              </>
            )}

            {form.rol === "Almacén" && (
              <>
                <label style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#5B6B76", marginBottom: 4, display: "block" }}>¿Cuál eres?</label>
                <select value={form.almacenId} onChange={(e) => setForm({ ...form, almacenId: Number(e.target.value) })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 12, boxSizing: "border-box" }}>
                  {ALMACEN_STAFF.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </>
            )}
          </>
        )}

        <label style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#5B6B76", marginBottom: 4, display: "block" }}>Usuario</label>
        <input value={form.usuario} onChange={(e) => setForm({ ...form, usuario: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 12, boxSizing: "border-box" }} />

        <label style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#5B6B76", marginBottom: 4, display: "block" }}>Contraseña</label>
        <input type="password" value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} onKeyDown={(e) => e.key === "Enter" && (modo === "login" ? enviarLogin() : enviarRegistro())} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 8, boxSizing: "border-box" }} />

        {error && <div style={{ color: "#C0392B", fontFamily: "Inter, sans-serif", fontSize: 12.5, marginBottom: 10 }}>{error}</div>}

        <button onClick={modo === "login" ? enviarLogin : enviarRegistro} style={{ width: "100%", background: PALETTE.ctaGrad, color: "#fff", border: "none", borderRadius: 10, padding: "12px 0", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 6 }}>
          {modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </button>

        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#B7C1C9", marginTop: 16, textAlign: "center" }}>
          Los datos de esta demo se guardan mientras la app esté abierta en este dispositivo.
        </p>
      </div>
    </div>
  );
}

function PulseStrip() {
  return (
    <div style={{ position: "relative", height: 30, overflow: "hidden", flex: 1, margin: "0 20px" }}>
      <svg width="200%" height="30" viewBox="0 0 800 30" preserveAspectRatio="none"
        style={{ position: "absolute", left: 0, top: 0, animation: "afinty-scroll 6s linear infinite" }}>
        <polyline fill="none" stroke="#4FD1C5" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
          points="0,15 60,15 75,15 85,2 95,28 105,15 400,15 460,15 475,15 485,2 495,28 505,15 800,15" />
        <polyline fill="none" stroke="#4FD1C5" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
          points="800,15 860,15 875,15 885,2 895,28 905,15 1200,15 1260,15 1275,15 1285,2 1295,28 1305,15 1600,15" />
      </svg>
      <style>{`
        @keyframes afinty-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { svg { animation: none !important; } }
      `}</style>
    </div>
  );
}

function KpiCard({ label, value, sub, accent, icon: Icon, iconBg }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: "18px 20px", flex: "1 1 200px", minWidth: 180 }}>
      {Icon && (
        <div style={{ width: 34, height: 34, borderRadius: 10, background: iconBg || "#F0FBFA", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
          <Icon size={17} color={accent || "#0E7C86"} />
        </div>
      )}
      <div style={{ fontSize: 12.5, color: "#5B6B76", fontFamily: "Inter, sans-serif" }}>{label}</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 30, fontWeight: 600, color: "#0F172A", marginTop: 6 }}>{value}</div>
      <div style={{ fontSize: 12.5, color: accent || "#5B6B76", marginTop: 4, fontFamily: "Inter, sans-serif" }}>{sub}</div>
    </div>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: "#0E7C86", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>{eyebrow}</div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "#0F172A", margin: 0 }}>{title}</h2>
    </div>
  );
}


/* -------------------------------------------------------------------------
   PERFIL PÚBLICO DEL HOSPITAL
   Inspirado en el patrón de "Find a Provider" de Cleveland Clinic: búsqueda
   por especialidad, perfiles resumidos, ubicación y contenido visual.
   Las descripciones explican el alcance de cada especialidad; no califican
   el desempeño individual de ningún médico.
   ------------------------------------------------------------------------- */
const HOSPITAL_FOTOS = [
  { src: "./assets/hospital-fachada.png", alt: "Fachada del Hospital Nacional Arzobispo Loayza", titulo: "Fachada histórica" },
  { src: "./assets/hospital-jardines.png", alt: "Patio y jardines del Hospital Nacional Arzobispo Loayza", titulo: "Patios y jardines" },
  { src: "./assets/hospital-mapa.png", alt: "Ubicación del Hospital Nacional Arzobispo Loayza", titulo: "Ubicación" },
];

// Fotos reales de médicos: agrega aquí solo imágenes autorizadas y asociadas
// al médico correcto (por ejemplo: "./assets/doctores/1.jpg").
// Si una foto todavía no existe, la tarjeta usa las iniciales del médico.
const FOTO_DOCTOR_POR_ID = {
  // 1: "./assets/doctores/1.jpg",
  // 2: "./assets/doctores/2.jpg",
};

function explicacionEspecialidad(esp) {
  const textos = {
    "Cardiología y Cuidados Coronarios": "Evaluación y atención de enfermedades cardiovasculares y problemas coronarios.",
    "Endocrinología": "Atención de enfermedades hormonales y metabólicas, incluido el manejo de diabetes y otras alteraciones endocrinas.",
    "Gastroenterología": "Evaluación y tratamiento de enfermedades del aparato digestivo.",
    "Geriatría": "Atención integral de personas adultas mayores, con enfoque preventivo, terapéutico y de rehabilitación.",
    "Infectología": "Atención especializada de enfermedades infecciosas y seguimiento de tratamientos correspondientes.",
    "Neurología": "Evaluación y tratamiento de enfermedades del sistema nervioso y realización de procedimientos especializados de neurofisiología.",
    "Neumología": "Prevención, diagnóstico, recuperación y rehabilitación de pacientes con enfermedades respiratorias.",
    "Hematología": "Atención de enfermedades de la sangre y sus complicaciones.",
    "Oncohematología": "Atención especializada de enfermedades oncológicas y hematológicas.",
    "Inmunoreumatología": "Atención integral de enfermedades inmunológicas y reumatológicas.",
    "Urología": "Atención médica y quirúrgica de enfermedades del aparato urinario y problemas urológicos.",
    "Oftalmología": "Evaluación y tratamiento de afecciones oculares, incluyendo procedimientos especializados.",
    "Otorrinolaringología": "Atención de enfermedades de oído, nariz y garganta.",
    "Ortopedia y Traumatología": "Atención de lesiones y enfermedades del sistema musculoesquelético y traumatológicas.",
    "Cirugía Plástica y Quemados": "Atención quirúrgica integral de cirugía plástica y pacientes con quemaduras, incluida la atención de urgencia.",
    "Neurocirugía": "Atención quirúrgica de enfermedades del sistema nervioso cuando requieren intervención especializada.",
    "Cirugía Torácica y Cardiovascular": "Atención médica y quirúrgica especializada de enfermedades torácicas y cardiovasculares.",
    "Cirugía Vascular Periférico y Angiología": "Evaluación y tratamiento médico y quirúrgico de enfermedades vasculares periféricas.",
    "Cirugía de Cabeza y Cuello": "Atención quirúrgica especializada de patologías de cabeza y cuello.",
    "Cirugía General, Aparato Digestivo y Pared Abdominal": "Atención quirúrgica general y especializada del aparato digestivo y pared abdominal.",
    "Ginecología y Obstetricia": "Atención integral de salud ginecológica y obstétrica.",
    "Ginecología": "Atención especializada de la salud ginecológica.",
    "Reproducción Humana": "Atención especializada relacionada con salud reproductiva y reproducción humana.",
    "Pediatría": "Atención médica de niños y adolescentes.",
    "Estomatología": "Atención de salud bucal y servicios estomatológicos.",
    "Medicina Interna": "Atención médica integral de pacientes con enfermedades sistémicas y problemas de salud complejos.",
    "Medicina Interna 1-I": "Atención de medicina interna, incluyendo pacientes ambulatorios y hospitalizados.",
    "Medicina Interna 1-II": "Atención de medicina interna, incluyendo pacientes ambulatorios y hospitalizados.",
    "Medicina Interna 2-I": "Atención de medicina interna, incluyendo pacientes ambulatorios y hospitalizados.",
    "Medicina Interna 2-II": "Atención de medicina interna, incluyendo pacientes ambulatorios y hospitalizados.",
    "Medicina Interna 3-I": "Atención de medicina interna, incluyendo pacientes ambulatorios y hospitalizados.",
    "Medicina Interna 3-II": "Atención de medicina interna, incluyendo pacientes ambulatorios y hospitalizados.",
    "Medicina Interna 4-I": "Atención de medicina interna, incluyendo pacientes ambulatorios y hospitalizados.",
    "Medicina Interna 4-II": "Atención de medicina interna, incluyendo pacientes ambulatorios y hospitalizados.",
    "Medicina Interna 8-I": "Atención de medicina interna, incluyendo pacientes ambulatorios y hospitalizados.",
    "Cirugía 6-I": "Atención quirúrgica especializada dentro del área de cirugía.",
    "Cirugía 6-III": "Atención quirúrgica especializada dentro del área de cirugía.",
    "Especialidades Quirúrgicas": "Atención quirúrgica especializada para pacientes que requieren procedimientos operatorios.",
    "Emergencia y Cuidados Críticos": "Atención de urgencias, emergencias y pacientes con necesidades de cuidados críticos.",
    "Cuidados Intensivos y Cuidados Intermedios": "Atención de pacientes que requieren vigilancia y soporte de cuidados intensivos o intermedios.",
    "Reanimación": "Atención inmediata y procedimientos de reanimación ante situaciones críticas.",
    "Ecografía": "Apoyo diagnóstico mediante estudios ecográficos.",
    "Radiología": "Apoyo diagnóstico mediante estudios de imágenes.",
    "Patología Clínica y Banco de Sangre / Bioquímica": "Apoyo diagnóstico de laboratorio, bioquímica y servicios relacionados con banco de sangre.",
    "Consulta Externa y Hospitalización / Salud Mental": "Atención de salud mental en consulta externa y hospitalización.",
    "Dermatología": "Atención especializada de enfermedades de la piel.",
    "Anestesiología": "No corresponde a un médico de la lista actual; se muestra como servicio hospitalario especializado.",
  };
  return textos[esp] || `Atención médica especializada en ${esp.toLowerCase()}.`;
}

function PerfilDoctorCard({ doctor }) {
  const foto = FOTO_DOCTOR_POR_ID[doctor.id];
  const iniciales = doctor.nombre.split(" ").filter(Boolean).slice(0, 2).map(x => x[0]).join("");

  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 5px 18px rgba(15,23,42,.04)" }}>
      <div style={{ height: 150, background: "linear-gradient(135deg,#EAFBF7,#DDF4F0)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ width: 76, height: 76, borderRadius: "50%", background: "#fff", color: "#0E7C86", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, boxShadow: "0 8px 25px rgba(14,124,134,.15)" }}>
          {iniciales}
        </div>
        {foto && <img src={foto} alt={`Foto de ${doctor.nombre}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />}
        <span style={{ position: "absolute", left: 12, bottom: 10, background: "rgba(255,255,255,.92)", color: "#0E7C86", borderRadius: 999, padding: "4px 9px", fontSize: 10.5, fontWeight: 700 }}>
          {doctor.area}
        </span>
      </div>

      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 11, flex: 1 }}>
        <div>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14, lineHeight: 1.35, color: "#0F172A" }}>{doctor.nombre}</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#0E7C86", marginTop: 4 }}>{doctor.esp}</div>
        </div>

        <div style={{ background: "#F7F9FB", borderRadius: 10, padding: "10px 11px" }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: "#0E7C86", textTransform: "uppercase", letterSpacing: .8, marginBottom: 4 }}>
            ¿En qué puede ayudarte?
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#5B6B76", lineHeight: 1.55 }}>
            {explicacionEspecialidad(doctor.esp)}
          </div>
        </div>

        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: "auto" }}>
          <span style={{ background: "#F0FBFA", color: "#0E7C86", borderRadius: 999, padding: "4px 9px", fontSize: 11.5, fontWeight: 600 }}>{doctor.area}</span>
          <span style={{ background: "#F7F9FB", color: "#5B6B76", borderRadius: 999, padding: "4px 9px", fontSize: 11.5 }}>{doctor.turno}</span>
        </div>
      </div>
    </div>
  );
}

function VistaHospital() {
  const [busqueda, setBusqueda] = useState("");
  const [area, setArea] = useState("Todas");
  const [fotoActiva, setFotoActiva] = useState(0);
  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return DOCTORES.filter(d => {
      const coincideTexto = !q || `${d.nombre} ${d.esp} ${d.area}`.toLowerCase().includes(q);
      const coincideArea = area === "Todas" || d.area === area;
      return coincideTexto && coincideArea;
    });
  }, [busqueda, area]);
  const areas = ["Todas", ...AREAS_MEDICAS.map(a => a.area)];
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Hospital+Nacional+Arzobispo+Loayza%2C+Av.+Alfonso+Ugarte+848%2C+Lima";

  return (
    <>
      <SectionTitle eyebrow="Perfil del hospital" title="Hospital Nacional Arzobispo Loayza" />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.45fr) minmax(300px,.85fr)", gap: 18, marginBottom: 22 }}>
        <div style={{ background: "#0A3E44", color: "#fff", borderRadius: 18, padding: 26, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", right: -100, top: -100, background: "rgba(31,191,160,.18)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 999, padding: "5px 10px", fontSize: 11.5, fontWeight: 600, marginBottom: 14 }}>
              <Building2 size={13} /> Centro hospitalario · {HOSPITAL.categoria}
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 29, lineHeight: 1.12, margin: "0 0 10px", maxWidth: 680 }}>{HOSPITAL.nombre}</h3>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, lineHeight: 1.65, color: "#D8EFEB", maxWidth: 700, margin: 0 }}>
              Conoce el hospital, consulta su ubicación y explora profesionales por nombre, especialidad o área. Cada perfil explica de forma sencilla qué tipo de atención corresponde a su especialidad.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#1FBFA0", color: "#062A2E", textDecoration: "none", borderRadius: 9, padding: "9px 13px", fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 700 }}><Navigation size={15} /> Ver ubicación</a>
              <a href="https://www.gob.pe/institucion/hospitalloayza/sedes" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.10)", color: "#fff", textDecoration: "none", border: "1px solid rgba(255,255,255,.18)", borderRadius: 9, padding: "9px 13px", fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600 }}><ExternalLink size={14} /> Sede y contacto oficial</a>
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 18, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><MapPin size={17} color="#0E7C86" /><strong style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#0F172A" }}>Ubicación y contacto</strong></div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#3B4652", lineHeight: 1.65 }}>
            <div><strong>Dirección</strong><br />{HOSPITAL.direccion}</div>
            <div style={{ marginTop: 10 }}><strong>Central telefónica</strong><br />(01) 5094800</div>
            <div style={{ marginTop: 10 }}><strong>Solicitar citas</strong><br />(01) 5094951</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(280px,.8fr)", gap: 18, marginBottom: 24 }}>
        <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 16, overflow: "hidden" }}>
          <img src={HOSPITAL_FOTOS[2].src} alt={HOSPITAL_FOTOS[2].alt} style={{ width: "100%", height: 245, objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
            <MapPin size={17} color="#0E7C86" />
            <strong style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#0F172A" }}>Cómo llegar</strong>
          </div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, lineHeight: 1.6, color: "#5B6B76", margin: "0 0 13px" }}>
            Hospital Nacional Arzobispo Loayza · Av. Alfonso Ugarte 848, Cercado de Lima.
          </p>
          <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: PALETTE.ctaGrad, color: "#fff", textDecoration: "none", borderRadius: 9, padding: "9px 13px", fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 700 }}>
            <Navigation size={15} /> Abrir en Google Maps
          </a>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 16, padding: 18, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div><div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#0E7C86", textTransform: "uppercase", letterSpacing: 1 }}>Galería</div><div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "#0F172A" }}>Conoce el hospital</div></div>
          <div style={{ fontSize: 12, color: "#8492A0", fontFamily: "Inter, sans-serif" }}>{fotoActiva + 1} / {HOSPITAL_FOTOS.length}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(170px,1fr)", gap: 10 }}>
          <div style={{ height: 280, borderRadius: 12, overflow: "hidden", background: "#EEF3F5" }}><img src={HOSPITAL_FOTOS[fotoActiva].src} alt={HOSPITAL_FOTOS[fotoActiva].alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div>
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 10 }}>
            {HOSPITAL_FOTOS.map((f, i) => <button key={f.src} onClick={() => setFotoActiva(i)} style={{ padding: 0, border: i === fotoActiva ? "2px solid #0E7C86" : "1px solid #E2E8ED", borderRadius: 12, overflow: "hidden", background: "#fff", cursor: "pointer", position: "relative" }}><img src={f.src} alt={f.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /><span style={{ position: "absolute", left: 8, bottom: 8, background: "rgba(0,0,0,.62)", color: "#fff", borderRadius: 999, padding: "4px 8px", fontSize: 10.5 }}>{f.titulo}</span></button>)}
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 16, padding: 18, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
          <Stethoscope size={18} color="#0E7C86" />
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "#0F172A" }}>Perfiles de profesionales</div>
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#5B6B76", lineHeight: 1.55 }}>
          Cada perfil muestra el nombre, especialidad, área de atención y una explicación sencilla de los problemas de salud que corresponde atender. Las fotografías deben ser imágenes autorizadas del profesional; mientras no se carguen, se muestran sus iniciales.
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#0E7C86", textTransform: "uppercase", letterSpacing: 1 }}>Encuentra un profesional</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "#0F172A", marginTop: 3 }}>Médicos por nombre, especialidad o área</div>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ flex: "1 1 320px", position: "relative" }}><SearchIcon size={16} color="#8492A0" style={{ position: "absolute", left: 12, top: 12 }} /><input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Ej. cardiología, pediatría o nombre del médico" style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px 10px 35px", borderRadius: 9, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13 }} /></div>
        <select value={area} onChange={e => setArea(e.target.value)} style={{ flex: "0 1 300px", padding: "10px 12px", borderRadius: 9, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13, background: "#fff" }}>{areas.map(a => <option key={a}>{a}</option>)}</select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(285px,1fr))", gap: 14 }}>
        {filtrados.map(d => <PerfilDoctorCard key={d.id} doctor={d} />)}
      </div>
      {filtrados.length === 0 && <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 24, textAlign: "center", color: "#5B6B76", fontFamily: "Inter, sans-serif", fontSize: 13 }}>No encontramos profesionales con esos filtros.</div>}
    </>
  );
}

/* -------------------------------------------------------------------------
   NOSOTROS
   Sección institucional visible para todos los roles (Doctor, Almacén,
   Vigilante, Paciente o familia, Jefatura). Contenido proporcionado por
   el equipo de AFINTY.
   ------------------------------------------------------------------------- */
const NOSOTROS_VALORES = [
  { icon: HeartHandshake, emoji: "🤝", titulo: "Compromiso", texto: "Orientamos nuestras soluciones a las necesidades del hospital.", color: "#0E7C86", bg: "#F0FBFA" },
  { icon: Lock, emoji: "🔐", titulo: "Seguridad", texto: "Protegemos la información y controlamos el acceso según el rol.", color: "#1F7A52", bg: "#EAF6F0" },
  { icon: Lightbulb, emoji: "💡", titulo: "Innovación", texto: "Utilizamos tecnología para mejorar procesos existentes.", color: "#D98E2B", bg: "#FBF3E4" },
  { icon: HeartHandshake, emoji: "❤️", titulo: "Enfoque humano", texto: "Ponemos al paciente y al personal de salud en el centro.", color: "#C0392B", bg: "#FDEDEA" },
  { icon: Zap, emoji: "⚡", titulo: "Eficiencia", texto: "Buscamos reducir tiempos, duplicidad de tareas y desorganización.", color: "#7A5BD9", bg: "#F1EEFC" },
];

function VistaNosotros() {
  return (
    <>
      <SectionTitle eyebrow="Institucional" title="Nosotros" />

      <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#F0FBFA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Info size={17} color="#0E7C86" />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, color: "#0F172A" }}>¿Quiénes somos?</span>
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#3B4652", lineHeight: 1.65, margin: 0 }}>
          AFINTY es una plataforma digital de gestión y coordinación hospitalaria diseñada para integrar en un solo entorno los principales procesos administrativos y operativos de un hospital.
        </p>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#F0FBFA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Activity size={17} color="#0E7C86" />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, color: "#0F172A" }}>¿Qué hacemos?</span>
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#3B4652", lineHeight: 1.65, margin: 0 }}>
          Conectamos las diferentes áreas involucradas en la atención hospitalaria para facilitar la gestión de citas, turnos médicos, camas, medicamentos, documentos, emergencias, comunicación interna y seguimiento de incidencias.
        </p>
      </div>

      <div style={{ background: "#F0FBFA", border: "1px solid #BFE3E3", borderRadius: 14, padding: "18px 22px", marginBottom: 24, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Sparkles size={19} color="#0E7C86" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13.5, color: "#0F172A", marginBottom: 4 }}>Nuestro propósito</div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#3B4652", lineHeight: 1.6, margin: 0 }}>
            Contribuir a una atención hospitalaria más organizada, coordinada y eficiente mediante el uso de tecnología y la centralización de información.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 26 }}>
        <div style={{ flex: "1 1 300px", background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 22 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: "#0E7C86", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Misión</div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#3B4652", lineHeight: 1.65, margin: 0 }}>
            Desarrollar soluciones digitales que permitan mejorar la coordinación de los procesos hospitalarios, facilitando el trabajo del personal y proporcionando una mejor experiencia de atención al paciente.
          </p>
        </div>
        <div style={{ flex: "1 1 300px", background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 22 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: "#0E7C86", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Visión</div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#3B4652", lineHeight: 1.65, margin: 0 }}>
            Ser una plataforma de referencia para la gestión hospitalaria digital, promoviendo hospitales más conectados, organizados y orientados a una atención eficiente.
          </p>
        </div>
      </div>

      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>Nuestros valores</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
        {NOSOTROS_VALORES.map((v) => (
          <div key={v.titulo} style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 18 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: v.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, fontSize: 16 }}>
              <span>{v.emoji}</span>
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13.5, color: "#0F172A", marginBottom: 4 }}>{v.titulo}</div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#5B6B76", lineHeight: 1.55, margin: 0 }}>{v.texto}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 26, background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: "14px 18px", display: "flex", gap: 18, flexWrap: "wrap", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#5B6B76" }}>
        <span><strong style={{ color: "#0F172A" }}>{HOSPITAL.nombre}</strong> — {HOSPITAL.direccion}</span>
        <span>Categoría {HOSPITAL.categoria}</span>
        <span>Fundado en {HOSPITAL.fundado}</span>
      </div>
    </>
  );
}

// Correo al que se notifica cuando un médico comete una falta o tardanza.
// AFINTY no tiene servidor de correo propio: arma el mensaje y abre el
// cliente de correo del navegador (mailto:) ya listo para enviar.
const EMAIL_JEFATURA = "abeliotpue123@gmail.com";
function mailtoFaltaDoctor(a) {
  const asunto = encodeURIComponent(`AFINTY · Alerta de asistencia — ${a.area}`);
  const cuerpo = encodeURIComponent(
    `${a.msg}\n\nEsta notificación fue generada automáticamente por AFINTY (módulo de asistencia médica).`
  );
  return `mailto:${EMAIL_JEFATURA}?subject=${asunto}&body=${cuerpo}`;
}

function AlertRow({ a, onResolve, onEnviarCorreo, correoEnviado }) {
  const s = sevStyles[a.sev];
  const esFaltaDoctor = a.id.startsWith("doc-") || a.id.startsWith("entrada-");
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap", padding: "13px 16px", background: "#fff", border: "1px solid #E2E8ED", borderRadius: 12, marginBottom: 8 }}>
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: s.dot, flexShrink: 0, marginTop: 6 }} />
      <div style={{ flex: "3 1 240px", minWidth: 200 }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#0F172A", fontWeight: 500 }}>{a.msg}</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8492A0", marginTop: 2 }}>{a.area} · {a.time}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginLeft: "auto", flexShrink: 0 }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 600, color: s.fg, background: s.bg, padding: "3px 10px", borderRadius: 999, flexShrink: 0 }}>{s.label}</span>
        {esFaltaDoctor && (
          correoEnviado ? (
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 600, color: "#1F7A52", background: "#EAF6F0", padding: "3px 10px", borderRadius: 999, flexShrink: 0 }}>Correo enviado</span>
          ) : (
            <a
              href={mailtoFaltaDoctor(a)}
              onClick={() => onEnviarCorreo && onEnviarCorreo(a.id)}
              style={{ border: "1px solid #E2E8ED", background: "#F0FBFA", borderRadius: 8, padding: "6px 10px", fontSize: 12.5, color: "#0E7C86", fontFamily: "Inter, sans-serif", cursor: "pointer", fontWeight: 600, flexShrink: 0, textDecoration: "none", whiteSpace: "nowrap" }}
            >
              Notificar por correo
            </a>
          )
        )}
        <button onClick={() => onResolve(a.id)} style={{ border: "1px solid #E2E8ED", background: "#F7F9FB", borderRadius: 8, padding: "6px 10px", fontSize: 12.5, color: "#0E7C86", fontFamily: "Inter, sans-serif", cursor: "pointer", fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" }}>
          Resolver
        </button>
      </div>
    </div>
  );
}

function VistaResumen({ alerts, onResolve, areasResumen, onEnviarCorreo, correosEnviados }) {
  const activas = alerts.length;
  const totalCamas = areasResumen.reduce((a, b) => a + b.total, 0);
  const libresCamas = areasResumen.reduce((a, b) => a + b.libres, 0);
  const ocupacion = Math.round(((totalCamas - libresCamas) / totalCamas) * 100);
  const criticos = MEDICAMENTOS_REALES.filter((i) => i.estado === "crítico").length;
  const conIncidencias = DOCTORES.filter(d => d.asistencia.filter(a => a.estado !== "a-tiempo" && a.estado !== "libre").length >= UMBRAL_ALERTA).length;
  const altas = alerts.filter(a => a.sev === "alta").length;

  return (
    <>
      <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 18, flexWrap: "wrap", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#5B6B76" }}>
        <span><strong style={{ color: "#0F172A" }}>{HOSPITAL.nombre}</strong> — {HOSPITAL.direccion}</span>
        <span>Categoría {HOSPITAL.categoria}</span>
        <span>Fundado en {HOSPITAL.fundado}</span>
        <span>{HOSPITAL.director}</span>
      </div>

      <SectionTitle eyebrow="Panel general · en vivo" title="Estado del hospital ahora" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 28 }}>
        <KpiCard label="Médicos con incidencias" value={conIncidencias} sub="Tardanzas/faltas ≥ umbral" accent="#E8553D" icon={ShieldAlert} iconBg="#FDEDEA" />
        <KpiCard label="Ocupación de camas" value={`${ocupacion}%`} sub={`${libresCamas} camas libres de ${totalCamas}`} icon={BedDouble} iconBg="#E3FBF5" />
        <KpiCard label="Alertas activas" value={activas} sub={`${altas} de severidad alta`} accent="#E8553D" icon={Bell} iconBg="#FDEDEA" />
        <KpiCard label="Medicamentos en crítico" value={criticos} sub="Requieren reposición urgente" accent="#D98E2B" icon={Pill} iconBg="#FBF3E4" />
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: "2 1 380px" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 10 }}>Ocupación por área</div>
          {areasResumen.map((a) => {
            const pct = Math.round(((a.total - a.libres) / a.total) * 100);
            return (
              <div key={a.area} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontFamily: "Inter, sans-serif", color: "#3B4652", marginBottom: 4 }}>
                  <span>{a.area}</span><span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{pct}%</span>
                </div>
                <div style={{ height: 8, background: "#E2E8ED", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: pct > 85 ? "#E8553D" : pct > 60 ? "#D98E2B" : "#0E7C86", borderRadius: 999 }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ flex: "1 1 320px" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 10 }}>Alertas recientes</div>
          {alerts.slice(0, 3).map((a) => <AlertRow key={a.id} a={a} onResolve={onResolve} onEnviarCorreo={onEnviarCorreo} correoEnviado={correosEnviados.includes(a.id)} />)}
          {alerts.length === 0 && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8492A0" }}>Sin alertas activas.</div>}
        </div>
      </div>
    </>
  );
}

function CalendarioAsistencia({ doc, onClose }) {
  const incidencias = doc.asistencia.filter(a => a.estado === "tardanza" || a.estado === "falta").length;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 26, width: 480, maxWidth: "92vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, color: "#0F172A" }}>{doc.nombre}</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#5B6B76", marginTop: 2 }}>{doc.area} · {doc.esp} · {doc.turno}</div>
          </div>
          <X size={18} style={{ cursor: "pointer", color: "#8492A0" }} onClick={onClose} />
        </div>

        {doc.guardia && (
          <div style={{ background: "#EAF6F0", border: "1px solid #BFE3D1", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#1F7A52" }}>
            Guardia rotativa de 24 horas para esta especialidad.
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 14 }}>
          {doc.asistencia.map((a, i) => {
            const cfg = estadoAsistCfg[a.estado];
            return (
              <div key={i} title={`${fmtDia(a.fecha)} · ${cfg.label}`} style={{ background: cfg.bg, border: `1px solid ${cfg.color}`, borderRadius: 8, padding: "6px 2px", textAlign: "center", fontFamily: "'IBM Plex Mono', monospace" }}>
                <div style={{ fontSize: 9.5, color: "#8492A0", textTransform: "uppercase" }}>{fmtDiaSemana(a.fecha)}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{fmtDia(a.fecha)}</div>
                {a.hora && <div style={{ fontSize: 8.5, color: cfg.color }}>{a.hora}</div>}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontFamily: "Inter, sans-serif", fontSize: 12 }}>
          {Object.entries(estadoAsistCfg).map(([k, v]) => (
            <span key={k} style={{ display: "flex", alignItems: "center", gap: 6, color: "#5B6B76" }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: v.color, display: "inline-block" }} /> {v.label}
            </span>
          ))}
        </div>

        {incidencias >= UMBRAL_ALERTA && (
          <div style={{ marginTop: 16, background: "#FDEDEA", border: "1px solid #F3C6BC", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10, alignItems: "center" }}>
            <ShieldAlert size={18} color="#C0392B" style={{ flexShrink: 0 }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#8A4A3F" }}>
              {incidencias} incidencias en 14 días. Se notificó automáticamente a Jefatura de Personal y Gestión Administrativa. Sujeto a sanción según reglamento interno.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function VistaMiTurno({ doctor, entrada, onMarcar }) {
  const horaProgramada = HORA_PROGRAMADA_POR_DOCTOR[doctor.id];

  return (
    <>
      <SectionTitle eyebrow="Marcado de asistencia" title="Mi turno" />
      <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 24, maxWidth: 460 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, color: "#0F172A" }}>{doctor.nombre}</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#5B6B76", marginTop: 2, marginBottom: 6 }}>{doctor.esp} · {doctor.turno}</div>
        <div style={{ display: "inline-block", fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 600, color: colorDeArea(doctor.area), background: "#F7F9FB", border: `1px solid ${colorDeArea(doctor.area)}33`, padding: "3px 10px", borderRadius: 999, marginBottom: 18 }}>{doctor.area}</div>

        <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
          <div style={{ flex: 1, background: "#F7F9FB", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#8492A0" }}>Hora programada</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, fontWeight: 700, color: "#0F172A" }}>{horaProgramada}</div>
          </div>
          {entrada && (
            <div style={{ flex: 1, background: entrada.tarde ? "#FDEDEA" : "#EAF6F0", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: entrada.tarde ? "#C0392B" : "#1F7A52" }}>Marcaste</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, fontWeight: 700, color: entrada.tarde ? "#C0392B" : "#1F7A52" }}>{entrada.hora}</div>
            </div>
          )}
        </div>

        {!entrada ? (
          <button onClick={onMarcar} style={{ width: "100%", background: PALETTE.ctaGrad, color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            Marcar entrada ahora
          </button>
        ) : entrada.tarde ? (
          <div style={{ display: "flex", gap: 10, alignItems: "center", background: "#FDEDEA", border: "1px solid #F3C6BC", borderRadius: 10, padding: "12px 14px" }}>
            <ShieldAlert size={18} color="#C0392B" style={{ flexShrink: 0 }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#8A4A3F" }}>Marcaste después de tu horario. Se notificó automáticamente a Jefatura de Personal.</span>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, alignItems: "center", background: "#EAF6F0", border: "1px solid #BFE3D1", borderRadius: 10, padding: "12px 14px" }}>
            <CheckCircle2 size={18} color="#2F9E6E" style={{ flexShrink: 0 }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#1F7A52" }}>Entrada a tiempo. Buen turno.</span>
          </div>
        )}
      </div>
    </>
  );
}

// Turnos agrupados por área del hospital: cada área es un bloque plegable
// con sus médicos dentro.
function VistaTurnos({ onEscribir }) {
  const [seleccionado, setSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [cerradas, setCerradas] = useState([]);
  const guardiaActual = DOCTORES.find(d => d.guardia && d.asistencia[d.asistencia.length - 1].estado !== "libre");

  const filtrados = DOCTORES.filter((d) => {
    const q = filtro.trim().toLowerCase();
    if (!q) return true;
    return d.nombre.toLowerCase().includes(q) || d.esp.toLowerCase().includes(q) || d.area.toLowerCase().includes(q);
  });
  const grupos = agruparDoctoresPorArea(filtrados);

  function alternar(area) {
    setCerradas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]));
  }

  return (
    <>
      <SectionTitle eyebrow="Programación diaria · plana médica por área" title="Turnos médicos" />

      {guardiaActual && (
        <div style={{ background: "#F0FBFA", border: "1px solid #BFE3E3", borderRadius: 12, padding: "14px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <CalendarDays size={18} color="#0E7C86" />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#0F172A" }}>
            Guardia activa en {guardiaActual.area}: <strong>{guardiaActual.nombre}</strong> ({guardiaActual.esp})
          </span>
        </div>
      )}

      <input
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder="Buscar médico, especialidad o área…"
        style={{ width: "100%", maxWidth: 360, padding: "10px 14px", borderRadius: 10, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 14, boxSizing: "border-box" }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {grupos.map((g) => {
          const abierta = !cerradas.includes(g.area);
          const incidenciasArea = g.doctores.reduce((acc, d) => acc + d.asistencia.filter(a => a.estado === "tardanza" || a.estado === "falta").length, 0);
          return (
            <div key={g.area} style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, overflow: "hidden" }}>
              <button
                onClick={() => alternar(g.area)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: "#F7F9FB", border: "none", borderBottom: abierta ? "1px solid #E2E8ED" : "none", cursor: "pointer", textAlign: "left" }}
              >
                <span style={{ width: 6, height: 26, borderRadius: 999, background: g.color, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: "#0F172A", flex: 1 }}>{g.area}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#5B6B76" }}>{g.doctores.length} médicos</span>
                {incidenciasArea > 0 && (
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 600, color: "#C0392B", background: "#FDEDEA", padding: "2px 9px", borderRadius: 999 }}>{incidenciasArea} incidencias</span>
                )}
                <ChevronRight size={16} color="#8492A0" style={{ transform: abierta ? "rotate(90deg)" : "none", transition: "transform 0.15s ease" }} />
              </button>

              {abierta && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1.9fr 1.5fr 1.6fr 0.9fr 1.1fr", padding: "10px 18px", fontSize: 11.5, fontFamily: "'IBM Plex Mono', monospace", color: "#8492A0", textTransform: "uppercase", letterSpacing: 0.6, borderBottom: "1px solid #EEF2F4" }}>
                    <span>Médico</span><span>Especialidad</span><span>Horario</span><span>Hoy</span><span></span>
                  </div>
                  {g.doctores.map((d, i) => {
                    const hoy = d.asistencia[d.asistencia.length - 1];
                    const cfg = estadoAsistCfg[hoy.estado];
                    return (
                      <div key={d.id} style={{ display: "grid", gridTemplateColumns: "1.9fr 1.5fr 1.6fr 0.9fr 1.1fr", padding: "13px 18px", fontSize: 13.5, fontFamily: "Inter, sans-serif", color: "#0F172A", borderBottom: i < g.doctores.length - 1 ? "1px solid #EEF2F4" : "none", alignItems: "center" }}>
                        <button onClick={() => setSeleccionado(d)} style={{ fontWeight: 500, background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer", color: "#0F172A", fontFamily: "Inter, sans-serif", fontSize: 13.5 }}>{d.nombre}</button>
                        <span style={{ color: "#5B6B76", fontSize: 12.5 }}>{d.esp}</span>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#5B6B76" }}>{d.turno}</span>
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: cfg.color, background: cfg.bg, padding: "3px 9px", borderRadius: 999, width: "fit-content" }}>{cfg.label}</span>
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          {onEscribir && (
                            <button onClick={() => onEscribir(d.id)} title={`Escribir a ${d.nombre}`} style={{ border: "1px solid #E2E8ED", background: "#F0FBFA", borderRadius: 8, padding: "5px 9px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: "#0E7C86", fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 600 }}>
                              <MessageCircle size={13} /> Escribir
                            </button>
                          )}
                          <button onClick={() => setSeleccionado(d)} title="Ver asistencia" style={{ border: "1px solid #E2E8ED", background: "#F7F9FB", borderRadius: 8, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center", color: "#5B6B76" }}>
                            <CalendarDays size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          );
        })}
        {grupos.length === 0 && (
          <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 18, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8492A0" }}>
            Ningún médico coincide con "{filtro}".
          </div>
        )}
      </div>

      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#8492A0", marginTop: 14 }}>
        Cada bloque es un área del hospital con los médicos que le corresponden. Toca el nombre de un médico para ver, día por día, en qué fecha faltó o llegó tarde durante las últimas dos semanas. AFINTY genera una alerta automática — con nombre y fecha — cuando alguien no marca ingreso después del horario comprometido, y la escala a Jefatura de Personal si se repite.
      </p>

      {seleccionado && <CalendarioAsistencia doc={seleccionado} onClose={() => setSeleccionado(null)} />}
    </>
  );
}

/* -------------------------------------------------------------------------
   MENSAJES INTERNOS
   ------------------------------------------------------------------------- */

function ListaAdjuntos({ adjuntos, onQuitar }) {
  if (!adjuntos || adjuntos.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
      {adjuntos.map((f) => (
        <div key={f.id} style={{ border: "1px solid #E2E8ED", borderRadius: 10, padding: 6, width: 118, background: "#F7F9FB", position: "relative" }}>
          {onQuitar && (
            <button onClick={() => onQuitar(f.id)} title="Quitar adjunto" style={{ position: "absolute", top: -7, right: -7, width: 20, height: 20, borderRadius: "50%", border: "1px solid #E2E8ED", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
              <X size={11} color="#8492A0" />
            </button>
          )}
          {esImagen(f.tipo) ? (
            <a href={f.dataUrl} target="_blank" rel="noreferrer">
              <img src={f.dataUrl} alt={f.nombre} style={{ width: "100%", height: 70, objectFit: "cover", borderRadius: 7, display: "block" }} />
            </a>
          ) : (
            <a href={f.dataUrl} download={f.nombre} style={{ height: 70, borderRadius: 7, background: "#EEF2F4", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <FileText size={26} color="#0E7C86" />
            </a>
          )}
          <div title={f.nombre} style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: "#3B4652", marginTop: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.nombre}</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: "#8492A0" }}>{pesoLegible(f.tamano)}</div>
        </div>
      ))}
    </div>
  );
}

function TarjetaCita({ cita }) {
  if (!cita) return null;
  return (
    <div style={{ border: "1px solid #BFE3E3", background: "#F0FBFA", borderRadius: 10, padding: "10px 14px", marginTop: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
      <User size={16} color="#0E7C86" style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#0F172A", lineHeight: 1.55 }}>
        <div style={{ fontWeight: 600 }}>{cita.nombre}</div>
        <div style={{ color: "#5B6B76" }}>DNI {cita.dni} · {cita.fecha} a las {cita.hora}</div>
        <div style={{ color: "#5B6B76" }}>{cita.doctor} — {cita.esp}</div>
      </div>
    </div>
  );
}

function VistaMensajes({ remitente, mensajes, onEnviar, onMarcarLeido, citasDisponibles, destinoInicial, onConsumirDestino }) {
  const [tab, setTab] = useState("recibidos"); // recibidos | enviados | nuevo
  const [abierto, setAbierto] = useState(null);
  const [para, setPara] = useState("");
  const [asunto, setAsunto] = useState("");
  const [texto, setTexto] = useState("");
  const [adjuntos, setAdjuntos] = useState([]);
  const [citaKey, setCitaKey] = useState("");
  const [aviso, setAviso] = useState("");
  const [enviado, setEnviado] = useState(false);
  const fileRef = useRef(null);

  // Cuando se entra desde "Escribir" en Turnos o desde una cita, el formulario
  // llega con el destinatario (y a veces el paciente) ya puesto.
  useEffect(() => {
    if (!destinoInicial) return;
    setTab("nuevo");
    if (destinoInicial.paraId != null) setPara(String(destinoInicial.paraId));
    if (destinoInicial.citaKey) setCitaKey(destinoInicial.citaKey);
    if (destinoInicial.asunto) setAsunto(destinoInicial.asunto);
    setEnviado(false);
    onConsumirDestino && onConsumirDestino();
  }, [destinoInicial]);

  const recibidos = mensajes.filter((m) => m.paraId === remitente.id).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const enviados = mensajes.filter((m) => m.deId === remitente.id).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const sinLeer = recibidos.filter((m) => !m.leido).length;

  // Destinatarios posibles: toda la plana médica agrupada por área, más
  // Jefatura de Personal para los casos administrativos.
  const JEFATURA = { id: ID_JEFATURA, nombre: "Jefatura de Personal", esp: "Gestión Administrativa", area: "Dirección y Gestión" };
  const gruposDestino = agruparDoctoresPorArea(DOCTORES.filter((d) => d.id !== remitente.id));
  const destinatarios = [...DOCTORES, JEFATURA];
  const citaElegida = citasDisponibles.find((c) => c.key === citaKey) || null;

  function manejarArchivos(e) {
    const files = Array.from(e.target.files || []);
    files.forEach((f) => {
      if (f.size > MAX_ADJUNTO_MB * 1024 * 1024) {
        setAviso(`${f.name} pesa más de ${MAX_ADJUNTO_MB} MB. Comprímelo o envíalo por partes.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setAdjuntos((prev) => [...prev, { id: `${Date.now()}-${f.name}-${prev.length}`, nombre: f.name, tipo: f.type, tamano: f.size, dataUrl: reader.result }]);
      };
      reader.onerror = () => setAviso(`No se pudo leer ${f.name}. Intenta de nuevo.`);
      reader.readAsDataURL(f);
    });
    e.target.value = "";
  }

  function limpiarFormulario() {
    setPara(""); setAsunto(""); setTexto(""); setAdjuntos([]); setCitaKey(""); setAviso("");
  }

  function enviar() {
    if (!para) { setAviso("Elige a qué médico le escribes."); return; }
    if (!texto.trim() && adjuntos.length === 0 && !citaElegida) {
      setAviso("Escribe un mensaje o adjunta un documento antes de enviarlo.");
      return;
    }
    const destino = destinatarios.find((d) => d.id === Number(para));
    onEnviar({
      id: `msg-${Date.now()}`,
      deId: remitente.id,
      deNombre: remitente.nombre,
      deEsp: remitente.esp,
      deArea: remitente.area,
      paraId: destino.id,
      paraNombre: destino.nombre,
      paraEsp: destino.esp,
      paraArea: destino.area,
      asunto: asunto.trim() || "Sin asunto",
      texto: texto.trim(),
      adjuntos,
      cita: citaElegida ? citaElegida.data : null,
      fecha: new Date().toISOString(),
      leido: false,
    });
    limpiarFormulario();
    setEnviado(true);
    setTab("enviados");
  }

  function abrirMensaje(m) {
    setAbierto(m);
    if (!m.leido && m.paraId === remitente.id) onMarcarLeido(m.id);
  }

  function responder(m) {
    setTab("nuevo");
    setPara(String(m.deId));
    setAsunto(m.asunto.startsWith("Re:") ? m.asunto : `Re: ${m.asunto}`);
    setTexto("");
    setAdjuntos([]);
    setCitaKey("");
    setAbierto(null);
    setEnviado(false);
  }

  const lista = tab === "recibidos" ? recibidos : enviados;
  const tabs = [
    { key: "recibidos", label: `Recibidos${sinLeer ? ` (${sinLeer})` : ""}` },
    { key: "enviados", label: "Enviados" },
    { key: "nuevo", label: "Escribir mensaje" },
  ];

  const inputEstilo = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 12, boxSizing: "border-box" };
  const etiqueta = { fontFamily: "Inter, sans-serif", fontSize: 12, color: "#5B6B76", marginBottom: 4, display: "block" };

  return (
    <>
      <SectionTitle eyebrow="Comunicación entre áreas" title="Mensajes del personal" />
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#8492A0", marginTop: -10, marginBottom: 16 }}>
        Escribe a cualquier médico del hospital sin salir de su consultorio. Si un paciente está siendo atendido y necesita que otro servicio revise algo, adjunta su cita, sus documentos o una foto del examen y llega directo a la bandeja del colega.
      </p>

      <div style={{ display: "flex", background: "#F1F4F6", borderRadius: 10, padding: 4, marginBottom: 18, maxWidth: 480 }}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => { setTab(t.key); setEnviado(false); }} style={{
            flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5,
            background: tab === t.key ? "#fff" : "transparent", color: tab === t.key ? "#0F172A" : "#8492A0",
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "nuevo" ? (
        <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 22, maxWidth: 560 }}>
          <label style={etiqueta}>Para</label>
          <select value={para} onChange={(e) => setPara(e.target.value)} style={inputEstilo}>
            <option value="">Elige un médico…</option>
            {gruposDestino.map((g) => (
              <optgroup key={g.area} label={g.area}>
                {g.doctores.map((d) => <option key={d.id} value={d.id}>{d.nombre} · {d.esp}</option>)}
              </optgroup>
            ))}
            {remitente.id !== ID_JEFATURA && (
              <optgroup label="Administración">
                <option value={ID_JEFATURA}>Jefatura de Personal · Gestión Administrativa</option>
              </optgroup>
            )}
          </select>

          <label style={etiqueta}>Asunto</label>
          <input value={asunto} onChange={(e) => setAsunto(e.target.value)} placeholder="Interconsulta, resultado de laboratorio, traslado…" style={inputEstilo} />

          <label style={etiqueta}>Mensaje</label>
          <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={5} placeholder="Cuéntale al colega qué necesitas y para cuándo." style={{ ...inputEstilo, resize: "vertical", lineHeight: 1.5 }} />

          <label style={etiqueta}>Paciente relacionado (opcional)</label>
          <select value={citaKey} onChange={(e) => setCitaKey(e.target.value)} style={inputEstilo}>
            <option value="">Sin paciente adjunto</option>
            {citasDisponibles.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          {citaElegida && <TarjetaCita cita={citaElegida.data} />}

          <div style={{ marginTop: 14, marginBottom: 6 }}>
            <button onClick={() => fileRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 8, border: "1px dashed #BFE3E3", background: "#F0FBFA", color: "#0E7C86", borderRadius: 10, padding: "11px 16px", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", width: "100%", justifyContent: "center" }}>
              <Paperclip size={15} /> Cargar documentos o fotos
            </button>
            <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={manejarArchivos} style={{ display: "none" }} />
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#B7C1C9", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <ImageIcon size={12} /> Fotos de exámenes, recetas o informes en PDF. Hasta {MAX_ADJUNTO_MB} MB por archivo.
            </div>
          </div>

          <ListaAdjuntos adjuntos={adjuntos} onQuitar={(id) => setAdjuntos((prev) => prev.filter((f) => f.id !== id))} />

          {aviso && (
            <div style={{ marginTop: 12, background: "#FDEDEA", border: "1px solid #F3C6BC", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10, alignItems: "center" }}>
              <AlertTriangle size={16} color="#C0392B" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#8A4A3F" }}>{aviso}</span>
            </div>
          )}

          <button onClick={enviar} style={{ width: "100%", marginTop: 16, background: PALETTE.ctaGrad, color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Send size={15} /> Enviar mensaje
          </button>
        </div>
      ) : (
        <>
          {enviado && tab === "enviados" && (
            <div style={{ background: "#EAF6F0", border: "1px solid #BFE3D1", borderRadius: 12, padding: "12px 16px", marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
              <CheckCircle2 size={17} color="#2F9E6E" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#1F7A52" }}>Mensaje enviado. Aparecerá en la bandeja del colega apenas abra AFINTY.</span>
            </div>
          )}

          {lista.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <Inbox size={26} color="#B7C1C9" />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#5B6B76" }}>
                {tab === "recibidos" ? "Tu bandeja está vacía." : "Todavía no has enviado ningún mensaje."}
              </span>
              <button onClick={() => setTab("nuevo")} style={{ background: PALETTE.ctaGrad, color: "#fff", border: "none", borderRadius: 10, padding: "9px 18px", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Escribir a un colega
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {lista.map((m) => {
                const otro = tab === "recibidos" ? { nombre: m.deNombre, esp: m.deEsp, area: m.deArea } : { nombre: m.paraNombre, esp: m.paraEsp, area: m.paraArea };
                const noLeido = tab === "recibidos" && !m.leido;
                return (
                  <button key={m.id} onClick={() => abrirMensaje(m)} style={{
                    display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%",
                    background: noLeido ? "#F0FBFA" : "#fff", border: `1px solid ${noLeido ? "#BFE3E3" : "#E2E8ED"}`,
                    borderRadius: 12, padding: "13px 16px", cursor: "pointer",
                  }}>
                    <span style={{ width: 6, height: 34, borderRadius: 999, background: colorDeArea(otro.area), flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#0F172A", fontWeight: noLeido ? 700 : 500 }}>
                        {tab === "recibidos" ? otro.nombre : `Para ${otro.nombre}`}
                      </div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#3B4652", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.asunto}</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#8492A0", marginTop: 2 }}>{otro.area} · {otro.esp}</div>
                    </div>
                    {m.cita && <User size={15} color="#0E7C86" style={{ flexShrink: 0 }} />}
                    {m.adjuntos.length > 0 && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#5B6B76", flexShrink: 0 }}>
                        <Paperclip size={13} /> {m.adjuntos.length}
                      </span>
                    )}
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#8492A0", flexShrink: 0 }}>{fmtFechaHora(m.fecha)}</span>
                    {noLeido && <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 700, color: "#fff", background: "#0E7C86", padding: "2px 8px", borderRadius: 999, flexShrink: 0 }}>Nuevo</span>}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {abierto && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }} onClick={() => setAbierto(null)}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 26, width: 520, maxWidth: "94vw", maxHeight: "86vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ paddingRight: 12 }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, color: "#0F172A" }}>{abierto.asunto}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#5B6B76", marginTop: 3 }}>
                  De {abierto.deNombre} ({abierto.deArea}) · para {abierto.paraNombre} ({abierto.paraArea})
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: "#8492A0", marginTop: 2 }}>{fmtFechaHora(abierto.fecha)}</div>
              </div>
              <X size={18} style={{ cursor: "pointer", color: "#8492A0", flexShrink: 0 }} onClick={() => setAbierto(null)} />
            </div>

            {abierto.texto && (
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#3B4652", lineHeight: 1.6, whiteSpace: "pre-wrap", background: "#F7F9FB", borderRadius: 10, padding: "14px 16px" }}>
                {abierto.texto}
              </div>
            )}

            <TarjetaCita cita={abierto.cita} />
            <ListaAdjuntos adjuntos={abierto.adjuntos} />

            {abierto.paraId === remitente.id && (
              <button onClick={() => responder(abierto)} style={{ width: "100%", marginTop: 18, background: PALETTE.ctaGrad, color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
                Responder
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Icono/celda de cama clickeable.
function CamaIcon({ cama, onClick, index }) {
  const ocupada = cama.ocupada;
  const color = ocupada ? "#E8553D" : "#2F9E6E";
  const bg = ocupada ? "#FDEDEA" : "#EAF6F0";
  const title = ocupada
    ? `Cama ${index + 1} · Ocupada${cama.nombre ? " — " + cama.nombre : ""} — clic para ver / liberar`
    : `Cama ${index + 1} · Libre — clic para asignar paciente`;
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 46, height: 46, borderRadius: 12, border: `1.5px solid ${color}`,
        background: bg, display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "transform 0.1s ease", padding: 0,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <BedDouble size={22} color={color} strokeWidth={2} />
    </button>
  );
}

function VistaCamas({ camas, onOcupar, onLiberar }) {
  const [modalLibre, setModalLibre] = useState(null); // { area, idx }
  const [modalOcupada, setModalOcupada] = useState(null); // { area, idx, cama }
  const [form, setForm] = useState({ nombre: "", dni: "" });

  const areas = AREAS_CAMAS_BASE.map((a) => {
    const estados = camas[a.area] || [];
    const libres = estados.filter((c) => !c.ocupada).length;
    return { ...a, estados, libres };
  });

  function abrirLibre(area, idx) {
    setForm({ nombre: "", dni: "" });
    setModalLibre({ area, idx });
  }
  function confirmarOcupar() {
    if (!form.nombre.trim()) return;
    onOcupar(modalLibre.area, modalLibre.idx, { nombre: form.nombre.trim(), dni: form.dni.trim() || "Sin DNI" });
    setModalLibre(null);
  }
  function confirmarLiberar() {
    onLiberar(modalOcupada.area, modalOcupada.idx);
    setModalOcupada(null);
  }

  return (
    <>
      <SectionTitle eyebrow="Disponibilidad en tiempo real" title="Camas por área" />
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#8492A0", marginTop: -10, marginBottom: 16 }}>
        Toca una cama libre para registrar el nombre y DNI del paciente que la ocupará. Toca una cama ocupada para ver quién está y liberarla.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {areas.map((a) => (
          <div key={a.area} style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{a.area}</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#5B6B76" }}>{a.libres} libres / {a.total}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {a.estados.map((cama, i) => (
                <CamaIcon
                  key={i}
                  cama={cama}
                  index={i}
                  onClick={() => (cama.ocupada ? setModalOcupada({ area: a.area, idx: i, cama }) : abrirLibre(a.area, i))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {modalLibre && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 26, width: 380, maxWidth: "90vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16, color: "#0F172A" }}>Asignar cama {modalLibre.idx + 1} · {modalLibre.area}</span>
              <X size={18} style={{ cursor: "pointer", color: "#8492A0" }} onClick={() => setModalLibre(null)} />
            </div>
            <input placeholder="Nombre del paciente" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 10, boxSizing: "border-box" }} />
            <input placeholder="DNI" value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} onKeyDown={(e) => e.key === "Enter" && confirmarOcupar()} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 16, boxSizing: "border-box" }} />
            <button onClick={confirmarOcupar} style={{ width: "100%", background: PALETTE.ctaGrad, color: "#fff", border: "none", borderRadius: 10, padding: "12px 0", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Ocupar cama</button>
          </div>
        </div>
      )}

      {modalOcupada && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 26, width: 380, maxWidth: "90vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16, color: "#0F172A" }}>Cama {modalOcupada.idx + 1} · {modalOcupada.area}</span>
              <X size={18} style={{ cursor: "pointer", color: "#8492A0" }} onClick={() => setModalOcupada(null)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#3B4652", marginBottom: 18 }}>
              <div><strong>Paciente:</strong> {modalOcupada.cama.nombre || "Sin registrar"}</div>
              <div><strong>DNI:</strong> {modalOcupada.cama.dni || "Sin registrar"}</div>
            </div>
            <button onClick={confirmarLiberar} style={{ width: "100%", background: "#FDEDEA", color: "#C0392B", border: "1px solid #F3C6BC", borderRadius: 10, padding: "10px 0", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>Liberar cama</button>
          </div>
        </div>
      )}
    </>
  );
}

// Vista de camas para "Paciente o familia": ve ocupación general, pero solo
// puede saber en qué cama está su familiar si conoce y escribe su DNI.
function VistaCamasFamilia({ camas }) {
  const [dni, setDni] = useState("");
  const [buscado, setBuscado] = useState(false);
  const [resultado, setResultado] = useState(null);

  const areas = AREAS_CAMAS_BASE.map((a) => {
    const estados = camas[a.area] || [];
    const libres = estados.filter((c) => !c.ocupada).length;
    return { area: a.area, total: a.total, libres };
  });

  function buscar() {
    const consulta = dni.trim();
    setBuscado(true);
    if (!consulta) { setResultado(null); return; }
    for (const a of AREAS_CAMAS_BASE) {
      const estados = camas[a.area] || [];
      const idx = estados.findIndex((c) => c.ocupada && c.dni && c.dni.trim() === consulta);
      if (idx !== -1) {
        setResultado({ encontrado: true, area: a.area, numero: idx + 1, nombre: estados[idx].nombre });
        return;
      }
    }
    setResultado({ encontrado: false });
  }

  return (
    <>
      <SectionTitle eyebrow="Consulta para familiares" title="Ubicación de camas" />
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#8492A0", marginTop: -10, marginBottom: 18 }}>
        Por privacidad, AFINTY solo muestra en qué cama está tu familiar si ingresas su DNI exacto. Sin el DNI, únicamente puedes ver cuántas camas hay libres por área.
      </p>

      <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 20, display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscar()}
          placeholder="DNI del paciente"
          style={{ flex: "1 1 200px", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, boxSizing: "border-box" }}
        />
        <button onClick={buscar} style={{ background: PALETTE.ctaGrad, color: "#fff", border: "none", borderRadius: 10, padding: "0 20px", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <Search size={15} /> Buscar
        </button>
      </div>

      {buscado && (!dni.trim() ? (
        <div style={{ background: "#FBF3E4", border: "1px solid #F0DCAE", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8A6A1F" }}>
          Ingresa un número de DNI para buscar.
        </div>
      ) : resultado?.encontrado ? (
        <div style={{ background: "#EAF6F0", border: "1px solid #BFE3D1", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
          <CheckCircle2 size={18} color="#2F9E6E" style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#1F7A52" }}>
            {resultado.nombre} se encuentra en la <strong>cama {resultado.numero}</strong> del área <strong>{resultado.area}</strong>.
          </span>
        </div>
      ) : (
        <div style={{ background: "#FDEDEA", border: "1px solid #F3C6BC", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
          <AlertTriangle size={18} color="#C0392B" style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#8A4A3F" }}>
            No se encontró ningún paciente registrado con ese DNI. Verifica el número o consulta con el personal del hospital.
          </span>
        </div>
      ))}

      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 10 }}>Ocupación general por área</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {areas.map((a) => (
          <div key={a.area} style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#3B4652" }}>
            <span>{a.area}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#5B6B76" }}>{a.libres} libres / {a.total}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function VistaInsumos() {
  const cfg = { crítico: { color: "#E8553D" }, bajo: { color: "#D98E2B" }, atención: { color: "#D98E2B" }, normal: { color: "#2F9E6E" } };
  const [seleccionado, setSeleccionado] = useState(null);

  const porReponer = MEDICAMENTOS_REALES.filter((m) => m.estado !== "normal");
  const totalPorReponer = porReponer.length;
  const totalUnidadesFaltantes = porReponer.reduce((acc, m) => acc + unidadesFaltantes(m.stock), 0);

  return (
    <>
      <SectionTitle eyebrow="Farmacia y biomédica · nombres reales (PNUME / DIGEMID)" title="Medicamentos y equipos" />
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#8492A0", marginTop: -10, marginBottom: 16 }}>
        Presentaciones tomadas del Petitorio Nacional Único de Medicamentos Esenciales. Los niveles de stock son ilustrativos.
      </p>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
        <KpiCard label="Medicamentos por reponer" value={totalPorReponer} sub={`de ${MEDICAMENTOS_REALES.length} presentaciones en total`} accent="#D98E2B" icon={Pill} iconBg="#FBF3E4" />
        <KpiCard label="Unidades faltantes en total" value={totalUnidadesFaltantes} sub={`para llegar al nivel seguro (${META_STOCK} unidades c/u)`} accent="#E8553D" icon={AlertTriangle} iconBg="#FDEDEA" />
      </div>

      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8492A0", marginBottom: 10 }}>
        Haz clic en el estado de un medicamento para ver en qué área está y cuánto falta reponer.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {MEDICAMENTOS_REALES.map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", border: "1px solid #E2E8ED", borderRadius: 12, padding: "12px 18px" }}>
            <div style={{ flex: "1 1 260px" }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 500, color: "#0F172A" }}>{it.nombre}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8492A0" }}>{it.cat}</div>
            </div>
            <div style={{ flex: "1 1 140px" }}>
              <div style={{ height: 8, background: "#E2E8ED", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(it.stock, 100)}%`, height: "100%", background: cfg[it.estado].color, borderRadius: 999 }} />
              </div>
            </div>
            <button
              onClick={() => setSeleccionado(it)}
              style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600, color: cfg[it.estado].color, textTransform: "capitalize", width: 80, textAlign: "right", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              {it.estado}
            </button>
          </div>
        ))}
      </div>

      {seleccionado && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setSeleccionado(null)}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 26, width: 400, maxWidth: "90vw" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16, color: "#0F172A", paddingRight: 12 }}>{seleccionado.nombre}</div>
              <X size={18} style={{ cursor: "pointer", color: "#8492A0", flexShrink: 0 }} onClick={() => setSeleccionado(null)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#3B4652" }}>
              <div><strong>Área / ubicación:</strong> {areaDe(seleccionado.cat)}</div>
              <div><strong>Categoría:</strong> {seleccionado.cat}</div>
              <div><strong>Stock actual:</strong> {seleccionado.stock} unidades</div>
              <div style={{ color: cfg[seleccionado.estado].color, fontWeight: 700 }}>
                Faltan {unidadesFaltantes(seleccionado.stock)} unidades para llegar al nivel seguro ({META_STOCK})
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function VistaDocumentos() {
  const [paciente, setPaciente] = useState("");
  const [gestion, setGestion] = useState(null);

  function iniciarGestion() {
    if (!paciente.trim()) return;
    const pasos = TRAMITE_TEMPLATE.map((t, i) => ({ ...t, estado: i === 0 ? "en-proceso" : "pendiente" }));
    setGestion({ paciente: paciente.trim(), pasos, areaEntrega: TRAMITE_TEMPLATE[TRAMITE_TEMPLATE.length - 1].area });
    setPaciente("");
  }

  function avanzarPaso(idx) {
    setGestion((prev) => {
      const pasos = prev.pasos.map((p, i) => {
        if (i === idx) return { ...p, estado: "listo" };
        if (i === idx + 1 && p.estado === "pendiente") return { ...p, estado: "en-proceso" };
        return p;
      });
      return { ...prev, pasos };
    });
  }

  const tiempoRestante = gestion ? gestion.pasos.filter((p) => p.estado !== "listo").reduce((acc, p) => acc + p.tiempoMin, 0) : 0;
  const todoListo = gestion && gestion.pasos.every((p) => p.estado === "listo");

  const estadoCfg = {
    pendiente: { color: "#8492A0", bg: "#F1F4F6", label: "Pendiente" },
    "en-proceso": { color: "#0E7C86", bg: "#F0FBFA", label: "La IA lo está moviendo" },
    listo: { color: "#2F9E6E", bg: "#EAF6F0", label: "Listo" },
  };

  return (
    <>
      <SectionTitle eyebrow="Trámites sin desplazamiento" title="Documentos" />
      <div style={{ background: "#F0FBFA", border: "1px solid #BFE3E3", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <Sparkles size={18} color="#0E7C86" style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#0F172A", lineHeight: 1.5 }}>
          Con solo el nombre del paciente, la IA de AFINTY mueve su expediente entre Admisión, Seguros, Historia Clínica y Farmacia. El paciente no hace ningún papeleo ni se desplaza entre áreas: solo espera a que le avisen dónde recoger sus medicamentos, y al llegar únicamente firma la entrega.
        </span>
      </div>

      {!gestion && (
        <>
          <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              value={paciente}
              onChange={(e) => setPaciente(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && iniciarGestion()}
              placeholder="Nombre del paciente"
              style={{ flex: "1 1 220px", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, boxSizing: "border-box" }}
            />
            <button onClick={iniciarGestion} style={{ background: PALETTE.ctaGrad, color: "#fff", border: "none", borderRadius: 10, padding: "0 18px", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13.5, cursor: "pointer", flexShrink: 0 }}>
              Iniciar gestión de documentos
            </button>
          </div>

          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#0F172A", margin: "32px 0 4px" }}>Por dónde pasa tu expediente</div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#8492A0", marginTop: 0, marginBottom: 16 }}>
            Este es el recorrido que hace la IA en tu nombre, en el orden en que ocurre. Tú solo esperas el aviso final.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 32 }}>
            {TRAMITE_TEMPLATE.map((t, i) => (
              <div key={t.area} style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: "16px 16px", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#F0FBFA", border: "1px solid #BFE3E3", color: "#0E7C86", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 600, color: "#0F172A" }}>{t.area}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8492A0", marginTop: 3 }}>~{t.tiempoMin} min estimados</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <div style={{ flex: "1 1 260px", background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "#F0FBFA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ClipboardList size={15} color="#0E7C86" />
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 600, color: "#0F172A" }}>Qué necesitas llevar</span>
              </div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#5B6B76", lineHeight: 1.6, margin: 0 }}>
                Nada de papeles. Con tu nombre completo AFINTY ubica tu historia clínica y tu seguro automáticamente. Solo trae tu documento de identidad para firmar al final.
              </p>
            </div>
            <div style={{ flex: "1 1 260px", background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "#FBF3E4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock size={15} color="#D98E2B" />
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 600, color: "#0F172A" }}>Cuánto se demora</span>
              </div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#5B6B76", lineHeight: 1.6, margin: 0 }}>
                En promedio {TRAMITE_TEMPLATE.reduce((a, t) => a + t.tiempoMin, 0)} minutos entre las cuatro áreas. Te avisamos apenas esté todo listo para recoger.
              </p>
            </div>
            <div style={{ flex: "1 1 260px", background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "#EAF6F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckCircle2 size={15} color="#2F9E6E" />
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 600, color: "#0F172A" }}>Dónde termina</span>
              </div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#5B6B76", lineHeight: 1.6, margin: 0 }}>
                Todo trámite cierra en {TRAMITE_TEMPLATE[TRAMITE_TEMPLATE.length - 1].area}: ahí firmas y recoges, sin pasar antes por ninguna otra ventanilla.
              </p>
            </div>
          </div>
        </>
      )}

      {gestion && (
        <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16, color: "#0F172A" }}>{gestion.paciente}</div>
            <button onClick={() => setGestion(null)} style={{ border: "1px solid #E2E8ED", background: "#F7F9FB", borderRadius: 8, padding: "5px 10px", fontSize: 12, color: "#5B6B76", fontFamily: "Inter, sans-serif", cursor: "pointer" }}>Nuevo trámite</button>
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#8492A0", marginBottom: 18 }}>
            {todoListo ? `Todo listo. El paciente solo debe acercarse a ${gestion.areaEntrega} a firmar y recoger sus medicamentos.` : `Tiempo estimado restante: ${tiempoRestante} min · entrega final en ${gestion.areaEntrega}`}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {gestion.pasos.map((p, i) => {
              const c = estadoCfg[p.estado];
              return (
                <div key={p.area} style={{ display: "flex", alignItems: "center", gap: 14, border: "1px solid #E2E8ED", borderRadius: 12, padding: "12px 16px" }}>
                  {i > 0 && <ArrowRight size={14} color="#B7C1C9" style={{ flexShrink: 0 }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 500, color: "#0F172A" }}>{p.area}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8492A0" }}>~{p.tiempoMin} min</div>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: c.color, background: c.bg, padding: "3px 10px", borderRadius: 999 }}>{c.label}</span>
                  {p.estado === "en-proceso" && (
                    <button onClick={() => avanzarPaso(i)} style={{ border: "1px solid #E2E8ED", background: "#F7F9FB", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#0E7C86", fontFamily: "Inter, sans-serif", cursor: "pointer", fontWeight: 600 }}>
                      Marcar listo
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#8492A0", marginTop: 12 }}>
            En producción, estos pasos avanzan solos: aquí puedes simular el avance de la IA con "Marcar listo".
          </p>
        </div>
      )}
    </>
  );
}

function VistaCitas({ citas, onAsignar, onLiberar, onConfirmar, onCompartirCita }) {
  const [modalVacio, setModalVacio] = useState(null); // { docId, idx }
  const [modalInfo, setModalInfo] = useState(null); // { docId, idx, paciente }
  const [form, setForm] = useState({ nombre: "", dni: "", celular: "", fecha: manana() });

  const doctores = DOCTORES.filter((d) => DOCTORES_CITAS_IDS.includes(d.id));
  const grupos = agruparDoctoresPorArea(doctores);

  function abrirAsignar(docId, idx) {
    setForm({ nombre: "", dni: "", celular: "", fecha: manana() });
    setModalVacio({ docId, idx });
  }

  function confirmarAsignar() {
    if (!form.nombre.trim()) return;
    onAsignar(modalVacio.docId, modalVacio.idx, { nombre: form.nombre.trim(), dni: form.dni.trim() || "Sin DNI", celular: form.celular.trim(), fecha: form.fecha, nueva: false });
    setModalVacio(null);
  }

  const doctorDe = (docId) => doctores.find((d) => d.id === docId);

  return (
    <>
      <SectionTitle eyebrow="Consulta externa · agenda por área y médico" title="Citas" />
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#8492A0", marginTop: -10, marginBottom: 18 }}>
        Toca un casillero vacío para agendar directamente. Los casilleros marcados como <strong>Nueva</strong> fueron solicitados por un paciente o familiar desde su propia interfaz — revísalos y confírmalos. Desde cada cita puedes enviársela a otro médico con sus documentos.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {grupos.map((g) => (
          <div key={g.area}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ width: 6, height: 20, borderRadius: 999, background: g.color }} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: "#0F172A" }}>{g.area}</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8492A0" }}>{g.doctores.length} médicos con consulta externa</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {g.doctores.map((d) => (
                <div key={d.id} style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{d.nombre}</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#5B6B76" }}>{d.esp}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {HORAS_CITAS.map((hora, i) => {
                      const p = citas[d.id]?.[i];
                      const ocupado = !!p;
                      return (
                        <button
                          key={i}
                          onClick={() => (ocupado ? setModalInfo({ docId: d.id, idx: i, paciente: p }) : abrirAsignar(d.id, i))}
                          title={ocupado ? `${p.nombre} · ${hora}` : `Libre · ${hora}`}
                          style={{
                            position: "relative",
                            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                            width: 68, padding: "8px 4px", borderRadius: 12, cursor: "pointer",
                            border: `1.5px solid ${ocupado ? (p.nueva ? "#D98E2B" : "#0E7C86") : "#2F9E6E"}`,
                            background: ocupado ? (p.nueva ? "#FBF3E4" : "#F0FBFA") : "#EAF6F0",
                          }}
                        >
                          {p?.nueva && (
                            <span style={{ position: "absolute", top: -7, right: -7, background: "#D98E2B", color: "#fff", fontSize: 8.5, fontWeight: 700, borderRadius: 999, padding: "2px 5px", fontFamily: "Inter, sans-serif" }}>Nueva</span>
                          )}
                          <User size={18} color={ocupado ? (p.nueva ? "#D98E2B" : "#0E7C86") : "#2F9E6E"} />
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: ocupado ? (p.nueva ? "#D98E2B" : "#0E7C86") : "#2F9E6E", fontWeight: 700 }}>{hora}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modalVacio && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 26, width: 380, maxWidth: "90vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16, color: "#0F172A" }}>Agendar cita · {HORAS_CITAS[modalVacio.idx]}</span>
              <X size={18} style={{ cursor: "pointer", color: "#8492A0" }} onClick={() => setModalVacio(null)} />
            </div>
            <input placeholder="Nombre del paciente" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 10, boxSizing: "border-box" }} />
            <input placeholder="DNI" value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 10, boxSizing: "border-box" }} />
            <input placeholder="Celular (opcional)" value={form.celular} onChange={(e) => setForm({ ...form, celular: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 10, boxSizing: "border-box" }} />
            <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 16, boxSizing: "border-box" }} />
            <button onClick={confirmarAsignar} style={{ width: "100%", background: PALETTE.ctaGrad, color: "#fff", border: "none", borderRadius: 10, padding: "12px 0", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Confirmar cita</button>
          </div>
        </div>
      )}

      {modalInfo && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 26, width: 380, maxWidth: "90vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16, color: "#0F172A" }}>{modalInfo.paciente.nombre}</span>
              <X size={18} style={{ cursor: "pointer", color: "#8492A0" }} onClick={() => setModalInfo(null)} />
            </div>
            {modalInfo.paciente.nueva && (
              <div style={{ background: "#FBF3E4", border: "1px solid #F0DCAE", borderRadius: 10, padding: "8px 12px", marginBottom: 14, fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8A6A1F" }}>
                Solicitada por el paciente o familiar desde su propia interfaz.
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#3B4652", marginBottom: 18 }}>
              <div><strong>DNI:</strong> {modalInfo.paciente.dni}</div>
              {modalInfo.paciente.celular && <div><strong>Celular:</strong> {modalInfo.paciente.celular}</div>}
              <div><strong>Fecha:</strong> {modalInfo.paciente.fecha}</div>
              <div><strong>Hora:</strong> {HORAS_CITAS[modalInfo.idx]}</div>
              <div><strong>Doctor:</strong> {doctorDe(modalInfo.docId)?.nombre} · {doctorDe(modalInfo.docId)?.esp}</div>
              <div><strong>Área:</strong> {doctorDe(modalInfo.docId)?.area}</div>
            </div>

            {onCompartirCita && (
              <button
                onClick={() => { onCompartirCita(modalInfo.docId, modalInfo.idx); setModalInfo(null); }}
                style={{ width: "100%", marginBottom: 10, background: "#F0FBFA", color: "#0E7C86", border: "1px solid #BFE3E3", borderRadius: 10, padding: "10px 0", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                <MessageCircle size={15} /> Enviar esta cita a otro médico
              </button>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              {modalInfo.paciente.nueva && (
                <button onClick={() => { onConfirmar(modalInfo.docId, modalInfo.idx); setModalInfo({ ...modalInfo, paciente: { ...modalInfo.paciente, nueva: false } }); }} style={{ flex: 1, background: PALETTE.ctaGrad, color: "#fff", border: "none", borderRadius: 10, padding: "10px 0", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>Confirmar</button>
              )}
              <button onClick={() => { onLiberar(modalInfo.docId, modalInfo.idx); setModalInfo(null); }} style={{ flex: 1, background: "#FDEDEA", color: "#C0392B", border: "1px solid #F3C6BC", borderRadius: 10, padding: "10px 0", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>Liberar casillero</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Solicitud de cita para "Paciente o familia": solo nombre, DNI opcional y
// celular obligatorio. AFINTY agenda automáticamente el primer horario libre
// de la especialidad elegida y notifica al doctor correspondiente.
function VistaCitasFamiliaSolicitud({ especialidades, onSolicitar }) {
  const [form, setForm] = useState({ nombre: "", dni: "", celular: "", especialidad: especialidades[0] || "" });
  const [resultado, setResultado] = useState(null);

  // Las especialidades también se ofrecen agrupadas por área, para que el
  // familiar encuentre el servicio sin conocer el nombre técnico exacto.
  const porArea = AREAS_MEDICAS
    .map((a) => ({ area: a.area, esps: especialidades.filter((e) => areaMedicaDe(e) === a.area) }))
    .filter((g) => g.esps.length > 0);

  function enviar() {
    if (!form.nombre.trim() || !form.celular.trim() || !form.especialidad) {
      setResultado({ ok: false, mensaje: "Completa tu nombre, tu celular y la especialidad." });
      return;
    }
    const res = onSolicitar({ nombre: form.nombre.trim(), dni: form.dni.trim(), celular: form.celular.trim(), especialidad: form.especialidad });
    setResultado(res);
    if (res.ok) setForm({ nombre: "", dni: "", celular: "", especialidad: especialidades[0] || "" });
  }

  return (
    <>
      <SectionTitle eyebrow="Solicitud de cita" title="Pedir una cita" />
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#8492A0", marginTop: -10, marginBottom: 18 }}>
        Escribe tus datos y elige la especialidad. AFINTY agenda automáticamente el próximo horario disponible y avisa al doctor de inmediato.
      </p>

      <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 22, maxWidth: 460 }}>
        <label style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#5B6B76", marginBottom: 4, display: "block" }}>Nombre completo del paciente</label>
        <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 12, boxSizing: "border-box" }} />

        <label style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#5B6B76", marginBottom: 4, display: "block" }}>DNI (opcional)</label>
        <input value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 12, boxSizing: "border-box" }} />

        <label style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#5B6B76", marginBottom: 4, display: "block" }}>Número de celular</label>
        <div style={{ position: "relative", marginBottom: 12 }}>
          <PhoneCall size={15} color="#8492A0" style={{ position: "absolute", left: 12, top: 12 }} />
          <input value={form.celular} onChange={(e) => setForm({ ...form, celular: e.target.value })} placeholder="9XXXXXXXX" style={{ width: "100%", padding: "10px 12px 10px 34px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, boxSizing: "border-box" }} />
        </div>

        <label style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#5B6B76", marginBottom: 4, display: "block" }}>Especialidad</label>
        <select value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 18, boxSizing: "border-box" }}>
          {porArea.map((g) => (
            <optgroup key={g.area} label={g.area}>
              {g.esps.map((esp) => <option key={esp} value={esp}>{esp}</option>)}
            </optgroup>
          ))}
        </select>

        <button onClick={enviar} style={{ width: "100%", background: PALETTE.ctaGrad, color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          Solicitar cita
        </button>

        {resultado && (
          <div style={{ marginTop: 14, background: resultado.ok ? "#EAF6F0" : "#FDEDEA", border: `1px solid ${resultado.ok ? "#BFE3D1" : "#F3C6BC"}`, borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10, alignItems: "center" }}>
            {resultado.ok ? <CheckCircle2 size={17} color="#2F9E6E" style={{ flexShrink: 0 }} /> : <AlertTriangle size={17} color="#C0392B" style={{ flexShrink: 0 }} />}
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: resultado.ok ? "#1F7A52" : "#8A4A3F" }}>{resultado.mensaje}</span>
          </div>
        )}
      </div>
    </>
  );
}

function VistaEmergencias({ atendidos, onAtender }) {
  const [modal, setModal] = useState(false);
  const [paso, setPaso] = useState(1);
  const [form, setForm] = useState({ nombre: "", dni: "" });
  const [ingresos, setIngresos] = useState([]);
  const [formIngreso, setFormIngreso] = useState({ dni: "", nombre: "" });

  function iniciar() { setModal(true); setPaso(1); }
  function confirmarAtencion() { setPaso(2); }
  function completarDatos() {
    onAtender({ id: Date.now(), nombre: form.nombre || "Paciente sin identificar", dni: form.dni || "Pendiente" });
    setModal(false); setForm({ nombre: "", dni: "" });
  }

  function registrarIngreso() {
    if (!formIngreso.nombre.trim()) return;
    const hora = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
    setIngresos((prev) => [{ id: Date.now(), dni: formIngreso.dni.trim() || "Sin DNI", nombre: formIngreso.nombre.trim(), hora, silla: false }, ...prev]);
    setFormIngreso({ dni: "", nombre: "" });
  }

  function toggleSilla(id) {
    setIngresos((prev) => prev.map((p) => (p.id === id ? { ...p, silla: !p.silla } : p)));
  }

  return (
    <>
      <SectionTitle eyebrow="Protocolo de urgencia" title="Emergencias" />
      <div style={{ background: "#FDEDEA", border: "1px solid #F3C6BC", borderRadius: 14, padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16, color: "#C0392B" }}>Atender primero, regularizar datos después</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8A4A3F", marginTop: 4 }}>La falta de DNI u otros datos nunca debe retrasar la atención de una emergencia.</div>
        </div>
        <button onClick={iniciar} style={{ background: PALETTE.ctaCoralGrad, color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Siren size={17} /> Emergencia
        </button>
      </div>

      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 10 }}>Pacientes atendidos hoy pendientes de regularizar datos</div>
      {atendidos.length === 0 && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8492A0" }}>Aún no hay casos registrados.</div>}
      {atendidos.map((p) => (
        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1px solid #E2E8ED", borderRadius: 12, padding: "12px 16px", marginBottom: 8 }}>
          <CheckCircle2 size={18} color="#2F9E6E" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#0F172A", fontWeight: 500 }}>{p.nombre}</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8492A0" }}>DNI: {p.dni} · Atendido de inmediato</div>
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 600, color: "#95651A", background: "#FBF3E4", padding: "3px 10px", borderRadius: 999 }}>Regularizar datos</span>
        </div>
      ))}

      <div style={{ height: 1, background: "#E2E8ED", margin: "26px 0" }} />

      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Ingreso sin emergencia</div>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8492A0", marginTop: 0, marginBottom: 12 }}>
        Para visitas o familiares que ingresan sin ser una urgencia: DNI, nombre y hora quedan registrados. Si la persona se lleva una silla de ruedas del hospital, solo toca el ícono — no hace falta escribir nada.
      </p>

      <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, padding: 18, marginBottom: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input placeholder="DNI" value={formIngreso.dni} onChange={(e) => setFormIngreso({ ...formIngreso, dni: e.target.value })} style={{ flex: "1 1 140px", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, boxSizing: "border-box" }} />
        <input placeholder="Nombre del paciente o visitante" value={formIngreso.nombre} onChange={(e) => setFormIngreso({ ...formIngreso, nombre: e.target.value })} onKeyDown={(e) => e.key === "Enter" && registrarIngreso()} style={{ flex: "2 1 220px", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, boxSizing: "border-box" }} />
        <button onClick={registrarIngreso} style={{ background: PALETTE.ctaGrad, color: "#fff", border: "none", borderRadius: 10, padding: "0 18px", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>Registrar ingreso</button>
      </div>

      {ingresos.length === 0 ? (
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8492A0" }}>Aún no hay ingresos registrados.</div>
      ) : ingresos.map((p) => (
        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "1px solid #E2E8ED", borderRadius: 12, padding: "12px 16px", marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#0F172A", fontWeight: 500 }}>{p.nombre}</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8492A0" }}>DNI: {p.dni} · Ingresó a las {p.hora}</div>
          </div>
          <button
            onClick={() => toggleSilla(p.id)}
            title={p.silla ? "Tiene silla de ruedas del hospital — clic para quitar" : "Marcar que se lleva una silla de ruedas"}
            style={{
              display: "flex", alignItems: "center", gap: 6, border: `1.5px solid ${p.silla ? "#0E7C86" : "#E2E8ED"}`,
              background: p.silla ? "#F0FBFA" : "#F7F9FB", borderRadius: 10, padding: "7px 12px", cursor: "pointer",
            }}
          >
            <Accessibility size={18} color={p.silla ? "#0E7C86" : "#B7C1C9"} />
            {p.silla && <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 600, color: "#0E7C86" }}>Silla de ruedas</span>}
          </button>
        </div>
      ))}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 26, width: 380, maxWidth: "90vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, color: "#0F172A" }}>{paso === 1 ? "Confirmar ingreso" : "Regularizar datos"}</span>
              <X size={18} style={{ cursor: "pointer", color: "#8492A0" }} onClick={() => setModal(false)} />
            </div>
            {paso === 1 ? (
              <>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#3B4652", lineHeight: 1.5 }}>El paciente será atendido de inmediato. Podrás completar sus datos personales una vez estabilizado.</p>
                <button onClick={confirmarAtencion} style={{ width: "100%", background: PALETTE.ctaCoralGrad, color: "#fff", border: "none", borderRadius: 10, padding: "12px 0", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8 }}>Atender ahora</button>
              </>
            ) : (
              <>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#2F9E6E", marginBottom: 14 }}>Paciente en atención. Completa lo que tengas disponible; si no tiene DNI ni ningún documento, igual ya está siendo atendido.</p>
                <input placeholder="Nombre del paciente (si se conoce)" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 10, boxSizing: "border-box" }} />
                <input placeholder="DNI (opcional por ahora)" value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 12, boxSizing: "border-box" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ flex: 1, height: 1, background: "#E2E8ED" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#B7C1C9" }}>o, si no tiene documento</span>
                  <div style={{ flex: 1, height: 1, background: "#E2E8ED" }} />
                </div>
                <button
                  onClick={() => setForm({ ...form, dni: "Identificado por foto" })}
                  style={{ width: "100%", background: form.dni === "Identificado por foto" ? "#EAF6F0" : "#F7F9FB", color: "#1F7A52", border: `1px solid ${form.dni === "Identificado por foto" ? "#2F9E6E" : "#E2E8ED"}`, borderRadius: 10, padding: "10px 0", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}
                >
                  <Camera size={16} /> {form.dni === "Identificado por foto" ? "Foto tomada — solo para saber quién es" : "Tomar foto para identificarlo"}
                </button>
                <button onClick={completarDatos} style={{ width: "100%", background: PALETTE.ctaGrad, color: "#fff", border: "none", borderRadius: 10, padding: "12px 0", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Guardar registro</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function VistaAlertas({ alerts, onResolve, onEnviarCorreo, correosEnviados }) {
  return (
    <>
      <SectionTitle eyebrow="Centro de alertas" title="Todas las alertas activas" />
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#8492A0", marginTop: -10, marginBottom: 16 }}>
        Las alertas de un médico específico tienen el botón "Notificar por correo": abre un correo ya redactado, listo para enviar a {EMAIL_JEFATURA}.
      </p>
      {alerts.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "40px 0", color: "#8492A0", fontFamily: "Inter, sans-serif" }}>
          <CheckCircle2 size={28} color="#2F9E6E" /> Sin alertas pendientes. Todo bajo control.
        </div>
      ) : alerts.map((a) => <AlertRow key={a.id} a={a} onResolve={onResolve} onEnviarCorreo={onEnviarCorreo} correoEnviado={correosEnviados.includes(a.id)} />)}
    </>
  );
}

function VistaReportes() {
  const filas = DOCTORES.map(d => {
    const tardanzas = d.asistencia.filter(a => a.estado === "tardanza").length;
    const faltas = d.asistencia.filter(a => a.estado === "falta").length;
    const total = tardanzas + faltas;
    return { ...d, tardanzas, faltas, total };
  }).sort((a, b) => b.total - a.total);

  const porArea = agruparDoctoresPorArea(DOCTORES).map((g) => ({
    ...g,
    total: g.doctores.reduce((acc, d) => acc + d.asistencia.filter(a => a.estado === "tardanza" || a.estado === "falta").length, 0),
  })).sort((a, b) => b.total - a.total);

  return (
    <>
      <SectionTitle eyebrow="Reporte automático · últimos 14 días" title="Inasistencias y reportes" />
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#8492A0", marginTop: -10, marginBottom: 18 }}>
        Cuando un médico acumula {UMBRAL_ALERTA} o más tardanzas/faltas en la ventana analizada, AFINTY notifica automáticamente a Jefatura de Personal y a Gestión Administrativa para que evalúen las medidas correspondientes, incluida una posible sanción.
      </p>

      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 10 }}>Incidencias acumuladas por área</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
        {porArea.map((g) => (
          <div key={g.area} style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 12, padding: "12px 16px", flex: "1 1 220px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 6, height: 30, borderRadius: 999, background: g.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#3B4652" }}>{g.area}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#8492A0" }}>{g.doctores.length} médicos</div>
            </div>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, fontWeight: 700, color: g.total > 0 ? "#C0392B" : "#2F9E6E" }}>{g.total}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.9fr 1.5fr 1.3fr 0.8fr 0.8fr 0.8fr 1.3fr", padding: "12px 18px", fontSize: 11.5, fontFamily: "'IBM Plex Mono', monospace", color: "#8492A0", textTransform: "uppercase", letterSpacing: 0.6, borderBottom: "1px solid #E2E8ED" }}>
          <span>Médico</span><span>Especialidad</span><span>Área</span><span>Tard.</span><span>Faltas</span><span>Total</span><span>Acción sugerida</span>
        </div>
        {filas.map((d, i) => {
          const critico = d.total >= UMBRAL_ALERTA;
          return (
            <div key={d.id} style={{ display: "grid", gridTemplateColumns: "1.9fr 1.5fr 1.3fr 0.8fr 0.8fr 0.8fr 1.3fr", padding: "14px 18px", fontSize: 13, fontFamily: "Inter, sans-serif", color: "#0F172A", borderBottom: i < filas.length - 1 ? "1px solid #EEF2F4" : "none", alignItems: "center" }}>
              <span style={{ fontWeight: 500 }}>{d.nombre}</span>
              <span style={{ color: "#5B6B76", fontSize: 12.5 }}>{d.esp}</span>
              <span style={{ color: colorDeArea(d.area), fontSize: 12, fontWeight: 600 }}>{d.area}</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#D98E2B" }}>{d.tardanzas}</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#E8553D" }}>{d.faltas}</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>{d.total}</span>
              <span style={{ fontSize: 11.5, fontWeight: 600, padding: "3px 10px", borderRadius: 999, width: "fit-content", color: critico ? "#C0392B" : "#1F7A52", background: critico ? "#FDEDEA" : "#EAF6F0" }}>
                {critico ? "Escalado a Jefatura" : "Sin acción requerida"}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function construirContextoHospital(areasResumen) {
  const porArea = agruparDoctoresPorArea(DOCTORES).map((g) => {
    const detalle = g.doctores.map(d => {
      const tardanzas = d.asistencia.filter(a => a.estado === "tardanza").length;
      const faltas = d.asistencia.filter(a => a.estado === "falta").length;
      return `  - ${d.nombre} (${d.esp}, ${d.turno}): ${tardanzas} tardanzas, ${faltas} faltas en 14 días.`;
    }).join("\n");
    return `ÁREA ${g.area} (${g.doctores.length} médicos):\n${detalle}`;
  }).join("\n");
  const criticos = MEDICAMENTOS_REALES.filter(m => m.estado === "crítico").map(m => `${m.nombre} (${m.stock}%)`).join(", ");
  const camas = areasResumen.map(a => `${a.area}: ${a.libres}/${a.total} libres`).join("; ");
  return `Hospital: ${HOSPITAL.nombre}, ${HOSPITAL.direccion}. ${HOSPITAL.director}.
PLANA MÉDICA POR ÁREA Y ASISTENCIA (últimos 14 días):
${porArea}
Umbral de alerta para escalar a Jefatura de Personal: ${UMBRAL_ALERTA} incidencias.
CAMAS: ${camas}.
MEDICAMENTOS EN ESTADO CRÍTICO: ${criticos}.`;
}

// Respuesta local (sin servidor) basada en los mismos datos del hospital.
// Se usa cuando no hay un endpoint de IA configurado (VITE_AI_ENDPOINT).
function respuestaLocal(texto, areasResumen) {
  const t = texto.toLowerCase();
  const grupos = agruparDoctoresPorArea(DOCTORES);
  const conteo = (d) => ({
    tard: d.asistencia.filter(a => a.estado === "tardanza").length,
    falt: d.asistencia.filter(a => a.estado === "falta").length,
  });

  if (/tardanza|falta|asistencia|escalar|jefatura|personal/.test(t)) {
    const porArea = grupos.map(g => {
      const total = g.doctores.reduce((acc, d) => { const c = conteo(d); return acc + c.tard + c.falt; }, 0);
      return { area: g.area, total };
    }).sort((a, b) => b.total - a.total);
    const escalar = DOCTORES.map(d => { const c = conteo(d); return { d, total: c.tard + c.falt }; })
      .filter(x => x.total >= UMBRAL_ALERTA);
    let r = `Incidencias (tardanzas + faltas) en 14 días por área:\n` +
      porArea.map(x => `• ${x.area}: ${x.total}`).join("\n");
    r += escalar.length
      ? `\n\nSuperan el umbral de ${UMBRAL_ALERTA} y deben escalarse a Jefatura de Personal:\n` +
        escalar.map(x => `• ${x.d.nombre} (${x.d.esp}): ${x.total} incidencias`).join("\n")
      : `\n\nNingún médico supera el umbral de ${UMBRAL_ALERTA}; no hay casos que escalar.`;
    return r;
  }
  if (/medicament|stock|reposic|farmacia|insumo/.test(t)) {
    const crit = MEDICAMENTOS_REALES.filter(m => m.estado === "crítico");
    const bajo = MEDICAMENTOS_REALES.filter(m => m.estado === "bajo");
    return `Reposición urgente (estado crítico):\n` + crit.map(m => `• ${m.nombre} — stock ${m.stock}%`).join("\n") +
      `\n\nStock bajo (programar reposición):\n` + bajo.map(m => `• ${m.nombre} — stock ${m.stock}%`).join("\n");
  }
  if (/cama|ocupaci|hospitaliz/.test(t)) {
    const ord = [...areasResumen].sort((a, b) => a.libres - b.libres);
    return `Disponibilidad de camas (menos libres primero):\n` +
      ord.map(a => `• ${a.area}: ${a.libres}/${a.total} libres`).join("\n") +
      `\n\nEl área con menos camas libres es ${ord[0]?.area}.`;
  }
  return "Puedo ayudarte con asistencia del personal, camas y stock de medicamentos. Prueba con una de las sugerencias de abajo.";
}

function VistaAsistenteIA({ areasResumen }) {
  const [mensajes, setMensajes] = useState([
    { rol: "asistente", texto: "Soy el asistente de IA de AFINTY. Puedo revisar turnos por área, asistencia del personal, disponibilidad de camas y stock de medicamentos, y sugerir acciones administrativas. ¿En qué te ayudo?" },
  ]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const finRef = useRef(null);

  useEffect(() => { finRef.current?.scrollIntoView({ behavior: "smooth" }); }, [mensajes]);

  async function enviar() {
    const texto = input.trim();
    if (!texto || cargando) return;
    const nuevos = [...mensajes, { rol: "usuario", texto }];
    setMensajes(nuevos);
    setInput("");
    setCargando(true);

    try {
      const historial = nuevos.map(m => ({ role: m.rol === "usuario" ? "user" : "assistant", content: m.texto }));
      const endpoint = import.meta.env.VITE_AI_ENDPOINT;
      let respuesta;
      if (!endpoint) {
        // Sin backend configurado: respuesta local con los datos de la demo
        await new Promise(r => setTimeout(r, 400));
        respuesta = respuestaLocal(texto, areasResumen);
      } else {
        // Con backend/proxy propio (la API key vive en el servidor, nunca en el navegador)
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system: `Eres el asistente de IA integrado en AFINTY, un software de gestión hospitalaria para el Hospital Nacional Arzobispo Loayza. Tu rol equivale al de un administrador de turno: analizas asistencia del personal médico por área, disponibilidad de camas, stock de medicamentos y alertas, y recomiendas acciones concretas (por ejemplo, escalar un caso a Jefatura de Personal, reprogramar una guardia, o priorizar la reposición de un medicamento). Responde en español, de forma breve, concreta y en tono profesional administrativo. Usa los datos del contexto a continuación; si algo no está en los datos, dilo con claridad en vez de inventar cifras.

DATOS ACTUALES DEL HOSPITAL:
${construirContextoHospital(areasResumen)}`,
            messages: historial,
          }),
        });
        if (!response.ok) throw new Error("HTTP " + response.status);
        const data = await response.json();
        const textBlocks = (data.content || []).filter(b => b.type === "text").map(b => b.text);
        respuesta = textBlocks.join("\n").trim() || "No pude generar una respuesta. Intenta reformular tu consulta.";
      }
      setMensajes(prev => [...prev, { rol: "asistente", texto: respuesta }]);
    } catch (err) {
      setMensajes(prev => [...prev, { rol: "asistente", texto: "Hubo un problema de conexión con el asistente. Intenta nuevamente en unos segundos." }]);
    } finally {
      setCargando(false);
    }
  }

  const sugerencias = [
    "¿Qué área acumula más tardanzas esta semana?",
    "¿Qué medicamentos necesitan reposición urgente?",
    "¿Qué área tiene menos camas disponibles?",
    "¿Debo escalar algún caso a Jefatura de Personal?",
  ];

  return (
    <>
      <SectionTitle eyebrow="Gestión asistida por IA · asistente integrado" title="Asistente IA de AFINTY" />
      <div style={{ background: "#F0FBFA", border: "1px solid #BFE3E3", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <Sparkles size={18} color="#0E7C86" style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#0F172A", lineHeight: 1.5 }}>
          Este asistente actúa como <strong>administrador virtual del turno</strong>: cruza asistencia médica por área, camas y stock de medicamentos en tiempo real, y te dice qué escalar a Jefatura de Personal o Gestión Administrativa antes de que se vuelva un problema.
        </span>
      </div>
      <div style={{ background: "#fff", border: "1px solid #E2E8ED", borderRadius: 14, display: "flex", flexDirection: "column", height: 520 }}>
        <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          {mensajes.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.rol === "usuario" ? "flex-end" : "flex-start",
              maxWidth: "78%", background: m.rol === "usuario" ? PALETTE.ctaGrad : "#F1F4F6",
              color: m.rol === "usuario" ? "#fff" : "#0F172A",
              padding: "10px 14px", borderRadius: 14,
              borderBottomRightRadius: m.rol === "usuario" ? 4 : 14,
              borderBottomLeftRadius: m.rol === "usuario" ? 14 : 4,
              fontFamily: "Inter, sans-serif", fontSize: 13.5, lineHeight: 1.5, whiteSpace: "pre-wrap",
            }}>
              {m.texto}
            </div>
          ))}
          {cargando && (
            <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8, color: "#8492A0", fontFamily: "Inter, sans-serif", fontSize: 13 }}>
              <Loader2 size={14} className="afinty-spin" /> Analizando datos del hospital…
            </div>
          )}
          <div ref={finRef} />
        </div>

        <div style={{ padding: "10px 16px", borderTop: "1px solid #E2E8ED", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {sugerencias.map((s) => (
            <button key={s} onClick={() => setInput(s)} style={{ border: "1px solid #E2E8ED", background: "#F7F9FB", borderRadius: 999, padding: "5px 12px", fontSize: 12, fontFamily: "Inter, sans-serif", color: "#0E7C86", cursor: "pointer" }}>
              {s}
            </button>
          ))}
        </div>

        <div style={{ padding: 14, borderTop: "1px solid #E2E8ED", display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviar()}
            placeholder="Pregúntale al asistente sobre turnos, camas o medicamentos…"
            style={{ flex: 1, padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8ED", fontFamily: "Inter, sans-serif", fontSize: 13.5, boxSizing: "border-box" }}
          />
          <button onClick={enviar} disabled={cargando} style={{ background: PALETTE.ctaGrad, color: "#fff", border: "none", borderRadius: 10, padding: "0 18px", cursor: cargando ? "default" : "pointer", opacity: cargando ? 0.6 : 1, display: "flex", alignItems: "center" }}>
            <Send size={16} />
          </button>
        </div>
      </div>
      <style>{`
        .afinty-spin { animation: afinty-spin 1s linear infinite; }
        @keyframes afinty-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

// Qué ve cada rol en el menú lateral.
function navParaRol(rol) {
  if (rol === "Jefatura") return NAV;
  if (rol === "Doctor") {
    return [
      { key: "miturno", label: "Mi turno", icon: Clock },
      { key: "mensajes", label: "Mensajes", icon: Inbox },
      { key: "turnos", label: "Médicos por área", icon: Clock },
      { key: "camas", label: "Camas", icon: BedDouble },
      { key: "citas", label: "Citas", icon: User },
      { key: "insumos", label: "Medicamentos y equipos", icon: Pill },
      { key: "documentos", label: "Documentos", icon: FileText },
      { key: "hospital", label: "Hospital y médicos", icon: Building2 },
    { key: "nosotros", label: "Nosotros", icon: Info },
    ];
  }
  if (rol === "Almacén") {
    return [
      { key: "insumos", label: "Medicamentos y equipos", icon: Pill },
      { key: "mensajes", label: "Mensajes", icon: Inbox },
      { key: "alertas", label: "Alertas", icon: Bell },
      { key: "hospital", label: "Hospital y médicos", icon: Building2 },
    { key: "nosotros", label: "Nosotros", icon: Info },
    ];
  }
  if (rol === "Vigilante") {
    return [
      { key: "emergencias", label: "Emergencia / Ingreso", icon: Siren },
      { key: "hospital", label: "Hospital y médicos", icon: Building2 },
    { key: "nosotros", label: "Nosotros", icon: Info },
    ];
  }
  // Paciente o familia: pedir cita y ubicar a su familiar, nada más.
  return [
    { key: "citasFamilia", label: "Citas", icon: User },
    { key: "camasFamilia", label: "Camas", icon: BedDouble },
    { key: "documentos", label: "Documentos", icon: FileText },
    { key: "hospital", label: "Hospital y médicos", icon: Building2 },
    { key: "nosotros", label: "Nosotros", icon: Info },
  ];
}
function seccionInicialPara(rol) {
  if (rol === "Doctor") return "miturno";
  if (rol === "Almacén") return "insumos";
  if (rol === "Vigilante") return "emergencias";
  if (rol === "Jefatura") return "resumen";
  return "citasFamilia";
}

export default function AfintyApp() {
  const [usuarios, setUsuarios] = useState([]);
  const [sesion, setSesion] = useState(null);
  const registrar = (u) => setUsuarios((prev) => [...prev, u]);

  const [section, setSection] = useState("resumen");
  const [alerts, setAlerts] = useState(() => [...generarAlertasDoctores(), ...alertasBase]);
  const [atendidos, setAtendidos] = useState([]);
  const [camas, setCamas] = useState(construirCamasIniciales);
  const [citas, setCitas] = useState(construirCitasIniciales);
  const [correosEnviados, setCorreosEnviados] = useState([]);
  const [entradasMarcadas, setEntradasMarcadas] = useState({});
  const [mensajes, setMensajes] = useState([]);
  const [destinoMensaje, setDestinoMensaje] = useState(null);

  useEffect(() => {
    if (sesion) setSection(seccionInicialPara(sesion.rol));
  }, [sesion]);

  const resolve = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));
  const atender = (p) => setAtendidos((prev) => [p, ...prev]);
  const marcarCorreoEnviado = (id) => setCorreosEnviados((prev) => (prev.includes(id) ? prev : [...prev, id]));

  function marcarEntrada(doctorId) {
    const horaStr = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false });
    const programada = HORA_PROGRAMADA_POR_DOCTOR[doctorId];
    const tarde = esTarde(horaStr, programada);
    setEntradasMarcadas((prev) => ({ ...prev, [doctorId]: { hora: horaStr, tarde } }));
    if (tarde) {
      const doc = DOCTORES.find((d) => d.id === doctorId);
      setAlerts((prev) => [
        { id: `entrada-${doctorId}-${Date.now()}`, sev: "media", area: doc.esp, msg: `${doc.nombre} marcó su entrada a las ${horaStr}, después de su horario programado (${programada}) — notificado a Jefatura.`, time: "Ahora" },
        ...prev,
      ]);
    }
  }
  function ocuparCama(area, idx, datos) {
    setCamas((prev) => ({
      ...prev,
      [area]: prev[area].map((c, i) => (i === idx ? { ocupada: true, dni: datos.dni, nombre: datos.nombre } : c)),
    }));
  }
  function liberarCama(area, idx) {
    setCamas((prev) => ({
      ...prev,
      [area]: prev[area].map((c, i) => (i === idx ? { ocupada: false, dni: null, nombre: null } : c)),
    }));
  }
  const asignarCita = (docId, idx, paciente) =>
    setCitas((prev) => ({
      ...prev,
      [docId]: prev[docId].map((v, i) => (i === idx ? paciente : v)),
    }));
  const liberarCita = (docId, idx) =>
    setCitas((prev) => ({
      ...prev,
      [docId]: prev[docId].map((v, i) => (i === idx ? null : v)),
    }));
  const confirmarCita = (docId, idx) =>
    setCitas((prev) => ({
      ...prev,
      [docId]: prev[docId].map((v, i) => (i === idx && v ? { ...v, nueva: false } : v)),
    }));

  // ---- Mensajería interna ----
  function enviarMensaje(msg) {
    setMensajes((prev) => [msg, ...prev]);
    setAlerts((prev) => [
      { id: `msg-alerta-${msg.id}`, sev: "baja", area: msg.paraArea || "Mensajería", msg: `${msg.deNombre} envió un mensaje a ${msg.paraNombre}: ${msg.asunto}${msg.adjuntos.length ? ` (${msg.adjuntos.length} adjunto${msg.adjuntos.length > 1 ? "s" : ""})` : ""}`, time: "Ahora" },
      ...prev,
    ]);
  }
  const marcarLeido = (id) => setMensajes((prev) => prev.map((m) => (m.id === id ? { ...m, leido: true } : m)));

  // Pacientes con cita agendada, listos para adjuntar a un mensaje.
  const citasDisponibles = useMemo(() => {
    const out = [];
    Object.entries(citas).forEach(([docId, slots]) => {
      const doc = DOCTORES.find((d) => d.id === Number(docId));
      if (!doc) return;
      slots.forEach((p, idx) => {
        if (!p) return;
        out.push({
          key: `${docId}-${idx}`,
          label: `${p.nombre} · ${HORAS_CITAS[idx]} · ${doc.esp}`,
          data: { nombre: p.nombre, dni: p.dni, fecha: p.fecha, hora: HORAS_CITAS[idx], doctor: doc.nombre, esp: doc.esp, celular: p.celular || "" },
        });
      });
    });
    return out.sort((a, b) => a.label.localeCompare(b.label, "es"));
  }, [citas]);

  function escribirA(doctorId) {
    setDestinoMensaje({ paraId: doctorId });
    setSection("mensajes");
  }
  function compartirCita(docId, idx) {
    const doc = DOCTORES.find((d) => d.id === docId);
    const p = citas[docId]?.[idx];
    setDestinoMensaje({
      citaKey: `${docId}-${idx}`,
      asunto: p ? `Paciente ${p.nombre} — ${doc?.esp}` : "Paciente en atención",
    });
    setSection("mensajes");
  }

  // Solicitud automática desde la interfaz de "Paciente o familia": busca el
  // primer horario libre entre los doctores de esa especialidad y lo agenda
  // sin intervención de personal, dejándolo marcado como "Nueva" para el doctor.
  function solicitarCitaAutomatica({ nombre, dni, celular, especialidad }) {
    const doctoresEsp = DOCTORES.filter((d) => DOCTORES_CITAS_IDS.includes(d.id) && d.esp === especialidad);
    for (const doc of doctoresEsp) {
      const slots = citas[doc.id] || [];
      const idx = slots.findIndex((s) => s === null);
      if (idx !== -1) {
        const nuevaCita = { nombre, dni: dni || "Sin DNI", celular, fecha: manana(), nueva: true };
        setCitas((prev) => ({ ...prev, [doc.id]: prev[doc.id].map((v, i) => (i === idx ? nuevaCita : v)) }));
        setAlerts((prev) => [
          { id: `sol-${Date.now()}`, sev: "baja", area: doc.area, msg: `Nueva solicitud de cita: ${nombre} (cel. ${celular}) con ${doc.nombre} el ${manana()} a las ${HORAS_CITAS[idx]}.`, time: "Ahora" },
          ...prev,
        ]);
        return { ok: true, mensaje: `Cita agendada con ${doc.nombre} (${doc.esp}) el ${manana()} a las ${HORAS_CITAS[idx]}. Te contactaremos al ${celular} si hay algún cambio.` };
      }
    }
    return { ok: false, mensaje: `No hay horarios disponibles en ${especialidad} por el momento. Intenta más tarde o llama al hospital.` };
  }

  const areasResumen = AREAS_CAMAS_BASE.map((a) => {
    const estados = camas[a.area] || [];
    return { area: a.area, total: a.total, libres: estados.filter((c) => !c.ocupada).length };
  });

  const now = useMemo(() => new Date().toLocaleString("es-PE", { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" }), []);
  const incidenciasTotal = DOCTORES.reduce((acc, d) => acc + d.asistencia.filter(a => a.estado === "tardanza" || a.estado === "falta").length, 0);

  if (!sesion) {
    return <PantallaAuth usuarios={usuarios} onRegistrar={registrar} onLogin={setSesion} />;
  }

  const navItems = navParaRol(sesion.rol);
  const miDoctor = sesion.rol === "Doctor" ? DOCTORES.find((d) => d.id === sesion.doctorId) : null;
  const miAlmacen = sesion.rol === "Almacén" ? ALMACEN_STAFF.find((p) => p.id === sesion.almacenId) : null;
  const remitente = miDoctor
    ? { id: miDoctor.id, nombre: miDoctor.nombre, esp: miDoctor.esp, area: miDoctor.area }
    : miAlmacen
    ? { id: 10000 + miAlmacen.id, nombre: miAlmacen.nombre, esp: "Almacén y Farmacia", area: "Almacén y Farmacia" }
    : { id: ID_JEFATURA, nombre: sesion.nombre, esp: "Jefatura de Personal", area: "Dirección y Gestión" };
  const sinLeer = mensajes.filter((m) => m.paraId === remitente.id && !m.leido).length;

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: PALETTE.bgApp, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "14px 24px", background: PALETTE.headerGrad, color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <Activity size={22} color="#4FD1C5" />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: 0.3 }}>AFINTY</span>
          <span style={{ fontSize: 11.5, color: "#CDEDE6", fontFamily: "Inter, sans-serif", marginLeft: 4 }}>{HOSPITAL.nombre}</span>
        </div>
        <PulseStrip />
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#CDEDE6", textTransform: "capitalize", flexShrink: 0, marginRight: 16 }}>{now}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: 16 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5 }}>{sesion.nombre} <span style={{ color: "#CDEDE6" }}>· {sesion.rol}{miDoctor ? ` · ${miDoctor.area}` : ""}</span></span>
          <button onClick={() => setSesion(null)} style={{ background: "rgba(255,255,255,0.16)", color: "#fff", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 11.5, fontFamily: "Inter, sans-serif", cursor: "pointer" }}>Cerrar sesión</button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ width: 240, background: "#fff", borderRight: "1px solid #E2E8ED", padding: "20px 12px", flexShrink: 0 }}>
          {navItems.map((n) => {
            const Icon = n.icon;
            const active = section === n.key;
            let count = null;
            if (n.key === "alertas") count = alerts.length;
            if (n.key === "reportes") count = incidenciasTotal;
            if (n.key === "mensajes") count = sinLeer;
            return (
              <button key={n.key} onClick={() => setSection(n.key)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10,
                border: "none", cursor: "pointer", marginBottom: 4, textAlign: "left",
                background: active ? PALETTE.navActiveGrad : "transparent", color: active ? "#fff" : "#3B4652",
                fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: active ? 600 : 500,
              }}>
                <Icon size={17} />
                <span style={{ flex: 1 }}>{n.label}</span>
                {count !== null && count > 0 && (
                  <span style={{ background: active ? "rgba(255,255,255,0.25)" : "#FDEDEA", color: active ? "#fff" : "#C0392B", fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "1px 7px" }}>{count}</span>
                )}
                {active && <ChevronRight size={14} />}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, padding: "28px 32px", maxWidth: 1440, width: "100%", boxSizing: "border-box" }}>
          {section === "resumen" && <VistaResumen alerts={alerts} onResolve={resolve} areasResumen={areasResumen} onEnviarCorreo={marcarCorreoEnviado} correosEnviados={correosEnviados} />}
          {section === "turnos" && <VistaTurnos onEscribir={escribirA} />}
          {section === "miturno" && miDoctor && <VistaMiTurno doctor={miDoctor} entrada={entradasMarcadas[miDoctor.id]} onMarcar={() => marcarEntrada(miDoctor.id)} />}
          {section === "mensajes" && (
            <VistaMensajes
              remitente={remitente}
              mensajes={mensajes}
              onEnviar={enviarMensaje}
              onMarcarLeido={marcarLeido}
              citasDisponibles={citasDisponibles}
              destinoInicial={destinoMensaje}
              onConsumirDestino={() => setDestinoMensaje(null)}
            />
          )}
          {section === "camas" && <VistaCamas camas={camas} onOcupar={ocuparCama} onLiberar={liberarCama} />}
          {section === "citas" && <VistaCitas citas={citas} onAsignar={asignarCita} onLiberar={liberarCita} onConfirmar={confirmarCita} onCompartirCita={compartirCita} />}
          {section === "citasFamilia" && <VistaCitasFamiliaSolicitud especialidades={ESPECIALIDADES_CON_CITAS} onSolicitar={solicitarCitaAutomatica} />}
          {section === "camasFamilia" && <VistaCamasFamilia camas={camas} />}
          {section === "insumos" && <VistaInsumos />}
          {section === "documentos" && <VistaDocumentos />}
          {section === "emergencias" && <VistaEmergencias atendidos={atendidos} onAtender={atender} />}
          {section === "reportes" && <VistaReportes />}
          {section === "alertas" && <VistaAlertas alerts={alerts} onResolve={resolve} onEnviarCorreo={marcarCorreoEnviado} correosEnviados={correosEnviados} />}
          {section === "ia" && <VistaAsistenteIA areasResumen={areasResumen} />}
          {section === "hospital" && <VistaHospital />}
          {section === "nosotros" && <VistaNosotros />}
        </div>
      </div>
    </div>
  );
}
