// =================================================================
// AURA LUXURY JEWELRY - AI JEWELRY CONSULTANT SCRIPT
// =================================================================

document.addEventListener('DOMContentLoaded', function () {
    const floatingBtn = document.getElementById('aiFloatingBtn');
    const chatWindow = document.getElementById('aiChatWindow');
    const closeBtn = document.getElementById('aiChatClose');
    const chatForm = document.getElementById('aiChatForm');
    const chatInput = document.getElementById('aiChatInput');
    const chatMessages = document.getElementById('aiChatMessages');
    const chipBtns = document.querySelectorAll('.chip-btn');

    // Toggle Floating Chat Window
    if (floatingBtn && chatWindow) {
        floatingBtn.addEventListener('click', function () {
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active')) {
                if (chatInput) chatInput.focus();
            }
        });
    }

    if (closeBtn && chatWindow) {
        closeBtn.addEventListener('click', function () {
            chatWindow.classList.remove('active');
        });
    }

    // Quick suggestion chips
    chipBtns.forEach(function (chip) {
        chip.addEventListener('click', function () {
            const query = this.getAttribute('data-query') || this.textContent.trim();
            if (chatInput) {
                chatInput.value = query;
                if (chatForm) {
                    sendMessage(query);
                }
            }
        });
    });

    // Chat submit
    if (chatForm) {
        chatForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const msg = chatInput.value.trim();
            if (!msg) return;
            sendMessage(msg);
        });
    }

    function appendMessage(sender, text, products = [], meta = {}) {
        if (!chatMessages) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg msg-${sender}`;

        // Nếu là phản hồi AI -> Hiển thị badge nguồn (Regex Intent Form sẵn hay DeepSeek LLM)
        if (sender === 'ai' && meta && meta.engine) {
            const isML = meta.engine.includes('Logistic') || meta.engine.includes('Regression');
            const badgeIcon = isML ? 'fa-bolt' : 'fa-brain';
            const badgeColor = isML ? '#facc15' : '#60a5fa';
            const confText = meta.confidence ? ` (${meta.confidence}%)` : '';
            const badgeLabel = isML ? `⚡ Logistic Regression: ${meta.intent_name || 'Form sẵn'}${confText}` : `🤖 ${meta.model || 'DeepSeek LLM'}`;

            const badgeElem = document.createElement('div');
            badgeElem.style.fontSize = '0.72rem';
            badgeElem.style.color = badgeColor;
            badgeElem.style.marginBottom = '6px';
            badgeElem.style.fontWeight = '600';
            badgeElem.style.display = 'flex';
            badgeElem.style.alignItems = 'center';
            badgeElem.style.gap = '5px';
            badgeElem.innerHTML = `<i class="fa-solid ${badgeIcon}"></i> <span>[${badgeLabel}]</span>`;
            msgDiv.appendChild(badgeElem);
        }

        // Format basic markdown like **bold** and newlines
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        const textContent = document.createElement('div');
        textContent.innerHTML = formattedText;
        msgDiv.appendChild(textContent);

        // If AI recommended products, render product cards inside the bubble
        if (products && products.length > 0) {
            const prodList = document.createElement('div');
            prodList.style.marginTop = '10px';
            prodList.style.display = 'flex';
            prodList.style.flexDirection = 'column';
            prodList.style.gap = '8px';

            products.forEach(p => {
                const pCard = document.createElement('div');
                pCard.style.display = 'flex';
                pCard.style.alignItems = 'center';
                pCard.style.gap = '10px';
                pCard.style.background = 'rgba(0,0,0,0.3)';
                pCard.style.padding = '8px';
                pCard.style.borderRadius = '8px';
                pCard.style.border = '1px solid rgba(212,175,55,0.2)';

                const formattedPrice = new Intl.NumberFormat('vi-VN').format(p.price) + ' ₫';

                pCard.innerHTML = `
                    <img src="${p.image}" alt="${p.name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px;">
                    <div style="flex: 1; font-size: 0.8rem;">
                        <a href="/product/${p.slug}" style="font-weight: 600; color: #f5f5f7; display: block; line-height: 1.2; margin-bottom: 3px;">${p.name}</a>
                        <span style="color: #f3e5ab; font-weight: 700;">${formattedPrice}</span>
                    </div>
                    <a href="/product/${p.slug}" class="btn btn-sm btn-outline-gold" style="padding: 4px 8px; font-size: 0.7rem;">Xem</a>
                `;
                prodList.appendChild(pCard);
            });
            msgDiv.appendChild(prodList);
        }

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage(msg) {
        appendMessage('user', msg);
        if (chatInput) chatInput.value = '';

        // Typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-msg msg-ai typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `<em>AuraStylist đang xử lý phân loại câu hỏi...</em>`;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        fetch('/api/ai-consultant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: msg })
        })
        .then(res => res.json())
        .then(data => {
            const typing = document.getElementById('typingIndicator');
            if (typing) typing.remove();

            if (data.success) {
                appendMessage('ai', data.reply, data.products || [], data);
            } else {
                appendMessage('ai', 'Xin lỗi, có lỗi khi kết nối với chuyên gia tư vấn. Vui lòng thử lại.');
            }
        })
        .catch(err => {
            console.error(err);
            const typing = document.getElementById('typingIndicator');
            if (typing) typing.remove();
            appendMessage('ai', 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.');
        });
    }
});
