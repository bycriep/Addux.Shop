import { showNotification } from './core.js';

let events = JSON.parse(localStorage.getItem('events')) || [
    { id: 'event-1', title: 'Sorteo de Navidad', description: 'Gana un mes gratis de Prime Video participando en nuestro sorteo.', date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), participateUrl: 'https://wa.me/51971541408?text=Quiero%20participar%20en%20el%20sorteo', media: { type: 'image', src: 'https://via.placeholder.com/150?text=Sorteo' } }
];

// Guardar los datos predeterminados en localStorage si no existen
if (!localStorage.getItem('events')) {
    localStorage.setItem('events', JSON.stringify(events));
}

function renderEvents(isAdminStatus) {
    console.log('Renderizando eventos...');
    console.log('Eventos:', events);
    const container = document.querySelector('#oferta .event-list');
    if (!container) {
        console.log('Contenedor de eventos no encontrado');
        return;
    }

    container.innerHTML = '';
    const now = new Date().getTime();
    events = events.filter(event => new Date(event.date).getTime() > now);
    localStorage.setItem('events', JSON.stringify(events));

    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.setAttribute('data-id', event.id);
        const isEditing = event.isEditing || false;
        let mediaHtml = '<p>Sin multimedia</p>';
        if (event.media && event.media.src) {
            if (event.media.type === 'image') {
                mediaHtml = `<img src="${event.media.src}" alt="${event.title}">`;
            } else if (event.media.type === 'video') {
                mediaHtml = `<video src="${event.media.src}" controls preload="metadata"></video>`;
            }
        }
        const eventDate = new Date(event.date);
        const timeLeft = eventDate.getTime() - now;
        const timerText = timeLeft > 0 ? `Falta: ${Math.floor(timeLeft / (1000 * 60 * 60))}h ${Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))}m ${Math.floor((timeLeft % (1000 * 60)) / 1000)}s` : 'Oferta terminada';

        eventElement.innerHTML = `
            <div class="event-media">${mediaHtml}</div>
            <div class="event-info">
                <h3 class="name" style="display: ${isEditing ? 'none' : 'block'}">${event.title}</h3>
                <div class="name-input" style="display: ${isEditing ? 'block' : 'none'}">
                    <input type="text" value="${event.title}" placeholder="Título de la oferta" aria-label="Editar título de la oferta">
                </div>
                <p class="description" style="display: ${isEditing ? 'none' : 'block'}">${event.description}</p>
                <div class="description-input" style="display: ${isEditing ? 'block' : 'none'}">
                    <textarea placeholder="Descripción de la oferta" aria-label="Editar descripción de la oferta">${event.description}</textarea>
                </div>
                <p class="event-date" style="display: ${isEditing ? 'none' : 'block'}">Fecha: ${eventDate.toLocaleString()}</p>
                <div class="date-input" style="display: ${isEditing ? 'block' : 'none'}">
                    <input type="datetime-local" value="${event.date.slice(0, 16)}" aria-label="Editar fecha de la oferta">
                </div>
                <p class="event-timer" style="display: ${isEditing ? 'none' : 'block'}" id="event-timer-${event.id}">${timerText}</p>
                <div class="participate-url-input" style="display: ${isEditing ? 'block' : 'none'}">
                    <input type="text" value="${event.participateUrl}" placeholder="URL para participar" aria-label="Editar URL de participación">
                </div>
                <div class="media-input" style="display: ${isEditing ? 'block' : 'none'}">
                    <label>Subir foto o video:</label>
                    <input type="file" accept="image/*,video/*" aria-label="Subir imagen o video para la oferta">
                    <input type="text" class="media-url-input" placeholder="O ingresa una URL de imagen/video" value="${event.media && event.media.src ? event.media.src : ''}" aria-label="Ingresar URL de imagen o video para la oferta">
                </div>
                <div class="event-buttons">
                    <button class="participate-btn" style="display: ${isEditing ? 'none' : 'inline-block'}" aria-label="Participar en ${event.title}">Participar</button>
                    <button class="edit-btn admin-only" style="display: ${isEditing ? 'none' : 'inline-block'}">Editar</button>
                    <button class="delete-btn admin-only" style="display: ${isEditing ? 'none' : 'inline-block'}">Eliminar</button>
                    <button class="save-btn admin-only" style="display: ${isEditing ? 'inline-block' : 'none'}">Guardar</button>
                    <button class="cancel-btn admin-only" style="display: ${isEditing ? 'inline-block' : 'none'}">Cancelar</button>
                </div>
            </div>
        `;
        container.appendChild(eventElement);

        // Asignar eventos dinámicamente
        const participateBtn = eventElement.querySelector('.participate-btn');
        const editBtn = eventElement.querySelector('.edit-btn');
        const deleteBtn = eventElement.querySelector('.delete-btn');
        const saveBtn = eventElement.querySelector('.save-btn');
        const cancelBtn = eventElement.querySelector('.cancel-btn');
        const nameInput = eventElement.querySelector('.name-input input');
        const descriptionInput = eventElement.querySelector('.description-input textarea');
        const dateInput = eventElement.querySelector('.date-input input');
        const participateUrlInput = eventElement.querySelector('.participate-url-input input');
        const mediaFileInput = eventElement.querySelector('.media-input input[type="file"]');
        const mediaUrlInput = eventElement.querySelector('.media-url-input');

        if (participateBtn) participateBtn.addEventListener('click', () => window.open(event.participateUrl, '_blank'));
        if (editBtn) editBtn.addEventListener('click', () => editEvent(event.id, isAdminStatus));
        if (deleteBtn) deleteBtn.addEventListener('click', () => deleteEvent(event.id, isAdminStatus));
        if (saveBtn) saveBtn.addEventListener('click', () => saveEvent(event.id, isAdminStatus));
        if (cancelBtn) cancelBtn.addEventListener('click', () => cancelEventEdit(event.id, isAdminStatus));
        if (nameInput) nameInput.addEventListener('change', (e) => updateEventField(event.id, 'title', e.target.value, isAdminStatus));
        if (descriptionInput) descriptionInput.addEventListener('change', (e) => updateEventField(event.id, 'description', e.target.value, isAdminStatus));
        if (dateInput) dateInput.addEventListener('change', (e) => updateEventField(event.id, 'date', e.target.value, isAdminStatus));
        if (participateUrlInput) participateUrlInput.addEventListener('change', (e) => updateEventField(event.id, 'participateUrl', e.target.value, isAdminStatus));
        if (mediaFileInput) mediaFileInput.addEventListener('change', () => updateEventMedia(event.id, 'file', mediaFileInput, isAdminStatus));
        if (mediaUrlInput) mediaUrlInput.addEventListener('change', (e) => updateEventMedia(event.id, 'url', e.target, isAdminStatus));
    });

    events.forEach(event => {
        const timerElement = document.getElementById(`event-timer-${event.id}`);
        if (timerElement) {
            const updateTimer = () => {
                const eventDate = new Date(event.date).getTime();
                const currentTime = new Date().getTime();
                const timeLeft = eventDate - currentTime;
                if (timeLeft <= 0) {
                    timerElement.textContent = 'Oferta terminada';
                    return;
                }
                const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                timerElement.textContent = `Falta: ${hours}h ${minutes}m ${seconds}s`;
            };
            setInterval(updateTimer, 1000);
            updateTimer();
        }
    });
}

function addNewEvent(isAdminStatus) {
    if (!isAdminStatus) {
        showNotification('Acceso denegado: Solo los administradores pueden añadir ofertas.');
        return;
    }
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const formattedDate = tomorrow.toISOString().slice(0, 16);
    const newEvent = {
        id: `event-${Date.now()}`,
        title: '',
        description: '',
        date: formattedDate,
        participateUrl: '',
        media: null,
        isEditing: true
    };
    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));
    renderEvents(isAdminStatus);
}

function editEvent(id, isAdminStatus) {
    if (!isAdminStatus) {
        showNotification('Acceso denegado: Solo los administradores pueden editar ofertas.');
        return;
    }
    const event = events.find(e => e.id === id);
    if (event) {
        event.isEditing = true;
        localStorage.setItem('events', JSON.stringify(events));
        renderEvents(isAdminStatus);
    }
}

function saveEvent(id, isAdminStatus) {
    if (!isAdminStatus) {
        showNotification('Acceso denegado: Solo los administradores pueden guardar ofertas.');
        return;
    }
    const eventElement = document.querySelector(`.event[data-id="${id}"]`);
    const event = events.find(e => e.id === id);
    if (event) {
        event.title = eventElement.querySelector('.name-input input').value;
        event.description = eventElement.querySelector('.description-input textarea').value;
        event.date = eventElement.querySelector('.date-input input').value;
        event.participateUrl = eventElement.querySelector('.participate-url-input input').value;
        const mediaFile = eventElement.querySelector('.media-input input[type="file"]').files[0];
        const mediaUrl = eventElement.querySelector('.media-url-input').value;
        event.isEditing = false;

        if (mediaFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                event.media = { type: mediaFile.type.startsWith('video') ? 'video' : 'image', src: event.target.result };
                localStorage.setItem('events', JSON.stringify(events));
                renderEvents(isAdminStatus);
                showNotification('Oferta guardada con éxito');
            };
            reader.readAsDataURL(mediaFile);
        } else if (mediaUrl) {
            event.media = { type: mediaUrl.includes('.mp4') || mediaUrl.includes('.webm') ? 'video' : 'image', src: mediaUrl };
            localStorage.setItem('events', JSON.stringify(events));
            renderEvents(isAdminStatus);
            showNotification('Oferta guardada con éxito');
        } else {
            localStorage.setItem('events', JSON.stringify(events));
            renderEvents(isAdminStatus);
            showNotification('Oferta guardada con éxito');
        }
    }
}

function cancelEventEdit(id, isAdminStatus) {
    if (!isAdminStatus) {
        showNotification('Acceso denegado: Solo los administradores pueden cancelar ediciones.');
        return;
    }
    const event = events.find(e => e.id === id);
    if (event) {
        if (!event.title && !event.description && !event.date && !event.participateUrl) {
            events = events.filter(e => e.id !== id);
        } else {
            event.isEditing = false;
        }
        localStorage.setItem('events', JSON.stringify(events));
        renderEvents(isAdminStatus);
        showNotification('Edición cancelada');
    }
}

function deleteEvent(id, isAdminStatus) {
    if (!isAdminStatus) {
        showNotification('Acceso denegado: Solo los administradores pueden eliminar ofertas.');
        return;
    }
    events = events.filter(e => e.id !== id);
    localStorage.setItem('events', JSON.stringify(events));
    renderEvents(isAdminStatus);
    showNotification('Oferta eliminada');
}

function updateEventField(id, field, value, isAdminStatus) {
    const event = events.find(e => e.id === id);
    if (event) {
        event[field] = value;
        localStorage.setItem('events', JSON.stringify(events));
        renderEvents(isAdminStatus);
        showNotification('Oferta actualizada');
    }
}

function updateEventMedia(id, type, element, isAdminStatus) {
    const event = events.find(e => e.id === id);
    if (event) {
        if (type === 'file' && element.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                event.media = { type: element.files[0].type.startsWith('video') ? 'video' : 'image', src: event.target.result };
                localStorage.setItem('events', JSON.stringify(events));
                renderEvents(isAdminStatus);
                showNotification('Multimedia actualizada');
            };
            reader.readAsDataURL(element.files[0]);
        } else if (type === 'url' && element.value) {
            event.media = { type: element.value.includes('.mp4') || element.value.includes('.webm') ? 'video' : 'image', src: element.value };
            localStorage.setItem('events', JSON.stringify(events));
            renderEvents(isAdminStatus);
            showNotification('Multimedia actualizada');
        }
    }
}

export {
    renderEvents,
    addNewEvent,
    editEvent,
    saveEvent,
    cancelEventEdit,
    deleteEvent,
    updateEventField,
    updateEventMedia
};