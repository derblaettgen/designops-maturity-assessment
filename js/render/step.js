import { state } from '../engine.js';

export function buildStepHeader(section) {
  const totalSteps = state.config.sections.length;
  let html = `<div class="step-head">`;
  html += `<div class="step-number">Abschnitt ${state.currentStep + 1} von ${totalSteps} — ${section.name}</div>`;
  html += `<h2>${section.icon} ${section.title}</h2>`;
  html += `<p>${section.desc}</p>`;
  if (section.note) html += `<div class="study-note">🔬 ${section.note}</div>`;
  html += `</div>`;
  return html;
}
