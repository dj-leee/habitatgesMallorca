const list      = document.getElementById('items-list');
const map       = document.getElementById('google-map');
const badge     = document.getElementById('count-badge');

const PAGE_SIZE = 40;
let data        = [];
let page        = 0;

function createCard(item, index) {
  const li = document.createElement('li');
  li.className = 'card';
  li.dataset.index = index;
  li.dataset.address = item.address ?? '';
  li.innerHTML = `<strong>${item.name}</strong><span>${item.location}</span>`;
  return li;
}

function loadMore() {
  const batch = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  if (!batch.length) return;

  const fragment = document.createDocumentFragment();
  batch.forEach((item, i) => fragment.appendChild(createCard(item, page * PAGE_SIZE + i)));
  list.appendChild(fragment);
  page++;
}

// Infinite scroll
list.addEventListener('scroll', () => {
  if (list.scrollTop + list.clientHeight >= list.scrollHeight - 200) loadMore();
});

// Click en card → actualizar mapa
list.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (!card) return;

  list.querySelector('.active')?.classList.remove('active');
  card.classList.add('active');

  const query = encodeURIComponent(card.dataset.address);
  map.src = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
});

// Cargar datos
fetch('./motorUpdate.json')
  .then(r => r.json())
  .then(json => {
    data = json;
    badge.textContent = `${data.length.toLocaleString('es-ES')} alojamientos`;
    list.innerHTML = ''; // quitar skeletons
    loadMore();
  })
  .catch(() => {
    list.innerHTML = '<li class="error">⚠️ No se pudo cargar el JSON. Usa un servidor local.</li>';
  });