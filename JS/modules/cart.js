import { products, cart, setCart } from './products.js';
import { getPriceValue, formatPrice, showNotification } from './core.js';

const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCounterElement = document.getElementById('cart-counter');

let coupons = JSON.parse(localStorage.getItem("coupons")) || [
    { code: "CURSO10", type: "curso", specificItem: "Curso Cracking", discountValue: 10 },
    { code: "PRODUCTO5", type: "producto", specificItem: "Links prime a dominio", discountValue: 5 },
    { code: "PRODUCTO10", type: "producto", specificItem: "LIGA 1 MAX", discountValue: 10 }
];

// Guardar los datos predeterminados en localStorage si no existen
if (!localStorage.getItem('coupons')) {
    localStorage.setItem('coupons', JSON.stringify(coupons));
}

let appliedCoupon = null;

function getAvailableItems(type) {
    return products
        .filter(p => p.category === type && !p.isSoldOut && (p.stock === "ilimitado" || parseInt(p.stock) > 0))
        .map(p => p.name);
}

function renderCoupons() {
    const couponsList = document.getElementById("coupons-list");
    if (!couponsList) {
        console.log('Contenedor de cupones no encontrado');
        return;
    }

    couponsList.innerHTML = coupons.map(coupon => {
        const itemsForType = getAvailableItems(coupon.type);
        const hasItems = itemsForType.length > 0;
        return `
            <tr data-code="${coupon.code}">
                <td class="code" style="display: ${coupon.isEditing ? 'none' : 'table-cell'}">${coupon.code}</td>
                <td class="code-input" style="display: ${coupon.isEditing ? 'table-cell' : 'none'}">
                    <input type="text" value="${coupon.code}">
                </td>
                <td class="type" style="display: ${coupon.isEditing ? 'none' : 'table-cell'}">${coupon.type === "cursos" ? "Curso" : "Producto"}</td>
                <td class="type-input" style="display: ${coupon.isEditing ? 'table-cell' : 'none'}">
                    <select>
                        <option value="curso" ${coupon.type === "curso" ? "selected" : ""}>Curso</option>
                        <option value="producto" ${coupon.type === "producto" ? "selected" : ""}>Producto</option>
                    </select>
                </td>
                <td class="specific-item" style="display: ${coupon.isEditing ? 'none' : 'table-cell'}">${coupon.specificItem}</td>
                <td class="specific-item-input" style="display: ${coupon.isEditing ? 'table-cell' : 'none'}">
                    ${hasItems ? `
                        <select>
                            ${itemsForType.map(item => `<option value="${item}" ${coupon.specificItem === item ? "selected" : ""}>${item}</option>`).join("")}
                        </select>
                    ` : "No hay ítems disponibles para este tipo"}
                </td>
                <td class="discount" style="display: ${coupon.isEditing ? 'none' : 'table-cell'}">${coupon.discountValue} PEN</td>
                <td class="discount-input" style="display: ${coupon.isEditing ? 'table-cell' : 'none'}">
                    <input type="number" value="${coupon.discountValue}">
                </td>
                <td>
                    <button class="edit-coupon-btn" style="display: ${coupon.isEditing ? 'none' : 'inline-block'}">Editar</button>
                    <button class="delete-coupon-btn" style="display: ${coupon.isEditing ? 'none' : 'inline-block'}">Eliminar</button>
                    <button class="save-coupon-btn" style="display: ${coupon.isEditing ? 'inline-block' : 'none'}">Guardar</button>
                    <button class="cancel-coupon-btn" style="display: ${coupon.isEditing ? 'inline-block' : 'none'}">Cancelar</button>
                </td>
            </tr>
        `;
    }).join("");

    // Asignar eventos dinámicamente
    document.querySelectorAll('.edit-coupon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.closest('tr').getAttribute('data-code');
            editCoupon(code);
        });
    });
    document.querySelectorAll('.delete-coupon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.closest('tr').getAttribute('data-code');
            deleteCoupon(code);
        });
    });
    document.querySelectorAll('.save-coupon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.closest('tr').getAttribute('data-code');
            saveCoupon(code);
        });
    });
    document.querySelectorAll('.cancel-coupon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.closest('tr').getAttribute('data-code');
            cancelCouponEdit(code);
        });
    });
    document.querySelectorAll('.code-input input').forEach(input => {
        input.addEventListener('change', (e) => {
            const code = input.closest('tr').getAttribute('data-code');
            updateCouponField(code, 'code', e.target.value);
        });
    });
    document.querySelectorAll('.type-input select').forEach(select => {
        select.addEventListener('change', (e) => {
            const code = select.closest('tr').getAttribute('data-code');
            updateCouponField(code, 'type', e.target.value);
        });
    });
    document.querySelectorAll('.specific-item-input select').forEach(select => {
        select.addEventListener('change', (e) => {
            const code = select.closest('tr').getAttribute('data-code');
            updateCouponField(code, 'specificItem', e.target.value);
        });
    });
    document.querySelectorAll('.discount-input input').forEach(input => {
        input.addEventListener('change', (e) => {
            const code = input.closest('tr').getAttribute('data-code');
            updateCouponField(code, 'discountValue', e.target.value);
        });
    });
}

function addNewCoupon() {
    const newCode = `CUPON${Date.now()}`;
    const availableCourses = getAvailableItems("cursos");
    const defaultItem = availableCourses.length > 0 ? availableCourses[0] : "";
    if (!defaultItem) {
        showNotification("No hay ítems disponibles para crear un cupón. Por favor, añade productos o cursos disponibles.");
        return;
    }
    coupons.push({
        code: newCode,
        type: "curso",
        specificItem: defaultItem,
        discountValue: 0,
        isEditing: true
    });
    localStorage.setItem("coupons", JSON.stringify(coupons));
    renderCoupons();
}

function editCoupon(code) {
    const coupon = coupons.find(c => c.code === code);
    if (coupon) {
        coupon.isEditing = true;
        localStorage.setItem("coupons", JSON.stringify(coupons));
        renderCoupons();
    }
}

function updateCouponField(code, field, value) {
    const coupon = coupons.find(c => c.code === code);
    if (coupon) {
        coupon[field] = field === "discountValue" ? parseFloat(value) : value;
        if (field === "type") {
            const itemsForType = getAvailableItems(value);
            coupon.specificItem = itemsForType.length > 0 ? itemsForType[0] : "";
        }
        localStorage.setItem("coupons", JSON.stringify(coupons));
        renderCoupons();
    }
}

function saveCoupon(code) {
    const coupon = coupons.find(c => c.code === code);
    if (coupon) {
        const itemsForType = getAvailableItems(coupon.type);
        if (!coupon.specificItem || !itemsForType.includes(coupon.specificItem)) {
            showNotification("Por favor, selecciona un ítem específico válido.");
            return;
        }
        coupon.isEditing = false;
        localStorage.setItem("coupons", JSON.stringify(coupons));
        renderCoupons();
    }
}

function cancelCouponEdit(code) {
    const coupon = coupons.find(c => c.code === code);
    if (coupon) {
        if (!coupon.code || coupon.discountValue <= 0 || !coupon.specificItem) {
            coupons = coupons.filter(c => c.code !== code);
        } else {
            coupon.isEditing = false;
        }
        localStorage.setItem("coupons", JSON.stringify(coupons));
        renderCoupons();
    }
}

function deleteCoupon(code) {
    coupons = coupons.filter(c => c.code !== code);
    localStorage.setItem("coupons", JSON.stringify(coupons));
    renderCoupons();
}

function applyCoupon(code) {
    const couponMessageDiv = document.getElementById("coupon-message");
    const coupon = coupons.find(c => c.code === code.toUpperCase());

    if (!coupon) {
        couponMessageDiv.style.color = "red";
        couponMessageDiv.textContent = "Cupón inválido";
        appliedCoupon = null;
    } else {
        const itemAvailable = products.some(p => p.name === coupon.specificItem && !p.isSoldOut && (p.stock === "ilimitado" || parseInt(p.stock) > 0));
        const hasItem = cart.some(item => item.name === coupon.specificItem);

        if (!itemAvailable) {
            couponMessageDiv.style.color = "red";
            couponMessageDiv.textContent = `El cupón ${coupon.code} aplica a ${coupon.specificItem}, pero ya no está disponible`;
            appliedCoupon = null;
        } else if (!hasItem) {
            couponMessageDiv.style.color = "red";
            couponMessageDiv.textContent = `El cupón ${coupon.code} aplica solo a ${coupon.specificItem}, pero no está en el carrito`;
            appliedCoupon = null;
        } else if (coupon.type === "producto") {
            const specificItemSubtotalUSD = cart
                .filter(item => item.name === coupon.specificItem)
                .reduce((sum, item) => sum + getPriceValue(item.price) * item.quantity, 0);
            const specificItemSubtotalPEN = specificItemSubtotalUSD * 3.75; // Usamos 3.75 como tipo de cambio para la verificación
            if (specificItemSubtotalPEN < 55) {
                couponMessageDiv.style.color = "red";
                couponMessageDiv.textContent = `El total de ${coupon.specificItem} debe ser al menos 55.00 PEN para usar este cupón`;
                appliedCoupon = null;
            } else {
                appliedCoupon = coupon;
                const discountUSD = (coupon.discountValue / 3.75).toFixed(2);
                couponMessageDiv.style.color = "green";
                couponMessageDiv.textContent = `Cupón aplicado: ${coupon.code} (-${discountUSD} USD / -${coupon.discountValue}.00 PEN) en ${coupon.specificItem}`;
            }
        } else {
            appliedCoupon = coupon;
            const discountUSD = (coupon.discountValue / 3.75).toFixed(2);
            couponMessageDiv.style.color = "green";
            couponMessageDiv.textContent = `Cupón aplicado: ${coupon.code} (-${discountUSD} USD / -${coupon.discountValue}.00 PEN) en ${coupon.specificItem}`;
        }
    }
    renderCart();
}

function renderCart() {
    const subtotalCursosSpan = document.getElementById("subtotal-cursos");
    const subtotalProductosSpan = document.getElementById("subtotal-productos");
    const originalTotalSpan = document.getElementById("original-total");
    const discountSpan = document.getElementById("discount");
    const discountItemsDiv = document.getElementById("discount-items");
    const discountItemsList = document.getElementById("discount-items-list");

    cart = cart.filter(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product || product.isSoldOut || (product.stock !== "ilimitado" && parseInt(product.stock) === 0)) {
            showNotification(`El producto ${item.name} ha sido marcado como agotado y se ha removido del carrito.`);
            return false;
        }

        const stockAvailable = product.stock === "ilimitado" ? Infinity : parseInt(product.stock);
        if (item.quantity > stockAvailable) {
            item.quantity = stockAvailable;
            showNotification(`El stock de ${item.name} ha cambiado. Cantidad ajustada a ${stockAvailable} unidades.`);
        }

        return item.quantity > 0;
    });

    let subtotalCursosUSD = 0;
    let subtotalProductosUSD = 0;
    let totalUSD = 0;

    cartItemsContainer.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return "";

        const priceValueUSD = getPriceValue(item.price);
        const subtotalUSD = item.quantity * priceValueUSD;
        if (product.category === "cursos") {
            subtotalCursosUSD += subtotalUSD;
        } else {
            subtotalProductosUSD += subtotalUSD;
        }
        totalUSD += subtotalUSD;

        const formattedPrice = formatPrice(priceValueUSD);
        const formattedSubtotal = formatPrice(subtotalUSD);

        return `
            <tr>
                <td>${item.name}</td>
                <td>${product.category === "cursos" ? "Curso" : "Producto"}</td>
                <td>${item.quantity} unidad(es)</td>
                <td>${formattedPrice}</td>
                <td>${formattedSubtotal}</td>
            </tr>
        `;
    }).join("");

    let discountPEN = 0;
    let affectedItems = [];
    if (appliedCoupon) {
        const itemAvailable = products.some(p => p.name === appliedCoupon.specificItem && !p.isSoldOut && (p.stock === "ilimitado" || parseInt(p.stock) > 0));
        if (itemAvailable) {
            affectedItems = cart
                .filter(item => item.name === appliedCoupon.specificItem)
                .map(item => item.name);
            if (affectedItems.length > 0) {
                discountPEN = appliedCoupon.discountValue;
                if (appliedCoupon.type === "producto") {
                    const specificItemSubtotalUSD = cart
                        .filter(item => item.name === appliedCoupon.specificItem)
                        .reduce((sum, item) => sum + getPriceValue(item.price) * item.quantity, 0);
                    const specificItemSubtotalPEN = specificItemSubtotalUSD * 3.75;
                    if (specificItemSubtotalPEN < 55) {
                        discountPEN = 0;
                        affectedItems = [];
                        showNotification(`El total de ${appliedCoupon.specificItem} debe ser al menos 55.00 PEN para usar este cupón`);
                        appliedCoupon = null;
                    }
                }
            }
        }
    }

    const discountUSD = (discountPEN / 3.75).toFixed(2);
    const totalFinalUSD = totalUSD - parseFloat(discountUSD);

    if (affectedItems.length > 0) {
        discountItemsList.textContent = affectedItems.join(", ");
        discountItemsDiv.style.display = "block";
    } else {
        discountItemsDiv.style.display = "none";
    }

    subtotalCursosSpan.textContent = formatPrice(subtotalCursosUSD);
    subtotalProductosSpan.textContent = formatPrice(subtotalProductosUSD);
    originalTotalSpan.textContent = formatPrice(totalUSD);
    discountSpan.textContent = formatPrice(parseFloat(discountUSD));
    cartTotalElement.textContent = formatPrice(totalFinalUSD);

    cartCounterElement.textContent = cart.length;
    localStorage.setItem("cart", JSON.stringify(cart));
}

function clearCart() {
    setCart([]);
    renderCart();
    showNotification('Carrito vaciado.');
}

function openCartModal() {
    renderCart();
    cartModal.style.display = 'flex';
}

function closeCartModal() {
    cartModal.style.display = 'none';
}

function buyAll() {
    let subtotalCursosUSD = cart
        .filter(item => {
            const product = products.find(p => p.id === item.productId);
            return product && product.category === "cursos";
        })
        .reduce((sum, item) => sum + getPriceValue(item.price) * item.quantity, 0);
    let subtotalProductosUSD = cart
        .filter(item => {
            const product = products.find(p => p.id === item.productId);
            return product && product.category === "productos";
        })
        .reduce((sum, item) => sum + getPriceValue(item.price) * item.quantity, 0);

    let totalOriginalUSD = subtotalCursosUSD + subtotalProductosUSD;

    let discountPEN = 0;
    let couponText = "";
    if (appliedCoupon) {
        const itemAvailable = products.some(p => p.name === appliedCoupon.specificItem && !p.isSoldOut && (p.stock === "ilimitado" || parseInt(p.stock) > 0));
        if (itemAvailable) {
            const affectedItems = cart.filter(item => item.name === appliedCoupon.specificItem);
            if (affectedItems.length > 0) {
                discountPEN = appliedCoupon.discountValue;
                if (appliedCoupon.type === "producto") {
                    const specificItemSubtotalUSD = affectedItems
                        .reduce((sum, item) => sum + getPriceValue(item.price) * item.quantity, 0);
                    const specificItemSubtotalPEN = specificItemSubtotalUSD * 3.75;
                    if (specificItemSubtotalPEN < 55) {
                        discountPEN = 0;
                    }
                }
            }
        }
        if (discountPEN > 0) {
            couponText = `\nNota: He usado el cupón ${appliedCoupon.code} que aplica a ${appliedCoupon.specificItem}.`;
        }
    }

    const messageLines = cart.map(item => `${item.quantity} unidades de ${item.name} (${item.command})`);
    const message = `Hola, vengo de addux.shop. Me interesa comprar:\n${messageLines.join('\n')}${couponText}`;
    const whatsappUrl = `https://wa.me/51971541408?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    setCart([]);
    appliedCoupon = null;
    renderCart();
    closeCartModal();
    showNotification("Redirigiendo a WhatsApp...");
}

export {
    renderCoupons,
    addNewCoupon,
    editCoupon,
    updateCouponField,
    saveCoupon,
    cancelCouponEdit,
    deleteCoupon,
    applyCoupon,
    renderCart,
    clearCart,
    openCartModal,
    closeCartModal,
    buyAll
};