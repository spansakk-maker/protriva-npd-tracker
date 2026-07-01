// script.js - multi-timezone digital clock
const STORAGE_KEY = 'npd-clock-zones-v1';
const DEFAULT_ZONES = ['Local','UTC','America/New_York','Europe/London','Asia/Tokyo','Australia/Sydney'];

function isLocalLabel(tz){return tz === 'Local'}

function getSavedZones(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_ZONES.slice()}catch(e){return DEFAULT_ZONES.slice()}
}

function saveZones(zones){
  try{localStorage.setItem(STORAGE_KEY, JSON.stringify(zones))}catch(e){console.warn('Could not persist zones', e)}
}

function getAvailableTimeZones(){
  // Prefer the modern API when present
  if(Intl && typeof Intl.supportedValuesOf === 'function'){
    try{
      return Intl.supportedValuesOf('timeZone');
    }catch(e){/* fall through */}
  }
  // Fallback: some common time zones
  return [
    'UTC','Europe/London','Europe/Paris','Europe/Berlin','America/New_York','America/Chicago','America/Denver','America/Los_Angeles','America/Sao_Paulo','Asia/Tokyo','Asia/Shanghai','Asia/Hong_Kong','Asia/Singapore','Asia/Kolkata','Australia/Sydney'
  ];
}

function formatForZone(date, tz){
  if(isLocalLabel(tz)){
    return {
      time: new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(date),
      date: new Intl.DateTimeFormat(undefined,{weekday:'short',year:'numeric',month:'short',day:'numeric'}).format(date)
    };
  }
  try{
    const time = new Intl.DateTimeFormat(undefined,{timeZone:tz,hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(date);
    const dateStr = new Intl.DateTimeFormat(undefined,{timeZone:tz,weekday:'short',year:'numeric',month:'short',day:'numeric'}).format(date);
    return {time, date: dateStr};
  }catch(e){
    return {time:'–',date:'Invalid time zone'};
  }
}

function createClockElement(tz, index, onRemove){
  const el = document.createElement('article');
  el.className = 'clock';
  el.dataset.tz = tz;

  const label = document.createElement('div');
  label.className = 'label';
  const name = document.createElement('div');
  name.className = 'tz-name';
  name.textContent = tz;
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.title = 'Remove this timezone';
  removeBtn.innerHTML = '✕';
  removeBtn.addEventListener('click', ()=>onRemove(tz));
  label.appendChild(name);
  label.appendChild(removeBtn);

  const time = document.createElement('div');
  time.className = 'time';
  time.setAttribute('aria-label', `Time in ${tz}`);

  const date = document.createElement('div');
  date.className = 'date';

  el.appendChild(label);
  el.appendChild(time);
  el.appendChild(date);

  return {el, timeEl: time, dateEl: date};
}

function renderZones(zones){
  const container = document.getElementById('clocks');
  container.innerHTML = '';
  zones.forEach((tz, idx)=>{
    const {el, timeEl, dateEl} = createClockElement(tz, idx, removeZone);
    container.appendChild(el);
    // store refs for updates
    clockRefs.push({tz, timeEl, dateEl, el});
  });
}

function updateClocks(){
  const now = new Date();
  clockRefs.forEach(ref=>{
    const {tz,timeEl,dateEl} = ref;
    const {time,date} = formatForZone(now, tz);
    timeEl.textContent = time;
    dateEl.textContent = date;
  });
}

function addZone(tz){
  if(!tz) return;
  const zones = getSavedZones();
  // Normalize 'local'
  const normalized = (tz.trim() === '' ? 'Local' : tz.trim());
  if(zones.includes(normalized)) return;
  zones.push(normalized);
  saveZones(zones);
  resetClocks();
}

function removeZone(tz){
  let zones = getSavedZones();
  zones = zones.filter(z=>z!==tz);
  saveZones(zones);
  resetClocks();
}

function resetClocks(){
  clockRefs.length = 0;
  const zones = getSavedZones();
  renderZones(zones);
  updateClocks();
}

// Populate timezone datalist/select
function populateTimeZoneList(){
  const list = document.getElementById('tz-list');
  const tzs = getAvailableTimeZones();
  // Add 'Local' and 'UTC' first if not present
  const special = ['Local','UTC'];
  const final = [...special, ...tzs.filter(t=>t!=='UTC')];
  final.forEach(tz=>{
    const opt = document.createElement('option');
    opt.value = tz;
    list.appendChild(opt);
  });
}

// Wiring
const clockRefs = [];

window.addEventListener('load', ()=>{
  populateTimeZoneList();
  const addBtn = document.getElementById('add-btn');
  const input = document.getElementById('tz-input');

  addBtn.addEventListener('click', ()=>{
    addZone(input.value || '');
    input.value = '';
  });

  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      e.preventDefault();
      addZone(input.value || '');
      input.value = '';
    }
  });

  resetClocks();
  // update every 1s, aligned to the second
  const align = 1000 - (Date.now() % 1000);
  setTimeout(()=>{
    updateClocks();
    setInterval(updateClocks, 1000);
  }, align);
});
