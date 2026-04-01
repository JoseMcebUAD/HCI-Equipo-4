# Requisitos No Funcionales – Recalendarización de Citas

---

## 1. Visibilidad de funciones principales (UX Clarity & Discoverability)

**Definición formal:**  
El sistema debe garantizar que todas las funciones críticas del proceso de recalendarización (consultar disponibilidad, cambiar horario, confirmar cambios, cancelar/revertir) sean visibles, accesibles y comprensibles sin entrenamiento previo.

**Criterios de aceptación:**
- Cada acción debe tener:
  - etiqueta clara (ej. "Reprogramar cita", no ambigua),
  - iconografía consistente,
  - feedback inmediato (hover, estado activo, confirmación).
- El sistema debe mostrar estados explícitos:
  - disponible / ocupado / conflicto / recomendado.
- Debe existir confirmación visual antes de aplicar cambios (modal o resumen).

---

## 2. Prevención de conflictos de agenda (Consistency & Constraint Enforcement)

**Definición formal:**  
El sistema debe impedir la generación de conflictos temporales entre terapeutas, pacientes y salas, aplicando validaciones automáticas en tiempo real durante la recalendarización.

**Criterios de aceptación:**
- No se puede confirmar una cita si existe:
  - traslape de horario en terapeuta, paciente o sala,
  - duplicidad de cita en el mismo intervalo.
- Las validaciones deben ejecutarse en tiempo real (≤ 300 ms) al seleccionar un horario.
- Los conflictos deben representarse visualmente:
  - bloqueo del slot,
  - mensaje contextual explicativo.
- El sistema debe sugerir automáticamente alternativas válidas cuando exista conflicto.

---

## 3. Visibilidad total del estado del sistema (System Transparency & Decision Support)

**Definición formal:**  
El sistema debe proporcionar una visualización completa, actualizada y contextualizada de todas las variables relevantes para la recalendarización, facilitando la toma de decisiones del usuario administrativo.

**Criterios de aceptación:**
- El usuario debe poder visualizar simultáneamente:
  - disponibilidad de terapeutas,
  - ocupación de salas,
  - agenda del paciente.
- Deben mostrarse:
  - horarios ocupados y libres,
  - restricciones (especialidad, tipo de cita, duración),
  - sugerencias óptimas (basadas en disponibilidad).
- Las recomendaciones deben estar priorizadas (ej. mejor ajuste primero).
- La información debe actualizarse en tiempo real tras cualquier cambio.
