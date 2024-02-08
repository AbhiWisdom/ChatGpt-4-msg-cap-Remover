// ==UserScript==
// @name         Toggle GPT-4 Mobile & Telegram Channel Link
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add ability to toggle GPT-4 Mobile model in ChatGPT interface and link to Telegram channel.
// @author       Abhiraj Singh
// @match        http*://chat.openai.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const targetModelSlug = 'gpt-4-mobile'; // Slug for GPT-4 Mobile
    const conversationApiUrl = 'https://chat.openai.com/backend-api/conversation';
    const localStorageKey = 'gpt4MobileSwitcherEnabled';

    // Check stored preference
    let isSwitcherEnabled = localStorage.getItem(localStorageKey) === 'true';

    // UI Creation with Enhanced Styling
    const createSwitcherUI = () => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.zIndex = '10000';
        container.style.background = 'rgba(0, 0, 0, 0.5)';
        container.style.padding = '10px';
        container.style.borderRadius = '10px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';

        const label = document.createElement('label');
        label.innerText = 'GPT-4 Limit Bypass: ';
        label.style.color = '#FFF';
        label.style.fontWeight = 'bold';
        label.style.marginBottom = '10px';

        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.checked = isSwitcherEnabled;
        toggle.style.width = '40px';
        toggle.style.height = '20px';
        toggle.style.position = 'relative';
        toggle.style.appearance = 'none';
        toggle.style.backgroundColor = '#ccc';
        toggle.style.borderRadius = '10px';
        toggle.style.cursor = 'pointer';
        toggle.style.transition = 'background-color .3s';
        toggle.style.marginBottom = '20px';

        const slider = document.createElement('span');
        slider.style.position = 'absolute';
        slider.style.top = '2px';
        slider.style.left = '2px';
        slider.style.width = '16px';
        slider.style.height = '16px';
        slider.style.borderRadius = '50%';
        slider.style.background = '#FFF';
        slider.style.transition = 'transform .3s';

        toggle.onchange = (e) => {
            isSwitcherEnabled = e.target.checked;
            localStorage.setItem(localStorageKey, isSwitcherEnabled ? 'true' : 'false');
            toggle.style.backgroundColor = isSwitcherEnabled ? '#4CAF50' : '#ccc';
            slider.style.transform = isSwitcherEnabled ? 'translateX(20px)' : 'translateX(0)';
        };

        if(isSwitcherEnabled) {
            toggle.style.backgroundColor = '#4CAF50';
            slider.style.transform = 'translateX(20px)';
        }

        // Create the Telegram channel button
        const telegramButton = document.createElement('button');
        telegramButton.innerText = 'Telegram Channel';
        telegramButton.style.padding = '5px 10px';
        telegramButton.style.border = 'none';
        telegramButton.style.borderRadius = '5px';
        telegramButton.style.backgroundColor = '#0088cc';
        telegramButton.style.color = '#FFF';
        telegramButton.style.cursor = 'pointer';
        telegramButton.style.fontSize = '14px';
        telegramButton.style.fontWeight = 'bold';
        telegramButton.onclick = () => window.open('https://t.me/abyproof', '_blank');

        toggle.appendChild(slider);
        container.appendChild(label);
        container.appendChild(toggle);
        container.appendChild(telegramButton);
        document.body.appendChild(container);
    };

    // Modify Fetch
    window.fetch = new Proxy(window.fetch, {
        apply: function(target, that, args) {
            let [resource, options] = args;

            // Modify the request only if the switcher is enabled
            if (isSwitcherEnabled && resource.includes(conversationApiUrl) && options && options.body) {
                const body = JSON.parse(options.body);

                // Change model to GPT-4 Mobile
                body.model = targetModelSlug;

                // Adjustments for the GPT-4 model
                if (body.model.startsWith('gpt-4') && body.arkose_token) {
                    body.arkose_token = null;
                }

                options.body = JSON.stringify(body);
                args[1] = options;
            }

            return Reflect.apply(target, that, args);
        }
    });

    // Initialize UI once the document is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSwitcherUI);
    } else {
        createSwitcherUI();
    }
})();
