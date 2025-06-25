// =====================================================
// FUNCIONES COMPARTIDAS (usadas en múltiples páginas)
// =====================================================

// Función para verificar si localStorage está disponible
function isLocalStorageAvailable() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.error('localStorage no está disponible:', e);
    return false;
  }
}

// Efecto de scroll en header (compartido por todas las páginas)
function initHeaderScrollEffect() {
  window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    if (header) {
      if (window.scrollY > 50) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
      } else {
        header.style.background = 'rgba(0, 0, 0, 0.8)';
      }
    }
  });
}

// =====================================================
// FUNCIONES ESPECÍFICAS PARA INDEX (/)
// =====================================================

// Animación de entrada para las tarjetas de características
function initFeatureCardsAnimation() {
  const cards = document.querySelectorAll('.feature-card');
  if (cards.length > 0) {
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.animation = `fadeInUp 0.6s ease-out`;
      }, index * 200);
    });
  }
}

// Inicializar funciones específicas de index
function initIndexPage() {
  window.addEventListener('load', function () {
    initFeatureCardsAnimation();
  });
}

// =====================================================
// FUNCIONES ESPECÍFICAS PARA FORM (/form/)
// =====================================================

// Mostrar mensaje de éxito
function showSuccessMessage() {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = '¡Solicitud enviada con éxito!';
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #28a745, #20c997);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    animation: slideInRight 0.5s ease-out;
  `;

  document.body.appendChild(successDiv);

  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.remove();
    }
  }, 3000);
}

// Mostrar mensaje de error
function showErrorMessage(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `ERROR: ${message}`;
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #dc3545, #e74c3c);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    animation: slideInRight 0.5s ease-out;
  `;

  document.body.appendChild(errorDiv);

  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 4000);
}

// Validar formulario
function validateForm(formData) {
  const errors = [];

  if (!formData.get('songTitle') || formData.get('songTitle').trim() === '') {
    errors.push('El título de la canción es requerido');
  }

  if (!formData.get('artist') || formData.get('artist').trim() === '') {
    errors.push('El artista es requerido');
  }

  if (!formData.get('genre') || formData.get('genre').trim() === '') {
    errors.push('El género es requerido');
  }

  if (!formData.get('requester') || formData.get('requester').trim() === '') {
    errors.push('El nombre del solicitante es requerido');
  }

  return errors;
}

// Manejo del formulario de solicitud
function initFormHandler() {
  const form = document.getElementById('song-request-form');

  if (!form) {
    console.log('Formulario no encontrado');
    return;
  }

  console.log('Formulario encontrado, inicializando evento submit');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('Formulario enviado');

    // Verificar si localStorage está disponible
    if (!isLocalStorageAvailable()) {
      showErrorMessage('No se puede guardar la solicitud. localStorage no está disponible.');
      return;
    }

    const formData = new FormData(this);

    // Validar formulario
    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
      showErrorMessage(validationErrors.join(', '));
      return;
    }

    // Crear objeto de solicitud
    const songRequest = {
      id: Date.now(),
      songTitle: formData.get('songTitle').trim(),
      artist: formData.get('artist').trim(),
      album: formData.get('album') ? formData.get('album').trim() : '',
      genre: formData.get('genre').trim(),
      requester: formData.get('requester').trim(),
      message: formData.get('message') ? formData.get('message').trim() : '',
      timestamp: new Date().toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      // Obtener solicitudes existentes o crear array vacío
      let songRequests = [];
      const existingRequests = localStorage.getItem('songRequests');

      if (existingRequests) {
        songRequests = JSON.parse(existingRequests);
        // Verificar que sea un array válido
        if (!Array.isArray(songRequests)) {
          songRequests = [];
        }
      }

      // Agregar nueva solicitud
      songRequests.push(songRequest);

      // Guardar en localStorage
      localStorage.setItem('songRequests', JSON.stringify(songRequests));

      console.log('Solicitud guardada:', songRequest);
      console.log('Total de solicitudes:', songRequests.length);

      // Limpiar formulario
      this.reset();

      // Mostrar mensaje de éxito
      showSuccessMessage();

      // Redirigir a la lista después de 2 segundos
      setTimeout(() => {
        window.location.href = '/list/';
      }, 2000);
    } catch (error) {
      console.error('Error al guardar la solicitud:', error);
      showErrorMessage('Error al guardar la solicitud. Inténtalo de nuevo.');
    }
  });
}

// Animación de entrada para el formulario
function initFormAnimation() {
  const formContainer = document.querySelector('.form-container');
  if (formContainer) {
    window.addEventListener('load', function () {
      formContainer.style.animation = 'fadeInUp 0.8s ease-out';
    });
  }
}

// Inicializar funciones específicas de form
function initFormPage() {
  console.log('Inicializando página de formulario');
  initFormHandler();
  initFormAnimation();
}

// =====================================================
// FUNCIONES ESPECÍFICAS PARA LIST (/list/)
// =====================================================

// Cargar y mostrar solicitudes
function loadSongRequests() {
  const songList = document.getElementById('song-list');

  if (!songList) {
    console.log('Elemento song-list no encontrado');
    return;
  }

  if (!isLocalStorageAvailable()) {
    songList.innerHTML = `
      <div class="song-item empty-state" style="text-align: center; padding: 40px; background: rgba(255, 255, 255, 0.1); border-radius: 15px; margin: 20px 0;">
        <h3>Error de almacenamiento</h3>
        <p>No se pueden cargar las solicitudes. localStorage no está disponible.</p>
      </div>
    `;
    return;
  }

  try {
    let songRequests = [];
    const existingRequests = localStorage.getItem('songRequests');

    if (existingRequests) {
      songRequests = JSON.parse(existingRequests);
      // Verificar que sea un array válido
      if (!Array.isArray(songRequests)) {
        songRequests = [];
      }
    }

    console.log('Solicitudes cargadas:', songRequests.length);

    if (songRequests.length === 0) {
      songList.innerHTML = `
        <div class="song-item empty-state" style="text-align: center; padding: 40px; background: rgba(255, 255, 255, 0.1); border-radius: 15px; margin: 20px 0;">
          <h3>No hay solicitudes</h3>
          <p>¡Aún no hay canciones solicitadas! Sé el primero en hacer una solicitud.</p>
        </div>
      `;
    } else {
      songRequests.forEach(request => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerHTML = `
          <h3>${request.songTitle}</h3>
          <p><strong>Artista:</strong> ${request.artist}</p>
          <p><strong>Género:</strong> ${request.genre}</p>
          <p><strong>Solicitado por:</strong> ${request.requester}</p>
          <p><strong>Mensaje:</strong> ${request.message || 'N/A'}</p>
          <small><strong>Fecha:</strong> ${request.timestamp}</small>
        `;
        songList.appendChild(songItem);
      });
    }
  } catch (error) {
    console.error('Error al cargar las solicitudes:', error);
    songList.innerHTML = `
      <div class="song-item empty-state" style="text-align: center; padding: 40px; background: rgba(255, 255, 255, 0.1); border-radius: 15px; margin: 20px 0;">
        <h3>Error al cargar solicitudes</h3>
        <p>No se pudo cargar las solicitudes correctamente.</p>
      </div>
    `;
  }
}

// Inicializar funciones específicas de list
function initListPage() {
  console.log('Inicializando página de lista');
  loadSongRequests();
}
