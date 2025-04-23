// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'autoFill') {
        const radioGroups = document.querySelectorAll('input[type="radio"]');
        const textFields = document.querySelectorAll('input[type="text"], textarea');

        // Group radio buttons by name
        const groups = {};
        radioGroups.forEach(radio => {
            if (!groups[radio.name]) {
                groups[radio.name] = [];
            }
            groups[radio.name].push(radio);
        });

        // Select first radio button in each group
        Object.values(groups).forEach(group => {
            if (group.length > 0) {
                group[0].checked = true;
                group[0].dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        // Fill text fields with dots
        textFields.forEach(field => {
            field.value = '.';
            field.dispatchEvent(new Event('input', { bubbles: true }));
        });

        sendResponse({ success: true });
    }
});
