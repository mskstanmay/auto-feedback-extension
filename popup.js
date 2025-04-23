let isExtensionActive = false;

document.addEventListener('DOMContentLoaded', async () => {
    const response = await chrome.runtime.sendMessage({type: 'getStatus'});
    updateUI(response.status);
});

document.getElementById('toggleExtension').addEventListener('click', async () => {
    const response = await chrome.runtime.sendMessage({
        type: 'toggleExtension',
        value: !isExtensionActive
    });
    
    updateUI(response.status);
    
    if (response.status) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.tabs.sendMessage(tab.id, { action: 'autoFill' });
    }
});

function updateUI(isActive) {
    isExtensionActive = isActive;
    const button = document.getElementById('toggleExtension');
    const statusDot = document.getElementById('status');
    
    button.textContent = isActive ? 'Turn OFF' : 'Turn ON';
    button.classList.toggle('active', isActive);
    statusDot.classList.toggle('active', isActive);
}
