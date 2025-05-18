import { showNotification } from './core.js';

let communityLinks = JSON.parse(localStorage.getItem('communityLinks')) || [
    { id: 'whatsapp-grupo-default', platform: 'whatsapp', type: 'channel', text: 'WhatsApp Grupo (Ejemplo)', url: 'https://wa.me/51971541408', media: { type: 'image', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png' } },
    { id: 'telegram-canal-default', platform: 'telegram', type: 'channel', text: 'Canal Telegram Avisos (Ejemplo)', url: 'https://t.me/canalavisos', media: { type: 'image', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/1200px-Telegram_logo.svg.png' } }
];

if (!localStorage.getItem('communityLinks')) {
    localStorage.setItem('communityLinks', JSON.stringify(communityLinks));
}

let contactButtons = JSON.parse(localStorage.getItem('contactButtons')) || [
    { id: 'whatsapp-contact-default', text: 'WhatsApp (Ejemplo)', url: 'https://wa.me/51971541408', media: { type: 'image', src: 'IMAGES/logo_whatsap.png' } }
];

if (!localStorage.getItem('contactButtons')) {
    localStorage.setItem('contactButtons', JSON.stringify(contactButtons));
}

// --- RENDER FUNCTIONS (Assumed to be largely similar to original, with robust handling of isEditing) ---
function renderCommunityLinks(isAdminStatus) {
    const containers = {
        'whatsapp-channels': document.getElementById('whatsapp-channels'),
        'whatsapp-bots': document.getElementById('whatsapp-bots'),
        'telegram-channels': document.getElementById('telegram-channels'),
        'telegram-bots': document.getElementById('telegram-bots'),
    };

    for (const key in containers) {
        if (containers[key]) containers[key].innerHTML = '';
    }

    communityLinks.forEach(link => {
        const container = link.platform === 'whatsapp' ? (link.type === 'channel' ? containers['whatsapp-channels'] : containers['whatsapp-bots']) :
                                                        (link.type === 'channel' ? containers['telegram-channels'] : containers['telegram-bots']);
        if (!container) return;

        const linkElement = document.createElement('div');
        linkElement.classList.add('community-link');
        linkElement.setAttribute('data-id', link.id);
        const isEditing = link.isEditing || false;

        let mediaHtml = '';
        if (link.media && link.media.src) {
            if (link.media.type === 'image') {
                mediaHtml = `<img src="${link.media.src}" alt="${link.text || 'media'}">`;
            } else if (link.media.type === 'video') {
                mediaHtml = `<video src="${link.media.src}" controls preload="metadata"></video>`;
            }
        }

        linkElement.innerHTML = `
            <div class="link-media-display" style="display: ${isEditing ? 'none' : 'flex'}">${mediaHtml || '<p class="no-media">Sin multimedia</p>'}</div>
            <div class="link-text-display" style="display: ${isEditing ? 'none' : 'block'}">
                <a href="${link.url || '#'}" target="_blank">${link.text || 'Enlace sin título'}</a>
            </div>
            
            ${isAdminStatus ? `
            <div class="link-input" style="display: ${isEditing ? 'block' : 'none'}">
                <input type="text" class="text-input" value="${link.text || ''}" placeholder="Texto del enlace">
                <input type="text" class="url-input" value="${link.url || ''}" placeholder="URL del enlace">
                <label>URL de imagen/video:</label>
                <input type="text" class="media-url-input" placeholder="https://ejemplo.com/imagen.png" value="${(link.media && link.media.src) || ''}">
                <label>O subir archivo:</label>
                <input type="file" class="media-file-input" accept="image/*,video/*">
            </div>
            <div class="button-group admin-only">
                <button class="edit-link-btn" style="display: ${isEditing ? 'none' : 'inline-block'}">Editar</button>
                <button class="delete-link-btn" style="display: ${isEditing ? 'none' : 'inline-block'}">Eliminar</button>
                <button class="save-link-btn" style="display: ${isEditing ? 'inline-block' : 'none'}">Guardar</button>
                <button class="cancel-link-btn" style="display: ${isEditing ? 'inline-block' : 'none'}">Cancelar</button>
            </div>
            ` : ''}
        `;
        container.appendChild(linkElement);

        if (isAdminStatus) {
            linkElement.querySelector('.edit-link-btn')?.addEventListener('click', () => editLink(link.id, isAdminStatus));
            linkElement.querySelector('.delete-link-btn')?.addEventListener('click', () => deleteLink(link.id, isAdminStatus));
            linkElement.querySelector('.save-link-btn')?.addEventListener('click', () => saveLink(link.id, isAdminStatus));
            linkElement.querySelector('.cancel-link-btn')?.addEventListener('click', () => cancelLinkEdit(link.id, isAdminStatus));
        }
    });
}

function renderContactButtons(isAdminStatus) {
    const buttonsContainer = document.getElementById('contact-buttons');
    if (!buttonsContainer) return;
    buttonsContainer.innerHTML = '';

    contactButtons.forEach(button => {
        const buttonElement = document.createElement('div');
        buttonElement.classList.add('contact-button-item'); // Changed class for clarity
        buttonElement.setAttribute('data-id', button.id);
        const isEditing = button.isEditing || false;

        let mediaHtml = '';
        if (button.media && button.media.src) {
            if (button.media.type === 'image') {
                mediaHtml = `<img src="${button.media.src}" alt="${button.text || 'media'}" style="width: 30px; height: 30px; margin-right: 8px;">`;
            } else if (button.media.type === 'video') {
                mediaHtml = `<video src="${button.media.src}" controls preload="metadata" style="width: 30px; height: 30px; margin-right: 8px;"></video>`;
            }
        }

        buttonElement.innerHTML = `
            <div class="contact-button-display" style="display: ${isEditing ? 'none' : 'flex'}; align-items: center;">
                <a href="${button.url || '#'}" target="_blank">${mediaHtml}${button.text || 'Botón sin título'}</a>
            </div>
            
            ${isAdminStatus ? `
            <div class="button-input" style="display: ${isEditing ? 'block' : 'none'}">
                <input type="text" class="text-input" value="${button.text || ''}" placeholder="Texto del botón">
                <input type="text" class="url-input" value="${button.url || ''}" placeholder="URL del botón">
                <label>URL de imagen/video:</label>
                <input type="text" class="media-url-input" placeholder="https://ejemplo.com/imagen.png" value="${(button.media && button.media.src) || ''}">
                <label>O subir archivo:</label>
                <input type="file" class="media-file-input" accept="image/*,video/*">
            </div>
            <div class="button-group admin-only">
                <button class="edit-contact-btn" style="display: ${isEditing ? 'none' : 'inline-block'}">Editar</button>
                <button class="delete-contact-btn" style="display: ${isEditing ? 'none' : 'inline-block'}">Eliminar</button>
                <button class="save-contact-btn" style="display: ${isEditing ? 'inline-block' : 'none'}">Guardar</button>
                <button class="cancel-contact-btn" style="display: ${isEditing ? 'inline-block' : 'none'}">Cancelar</button>
            </div>
            ` : ''}
        `;
        buttonsContainer.appendChild(buttonElement);

        if (isAdminStatus) {
            buttonElement.querySelector('.edit-contact-btn')?.addEventListener('click', () => editContactButton(button.id, isAdminStatus));
            buttonElement.querySelector('.delete-contact-btn')?.addEventListener('click', () => deleteContactButton(button.id, isAdminStatus));
            buttonElement.querySelector('.save-contact-btn')?.addEventListener('click', () => saveContactButton(button.id, isAdminStatus));
            buttonElement.querySelector('.cancel-contact-btn')?.addEventListener('click', () => cancelContactButtonEdit(button.id, isAdminStatus));
        }
    });
}

// --- ADD FUNCTIONS ---
function addNewLink(platform, type, isAdminStatus) {
    const newLinkId = `link-${Date.now()}`;
    communityLinks.push({
        id: newLinkId,
        platform: platform,
        type: type,
        text: '',
        url: '',
        media: null,
        isEditing: true,
        isNew: true 
    });
    localStorage.setItem('communityLinks', JSON.stringify(communityLinks));
    renderCommunityLinks(isAdminStatus);
    showNotification(`Nuevo campo para ${type} de ${platform} añadido. Edita los detalles.`);
}

function addNewContactButton(isAdminStatus) {
    const newButtonId = `contact-btn-${Date.now()}`;
    contactButtons.push({
        id: newButtonId,
        text: '',
        url: '',
        media: null,
        isEditing: true,
        isNew: true
    });
    localStorage.setItem('contactButtons', JSON.stringify(contactButtons));
    renderContactButtons(isAdminStatus);
    showNotification('Nuevo campo para botón de contacto añadido. Edita los detalles.');
}

// --- EDIT/SAVE/CANCEL/DELETE LINKS ---
function editLink(id, isAdminStatus) {
    if (!isAdminStatus) return;
    const link = communityLinks.find(l => l.id === id);
    if (link) {
        link.originalData = { ...link }; // Store original data for cancellation
        link.isEditing = true;
        renderCommunityLinks(isAdminStatus);
    }
}

async function saveLink(id, isAdminStatus) {
    if (!isAdminStatus) return;
    const linkElement = document.querySelector(`.community-link[data-id="${id}"]`);
    const link = communityLinks.find(l => l.id === id);
    if (link && linkElement) {
        link.text = linkElement.querySelector('.text-input').value;
        link.url = linkElement.querySelector('.url-input').value;
        const mediaUrl = linkElement.querySelector('.media-url-input').value;
        const mediaFile = linkElement.querySelector('.media-file-input').files[0];

        link.isEditing = false;
        delete link.isNew;
        delete link.originalData;

        const saveAndRender = () => {
            localStorage.setItem('communityLinks', JSON.stringify(communityLinks));
            renderCommunityLinks(isAdminStatus);
            showNotification('Enlace guardado.');
        };

        if (mediaFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                link.media = { type: mediaFile.type.startsWith('video') ? 'video' : 'image', src: event.target.result };
                saveAndRender();
            };
            reader.onerror = () => { showNotification('Error al leer el archivo.'); saveAndRender(); /* Save without new media */ };
            reader.readAsDataURL(mediaFile);
        } else if (mediaUrl) {
            link.media = { type: mediaUrl.includes('.mp4') || mediaUrl.includes('.webm') || mediaUrl.includes('video') ? 'video' : 'image', src: mediaUrl };
            saveAndRender();
        } else {
            link.media = null; // Clear media if both are empty
            saveAndRender();
        }
    } else {
      showNotification('Error: No se pudo guardar el enlace.');
    }
}

function cancelLinkEdit(id, isAdminStatus) {
    const linkIndex = communityLinks.findIndex(l => l.id === id);
    if (linkIndex !== -1) {
        const link = communityLinks[linkIndex];
        if (link.isNew) {
            communityLinks.splice(linkIndex, 1);
        } else if (link.originalData) {
            communityLinks[linkIndex] = { ...link.originalData, isEditing: false };
            delete communityLinks[linkIndex].originalData;
        } else {
            link.isEditing = false; // Fallback
        }
        localStorage.setItem('communityLinks', JSON.stringify(communityLinks));
        renderCommunityLinks(isAdminStatus);
        showNotification('Cambios cancelados.');
    }
}

function deleteLink(id, isAdminStatus) {
    if (!isAdminStatus) return;
    communityLinks = communityLinks.filter(l => l.id !== id);
    localStorage.setItem('communityLinks', JSON.stringify(communityLinks));
    renderCommunityLinks(isAdminStatus);
    showNotification('Enlace eliminado.');
}

// --- EDIT/SAVE/CANCEL/DELETE CONTACT BUTTONS ---
function editContactButton(id, isAdminStatus) {
    if (!isAdminStatus) return;
    const button = contactButtons.find(b => b.id === id);
    if (button) {
        button.originalData = { ...button };
        button.isEditing = true;
        renderContactButtons(isAdminStatus);
    }
}

async function saveContactButton(id, isAdminStatus) {
    if (!isAdminStatus) return;
    const buttonElement = document.querySelector(`.contact-button-item[data-id="${id}"]`);
    const button = contactButtons.find(b => b.id === id);
    if (button && buttonElement) {
        button.text = buttonElement.querySelector('.text-input').value;
        button.url = buttonElement.querySelector('.url-input').value;
        const mediaUrl = buttonElement.querySelector('.media-url-input').value;
        const mediaFile = buttonElement.querySelector('.media-file-input').files[0];

        button.isEditing = false;
        delete button.isNew;
        delete button.originalData;

        const saveAndRender = () => {
            localStorage.setItem('contactButtons', JSON.stringify(contactButtons));
            renderContactButtons(isAdminStatus);
            showNotification('Botón de contacto guardado.');
        };

        if (mediaFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                button.media = { type: mediaFile.type.startsWith('video') ? 'video' : 'image', src: event.target.result };
                saveAndRender();
            };
            reader.onerror = () => { showNotification('Error al leer el archivo.'); saveAndRender(); };
            reader.readAsDataURL(mediaFile);
        } else if (mediaUrl) {
            button.media = { type: mediaUrl.includes('.mp4') || mediaUrl.includes('.webm') || mediaUrl.includes('video') ? 'video' : 'image', src: mediaUrl };
            saveAndRender();
        } else {
            button.media = null;
            saveAndRender();
        }
    } else {
        showNotification('Error: No se pudo guardar el botón de contacto.');
    }
}

function cancelContactButtonEdit(id, isAdminStatus) {
    const buttonIndex = contactButtons.findIndex(b => b.id === id);
    if (buttonIndex !== -1) {
        const button = contactButtons[buttonIndex];
        if (button.isNew) {
            contactButtons.splice(buttonIndex, 1);
        } else if (button.originalData) {
            contactButtons[buttonIndex] = { ...button.originalData, isEditing: false };
            delete contactButtons[buttonIndex].originalData;
        } else {
            button.isEditing = false;
        }
        localStorage.setItem('contactButtons', JSON.stringify(contactButtons));
        renderContactButtons(isAdminStatus);
        showNotification('Cambios cancelados.');
    }
}

function deleteContactButton(id, isAdminStatus) {
    if (!isAdminStatus) return;
    contactButtons = contactButtons.filter(b => b.id !== id);
    localStorage.setItem('contactButtons', JSON.stringify(contactButtons));
    renderContactButtons(isAdminStatus);
    showNotification('Botón de contacto eliminado.');
}

export { 
    renderCommunityLinks, 
    renderContactButtons, 
    addNewLink, 
    addNewContactButton,
    // editLink, saveLink, cancelLinkEdit, deleteLink, // These are not exported as they are called by event listeners set up within render functions
    // editContactButton, saveContactButton, cancelContactButtonEdit, deleteContactButton // Same as above
};
