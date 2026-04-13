import { removeChat, getUserChats, getChat, postMessage } from "../services/api.js";

const socket = new WebSocket('ws://localhost:3000');

export function createNodeMessage (data) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('chat__message');

    const messageSender = document.createElement('h3');
    messageSender.classList.add('message__sender');
    messageSender.textContent = data.senderName;

    const messageText = document.createElement('p');
    messageText.classList.add('message__text');
    messageText.textContent = data.body;

    const messageTimestamp = document.createElement('span');
    messageTimestamp.classList.add('message__timestamp');
    messageTimestamp.textContent = data.createdAt;

    messageContainer.append(messageSender, messageText, messageTimestamp);

    return messageContainer;
}

export function createNodeListChat(data) {
    const chatsBlank = document.querySelector('.chats__list_blank');
    chatsBlank.style.display = 'none';

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

    chatListContainer.addEventListener('click', () => {
        createMessageWindow(data);
        restoreChatHistory(data);
    })

    if (data.has_unread) {
        name.classList.add('unread');
    }

    return chatListContainer;
}


export function createChatHeader(data) {
    const chatHeader = document.createElement('header');
    chatHeader.className = 'chat__header';

    const chatInfo = document.createElement('div');
    chatInfo.className = 'chat__info';
    
    const chatName = document.createElement('h3');
    chatName.textContent = data.peer_username;

    const chatRemove = document.createElement('button');
    chatRemove.className = 'chat__remove';

    const img = document.createElement('img');
    img.src = '/assets/icons/remove.svg'
    img.width = 24;
    img.height = 24;
    chatRemove.append(img);

    chatRemove.addEventListener('click', () => {
        removeChat(data.id).then(() => {
            const chatList = document.querySelector('.chats__list');
            chatList.innerHTML = '';

            getUserChats().then(chats => {
                chats.forEach(chatData => {
                    const chatListNode = createNodeListChat(chatData);
                    chatList.append(chatListNode)
                });
            });
        })

    })

    chatInfo.append(chatName);
    chatHeader.append(chatInfo, chatRemove);

    return chatHeader;
}

export async function restoreChatHistory(data) {
    const chatHistory = await getChat(data.id);
    if (chatHistory) {
        chatHistory.forEach(message => {
            const messageContainer = createNodeMessage(message);
            const chatWindow = document.querySelector('.chat__window');
            chatWindow.append(messageContainer);
        })
    }
}

export function createMessageWindow(data) {
    const chatContainer = document.querySelector('.chat__container');
    chatContainer.innerHTML = '';
    
    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat__window';

    const chatHeader = createChatHeader(data);
    const chatInput = createChatInput(data.id);
    
    chatContainer.append(chatHeader, chatWindow, chatInput);
}

function createChatInput(chatId) {
    const form = document.createElement('form');
    form.className = 'chat__input_form';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'chat__input';
    input.name = 'chat__text';
    input.required = true;
    input.placeholder = 'Введите сообщение';

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            sendMessage(chatId);
        }
    })

    const button = document.createElement('button');
    button.type = 'submit';
    button.className = 'input_btn';

    const img = document.createElement('img');
    img.src = '/assets/icons/arrow.svg';
    img.width = 24;
    img.height = 24;
    button.append(img);
    
    form.append(input, button);
    return form;
}

function sendMessage(chatId) {
    const chatInput = document.querySelector('.chat__input');
    const message = chatInput.value;
    
    if (message) {
        postMessage(chatId, message);
        const chatForm = document.querySelector('.chat__input_form');
        chatForm.reset();
    }
}

socket.onopen = () => {
    console.log('Соединение установлено');
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
  
    console.log('Сообщение:', data);
  };


