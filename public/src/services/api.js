export async function getUserChats () {
    return fetch('/api/chats', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        }
        return data;
    })
    .catch(error => {
        console.error('Error:', error)
    })
}

export async function createChat(peerId) {
    return fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            peerId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        }
        return data;
    })
    .catch(error => console.error('Error:', error))
}

export async function findUsersByName (name) {
    const params = new URLSearchParams({
        name 
    })
    return fetch(`/api/users?${params}`, {
        method: 'GET',    
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error)
        }
        return data;
    })
    .catch(error => {
        console.error('Error:', error)
    })
}

export async function removeChat(id) {
    return fetch(`/api/chats/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        }
        return data;
    })
    .catch(error => console.error('Error:', error))
}

export async function getChat(id) {
    return fetch(`/api/chats/${id}/messages`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        }
        return data;
    })
    .catch(error => console.error('Error:', error))
}

export async function postMessage(chatId, message) {
    return fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            body: message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        }
        return data;
    })
    .catch(error => console.error('Error:', error))
}

export async function logoutUser() {
    return fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        }
    })
}

export async function getDetailChat(id) {
    return fetch(`/api/chats/${id}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        }
        return data;
    })
    .catch(error => console.error('Error:', error))
}