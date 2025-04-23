let isExtensionActive = false;

document.addEventListener('DOMContentLoaded', async () => {
    // Get initial state
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
        // Get current tab and execute content script
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: autoFillFeedback
        });
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

function autoFillFeedback() {
    // Get all table rows within tbody
    const tableRows = document.querySelectorAll('tbody tr');
    
    tableRows.forEach(row => {
        // Find radio buttons in this row
        const radios = row.querySelectorAll('input[type="radio"]');
        if (radios.length > 0) {
            radios[0].checked = true;
            radios[0].dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        // Find text fields in this row
        const textFields = row.querySelectorAll('input[type="text"], textarea');
        textFields.forEach(field => {
            field.value = '.';
            field.dispatchEvent(new Event('input', { bubbles: true }));
        });
    });
}
