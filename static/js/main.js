// =================================================================
// AURA LUXURY JEWELRY - CLIENT SCRIPTS
// =================================================================

document.addEventListener('DOMContentLoaded', function () {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
        });
    }

    // 2. Auto-dismiss Flash Alerts
    const flashAlerts = document.querySelectorAll('.flash-alert');
    flashAlerts.forEach(function (alert) {
        setTimeout(function () {
            alert.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            alert.style.opacity = '0';
            alert.style.transform = 'translateX(100%)';
            setTimeout(function () { alert.remove(); }, 500);
        }, 4000);
    });

    // 3. Product Detail Gallery Thumbnails
    const thumbs = document.querySelectorAll('.thumb-item');
    const mainImg = document.getElementById('mainProductImage');
    thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            thumbs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const targetUrl = this.getAttribute('data-img');
            if (mainImg && targetUrl) {
                mainImg.style.opacity = '0.3';
                setTimeout(function () {
                    mainImg.src = targetUrl;
                    mainImg.style.opacity = '1';
                }, 150);
            }
        });
    });

    // 4. Product Variant Selection
    const variantBtns = document.querySelectorAll('.variant-btn');
    const variantInput = document.getElementById('selectedVariantId');
    const priceDisplay = document.getElementById('productPriceDisplay');
    const stockDisplay = document.getElementById('productStockDisplay');
    const skuDisplay = document.getElementById('productSkuDisplay');
    const addToCartBtn = document.getElementById('btnAddToCart');

    variantBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            variantBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const variantId = this.getAttribute('data-id');
            const price = parseFloat(this.getAttribute('data-price') || 0);
            const stock = parseInt(this.getAttribute('data-stock') || 0);
            const sku = this.getAttribute('data-sku') || '';

            if (variantInput) variantInput.value = variantId;
            if (priceDisplay) {
                priceDisplay.textContent = new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
            }
            if (skuDisplay) skuDisplay.textContent = 'Mã SKU: ' + sku;
            if (stockDisplay) {
                if (stock > 0) {
                    stockDisplay.innerHTML = `<span style="color: #4ade80;">● Còn hàng (${stock} sản phẩm sẵn có)</span>`;
                    if (addToCartBtn) addToCartBtn.disabled = false;
                } else {
                    stockDisplay.innerHTML = `<span style="color: #f87171;">● Tạm hết hàng</span>`;
                    if (addToCartBtn) addToCartBtn.disabled = true;
                }
            }
        });
    });

    // 5. Quantity Selector Buttons
    const qtyInput = document.getElementById('quantityInput');
    const btnMinus = document.getElementById('btnQtyMinus');
    const btnPlus = document.getElementById('btnQtyPlus');

    if (qtyInput && btnMinus && btnPlus) {
        btnMinus.addEventListener('click', function () {
            let current = parseInt(qtyInput.value) || 1;
            if (current > 1) qtyInput.value = current - 1;
        });
        btnPlus.addEventListener('click', function () {
            let current = parseInt(qtyInput.value) || 1;
            qtyInput.value = current + 1;
        });
    }

    // 6. AJAX Add to Cart
    const addCartForm = document.getElementById('addToCartForm');
    if (addCartForm) {
        addCartForm.addEventListener('submit', function (e) {
            // Nếu người dùng bấm "Mua ngay", để form submit thông thường
            const submitter = e.submitter;
            if (submitter && submitter.getAttribute('name') === 'buy_now') {
                return;
            }

            e.preventDefault();
            const formData = new FormData(addCartForm);

            fetch(addCartForm.action, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showToast(data.message, 'success');
                    // Cập nhật số lượng giỏ hàng trên header
                    const cartCountBadges = document.querySelectorAll('.cart-count-badge');
                    cartCountBadges.forEach(b => b.textContent = data.cart_count);
                } else {
                    showToast(data.message, 'danger');
                }
            })
            .catch(err => {
                console.error(err);
                showToast('Có lỗi xảy ra khi thêm vào giỏ hàng.', 'danger');
            });
        });
    }

    // 7. Wishlist removed in refactoring

    // 8. Size Guide Modal
    const openSizeGuide = document.getElementById('openSizeGuide');
    const sizeGuideModal = document.getElementById('sizeGuideModal');
    const closeSizeGuide = document.getElementById('closeSizeGuide');

    if (openSizeGuide && sizeGuideModal) {
        openSizeGuide.addEventListener('click', function () {
            sizeGuideModal.classList.add('active');
        });
    }
    if (closeSizeGuide && sizeGuideModal) {
        closeSizeGuide.addEventListener('click', function () {
            sizeGuideModal.classList.remove('active');
        });
        sizeGuideModal.addEventListener('click', function (e) {
            if (e.target === sizeGuideModal) {
                sizeGuideModal.classList.remove('active');
            }
        });
    }
});

// Toast Helper Function
function showToast(message, type = 'success') {
    let container = document.querySelector('.flash-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'flash-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `flash-alert flash-${type}`;
    toast.innerHTML = `
        <div style="display:flex; align-items:center; gap: 8px;">
            <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
            <span>${message}</span>
        </div>
    `;

    container.appendChild(toast);
    setTimeout(function () {
        toast.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(function () { toast.remove(); }, 500);
    }, 3500);
}
