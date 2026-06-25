const filterButtons = document.querySelectorAll('.filter-btn');
const galleryGrid = document.getElementById('gallery-grid');
const contactForm = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');
const navToggle = document.getElementById('nav-toggle');
const menuLinks = document.querySelectorAll('.menu a');
const galleryModal = document.getElementById('gallery-modal');
const galleryModalImage = document.getElementById('gallery-modal-image');
const galleryModalCaption = document.getElementById('gallery-modal-caption');
const galleryModalThumbs = document.getElementById('gallery-modal-thumbs');
const galleryModalClose = document.getElementById('gallery-modal-close');
const galleryModalPrev = document.getElementById('gallery-modal-prev');
const galleryModalNext = document.getElementById('gallery-modal-next');

const WHATSAPP_NUMBER = '593980380673';

const galleryModalState = {
  images: [],
  index: 0,
  title: '',
};

const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
const saveDataEnabled = Boolean(navigator.connection && navigator.connection.saveData);

if (isSmallScreen || saveDataEnabled) {
  document.body.classList.add('mobile-fast');
}

const revealTargets = document.querySelectorAll('.section, .card, .gallery-card, .contact-card, .advisor-profile');

revealTargets.forEach((element) => {
  element.classList.add('reveal');
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
}

if (navToggle) {
  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.checked = false;
    });
  });
}

function applyFilter(filter) {
  const cards = document.querySelectorAll('.gallery-card');
  cards.forEach((card) => {
    const type = card.getAttribute('data-type');
    const shouldShow = filter === 'todos' || type === filter;
    card.style.display = shouldShow ? 'block' : 'none';
  });
}

function updateFilterPressedState(activeButton) {
  filterButtons.forEach((button) => {
    button.setAttribute('aria-pressed', button === activeButton ? 'true' : 'false');
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    updateFilterPressedState(button);
    applyFilter(button.dataset.filter || 'todos');
  });
});

const initialActiveFilter = document.querySelector('.filter-btn.active');
if (initialActiveFilter) {
  updateFilterPressedState(initialActiveFilter);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseImageCollection(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter(Boolean);
  }

  if (!value) {
    return [];
  }

  const raw = String(value).trim();

  if (!raw) {
    return [];
  }

  if (raw.startsWith('[') && raw.endsWith(']')) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item || '').trim()).filter(Boolean);
      }
    } catch (error) {
      // Si falla el JSON, se usa el parseo por separadores.
    }
  }

  return raw
    .split(/[|,;\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toSentenceCase(value) {
  const clean = String(value || '').trim();
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase() : 'Propiedad';
}

function ensureCardEnhancements() {
  if (!galleryGrid) {
    return;
  }

  const cards = galleryGrid.querySelectorAll('.gallery-card');

  cards.forEach((card) => {
    const imageElement = card.querySelector('img');
    if (!imageElement) {
      return;
    }

    const existingImages = parseImageCollection(card.dataset.images);
    if (!existingImages.length && imageElement.src) {
      card.dataset.images = imageElement.src;
    }

    const body = card.querySelector('.gallery-body');
    if (!body) {
      return;
    }

    if (!body.querySelector('.gallery-more-info')) {
      const infoButton = document.createElement('button');
      infoButton.type = 'button';
      infoButton.className = 'btn btn-main gallery-more-info';
      infoButton.textContent = 'Mas Informacion';
      body.appendChild(infoButton);
    }
  });
}

function renderModalImage() {
  if (!galleryModalImage || !galleryModalCaption || !galleryModalState.images.length) {
    return;
  }

  const safeIndex = ((galleryModalState.index % galleryModalState.images.length) + galleryModalState.images.length) % galleryModalState.images.length;
  galleryModalState.index = safeIndex;

  galleryModalImage.src = galleryModalState.images[safeIndex];
  galleryModalCaption.textContent =
    galleryModalState.title + ' - Imagen ' + (safeIndex + 1) + ' de ' + galleryModalState.images.length;

  const showNav = galleryModalState.images.length > 1;
  if (galleryModalPrev) {
    galleryModalPrev.style.display = showNav ? 'grid' : 'none';
  }
  if (galleryModalNext) {
    galleryModalNext.style.display = showNav ? 'grid' : 'none';
  }

  if (galleryModalThumbs) {
    const thumbButtons = galleryModalThumbs.querySelectorAll('.gallery-thumb-btn');
    thumbButtons.forEach((button) => {
      const thumbIndex = Number(button.dataset.index || '-1');
      button.classList.toggle('is-active', thumbIndex === safeIndex);
      button.setAttribute('aria-pressed', String(thumbIndex === safeIndex));
    });
  }
}

function renderModalThumbs() {
  if (!galleryModalThumbs) {
    return;
  }

  galleryModalThumbs.innerHTML = '';

  if (galleryModalState.images.length <= 1) {
    galleryModalThumbs.style.display = 'none';
    return;
  }

  galleryModalThumbs.style.display = 'flex';

  galleryModalState.images.forEach((imageUrl, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-thumb-btn';
    button.dataset.index = String(index);
    button.setAttribute('aria-label', 'Ver imagen ' + (index + 1));
    button.setAttribute('aria-pressed', 'false');

    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = galleryModalState.title + ' miniatura ' + (index + 1);

    button.appendChild(image);
    galleryModalThumbs.appendChild(button);
  });
}

function openGalleryModal(images, title, initialIndex = 0) {
  if (!galleryModal || !images.length) {
    return;
  }

  galleryModalState.images = images;
  galleryModalState.title = title || 'Propiedad';
  galleryModalState.index = initialIndex;
  renderModalThumbs();
  renderModalImage();
  galleryModal.classList.add('is-open');
  galleryModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
  if (!galleryModal) {
    return;
  }

  galleryModal.classList.remove('is-open');
  galleryModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function sendPropertyInfoToWhatsapp(card) {
  if (!card) {
    return;
  }

  const title = card.querySelector('h4')?.textContent?.trim() || 'Propiedad destacada';
  const description = card.querySelector('p')?.textContent?.trim() || '';
  const priceStatus = card.querySelector('span')?.textContent?.trim() || 'Precio a consultar';
  const propertyType = toSentenceCase(card.getAttribute('data-type'));

  const message =
    'Hola, estoy interesado en esta propiedad.\n' +
    'Tipo: ' +
    propertyType +
    '\n' +
    'Nombre: ' +
    title +
    '\n' +
    'Detalle: ' +
    description +
    '\n' +
    'Referencia: ' +
    priceStatus;

  const whatsappUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  openExternalLink(whatsappUrl);
}

function normalizePropertyType(value) {
  const normalized = String(value || '').toLowerCase();

  if (normalized.includes('depar')) {
    return 'departamento';
  }

  if (normalized.includes('terreno') || normalized.includes('lote')) {
    return 'terreno';
  }

  if (normalized.includes('oficina') || normalized.includes('local')) {
    return 'oficina';
  }

  return 'casa';
}

function getPropertyValue(property, keys) {
  for (const key of keys) {
    if (property[key] !== undefined && property[key] !== null && property[key] !== '') {
      return property[key];
    }
  }

  return '';
}

function formatPrice(value) {
  const numericValue = Number(String(value || '').replace(/[^\d.-]/g, ''));

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return 'Consultar precio';
  }

  return `$${numericValue.toLocaleString('en-US')}`;
}

function renderGalleryProperties(properties) {
  if (!galleryGrid) {
    return;
  }

  galleryGrid.innerHTML = '';

  properties.forEach((property) => {
    const imageValues = parseImageCollection(
      getPropertyValue(property, [
        'Fotos',
        'fotos',
        'Imagenes',
        'imagenes',
        'Imagen',
        'imagen',
        'Foto',
        'foto',
        'Gallery',
        'gallery',
      ])
    );
    const image =
      imageValues[0] ||
      getPropertyValue(property, ['FotoPrincipal', 'foto_principal', 'Cover', 'cover']);
    const title = getPropertyValue(property, ['Titulo', 'Título', 'title', 'Nombre', 'nombre']) || 'Propiedad destacada';
    const description =
      getPropertyValue(property, ['Descripcion', 'Descripción', 'descripcion', 'Detalle', 'detalle']) ||
      'Propiedad disponible con asesoria personalizada de Hogar Grupo Inmobiliario.';
    const status = getPropertyValue(property, ['Estado', 'estado', 'Operacion', 'operacion']) || 'Disponible';
    const type = normalizePropertyType(
      getPropertyValue(property, ['Tipo', 'tipo', 'Categoria', 'categoria', 'TipoInmueble', 'tipo_inmueble']) || title
    );

    const cardMarkup = `
      <article class="gallery-card" data-type="${escapeHtml(type)}" data-images="${escapeHtml((imageValues.length ? imageValues : [image]).join('|'))}">
        <img src="${escapeHtml(image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80')}" alt="${escapeHtml(title)}" loading="lazy" decoding="async" />
        <div class="gallery-body">
          <h4>${escapeHtml(title)}</h4>
          <p>${escapeHtml(description)}</p>
          <span>${escapeHtml(formatPrice(getPropertyValue(property, ['Precio', 'precio'])))} | ${escapeHtml(status)}</span>
          <button type="button" class="btn btn-main gallery-more-info">Mas Informacion</button>
        </div>
      </article>
    `;

    galleryGrid.insertAdjacentHTML('beforeend', cardMarkup);
  });

  const activeFilterButton = document.querySelector('.filter-btn.active');
  applyFilter(activeFilterButton?.dataset.filter || 'todos');
  ensureCardEnhancements();
}

async function loadGalleryFromSupabase() {
  if (!galleryGrid || !window.supabase) {
    return;
  }

  const supabaseUrl = 'https://uhcluuvtcbvygiggbtnv.supabase.co/';
  const supabaseKey = 'sb_publishable_6kBucfZ8kLekaFi9d8fPiA_SC6n2y3z';
  const client = window.supabase.createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await client
      .from('propiedades')
      .select('*')
      .limit(20);

    if (error || !Array.isArray(data) || data.length === 0) {
      return;
    }

    renderGalleryProperties(data.slice(0, 20));
  } catch (error) {
    // Si Supabase no responde, se mantienen las tarjetas estaticas del HTML.
  }
}

loadGalleryFromSupabase();
ensureCardEnhancements();

if (galleryGrid) {
  galleryGrid.addEventListener('click', (event) => {
    const infoButton = event.target.closest('.gallery-more-info');
    if (infoButton) {
      const card = infoButton.closest('.gallery-card');
      sendPropertyInfoToWhatsapp(card);
      return;
    }

    const clickedImage = event.target.closest('.gallery-card img');
    if (!clickedImage) {
      return;
    }

    const card = clickedImage.closest('.gallery-card');
    if (!card) {
      return;
    }

    const images = parseImageCollection(card.dataset.images);
    const fallbackImage = clickedImage.getAttribute('src');
    const imageList = images.length ? images : [fallbackImage];
    const selectedIndex = Math.max(0, imageList.findIndex((url) => url === fallbackImage));
    const title = card.querySelector('h4')?.textContent?.trim() || 'Propiedad';

    openGalleryModal(imageList, title, selectedIndex);
  });
}

galleryModalClose?.addEventListener('click', closeGalleryModal);

galleryModal?.addEventListener('click', (event) => {
  if (event.target === galleryModal) {
    closeGalleryModal();
  }
});

galleryModalThumbs?.addEventListener('click', (event) => {
  const thumbButton = event.target.closest('.gallery-thumb-btn');
  if (!thumbButton) {
    return;
  }

  const index = Number(thumbButton.dataset.index || '-1');
  if (!Number.isInteger(index) || index < 0) {
    return;
  }

  galleryModalState.index = index;
  renderModalImage();
});

galleryModalPrev?.addEventListener('click', () => {
  galleryModalState.index -= 1;
  renderModalImage();
});

galleryModalNext?.addEventListener('click', () => {
  galleryModalState.index += 1;
  renderModalImage();
});

document.addEventListener('keydown', (event) => {
  if (!galleryModal?.classList.contains('is-open')) {
    return;
  }

  if (event.key === 'Escape') {
    closeGalleryModal();
    return;
  }

  if (event.key === 'ArrowLeft') {
    galleryModalState.index -= 1;
    renderModalImage();
  }

  if (event.key === 'ArrowRight') {
    galleryModalState.index += 1;
    renderModalImage();
  }
});

function setFeedback(message, type) {
  if (!feedback) {
    return;
  }

  feedback.textContent = message;
  feedback.classList.remove('ok', 'error');
  if (type) {
    feedback.classList.add(type);
  }
}

function openExternalLink(url) {
  const openedWindow = window.open(url, '_blank', 'noopener,noreferrer');

  if (!openedWindow) {
    window.location.href = url;
  }
}

function validateFormData(data) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9+\s-]{7,15}$/;

  if (!data.nombre || data.nombre.length < 3) {
    return 'Ingresa un nombre valido (minimo 3 caracteres).';
  }

  if (!phonePattern.test(data.telefono)) {
    return 'Ingresa un telefono valido.';
  }

  if (!emailPattern.test(data.correo)) {
    return 'Ingresa un correo electronico valido.';
  }

  if (!data.interes) {
    return 'Selecciona un tipo de interes.';
  }

  if (!data.mensaje || data.mensaje.length < 10) {
    return 'El mensaje debe tener al menos 10 caracteres.';
  }

  return '';
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const submitter = event.submitter;
    const channel = submitter?.dataset.channel || 'whatsapp';
    const formData = new FormData(contactForm);

    const data = {
      nombre: (formData.get('nombre') || '').toString().trim(),
      telefono: (formData.get('telefono') || '').toString().trim(),
      correo: (formData.get('correo') || '').toString().trim(),
      interes: (formData.get('interes') || '').toString().trim(),
      mensaje: (formData.get('mensaje') || '').toString().trim(),
    };

    const validationError = validateFormData(data);

    if (validationError) {
      setFeedback(validationError, 'error');
      return;
    }

    const text =
      'Hola, soy ' +
      data.nombre +
      '. Me interesa: ' +
      data.interes +
      '. Telefono: ' +
      data.telefono +
      '. Correo: ' +
      data.correo +
      '. Mensaje: ' +
      data.mensaje;

    if (channel === 'email') {
      const subject = encodeURIComponent('Solicitud de asesoria inmobiliaria');
      const body = encodeURIComponent(text);
      openExternalLink('mailto:hogargrupoinmobiliarioec@gmail.com?subject=' + subject + '&body=' + body);
      setFeedback('Correo preparado. Revisa tu cliente de email para enviarlo.', 'ok');
      return;
    }

    const whatsappUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
    openExternalLink(whatsappUrl);
    setFeedback('Mensaje listo en WhatsApp. Completa el envio en la ventana abierta.', 'ok');
  });
}
