/*jshint esversion: 8 */
// Contenido de core.js
const canvas = document.getElementById('matrix');
const context = canvas ? canvas.getContext('2d') : null;
const notification = document.getElementById('notification');
const SECRET_KEY = 'plateadouno123';

let exchangeRate = 3.75;

async function fetchExchangeRate() {
    try {
        const response = await fetch('https://api.currencyapi.com/v3/latest?apikey=cur_live_bQJcTZu8pU7WvT0ca0ohQNqhpBUfTZrU6ZnLWjqo&base_currency=USD&currencies=PEN');
        const data = await response.json();
        if (data.data && data.data.PEN) {
            exchangeRate = data.data.PEN.value;
            showNotification('Tipo de cambio actualizado: 1 USD = ' + exchangeRate.toFixed(2) + ' PEN');
        } else {
            showNotification('No se pudo obtener el tipo de cambio. Usando valor de respaldo.');
        }
    } catch (error) {
        showNotification('Error al obtener el tipo de cambio. Usando valor de respaldo.');
    }
}

function convertToPEN(usd) {
    return (usd * exchangeRate).toFixed(2);
}

function getPriceValue(price) {
    return parseFloat(price.replace(' USD', '')) || 0;
}

function formatPrice(usdValue) {
    const penValue = convertToPEN(usdValue);
    return `${penValue} PEN (${usdValue.toFixed(2)} USD)`;
}

function resizeCanvas() {
    if (!canvas) {
        console.error('Canvas no encontrado');
        return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
const alphabet_global = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function initializeMatrixEffect() {
    console.log('Inicializando efecto Matrix...');
    if (!canvas || !context) {
        console.error('Canvas o contexto no encontrado');
        return;
    }

    resizeCanvas();
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    let fontSize = window.innerWidth < 768 ? 10 : window.innerWidth < 480 ? 8 : 18;
    let columns = Math.floor(canvas.width / fontSize);
    const rainDrops = [];

    for (let x = 0; x < columns; x++) {
        rainDrops[x] = Math.random() * canvas.height / fontSize;
    }

    const draw = () => {
        context.fillStyle = 'rgba(0, 0, 0, 0.1)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'rgba(0, 255, 0, 0.8)';
        context.font = `${fontSize}px monospace, 'Courier New'`;
        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            const x = i * fontSize;
            const y = rainDrops[i] * fontSize;
            context.fillText(text, x, y);
            if (y > canvas.height && Math.random() > 0.98) {
                rainDrops[i] = 0;
            }
            rainDrops[i] += 1;
        }
    };

    setInterval(draw, window.innerWidth < 768 ? 100 : 50);

    window.addEventListener('resize', () => {
        resizeCanvas();
        fontSize = window.innerWidth < 768 ? 10 : window.innerWidth < 480 ? 8 : 18;
        columns = Math.floor(canvas.width / fontSize);
        rainDrops.length = columns;
        for (let x = 0; x < columns; x++) {
            rainDrops[x] = rainDrops[x] || Math.random() * canvas.height / fontSize;
        }
    });
}

function setupProductMediaCanvas(productElement) {
    const mediaContainer = productElement.querySelector('.product-media');
    const canvasElement = document.createElement('canvas'); // Renombrado para evitar conflicto
    canvasElement.width = mediaContainer.offsetWidth;
    canvasElement.height = mediaContainer.offsetHeight;
    mediaContainer.insertBefore(canvasElement, mediaContainer.firstChild);

    const ctx = canvasElement.getContext('2d');
    let productFontSize = Math.min(canvasElement.width, canvasElement.height) / 20;
    let productColumns = Math.floor(canvasElement.width / productFontSize);
    const productRainDrops = [];

    for (let x = 0; x < productColumns; x++) {
        productRainDrops[x] = Math.random() * canvasElement.height / productFontSize;
    }

    const drawProductMedia = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.font = `${productFontSize}px monospace, 'Courier New'`;
        for (let i = 0; i < productRainDrops.length; i++) {
            const text = alphabet_global.charAt(Math.floor(Math.random() * alphabet_global.length));
            const x = i * productFontSize;
            const y = productRainDrops[i] * productFontSize;
            ctx.fillText(text, x, y);
            if (y > canvasElement.height && Math.random() > 0.98) {
                productRainDrops[i] = 0;
            }
            productRainDrops[i] += 1;
        }
    };

    setInterval(drawProductMedia, 50);
}

function showNotification(message) {
    if (!notification) {
        console.error('Elemento de notificación no encontrado');
        return;
    }
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Comando copiado: ' + text);
    });
}

let products = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('JS/data/products.json')
      .then(response => {
        if (!response.ok) throw new Error("Error al cargar products.json");
        return response.json();
      })
      .then(data => {
        products = data;
        console.log('[DEBUG] Productos cargados desde JSON:', products);
        const adminStatus = checkAdminStatus();
        renderProducts(adminStatus);
      })
      .catch(error => {
        console.error("No se pudo cargar el archivo JSON:", error);
      });
});

console.log('Productos inicializados directamente desde defaultProducts.');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderProducts(isAdminStatus) {
    console.log("[renderProducts] Iniciando renderizado de productos. isAdmin:", isAdminStatus);
    const activeTabButton = document.querySelector(".tab.active");
    if (!activeTabButton) {
        console.error("[renderProducts] ERROR: No se encontró la pestaña activa (botón .tab.active).");
        return;
    }
    const currentTabId = activeTabButton.getAttribute("data-tab");
    console.log("[renderProducts] Pestaña activa ID:", currentTabId);

    const activeTabContent = document.querySelector(`.tab-content.active#${currentTabId}`);
    if (!activeTabContent) {
        console.error(`[renderProducts] ERROR: El panel de contenido para la pestaña activa '${currentTabId}' no se encontró.`);
        return;
    }
    console.log("[renderProducts] Panel de contenido activo encontrado:", activeTabContent);

    const container = activeTabContent.querySelector(".product-categories.product-list");
    if (!container) {
        console.error("[renderProducts] ERROR: Contenedor .product-categories.product-list NO encontrado DENTRO del panel de contenido activo.");
        return;
    }
    console.log("[renderProducts] Contenedor de productos encontrado:", container);

    container.innerHTML = "";
    const filteredProducts = products.filter(p => p.category === currentTabId);
    console.log("[renderProducts] Productos filtrados para la pestaña actual:", filteredProducts);
    const isCoursesTab = currentTabId === "cursos";

    if (filteredProducts.length === 0) {
        console.log("[renderProducts] No hay productos para mostrar en esta categoría.");
        container.innerHTML = "<p>No hay productos disponibles en esta categoría.</p>";
        return;
    }

    console.log(`[renderProducts] Renderizando ${filteredProducts.length} productos.`);
    filteredProducts.forEach(product => {
        // ... (resto del código de renderizado del producto sin cambios)
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        const isVisuallySoldOut = product.isSoldOut || (product.stock !== "ilimitado" && String(product.stock).trim() === "0");

        let soldOutBadgeHtml = "";
        if (isVisuallySoldOut) {
            productElement.classList.add("sold-out");
            soldOutBadgeHtml = 
'<div class="sold-out-badge">AGOTADO</div>';
        }
        productElement.setAttribute("data-id", product.id);
        const isEditing = product.isEditing || false;
        
        let mediaHtml = 
            '<div class="product-image-container"><p>Sin multimedia</p></div>'; 
        if (product.media && product.media.src) {
            if (product.media.type === "image") {
                mediaHtml = `<div class="product-image-container"><img src="${product.media.src}" alt="${product.name}" class="product-image"></div>`;
            } else if (product.media.type === "video") {
                mediaHtml = `<div class="product-image-container"><video src="${product.media.src}" controls preload="metadata" class="product-image"></video></div>`;
            }
        }

        const stockInCart = cart.find(item => item.productId === product.id)?.quantity || 0;
        const stockAvailable = product.stock === "ilimitado" ? Infinity : parseInt(product.stock) - stockInCart;
        // const isSoldOut = product.isSoldOut || stockAvailable <= 0; // isVisuallySoldOut is now the primary flag for display
        const stockDisplay = product.stock === "ilimitado" ? "Stock: ilimitado" : `Stock: ${product.stock}`;
        const lowStockMessage = stockAvailable < 5 && stockAvailable > 0 && product.stock !== "ilimitado" && !isVisuallySoldOut ? `<p class="low-stock">¡Quedan solo ${stockAvailable} unidades disponibles!</p>` : "";
        const priceValue = getPriceValue(product.price);
        const formattedPrice = formatPrice(priceValue);

        const adminControlsDisplay = isAdminStatus && isEditing ? "block" : "none";
        const userViewDisplay = !isEditing ? "block" : "none";
        const adminButtonsDisplay = isAdminStatus && !isEditing ? "inline-block" : "none";
        const userActionDisplay = !isEditing ? "flex" : "none";

        productElement.innerHTML = `
            ${soldOutBadgeHtml}
            ${mediaHtml}
            <div class="product-info">
                <h3 class="name" style="display: ${userViewDisplay};">${product.name}</h3>
                <div class="name-input" style="display: ${adminControlsDisplay};">
                    <input type="text" value="${product.name}" aria-label="Editar nombre del producto">
                </div>
                
                <p class="stock" style="display: ${isAdminStatus && !isEditing ? "block" : "none" };">${stockDisplay}</p>
                <div class="stock-input" style="display: ${adminControlsDisplay};">
                    <input type="text" value="${product.stock || ''}" placeholder="Stock (ej. 30 o ilimitado)" aria-label="Editar stock del producto">
                </div>
                <div class="sold-out-input" style="display: ${adminControlsDisplay};">
                    <label><input type="checkbox" ${product.isSoldOut ? "checked" : ""}> Producto Agotado</label>
                </div>
                
                <p class="command" style="display: ${isAdminStatus && !isEditing && !isCoursesTab ? "block" : "none" };">Comando: <span class="command-text">${product.command}</span></p>
                <div class="command-input" style="display: ${adminControlsDisplay};">
                    <input type="text" value="${product.command}" placeholder="/comando" aria-label="Editar comando del producto">
                </div>
                
                <p class="details" style="display: ${isAdminStatus && !isEditing && !isCoursesTab ? "block" : "none" };">${product.details ? product.details.replace(/\n/g, "<br>") : ""}</p>
                <div class="details-input" style="display: ${adminControlsDisplay};">
                    <textarea placeholder="Detalles" aria-label="Editar detalles del producto">${product.details || ""}</textarea>
                </div>
                
                <div class="media-input" style="display: ${adminControlsDisplay};">
                    <label>Subir foto o video:</label>
                    <input type="file" accept="image/*,video/*" aria-label="Subir imagen o video para el producto">
                    <input type="text" class="media-url-input" placeholder="O ingresa una URL de imagen/video" value="${product.media && product.media.src ? product.media.src : ""}" aria-label="Ingresar URL de imagen o video para el producto">
                </div>
                
                <p class="price" style="display: ${userViewDisplay};">${formattedPrice}</p>
                <div class="price-input" style="display: ${adminControlsDisplay};">
                    <label for="price-pen-${product.id}">Precio en USD:</label>\n                    <input type="number" class="price-pen-input" data-product-id="${product.id}" step="0.01" placeholder="Ej. 37.50" aria-label="Ingresar precio en PEN" value="${(getPriceValue(product.price) * exchangeRate).toFixed(2)}">\n                    <p style="font-size: 0.8em; margin-top: 5px; margin-bottom: 0;">Equivalente: <span class="price-usd-display">${getPriceValue(product.price).toFixed(2)} USD</span> (T.C. 1 USD = ${exchangeRate.toFixed(2)} PEN)</p>
                </div>
                
                ${lowStockMessage}
            </div>
            <div class="product-actions" style="display: ${userActionDisplay};">
                <div class="quantity-selector" style="display: ${userViewDisplay};">
                    <label for="quantity-${product.id}">Cantidad:</label>
                    <input type="number" id="quantity-${product.id}" min="1" ${stockAvailable !== Infinity && !isVisuallySoldOut ? `max="${stockAvailable}"` : ""} value="1" aria-label="Cantidad a comprar" ${isVisuallySoldOut ? "disabled" : ""}>
                </div>
                <button class="add-to-cart-btn" style="display: ${userViewDisplay};" ${isVisuallySoldOut ? "disabled" : ""} aria-label="Agregar ${product.name} al carrito">Agregar al Carrito</button>
            </div>
            <div class="admin-product-buttons" style="display: ${isAdminStatus ? "flex" : "none"}; justify-content: space-around; margin-top: 10px;">
                <button class="edit-btn" style="display: ${adminButtonsDisplay};" aria-label="Editar producto">Editar</button>
                <button class="delete-btn" style="display: ${adminButtonsDisplay};" aria-label="Eliminar producto">Eliminar</button>
                <button class="save-btn" style="display: ${adminControlsDisplay};" aria-label="Guardar cambios">Guardar</button>
                <button class="cancel-btn" style="display: ${adminControlsDisplay};" aria-label="Cancelar edición">Cancelar</button>
            </div>
        `;pricePenInputEl = productElement.querySelector('.price-pen-input');
        const priceUsdDisplayEl = productElement.querySelector('.price-usd-display');
        const exchangeRateDisplayEl = productElement.querySelector('.price-input p'); // The <p> holding the T.C. info

        // product here is the current product from the forEach loop
        if (pricePenInputEl && priceUsdDisplayEl) {
            pricePenInputEl.addEventListener('input', (event) => {
                const penValue = parseFloat(event.target.value);
                let usdValue = 0;

                if (!isNaN(penValue) && exchangeRate > 0) {
                    usdValue = penValue / exchangeRate;
                }
                
                // Ensure product.price is always a string like "XX.YY USD"
                const formattedUsdPrice = `${usdValue.toFixed(2)} USD`;
                priceUsdDisplayEl.textContent = formattedUsdPrice;
                product.price = formattedUsdPrice; // Update the product's USD price in the products array

                if (exchangeRateDisplayEl) {
                    // Update the T.C. display string
                    exchangeRateDisplayEl.textContent = `Equivalente: ${formattedUsdPrice} (T.C. 1 USD = ${exchangeRate.toFixed(2)} PEN)`;
                }
            });
        }
        container.appendChild(productElement);
        // ... (resto de los event listeners para botones de admin y añadir al carrito)
        const addToCartBtn = productElement.querySelector(".add-to-cart-btn");
        if (addToCartBtn) {
            addToCartBtn.addEventListener("click", () => {
                const quantityInput = productElement.querySelector(`#quantity-${product.id}`);
                const quantity = parseInt(quantityInput.value);
                if (quantity > 0) {
                    addToCart(product.id, quantity, product.category);
                }
            });
        }

        if (isAdminStatus) {
            const editBtn = productElement.querySelector(".edit-btn");
            const deleteBtn = productElement.querySelector(".delete-btn");
            const saveBtn = productElement.querySelector(".save-btn");
            const cancelBtn = productElement.querySelector(".cancel-btn");
            const nameInput = productElement.querySelector(".name-input input");
            const stockInput = productElement.querySelector(".stock-input input");
            const soldOutInput = productElement.querySelector(".sold-out-input input");
            const commandInput = productElement.querySelector(".command-input input");
            const detailsInput = productElement.querySelector(".details-input textarea");
            const priceInput = productElement.querySelector(".price-input input");
            const mediaFileInput = productElement.querySelector(".media-input input[type='file']");
            const mediaUrlInput = productElement.querySelector(".media-input .media-url-input");

            if (editBtn) {
                editBtn.addEventListener("click", () => {
                    product.isEditing = true;
                    renderProducts(isAdminStatus);
                });
            }
            if (deleteBtn) {
                deleteBtn.addEventListener("click", () => {
                    if (confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
                        products = products.filter(p => p.id !== product.id);
                        saveProducts();
                        renderProducts(isAdminStatus);
                        showNotification(`"${product.name}" eliminado.`);
                    }
                });
            }
                if (saveBtn) {
        saveBtn.addEventListener("click", async () => {
        product.name = nameInput.value;
        product.stock = stockInput.value;
        product.isSoldOut = soldOutInput.checked;
        product.command = commandInput.value;
        product.details = detailsInput.value;
        product.price = priceInput.value;

        if (mediaFileInput.files && mediaFileInput.files[0]) {
        const file = mediaFileInput.files[0];
        const formData = new FormData();
        formData.append('media', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            product.media.src = data.path;
            product.media.type = file.type.startsWith("image/") ? "image" : "video";
            product.isEditing = false;
            saveProducts();
            renderProducts(isAdminStatus);
            showNotification(`"${product.name}" actualizado con imagen subida.`);
        })
        .catch(err => {
            console.error("Error subiendo archivo:", err);
            showNotification("Error al subir archivo.");
        });
        } else {
            product.isEditing = false;
            saveProducts();
            renderProducts(isAdminStatus);
            showNotification(`"${product.name}" actualizado.`);
        }
        });
        }

            if (cancelBtn) {
                cancelBtn.addEventListener("click", () => {
                    product.isEditing = false;
                    renderProducts(isAdminStatus);
                });
            }
        }
    });
    const addNewProductButton = activeTabContent.querySelector(".add-new-btn");
    if (addNewProductButton) {
        addNewProductButton.style.display = isAdminStatus ? "inline-block" : "none";
    }
    console.log("[renderEvents] Renderizado de eventos completado.");

    // Mostrar/ocultar botones de "Añadir" según el estado de admin
    const addNewButtons = activeTabContent.querySelectorAll('.add-new-btn');
    addNewButtons.forEach(btn => {
        btn.style.display = isAdminStatus ? 'inline-block' : 'none';
    });
}

function saveProducts() {
  fetch('/api/products', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(products)
  })
  .then(res => res.json())
  .then(() => {
    showNotification('Productos guardados correctamente.');
  })
  .catch(err => {
    console.error('Error guardando productos:', err);
    showNotification('Error al guardar productos.');
  });
}


function addNewProductOrCourse(category) {
    if (!checkAdminStatus()) {
        showNotification('Acción no permitida.');
        return;
    }
    const allProductIds = products.map(p => p.id);
    const allEventIds = events.map(e => e.id);
    const newId = Math.max(0, ...allProductIds, ...allEventIds) + 1;
    const newProduct = {
        id: newId,
        name: category === 'productos' ? 'Nuevo Producto' : 'Nuevo Curso',
        category: category,
        stock: '0',
        command: '/nuevo',
        details: '',
        media: { type: 'image', src: '' },
        price: '0.00 USD',
        isSoldOut: false,
        isEditing: true
    };
    products.push(newProduct);
    // saveProducts(); 
    renderProducts(true); 
    showNotification(`Nuevo ${category === 'productos' ? 'producto' : 'curso'} añadido. Edite los detalles y guarde.`);
}


// Contenido de cart.js

const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCounter = document.getElementById('cart-counter');
const subtotalCursosElement = document.getElementById('subtotal-cursos');
const subtotalProductosElement = document.getElementById('subtotal-productos');
const originalTotalElement = document.getElementById('original-total');
const discountElement = document.getElementById('discount');
const discountItemsElement = document.getElementById('discount-items');
const discountItemsListElement = document.getElementById('discount-items-list');
const couponInputElement = document.getElementById('coupon-input');

let appliedCoupon = null;

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.productId === productId);
    const stockInCart = existingItem ? existingItem.quantity : 0;
    const stockAvailable = product.stock === 'ilimitado' ? Infinity : parseInt(product.stock) - stockInCart;

    if (quantity > stockAvailable) {
        showNotification(`No hay suficiente stock para "${product.name}". Disponible: ${stockAvailable}`);
        return;
    }

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ productId, quantity, category: product.category, price: product.price });
    }
    saveCart();
    renderCart();
    showNotification(`${quantity} x "${product.name}" añadido al carrito.`);
    renderProducts(checkAdminStatus()); // Re-render para actualizar stock visual si es necesario
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
    renderCart();
    renderProducts(checkAdminStatus());
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        const product = products.find(p => p.id === productId);
        const stockAvailable = product.stock === 'ilimitado' ? Infinity : parseInt(product.stock);
        if (quantity > stockAvailable) {
            showNotification(`No hay suficiente stock para "${product.name}". Disponible: ${stockAvailable}`);
            item.quantity = stockAvailable; // Ajustar a lo máximo disponible
        } else if (quantity <= 0) {
            removeFromCart(productId);
            return;
        } else {
            item.quantity = quantity;
        }
        saveCart();
        renderCart();
        renderProducts(checkAdminStatus());
    }
}

function renderCart() {
    if (!cartItemsContainer || !cartTotalElement || !cartCounter) return;

    cartItemsContainer.innerHTML = '';
    let totalUSD = 0;
    let subtotalCursosUSD = 0;
    let subtotalProductosUSD = 0;
    let itemCount = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            const itemElement = document.createElement('tr');
            const priceValue = getPriceValue(product.price);
            const subtotalItemUSD = priceValue * item.quantity;
            totalUSD += subtotalItemUSD;
            itemCount += item.quantity;

            if (product.category === 'cursos') {
                subtotalCursosUSD += subtotalItemUSD;
            } else {
                subtotalProductosUSD += subtotalItemUSD;
            }

            itemElement.innerHTML = `
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" ${product.stock !== 'ilimitado' ? `max="${parseInt(product.stock)}"` : ''} data-id="${product.id}" class="cart-quantity-input" aria-label="Cantidad de ${product.name}">
                </td>
                <td>${formatPrice(priceValue)}</td>
                <td>${formatPrice(subtotalItemUSD)}</td>
                <td><button class="remove-from-cart-btn" data-id="${product.id}" aria-label="Eliminar ${product.name} del carrito">Eliminar</button></td>
            `;
            cartItemsContainer.appendChild(itemElement);
        }
    });

    const originalTotalUSD = totalUSD;
    let discountAmountUSD = 0;
    let discountedItemsList = [];

    if (appliedCoupon) {
        const couponDetails = coupons.find(c => c.code === appliedCoupon);
        if (couponDetails) {
            cart.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product && (couponDetails.item === 'todos' || product.name === couponDetails.item)) {
                    const priceValue = getPriceValue(product.price);
                    const itemDiscount = Math.min(priceValue * item.quantity, parseFloat(couponDetails.discountPEN) / exchangeRate);
                    discountAmountUSD += itemDiscount;
                    if (!discountedItemsList.includes(product.name)) {
                        discountedItemsList.push(product.name);
                    }
                }
            });
        }
    }
    totalUSD -= discountAmountUSD;

    cartTotalElement.textContent = formatPrice(totalUSD);
    cartCounter.textContent = itemCount;
    subtotalCursosElement.textContent = formatPrice(subtotalCursosUSD);
    subtotalProductosElement.textContent = formatPrice(subtotalProductosUSD);
    originalTotalElement.textContent = formatPrice(originalTotalUSD);
    discountElement.textContent = formatPrice(discountAmountUSD);

    if (discountAmountUSD > 0 && discountedItemsList.length > 0) {
        discountItemsElement.style.display = 'block';
        discountItemsListElement.textContent = discountedItemsList.join(', ');
    } else {
        discountItemsElement.style.display = 'none';
    }

    document.querySelectorAll('.cart-quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            updateCartQuantity(parseInt(e.target.dataset.id), parseInt(e.target.value));
        });
    });
    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            removeFromCart(parseInt(e.target.dataset.id));
        });
    });
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function clearCart() {
    cart = [];
    appliedCoupon = null; // Resetear cupón al vaciar carrito
    couponInputElement.value = ''; // Limpiar input del cupón
    document.getElementById('coupon-message').textContent = ''; // Limpiar mensaje del cupón
    saveCart();
    renderCart();
    renderProducts(checkAdminStatus());
    showNotification('Carrito vaciado.');
}

function applyCoupon() {
    const couponCode = couponInputElement.value.trim();
    const coupon = coupons.find(c => c.code === couponCode);
    const couponMessageElement = document.getElementById('coupon-message');

    if (coupon) {
        appliedCoupon = couponCode;
        couponMessageElement.textContent = `Cupón "${couponCode}" aplicado.`;
        couponMessageElement.style.color = '#00FF00';
        showNotification(`Cupón "${couponCode}" aplicado.`);
    } else {
        appliedCoupon = null;
        couponMessageElement.textContent = 'Cupón inválido.';
        couponMessageElement.style.color = '#FF4444';
        showNotification('Cupón inválido.');
    }
    renderCart(); // Re-renderizar el carrito para aplicar el descuento
}


// Contenido de events.js

let eventUpdateIntervals = []; // Store interval IDs to clear them later

function updateCountdown(eventDateString, countdownElement) {
    const now = new Date().getTime();
    const eventTime = new Date(eventDateString).getTime();
    const timeLeft = eventTime - now;

    if (timeLeft <= 0) {
        countdownElement.textContent = "Oferta expirada";
        // Optionally, clear the interval for this specific countdown if it's expired and the event object is accessible
        // This requires a more complex interval management than just a global array of all intervals.
        return;
    }

    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    countdownElement.textContent = `Tiempo restante: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

document.addEventListener("DOMContentLoaded", () => {
  loadEvents(); // ✅ Esto debe ejecutarse al cargar la página
});

let events = [];

// Cargar eventos desde el servidor
async function loadEvents() {
    try {
        const res = await fetch('/api/events');
        events = await res.json();
        console.log("✅ Eventos cargados:", events);
        renderEvents(isAdmin());
    } catch (error) {
        console.error("❌ Error cargando eventos:", error);
    }
}

// Guardar eventos en el servidor
async function saveEvents() {
    const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(events)
    });
    const result = await res.json();
    if (!result.success) throw new Error("Error en respuesta del servidor");
}


// Renderizar ofertas
function renderEvents(isAdminStatus) {
    eventUpdateIntervals.forEach(clearInterval);
    eventUpdateIntervals = [];

    const container = document.querySelector("#oferta .event-list");
    if (!container) return;
    container.innerHTML = "";

    events.forEach(event => {
        const eventElement = document.createElement("div");
        eventElement.classList.add("event");
        eventElement.setAttribute("data-id", event.id);

        const isSoldOut = event.isSoldOut || (event.stock !== "ilimitado" && parseInt(event.stock) <= 0);
        if (isSoldOut) eventElement.classList.add("sold-out");

        const isEditing = event.isEditing || false;
        const priceValue = getPriceValue(event.price || "0 USD");
        const formattedPrice = formatPrice(priceValue);

        const stockInCart = cart.find(item => item.productId === event.id && item.category === "oferta")?.quantity || 0;
        const stockAvailable = event.stock === "ilimitado" ? Infinity : parseInt(event.stock) - stockInCart;

        const stockDisplay = event.stock === "ilimitado" ? "Stock: ilimitado" : `Stock: ${event.stock}`;
        const adminControlsDisplay = isAdminStatus && isEditing ? "block" : "none";
        const userViewDisplay = !isEditing ? "block" : "none";
        const adminButtonsDisplay = isAdminStatus && !isEditing ? "inline-block" : "none";
        const userActionDisplay = !isEditing ? "flex" : "none";

        let mediaHtml = '<div class="product-image-container"><p>Sin imagen</p></div>';
        if (event.image && event.image !== ".") {
            mediaHtml = `<div class="product-image-container"><img src="${event.image}" alt="${event.name}" class="product-image"></div>`;
        }

        eventElement.innerHTML = `
            <div class="sale-tag">Oferta</div>
            ${mediaHtml}
            <div class="product-info">
                <h3 class="name" style="display: ${userViewDisplay};">${event.name}</h3>
                <div class="name-input" style="display: ${adminControlsDisplay};">
                    <input type="text" value="${event.name}">
                </div>

                <p class="details" style="display: ${userViewDisplay};">${event.description}</p>
                <div class="details-input" style="display: ${adminControlsDisplay};">
                    <textarea>${event.description}</textarea>
                </div>

                <p class="date" style="display: ${userViewDisplay};">Fecha Límite: ${event.date}</p>
                <div class="event-countdown" data-event-id="${event.id}" style="display: ${userViewDisplay};"></div>
                <div class="date-input" style="display: ${adminControlsDisplay};">
                    <input type="date" value="${event.date}">
                </div>

                <p class="price" style="display: ${userViewDisplay};">${formattedPrice}</p>
                <div class="price-input" style="display: ${adminControlsDisplay};">
                    <input type="text" value="${event.price || '0.00 USD'}">
                </div>

                <p class="stock" style="display: ${isAdminStatus && !isEditing ? 'block' : 'none' };">${stockDisplay}</p>
                <div class="stock-input" style="display: ${adminControlsDisplay};">
                    <input type="text" value="${event.stock || ''}">
                </div>
                <div class="sold-out-input" style="display: ${adminControlsDisplay};">
                    <label><input type="checkbox" ${event.isSoldOut ? 'checked' : ''}> Oferta Agotada</label>
                </div>

                <div class="media-input" style="display: ${adminControlsDisplay};">
                    <label>Subir imagen:</label>
                    <input type="file" accept="image/*">
                    <input type="text" class="media-url-input" placeholder="URL de imagen" value="${event.image || ''}">
                </div>
            </div>
            <div class="product-actions" style="display: ${userActionDisplay};">
                <div class="quantity-selector" style="display: ${userViewDisplay};">
                    <label for="quantity-event-${event.id}">Cantidad:</label>
                    <input type="number" id="quantity-event-${event.id}" min="1" ${stockAvailable !== Infinity ? `max="${stockAvailable}"` : ''} value="1">
                </div>
                <button class="add-to-cart-btn event-add-to-cart-btn" ${isSoldOut ? 'disabled' : ''}>Agregar al Carrito</button>
            </div>
            <div class="admin-product-buttons" style="display: ${isAdminStatus ? "block" : "none"}">
                <button class="edit-btn" style="display: ${adminButtonsDisplay};">Editar</button>
                <button class="delete-btn" style="display: ${adminButtonsDisplay};">Eliminar</button>
                <button class="save-btn" style="display: ${adminControlsDisplay};">Guardar</button>
                <button class="cancel-btn" style="display: ${adminControlsDisplay};">Cancelar</button>
            </div>
        `;

        const countdownElement = eventElement.querySelector(`.event-countdown[data-event-id="${event.id}"]`);
        if (countdownElement && event.date) {
            updateCountdown(event.date, countdownElement);
            event.countdownInterval = setInterval(() => updateCountdown(event.date, countdownElement), 1000);
        }

        // Listeners
        const quantityInput = eventElement.querySelector(`#quantity-event-${event.id}`);
        const addToCartBtn = eventElement.querySelector(".event-add-to-cart-btn");
        if (addToCartBtn && quantityInput) {
            addToCartBtn.addEventListener("click", () => {
                const quantity = parseInt(quantityInput.value);
                if (quantity > 0) {
                    addToCart(event.id, quantity, "oferta");
                }
            });
        }

        if (isAdminStatus) {
            const editBtn = eventElement.querySelector(".edit-btn");
            const deleteBtn = eventElement.querySelector(".delete-btn");
            const saveBtn = eventElement.querySelector(".save-btn");
            const cancelBtn = eventElement.querySelector(".cancel-btn");
            const nameInput = eventElement.querySelector(".name-input input");
            const descInput = eventElement.querySelector(".details-input textarea");
            const dateInput = eventElement.querySelector(".date-input input");
            const priceInput = eventElement.querySelector(".price-input input");
            const stockInput = eventElement.querySelector(".stock-input input");
            const soldOutInput = eventElement.querySelector(".sold-out-input input");
            const fileInput = eventElement.querySelector('.media-input input[type="file"]');
            const urlInput = eventElement.querySelector('.media-url-input');

            if (editBtn) editBtn.addEventListener("click", () => {
                event.isEditing = true;
                renderEvents(isAdminStatus);
            });

            if (cancelBtn) cancelBtn.addEventListener("click", () => {
                event.isEditing = false;
                renderEvents(isAdminStatus);
            });

            if (deleteBtn) deleteBtn.addEventListener("click", () => {
                if (confirm(`¿Eliminar "${event.name}"?`)) {
                    events = events.filter(e => e.id !== event.id);
                    saveEvents();
                    renderEvents(isAdminStatus);
                    showNotification(`"${event.name}" eliminado.`);
                }
            });

            if (saveBtn) saveBtn.addEventListener("click", async () => {
            event.name = nameInput.value;
            event.description = descInput.value;

            // Ajustar fecha para que incluya hora final del día
            let inputDate = dateInput.value;
            if (inputDate) {
                event.date = inputDate + "T23:59:59";
            } else {
                event.date = "";
            }

            event.price = priceInput.value;
            event.stock = stockInput.value;
            event.isSoldOut = soldOutInput.checked;

            if (fileInput.files && fileInput.files[0]) {
                const formData = new FormData();
                formData.append('media', fileInput.files[0]);
                const res = await fetch('/upload', { method: 'POST', body: formData });
                const data = await res.json();
                event.image = data.path;
            } else {
                event.image = urlInput.value;
            }

            event.isEditing = false;
            await saveEvents();
            renderEvents(isAdminStatus);
            showNotification(`"${event.name}" actualizado.`);
        });

        }

        container.appendChild(eventElement);
    });

    const addNewEventButton = document.querySelector("#oferta .add-new-btn");
    if (addNewEventButton) {
        addNewEventButton.style.display = isAdminStatus ? "inline-block" : "none";
        addNewEventButton.addEventListener('click', () => addNewOffer());
    }
}

// Crear nueva oferta (modal o prompt)
function addNewOffer() {
    if (!checkAdminStatus()) {
        showNotification("Acción no permitida.");
        return;
    }

    // ✅ Verifica si ya existe una tarjeta editable sin guardar
    const hasUnsavedOffer = events.some(e => e.isEditing);
    if (hasUnsavedOffer) {
        showNotification("Ya hay una oferta en edición. Guarda o cancela antes de añadir otra.");
        return;
    }

    const allIds = [...products.map(p => p.id), ...events.map(e => e.id)];
    const newId = Math.max(0, ...allIds) + 1;

    const newEvent = {
        id: newId,
        name: "Nueva Oferta",
        description: "Descripción de la nueva oferta.",
        image: ".", // Imagen por defecto o vacía
        date: "", // Puede ser "" o una fecha como "2025-12-31"
        category: "oferta",
        price: "0.00 USD",
        stock: "ilimitado",
        isSoldOut: false,
        isEditing: true
    };

    events.push(newEvent);
    renderEvents(true); // Vuelve a renderizar mostrando la nueva tarjeta editable
    showNotification("Nueva oferta añadida. Complete los campos y haga clic en 'Guardar'.");
}





// Contenido de community.js

let communityLinks = {
    whatsapp: {
        channels: [
            { id: 1, name: 'Canal Principal Addux', link: 'https://whatsapp.com/channel/0029VbB1KUR7NoZyGar4u52R' },
            { id: 2, name: 'Comunidad (respaldo)', link: 'https://chat.whatsapp.com/GckVmp6LG9S3FVSBnwfDiE' }
        ],
        bots: [
            { id: 1, name: 'Addux InfoBot', link: 'https://wa.me/51971541408?text=info' }
        ]
    },
    telegram: {
        channels: [
            { id: 1, name: 'Canal de Avisos', link: 'https://t.me/Addux12Shop' },
            { id: 2, name: 'Grupo de sorteos', link: 'https://t.me/Addux12referencias' }
        ],
        bots: [
            { id: 1, name: 'Bots Regalos y Doxing', link: 'https://t.me/BotsDisponibles' }
        ]
    }
};

let contactButtons = [
    { id: 1, text: 'Abrir Chat WhatsApp', action: 'whatsapp', number: '51971541408', message: 'Hola, vengo de tu pagina web.' },
    { id: 2, text: 'Contactar por Telegram', action: 'telegram', username: 'AdduxBot' }
];

function renderCommunityLinks(isAdminStatus) {
    renderPlatformLinks('whatsapp-channels', communityLinks.whatsapp.channels, 'channel', isAdminStatus);
    renderPlatformLinks('whatsapp-bots', communityLinks.whatsapp.bots, 'bot', isAdminStatus);
    renderPlatformLinks('telegram-channels', communityLinks.telegram.channels, 'channel', isAdminStatus);
    renderPlatformLinks('telegram-bots', communityLinks.telegram.bots, 'bot', isAdminStatus);
    renderContactButtons(isAdminStatus);

    // Mostrar/ocultar botones de "Añadir" según el estado de admin
    const communityTab = document.getElementById('comunidad');
    if (communityTab) {
        const addNewCommunityButtons = communityTab.querySelectorAll('.add-new-btn');
        addNewCommunityButtons.forEach(btn => {
            btn.style.display = isAdminStatus ? 'inline-block' : 'none';
        });
    }
}

function renderPlatformLinks(containerId, links, type, isAdminStatus) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    links.forEach(link => {
        const linkElement = document.createElement('div');
        linkElement.classList.add('community-link');
        const logoSrc = containerId.includes('whatsapp') ? 'IMAGES/logo_whatsap.png' : 'IMAGES/logo_telegram.png';
        linkElement.innerHTML = `
            <img src="${logoSrc}" alt="${type} logo">
            <a href="${link.link}" target="_blank">${link.name}</a>
            ${isAdminStatus ? `<button class="delete-link-btn" data-id="${link.id}" data-platform="${containerId.split('-')[0]}" data-type="${type}s">Eliminar</button>` : ''}
        `;
        container.appendChild(linkElement);
    });

    if (isAdminStatus) {
        document.querySelectorAll('.delete-link-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const platform = e.target.dataset.platform;
                const linkType = e.target.dataset.type; // 'channels' o 'bots'
                if (confirm('¿Seguro que quieres eliminar este enlace?')) {
                    communityLinks[platform][linkType] = communityLinks[platform][linkType].filter(l => l.id !== id);
                    saveCommunityLinks();
                    renderCommunityLinks(isAdminStatus);
                }
            });
        });
    }
}

function renderContactButtons(isAdminStatus) {
    const container = document.getElementById('contact-buttons');
    if (!container) return;
    container.innerHTML = '';
    contactButtons.forEach(button => {
        const buttonElement = document.createElement('button');
        buttonElement.textContent = button.text;
        buttonElement.addEventListener('click', () => {
            if (button.action === 'whatsapp') {
                window.open(`https://wa.me/${button.number}?text=${encodeURIComponent(button.message)}`, '_blank');
            } else if (button.action === 'telegram') {
                window.open(`https://t.me/${button.username}`, '_blank');
            }
        });
        if (isAdminStatus) {
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar Botón';
            deleteBtn.classList.add('delete-contact-btn'); // Para estilo si es necesario
            deleteBtn.style.marginLeft = '10px';
            deleteBtn.onclick = () => {
                if (confirm('¿Seguro que quieres eliminar este botón de contacto?')) {
                    contactButtons = contactButtons.filter(b => b.id !== button.id);
                    saveContactButtons();
                    renderContactButtons(isAdminStatus);
                }
            };
            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = '10px';
            wrapper.appendChild(buttonElement);
            wrapper.appendChild(deleteBtn);
            container.appendChild(wrapper);
        } else {
            container.appendChild(buttonElement);
        }
    });
}

function saveCommunityLinks() {
    // localStorage.setItem("communityLinks", JSON.stringify(communityLinks));
    console.log("Links de comunidad guardados (simulado)");
}

function addNewCommunityLink(platform, type) { // type es 'channels' o 'bots'
    if (!checkAdminStatus()) {
        showNotification("Acción no permitida.");
        return;
    }
    const name = prompt(`Ingrese el nombre del nuevo ${type === 'channels' ? 'canal/grupo' : 'bot'} de ${platform}:`);
    if (!name) return;
    const link = prompt(`Ingrese el enlace (URL) para "${name}":`);
    if (!link) return;

    const newId = communityLinks[platform][type].length > 0 ? Math.max(...communityLinks[platform][type].map(l => l.id)) + 1 : 1;
    communityLinks[platform][type].push({ id: newId, name, link });
    saveCommunityLinks();
    renderCommunityLinks(true);
    showNotification(`Nuevo ${type === 'channels' ? 'canal/grupo' : 'bot'} de ${platform} añadido.`);
}

function saveContactButtons() {
    // localStorage.setItem("contactButtons", JSON.stringify(contactButtons));
    console.log("Botones de contacto guardados (simulado)");
}

function addNewContactButton() {
    if (!checkAdminStatus()) {
        showNotification("Acción no permitida.");
        return;
    }
    const text = prompt("Ingrese el texto para el nuevo botón de contacto (ej. 'Abrir Chat Soporte'):");
    if (!text) return;
    const actionType = prompt("Ingrese el tipo de acción: 'whatsapp' o 'telegram':").toLowerCase();
    if (actionType !== 'whatsapp' && actionType !== 'telegram') {
        showNotification("Tipo de acción inválido.");
        return;
    }

    let newButtonData = { id: contactButtons.length > 0 ? Math.max(...contactButtons.map(b => b.id)) + 1 : 1, text, action: actionType };

    if (actionType === 'whatsapp') {
        const number = prompt("Ingrese el número de WhatsApp (ej. 519XXXXXXXX):");
        if (!number) return;
        const message = prompt("Ingrese el mensaje predeterminado para WhatsApp (opcional):");
        newButtonData.number = number;
        newButtonData.message = message || '';
    } else { // telegram
        const username = prompt("Ingrese el nombre de usuario de Telegram (ej. MiUsuarioBot):");
        if (!username) return;
        newButtonData.username = username;
    }

    contactButtons.push(newButtonData);
    saveContactButtons();
    renderContactButtons(true); // Asumiendo que renderContactButtons se encarga de la parte de admin
    showNotification("Nuevo botón de contacto añadido.");
}


// Contenido de admin.js
const adminLoginSection = document.getElementById('admin-login-section');
const adminIcon = document.getElementById('admin-icon');
const loginForm = document.getElementById('login-form-element');
const loginError = document.getElementById('login-error');
const logoutButton = document.getElementById('logout-button');

let isAdmin = false;

function checkAdminStatus() {
    const adminLoggedIn = sessionStorage.getItem('adminLoggedIn');
    isAdmin = adminLoggedIn === 'true';
    console.log("Estado de admin verificado:", isAdmin);
    toggleAdminUI(isAdmin);
    return isAdmin; // Devolver el estado para uso inmediato
}

function toggleAdminUI(isAdminStatus) {
    console.log("Alternando UI de admin a:", isAdminStatus);
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = isAdminStatus ? (el.tagName === 'BUTTON' || el.classList.contains('title-input') || el.classList.contains('subtitle-input') ? 'inline-block' : 'block') : 'none';
    });
    if (logoutButton) logoutButton.style.display = isAdminStatus ? 'inline-block' : 'none';
    if (adminIcon) adminIcon.style.borderColor = isAdminStatus ? '#FFD700' : '#00FFFF'; // Borde dorado si admin

    // Re-renderizar las secciones que dependen del estado de admin
    const activeTabButton = document.querySelector('.tab.active');
    if (activeTabButton) {
        const currentTabId = activeTabButton.getAttribute('data-tab');
        if (currentTabId === 'productos' || currentTabId === 'cursos') {
            renderProducts(isAdminStatus);
        } else if (currentTabId === 'oferta') {
            renderEvents(isAdminStatus);
        } else if (currentTabId === 'comunidad') {
            renderCommunityLinks(isAdminStatus);
        } else if (currentTabId === 'cupones') {
            renderCoupons(isAdminStatus);
        }
    }
}

if (adminIcon) {
    adminIcon.addEventListener('click', () => {
        if (!isAdmin) {
            adminLoginSection.style.display = 'flex';
        }
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const secretKeyInput = document.getElementById('secretKey');
        const enteredKey = secretKeyInput.value;
        const hashedKey = sha256(enteredKey);
        // Comparar con un hash precalculado de SECRET_KEY
        // sha256('plateadouno123') -> e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 (esto es hash de string vacío, usar el correcto)
        // Para 'plateadouno123', el hash es: 2b920310883e2899d33e1889be99029099584001180850205914292340e388c0
        if (hashedKey === '3ba26efbb3fa2d4527a41af892565972a03c5527ec9b7b4d08739557acfee503') { 
            sessionStorage.setItem('adminLoggedIn', 'true');
            checkAdminStatus();
            adminLoginSection.style.display = 'none';
            loginError.style.display = 'none';
            secretKeyInput.value = '';
            showNotification('Sesión de administrador iniciada.');
        } else {
            loginError.style.display = 'block';
        }
    });
    // Botón Cancelar en el modal de login
    const cancelLoginBtn = loginForm.querySelector('button[type="button"]');
    if(cancelLoginBtn){
        cancelLoginBtn.addEventListener('click', () => {
            adminLoginSection.style.display = 'none';
            loginError.style.display = 'none';
            document.getElementById('secretKey').value = '';
        });
    }
}

if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('adminLoggedIn');
        checkAdminStatus();
        showNotification('Sesión de administrador cerrada.');
    });
}

let coupons = [];

// Cargar cupones desde el servidor
function loadCoupons() {
  fetch('/api/coupons')
    .then(res => res.json())
    .then(data => {
      coupons = Array.isArray(data) ? data : [];
      renderCoupons(checkAdminStatus());
    })
    .catch(err => {
      console.error("Error al cargar cupones:", err);
      showNotification("❌ No se pudieron cargar los cupones.");
    });
}

function saveCoupons() {
  fetch('/api/coupons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(coupons, null, 2)
  })
    .then(res => res.json())
    .then(() => {
      showNotification("✅ Cupones guardados.");
      renderCoupons(checkAdminStatus());
    })
    .catch(err => {
      console.error("Error al guardar cupones:", err);
      showNotification("❌ Error al guardar cupones.");
    });
}

function renderCoupons(isAdminStatus) {
  const tableBody = document.getElementById('coupons-list');
  const addCouponBtn = document.querySelector('#cupones .add-new-btn');
  if (!tableBody) return;

  tableBody.innerHTML = '';

  if (coupons.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 5;
    cell.textContent = 'No hay cupones disponibles.';
    return;
  }

  coupons.forEach(coupon => {
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${coupon.code}</td>
      <td>${coupon.type}</td>
      <td>${coupon.item}</td>
      <td>${coupon.discountPEN} PEN</td>
      ${isAdminStatus ? `<td><button class="delete-coupon-btn" data-id="${coupon.id}">Eliminar</button></td>` : '<td>-</td>'}
    `;
  });

  if (isAdminStatus) {
    document.querySelectorAll('.delete-coupon-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = parseInt(e.target.dataset.id);
        if (confirm('¿Eliminar este cupón?')) {
          coupons = coupons.filter(c => c.id !== id);
          saveCoupons();
        }
      });
    });

    if (addCouponBtn) addCouponBtn.style.display = 'inline-block';
  } else {
    if (addCouponBtn) addCouponBtn.style.display = 'none';
  }
}

// Evento para añadir cupón desde el formulario del modal
const addCouponForm = document.getElementById('add-coupon-form');
if (addCouponForm) {
  addCouponForm.addEventListener('submit', e => {
    e.preventDefault();

    const code = document.getElementById('couponCodeModal').value.trim();
    const type = document.getElementById('couponTypeModal').value;
    const item = type === 'especifico' ? document.getElementById('couponItemModal').value.trim() : 'todos';
    const discountPEN = document.getElementById('couponDiscountPENModal').value;

    if (!code || !discountPEN || (type === 'especifico' && !item)) {
      showNotification("⚠️ Completa todos los campos requeridos.");
      return;
    }

    const newId = coupons.length > 0 ? Math.max(...coupons.map(c => c.id)) + 1 : 1;

    coupons.push({
      id: newId,
      code,
      type,
      item,
      discountPEN: parseFloat(discountPEN).toFixed(2)
    });

    saveCoupons();
    document.getElementById('add-coupon-modal').style.display = 'none';
    addCouponForm.reset();
  });
}

const addCouponBtn = document.querySelector('#cupones .add-new-btn');
if (addCouponBtn) {
  addCouponBtn.addEventListener('click', () => {
    const modal = document.getElementById('add-coupon-modal');
    modal.style.display = 'flex';

    const typeSelect = document.getElementById('couponTypeModal');
    const itemInput = document.getElementById('couponItemModal');
    itemInput.disabled = typeSelect.value !== 'especifico';

    typeSelect.addEventListener('change', () => {
      itemInput.disabled = typeSelect.value !== 'especifico';
      if (typeSelect.value !== 'especifico') itemInput.value = '';
    });
  });
}


// Botón cancelar en el modal de cupón
const cancelAddCouponBtn = document.getElementById('cancel-add-coupon-btn');
if (cancelAddCouponBtn) {
  cancelAddCouponBtn.addEventListener('click', () => {
    document.getElementById('add-coupon-modal').style.display = 'none';
    addCouponForm.reset();
  });
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    if (tabName === 'cupones') {
      loadCoupons();
    }
  });
});



// Inicialización y eventos principales
document.addEventListener('DOMContentLoaded', () => {
    console.log("[MAIN.JS] SCRIPT CARGADO Y DOM LISTO");
    initializeMatrixEffect();
    checkAdminStatus(); // Verificar estado de admin al cargar
    fetchExchangeRate();

    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const targetTab = tab.getAttribute('data-tab');
            tabContents.forEach(tc => {
                tc.classList.remove('active');
                if (tc.id === targetTab) {
                    tc.classList.add('active');
                    // Re-renderizar contenido de la pestaña activa con el estado de admin actual
                    const isAdmin = checkAdminStatus();
                    if (targetTab === 'productos' || targetTab === 'cursos') {
                        renderProducts(isAdmin);
                    } else if (targetTab === 'oferta') {
                        renderEvents(isAdmin);
                    } else if (targetTab === 'comunidad') {
                        renderCommunityLinks(isAdmin);
                    } else if (targetTab === 'cupones') {
                        renderCoupons(isAdmin);
                    }
                }
            });
        });
    });

    // Activar la primera pestaña por defecto y renderizar su contenido
    if (tabs.length > 0) {
        tabs[0].click(); 
    }

    // Carrito
    const cartButton = document.getElementById('cart-button');
    const closeCartModalBtn = cartModal ? cartModal.querySelector('.cancel-btn') : null;
    const clearCartButton = cartModal ? cartModal.querySelector('.clear-cart-btn') : null;
    const buyAllButton = cartModal ? cartModal.querySelector('.buy-all-btn') : null;
    const applyCouponButton = document.getElementById('apply-coupon-btn');

    if (cartButton) {
        cartButton.addEventListener('click', () => {
            renderCart();
            cartModal.style.display = 'flex';
        });
    }
    if (closeCartModalBtn) {
        closeCartModalBtn.addEventListener('click', () => cartModal.style.display = 'none');
    }
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }
    if (buyAllButton) {
    buyAllButton.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('El carrito está vacío.');
            return;
        }
        let message = 'Pedido Addux Shop:\n';
        let totalToPayPEN = 0;
        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                const priceValue = getPriceValue(product.price);
                // Multiplicar precio USD * cantidad * tipo de cambio para PEN
                const subtotalItemPEN = priceValue * item.quantity * exchangeRate;
                message += `${item.quantity}x ${product.name} - ${subtotalItemPEN.toFixed(2)} PEN\n`;
                totalToPayPEN += subtotalItemPEN;
            }
        });

        // Aquí: tomar el texto que tiene solo el número en PEN, quitamos texto extra:
        const discountText = discountElement.textContent || '0';
        // Extraemos número (incluyendo decimales) con regex
        const match = discountText.match(/([\d,.]+)/);
        const discountAmountPEN = match ? parseFloat(match[1].replace(',', '.')) : 0;

        totalToPayPEN = Math.max(0, totalToPayPEN - discountAmountPEN);

        message += `Total: ${totalToPayPEN.toFixed(2)} PEN`;
        if (discountAmountPEN > 0) {
            message += ` (Descuento aplicado: ${discountAmountPEN.toFixed(2)} PEN)`;
        }
        window.open(`https://wa.me/51971541408?text=${encodeURIComponent(message)}`, '_blank');
        showNotification('Redirigiendo a WhatsApp para completar la compra.');
    });
}
    if (applyCouponButton) {
        applyCouponButton.addEventListener('click', applyCoupon);
    }

    // Event listeners para los botones "Añadir"
    const addProductBtn = document.querySelector('#productos .add-new-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => addNewProductOrCourse('productos'));
    }

    const addCourseBtn = document.querySelector('#cursos .add-new-btn');
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', () => addNewProductOrCourse('cursos'));
    }

    const addOfferBtn = document.querySelector('#oferta .add-new-btn');
    if (addOfferBtn) {
        addOfferBtn.addEventListener('click', () => addNewOffer());
    }

    // Cargar datos iniciales (si no se usa localStorage para persistencia)
    // loadInitialData(); // Esta función ya no es necesaria si los datos se cargan directamente
    renderProducts(checkAdminStatus()); // Renderizar productos de la pestaña activa inicial
    renderEvents(checkAdminStatus());
    renderCommunityLinks(checkAdminStatus());
    renderCoupons(checkAdminStatus());

    // Funcionalidad de edición de títulos y subtítulos (admin)
    document.querySelectorAll('.title-input, .subtitle-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const spanId = this.id.replace('-input', '');
                document.getElementById(spanId).textContent = this.value;
                this.style.display = 'none';
                document.getElementById(spanId).style.display = 'inline'; 
                // Aquí se podría añadir lógica para guardar estos cambios si fuera necesario
                showNotification('Título/Subtítulo actualizado.');
            }
        });
        input.addEventListener('blur', function() { // Guardar también al perder el foco
            const spanId = this.id.replace('-input', '');
            document.getElementById(spanId).textContent = this.value;
            this.style.display = 'none';
            document.getElementById(spanId).style.display = 'inline';
        });
    });

    document.querySelectorAll('.site-title, h2 > span, p > span, h3 > span').forEach(span => {
        span.addEventListener('click', function() {
            if (isAdmin) {
                const inputId = this.id + '-input';
                const inputElement = document.getElementById(inputId);
                if (inputElement) {
                    this.style.display = 'none';
                    inputElement.style.display = 'inline-block';
                    inputElement.focus();
                }
            }
        });
    });

    // Edición mensaje de cursos
    const courseMessageText = document.getElementById('course-message-text');
    const courseMessageEditDiv = document.getElementById('course-message-edit');
    const courseMessageInput = document.getElementById('course-message-input');
    const editCourseMessageBtn = document.querySelector('#cursos .course-message .edit-btn');
    const saveCourseMessageBtn = document.querySelector('#cursos .course-message .save-btn');
    const cancelCourseMessageBtn = document.querySelector('#cursos .course-message .cancel-btn');

    if (courseMessageText) courseMessageText.innerHTML = "<strong>Mensaje Importante para Cursos:</strong> Contenido exclusivo y actualizado regularmente. ¡Aprovecha nuestras ofertas!".replace(/\n/g, '<br>'); // Mensaje por defecto
    if (courseMessageInput && courseMessageText) courseMessageInput.value = courseMessageText.textContent;

    if (editCourseMessageBtn) {
        editCourseMessageBtn.addEventListener('click', () => {
            if(isAdmin && courseMessageText && courseMessageEditDiv && courseMessageInput) {
                courseMessageText.style.display = 'none';
                editCourseMessageBtn.style.display = 'none';
                courseMessageInput.value = courseMessageText.innerHTML.replace(/<br\s*\/?>/gi, '\n'); // Convertir <br> a saltos de línea para textarea
                courseMessageEditDiv.style.display = 'block';
            }
        });
    }
    if (saveCourseMessageBtn) {
        saveCourseMessageBtn.addEventListener('click', () => {
            if(isAdmin && courseMessageText && courseMessageEditDiv && courseMessageInput) {
                courseMessageText.innerHTML = courseMessageInput.value.replace(/\n/g, '<br>'); // Convertir saltos de línea a <br>
                courseMessageEditDiv.style.display = 'none';
                courseMessageText.style.display = 'block';
                editCourseMessageBtn.style.display = 'inline-block';
                // Guardar mensaje si es necesario
                showNotification('Mensaje de cursos actualizado.');
            }
        });
    }
    if (cancelCourseMessageBtn) {
        cancelCourseMessageBtn.addEventListener('click', () => {
            if(isAdmin && courseMessageText && courseMessageEditDiv && editCourseMessageBtn) {
                courseMessageEditDiv.style.display = 'none';
                courseMessageText.style.display = 'block';
                editCourseMessageBtn.style.display = 'inline-block';
            }
        });
    }
});

console.log("[MAIN.JS] SCRIPT TOTALMENTE PROCESADO");




// --- Event Listeners for Community Add Buttons ---
const addWhatsAppChannelBtn = document.getElementById('add-whatsapp-channel-btn');
const addWhatsAppBotBtn = document.getElementById('add-whatsapp-bot-btn');
const addTelegramChannelBtn = document.getElementById('add-telegram-channel-btn');
const addTelegramBotBtn = document.getElementById('add-telegram-bot-btn');
const addContactButtonBtn = document.getElementById('add-contact-button-btn');

if (addWhatsAppChannelBtn) {
    addWhatsAppChannelBtn.addEventListener('click', () => {
        if (isAdmin) {
            communityModule.addNewLink('whatsapp', 'channel', isAdmin);
        } else {
            showNotification('Acción no permitida.');
        }
    });
}

if (addWhatsAppBotBtn) {
    addWhatsAppBotBtn.addEventListener('click', () => {
        if (isAdmin) {
            communityModule.addNewLink('whatsapp', 'bot', isAdmin);
        } else {
            showNotification('Acción no permitida.');
        }
    });
}

if (addTelegramChannelBtn) {
    addTelegramChannelBtn.addEventListener('click', () => {
        if (isAdmin) {
            communityModule.addNewLink('telegram', 'channel', isAdmin);
        } else {
            showNotification('Acción no permitida.');
        }
    });
}

if (addTelegramBotBtn) {
    addTelegramBotBtn.addEventListener('click', () => {
        if (isAdmin) {
            communityModule.addNewLink('telegram', 'bot', isAdmin);
        } else {
            showNotification('Acción no permitida.');
        }
    });
}

if (addContactButtonBtn) {
    addContactButtonBtn.addEventListener('click', () => {
        if (isAdmin) {
            communityModule.addNewContactButton(isAdmin);
        } else {
            showNotification('Acción no permitida.');
        }
    });
}

// Ensure community content is rendered on tab switch if admin status is known
// This might need to be called within the tab switching logic if isAdmin is set asynchronously
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        if (tab.getAttribute('data-tab') === 'comunidad') {
            // Re-render community links and buttons when switching to the community tab
            // to ensure they reflect the current admin status and any changes.
            if (typeof communityModule !== 'undefined' && communityModule.renderCommunityLinks) {
                 communityModule.renderCommunityLinks(isAdmin);
            }
            if (typeof communityModule !== 'undefined' && communityModule.renderContactButtons) {
                communityModule.renderContactButtons(isAdmin);
            }
        }
    });
});



