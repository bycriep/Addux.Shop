console.log("[MAIN.JS] SCRIPT PARSE START");

import { fetchExchangeRate, initializeMatrixEffect, showNotification } from "./core.js";
import { renderProducts, addNewProduct } from "./products.js";
import { renderCoupons, applyCoupon, renderCart, openCartModal, clearCart, closeCartModal, buyAll } from "./cart.js";
import { renderEvents, addNewEvent } from "./events.js";
import { renderCommunityLinks, renderContactButtons, updateWhatsAppLogo, whatsappLogo, addNewWhatsAppChannel, addNewWhatsAppBot, addNewTelegramChannel, addNewTelegramBot, addNewContactButton } from "./community.js";
import { adminCredentials, generateSessionToken, isAdmin, updateUI, cancelAdminLogin, setSessionToken, editCourseMessage, saveCourseMessage, cancelCourseMessageEdit } from "./admin.js";

console.log("[MAIN.JS] Imports loaded (or at least attempted)");

let titles = JSON.parse(localStorage.getItem("titles")) || {
    "main-title": "Addux Shop",
    "productos-title": "Productos de Streaming",
    "productos-subtitle": "Explora nuestra selección de servicios de streaming como Prime Video, Deezer, Vix, y más.",
    "cursos-title": "Cursos",
    "oferta-title": "Oferta",
    "oferta-subtitle": "No te pierdas nuestras promociones especiales.",
    "comunidad-title": "Comunidad",
    "contactanos-title": "Contáctanos",
    "contact-number": "+51 971 541 408",
    "contact-instructions": "Para ingresar a la comunidad, envía un mensaje al número de WhatsApp con la palabra clave <strong>/grupo</strong> y para ver mi menú escribe <strong>/cmds</strong>"
};

if (!localStorage.getItem("titles")) {
    localStorage.setItem("titles", JSON.stringify(titles));
}

console.log("[MAIN.JS] Before fetchExchangeRate and initializeMatrixEffect");
fetchExchangeRate();
console.log("[MAIN.JS] After fetchExchangeRate");
initializeMatrixEffect();
console.log("[MAIN.JS] After initializeMatrixEffect. Inicializando efecto Matrix...");

document.addEventListener("DOMContentLoaded", () => {
    console.log("[MAIN.JS] DOMContentLoaded event fired. Página cargada, inicializando...");
    const tabs = document.querySelectorAll(".tab");
    const loginForm = document.getElementById("login-form-element");
    const logoutButton = document.getElementById("logout-button");
    const adminIcon = document.getElementById("admin-icon");
    const adminLoginSection = document.getElementById("admin-login-section");
    const cartButton = document.getElementById("cart-button");
    const applyCouponBtn = document.getElementById("apply-coupon-btn");
    const clearCartBtn = document.querySelector(".clear-cart-btn");
    const buyAllBtn = document.querySelector(".buy-all-btn");
    const closeCartBtn = document.querySelector("#cart-modal .cancel-btn");

    const addProductBtn = document.querySelector("#productos .add-new-btn");
    const addCourseBtn = document.querySelector("#cursos .add-new-btn");
    const addEventBtn = document.querySelector("#oferta .add-new-btn");
    const addWhatsAppChannelBtn = document.querySelector("#comunidad button:nth-of-type(1)");
    const addWhatsAppBotBtn = document.querySelector("#comunidad button:nth-of-type(2)");
    const addTelegramChannelBtn = document.querySelector("#comunidad button:nth-of-type(3)");
    const addTelegramBotBtn = document.querySelector("#comunidad button:nth-of-type(4)");
    const addContactBtn = document.querySelector("#comunidad button:nth-of-type(5)");
    const addCouponBtn = document.querySelector("#cupones .add-new-btn");

    const editCourseMessageBtn = document.querySelector("#cursos .edit-btn");
    const saveCourseMessageBtn = document.querySelector("#course-message-edit .save-btn");
    const cancelCourseMessageBtn = document.querySelector("#course-message-edit .cancel-btn");

    const logoElement = document.getElementById("whatsapp-logo");
    if (logoElement) {
        logoElement.src = whatsappLogo;
    }

    const fileInput = document.getElementById("whatsapp-logo-file");
    const urlInput = document.getElementById("whatsapp-logo-url");
    if (fileInput) fileInput.addEventListener("change", updateWhatsAppLogo);
    if (urlInput) urlInput.addEventListener("change", updateWhatsAppLogo);

    Object.keys(titles).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = titles[id];
        }
        const inputElement = document.getElementById(`${id}-input`);
        if (inputElement) {
            inputElement.value = titles[id];
            inputElement.addEventListener("change", () => updateTitle(id, inputElement.value));
        }
    });
    document.title = titles["main-title"];

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));
            const targetTab = document.getElementById(tab.getAttribute("data-tab"));
            if (targetTab) {
                targetTab.classList.add("active");
            }
            console.log("[MAIN.JS] Cambiando a pestaña:", tab.getAttribute("data-tab"));
            console.log("[MAIN.JS] Intentando llamar a renderProducts DESPUÉS de cambiar de pestaña...");
            try {
                renderProducts(isAdmin());
                console.log("[MAIN.JS] renderProducts llamado con éxito DESPUÉS de cambiar de pestaña.");
            } catch (e) {
                console.error("[MAIN.JS] Error al llamar a renderProducts DESPUÉS de cambiar de pestaña:", e);
            }
            renderCoupons();
            updateUI();
        });
    });

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const secretKey = formData.get("secretKey");
            const hashedSecretKey = sha256(secretKey);

            if (hashedSecretKey === adminCredentials.secretKey) {
                const newToken = generateSessionToken();
                setSessionToken(newToken);
                localStorage.setItem("isAdmin", "true");
                document.getElementById("login-error").style.display = "none";
                adminLoginSection.style.display = "none";
                updateUI();
                showNotification("Sesión iniciada con éxito");
            } else {
                document.getElementById("login-error").style.display = "block";
            }
        });
        const cancelBtn = loginForm.querySelector("button[type='button']");
        if (cancelBtn) cancelBtn.addEventListener("click", cancelAdminLogin);
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("isAdmin");
            localStorage.removeItem("sessionToken");
            setSessionToken(null);
            updateUI();
            showNotification("Sesión cerrada con éxito");
        });
    }

    if (adminIcon) {
        adminIcon.addEventListener("click", () => {
            adminLoginSection.style.display = "flex";
        });
    }

    if (cartButton) cartButton.addEventListener("click", openCartModal);
    if (applyCouponBtn) applyCouponBtn.addEventListener("click", () => applyCoupon(document.getElementById("coupon-input").value));
    if (clearCartBtn) clearCartBtn.addEventListener("click", clearCart);
    if (buyAllBtn) buyAllBtn.addEventListener("click", buyAll);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartModal);

    if (addProductBtn) addProductBtn.addEventListener("click", () => addNewProduct("productos"));
    if (addCourseBtn) addCourseBtn.addEventListener("click", () => addNewProduct("cursos"));
    if (addEventBtn) addEventBtn.addEventListener("click", () => addNewEvent(isAdmin()));
    if (addWhatsAppChannelBtn) addWhatsAppChannelBtn.addEventListener("click", addNewWhatsAppChannel);
    if (addWhatsAppBotBtn) addWhatsAppBotBtn.addEventListener("click", addNewWhatsAppBot);
    if (addTelegramChannelBtn) addTelegramChannelBtn.addEventListener("click", addNewTelegramChannel);
    if (addTelegramBotBtn) addTelegramBotBtn.addEventListener("click", addNewTelegramBot);
    if (addContactBtn) addContactBtn.addEventListener("click", () => addNewContactButton(isAdmin()));
    // const addCouponBtn = document.querySelector("#cupones .add-new-btn"); // Already defined
    // if (addCouponBtn) addCouponBtn.addEventListener("click", addNewCoupon); // addNewCoupon is not defined in this scope

    if (editCourseMessageBtn) editCourseMessageBtn.addEventListener("click", editCourseMessage);
    if (saveCourseMessageBtn) saveCourseMessageBtn.addEventListener("click", saveCourseMessage);
    if (cancelCourseMessageBtn) cancelCourseMessageBtn.addEventListener("click", cancelCourseMessageEdit);

    console.log("[MAIN.JS] Intentando llamar a renderProducts por primera vez (DOMContentLoaded)...");
    try {
        renderProducts(isAdmin());
        console.log("[MAIN.JS] renderProducts llamado con éxito por primera vez (DOMContentLoaded).");
    } catch (e) {
        console.error("[MAIN.JS] Error al llamar a renderProducts por primera vez (DOMContentLoaded):", e);
    }
    renderCart();
    updateUI();
});

function updateTitle(id, value) {
    titles[id] = value;
    localStorage.setItem("titles", JSON.stringify(titles));
    document.getElementById(id).textContent = value;
    if (id === "main-title") {
        document.title = value;
    }
    showNotification("Título actualizado");
}

export { editCourseMessage, saveCourseMessage, cancelCourseMessageEdit };

