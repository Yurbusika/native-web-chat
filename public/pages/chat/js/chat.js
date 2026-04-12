import socket from "../../../src/services/socket.js";
import { userService } from "../../../src/services/user.js";

const currentUser = userService.getUser()
const username = currentUser.username;
const id = currentUser.id;

const profileName = document.querySelector('.profile__name');
profileName.textContent = username;

const chatList = document.querySelector('.chats__list');
const chatsBlank = document.querySelector('.chats__list_blank');

const chatsList = await getUserChats();

const chatWindow = document.querySelector('.chat__window');

console.log(chatsList)

if (!chatsList.length) {
    chatsBlank.style.display = 'flex';
} else {
    chatsList.forEach(data => {
        const chatListNode = createNodeListChat(data);
        chatList.append(chatListNode)
    });
}

const searchForm = document.querySelector('#searchUserForm');

if (!(searchForm instanceof HTMLFormElement)) {
    throw new Error('Search form not found');
}

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(searchForm);
    const username = formData.get('username');

    const companion = await findUsersByName(username);


    if (!companion) {
        // TODO: 
        alert('Такого пользователя не существует')
        return;
    }


    const peerId = companion.id;
    console.log(peerId)
    const chatResult = await createChat(peerId)
    console.log(chatResult)
})

async function getUserChats () {
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

async function findUsersByName (name) {
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

async function createChat(peerId) {
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

function startChat(componionId) {
    socket.connect();

}

function createNodeMessage (data) {
    //TODO:
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('chat__message');

    const messageSender = document.createElement('h3');
    messageSender.classList.add('message__sender');
    messageContainer.textContent = data;

    const messageText = document.createElement('p');
    messageText.classList.add('message__text');
    messageText.textContent = data;

    const messageTimestamp = document.createElement('span');
    messageTimestamp.classList.add('message__timestamp');
    messageTimestamp.textContent = data;

    messageContainer.append(messageSender, messageText, messageTimestamp);

    return messageContainer;
}

function createNodeListChat(data) {
    const chatListContainer = document.createElement('div');
    chatListContainer.className = 'list__chat';

    const name = document.createElement('h4');
    name.className = 'chat__name';
    name.textContent = data.peer_username;

    const updated = document.createElement('span');
    updated.className = 'chat__updated';

    const date = new Date(data.updated_at);
    updated.textContent = date.toLocaleTimeString();

    chatListContainer.append(name, updated);

    if (data.has_unread) {
        TODO:
    }

    return chatListContainer;
}