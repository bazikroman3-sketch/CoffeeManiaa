document.addEventListener('DOMContentLoaded', () => {
    // 1. Динамический год в подвале
    const yearEl = document.querySelector('.current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2. Корзина
    let cart = [];
    let cartCount = 0;
    const cartCounterEl = document.querySelector('.cart-count');
    const cartModal = document.querySelector('.cart-modal');
    const notificationModal = document.querySelector('.notification-modal');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalEl = document.querySelector('.cart-total-price');

    // Открытие корзины
    const cartIcon = document.querySelector('.cart');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            openCartModal();
        });
    }

    // Закрытие окна
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => closeAllModals());
    });

    const closeNotificationBtn = document.querySelector('.modal-close-notification');
    if (closeNotificationBtn) {
        closeNotificationBtn.addEventListener('click', () => {
            if (notificationModal) {
                notificationModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeAllModals();
        });
    });

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            closeCartModal();
            showNotification();
        });
    }

    // Добавление в корзину
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productName = btn.dataset.product || 'Товар';
            const productPrice = btn.dataset.price || 0;
            addToCart(productName, productPrice);
        });
    });

    function addToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price: parseFloat(price), quantity: 1 });
        }
        cartCount++;
        updateCartCounter();
        console.log(`Товар [${name}] добавлен`);
    }

    function updateCartCounter() {
        if (cartCounterEl) cartCounterEl.textContent = cartCount;
    }

    function openCartModal() {
        if (!cartModal) return;
        renderCartItems();
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCartModal() {
        if (!cartModal) return;
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function closeAllModals() {
        if (cartModal) cartModal.classList.remove('active');
        if (notificationModal) notificationModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function renderCartItems() {
        if (!cartItemsContainer) return;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="cart-empty">Корзина пуста</div>';
            if (cartTotalEl) cartTotalEl.textContent = '0 ₽';
            return;
        }
        let html = '';
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            html += `
                <div class="cart-item">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-qty">x${item.quantity}</span>
                </div>`;
        });
        cartItemsContainer.innerHTML = html;
        if (cartTotalEl) cartTotalEl.textContent = `${total} ₽`;
    }

    function showNotification() {
        if (!notificationModal) return;
        notificationModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        cart = [];
        cartCount = 0;
        updateCartCounter();
    }

    // 3. Бургер-меню
    const burger = document.querySelector('.burger');
    const navList = document.querySelector('.nav-list');
    if (burger && navList) {
        burger.addEventListener('click', () => navList.classList.toggle('open'));
    }

    // 4. Табы
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                const tabId = btn.dataset.tab;
                if (tabId) document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // 5. Фильтры каталога
    const filterLinks = document.querySelectorAll('.aside a[data-filter]');
    const catalogCards = document.querySelectorAll('.catalog-grid .card');

    if (filterLinks.length && catalogCards.length) {
        filterLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const filterValue = link.dataset.filter;
                filterLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                catalogCards.forEach(card => {
                    const cardCategory = card.dataset.category;
                    card.style.display = (filterValue === 'all' || filterValue === cardCategory) ? 'block' : 'none';
                });
            });
        });
    }


// --- Калькулятор крепости ---
const beanSelect = document.getElementById('beanType');
const grindSelect = document.getElementById('grindSize');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

if (beanSelect && grindSelect && strengthBar && strengthText) {
    
    function updateStrength() {
        const base = parseInt(beanSelect.value) || 0;
        const modifier = parseInt(grindSelect.value) || 0;
        let strength = Math.min(100, Math.max(0, base + modifier));

        // Анимация ширины полоски
        strengthBar.style.width = strength + '%';
        strengthText.textContent = `Крепость: ${strength}%`;
        if (strength < 40) {
            strengthBar.style.background = 'linear-gradient(90deg, #91602f, #91602f)';
        } else if (strength < 70) {
            strengthBar.style.background = 'linear-gradient(90deg, #91602f, #91602f)';
        } else {
            strengthBar.style.background = 'linear-gradient(90deg, #91602f, #91602f)';
        }
    }

    beanSelect.addEventListener('change', updateStrength);
    grindSelect.addEventListener('change', updateStrength);
    
    updateStrength();
}



    // 7. Рекомендации по завариванию
    const tipsContainer = document.getElementById('brewingTips');
    const tipsText = document.getElementById('tipsText');
    const brewingTips = {
        'Эрл Грей': 'Заваривайте 1 ч.л. на 200мл воды при 95°C в течение 3-5 минут. Идеален с каплей молока.',
        'Дарджилинг': 'Утончённый чай. Температура воды 90-95°C, настаивать 3 минуты.',
        'Супремо': 'Колумбийский кофе с нотами карамели. Помол средний, температура воды 90-93°C.',
        'Стеклянный заварник': 'Отлично подходит для зелёного и белого чая. Позволяет наблюдать за раскрытием листа.',
        'Турка': 'Используйте мелкий помол (в пыль). Нагревайте на медленном огне до поднятия пенки (не кипятите!).',
        'Френч-пресс': 'Крупный помол, 92-94°C, настаивать 4 минуты. Полнотелый напиток.'
    };

    if (catalogCards.length && tipsContainer && tipsText) {
        catalogCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Игнорируем клик, если нажата кнопка "В корзину"
                if (e.target.closest('.add-to-cart')) return;

                const name = card.dataset.name || card.querySelector('h2, h3, p').textContent.trim();
                const tip = brewingTips[name] || '📖 Классический способ: 10г на 150мл воды, 90-95°C, настаивать 4 минуты.';
                
                tipsText.textContent = tip;
                tipsContainer.classList.remove('hidden');
                tipsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });
    }
});