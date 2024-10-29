// Helper function to save a value in local storage
function saveToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

// Load saved values from local storage on page load
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('urlInput').value = localStorage.getItem('urlInput') || '';
    document.getElementById('endpointInput').value = localStorage.getItem('endpointInput') || '';
    document.getElementById('methodSelect').value = localStorage.getItem('methodSelect') || 'GET';
    document.getElementById('headersInput').value = localStorage.getItem('headersInput') || '';
    document.getElementById('bodyInput').value = localStorage.getItem('bodyInput') || '';
});

// Save each field to local storage when changed
document.getElementById('urlInput').addEventListener('input', (e) => saveToLocalStorage('urlInput', e.target.value));
document.getElementById('endpointInput').addEventListener('input', (e) => saveToLocalStorage('endpointInput', e.target.value));
document.getElementById('methodSelect').addEventListener('change', (e) => saveToLocalStorage('methodSelect', e.target.value));
document.getElementById('headersInput').addEventListener('input', (e) => saveToLocalStorage('headersInput', e.target.value));
document.getElementById('bodyInput').addEventListener('input', (e) => saveToLocalStorage('bodyInput', e.target.value));

// Clear local storage and reset fields when "Clear" button is clicked
document.getElementById('clearStorageButton').addEventListener('click', () => {
    localStorage.clear();
    document.getElementById('urlInput').value = 'http://127.0.0.1:3000';
    document.getElementById('endpointInput').value = '/test';
    document.getElementById('methodSelect').value = 'GET';
    document.getElementById('headersInput').value = '';
    document.getElementById('bodyInput').value = '';
    document.getElementById('apiResponse').textContent = '';
    document.getElementById('responseTime').textContent = '';
    document.getElementById('requestUrl').textContent = '';
});

// API request handling
async function handleRequest() {
    const url = document.getElementById('urlInput').value;
    const endpoint = document.getElementById('endpointInput').value;
    const method = document.getElementById('methodSelect').value;
    const headersInput = document.getElementById('headersInput').value;
    const bodyInput = document.getElementById('bodyInput').value;

    // Capture des nouvelles options
    const mode = document.getElementById('modeSelect').value;
    const credentials = document.getElementById('credentialsSelect').value;
    const cache = document.getElementById('cacheSelect').value;
    const redirect = document.getElementById('redirectSelect').value;
    const referrerPolicy = document.getElementById('referrerPolicySelect').value;
    const integrity = document.getElementById('integrityInput').value;
    const keepalive = document.getElementById('keepaliveCheckbox').checked;
    
    const fullUrl = url + endpoint;
    document.getElementById('requestUrl').textContent = `Request URL: ${fullUrl}`;

    let headers;
    try {
        headers = headersInput ? JSON.parse(headersInput) : {};
    } catch (error) {
        alert('Invalid JSON format in headers.');
        return;
    }

    let body = null;
    if (method !== 'GET' && bodyInput) {
        try {
            body = JSON.stringify(JSON.parse(bodyInput));
        } catch (error) {
            alert('Invalid JSON format in body.');
            return;
        }
    }

    if (method !== 'GET' && body) {
        headers['Content-Type'] = 'application/json';
    }

    const startTime = performance.now();

    try {
        const response = await fetch(fullUrl, {
            method,
            headers,
            body,
            mode,
            credentials,
            cache,
            redirect,
            referrerPolicy,
            integrity,
            keepalive
        });

        const endTime = performance.now();
        const responseTime = (endTime - startTime).toFixed(3);

        const responseData = await response.json();
        document.getElementById('apiResponse').textContent = JSON.stringify(responseData, null, 2);
        document.getElementById('responseTime').textContent = `Response Time: ${responseTime} ms`;
        Prism.highlightElement(document.getElementById('apiResponse'));

    } catch (error) {
        document.getElementById('apiResponse').textContent = `Error: ${error.message}`;
        document.getElementById('responseTime').textContent = 'Response Time: N/A';
        Prism.highlightElement(document.getElementById('apiResponse'));
    }
}


// Attach click event to send button
document.getElementById('sendButton').addEventListener('click', handleRequest);