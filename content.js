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

        // Select random radio button (0-3) in each group
        Object.values(groups).forEach(group => {
            if (group.length > 0) {
                const randomIndex = Math.floor(Math.random() * Math.min(4, group.length));
                group[randomIndex].checked = true;
                group[randomIndex].dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        // Fill text fields with dots
        textFields.forEach(field => {
            field.value = '.';
            field.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // Find and click submit button
        setTimeout(() => {
            const submitButton = Array.from(document.querySelectorAll('button')).find(
                button => button.textContent.toLowerCase().includes('submit')
            );
            
            if (submitButton) {
                submitButton.click();
            }
        }, 500); // Small delay to ensure form is filled first

        sendResponse({ success: true });
    }
});
