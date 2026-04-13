import { removeChat, getUserChats, getChat, postMessage, getDetailChat } from "../services/api.js";
import { userService } from "../services/user.js";

const socket = new WebSocket('ws://localhost:3000');

export function createNodeMessage (data) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('chat__message');

    const headerContainer = document.createElement('div');
    headerContainer.classList.add('message__header');

    const messageSender = document.createElement('h3');
    messageSender.classList.add('message__sender');
    messageSender.textContent = data.senderName;

    const messageText = document.createElement('p');
    messageText.classList.add('message__text');
    messageText.textContent = data.body;

    const dateContainer = document.createElement('div');
    dateContainer.classList.add('message__timestamp');

    const messageTimestamp = document.createElement('span');
    messageTimestamp.classList.add('message__timestamp_time');
    const messageDate = document.createElement('span');
    messageDate.classList.add('message__timestamp_date');

    const date = new Date(data.created_at);
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString();

    messageTimestamp.textContent = timeString;
    messageDate.textContent = dateString;

    dateContainer.append(messageDate, messageTimestamp);
    headerContainer.append(messageSender, dateContainer);
    messageContainer.append(headerContainer, messageText);

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

        const url = new URL(window.location);
        url.searchParams.set('id', data.id);
        window.location.href = url.href;

        createMessageWindow();
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
    if (data) {
        chatName.textContent = data.peer_username;
    }

    const chatRemove = document.createElement('button');
    chatRemove.className = 'chat__remove';
    chatRemove.title = 'Удалить чат и сообщения';

    const img = document.createElement('img');
    img.src = '/assets/icons/remove.svg'
    img.width = 0;
    img.height = 0;
    chatRemove.append(img);

    if (data) {
        img.width = 24;
        img.height = 24;

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
    
            const chatContainer = document.querySelector('.chat__container');
            chatContainer.innerHTML = '';
        })
    }
    chatInfo.append(chatName);
    chatHeader.append(chatInfo, chatRemove);

    return chatHeader;
}

export function restoreChatHistory() {
    const url = new URL(window.location);
    const id = url.searchParams.get('id');

    const chatWindow = document.querySelector('.chat__window');
    chatWindow.innerHTML = '';
    const currentUser = userService.getUser();
    getChat(id).then(messages => {
        messages.forEach(message => {
            const messageContainer = createNodeMessage(message);
            chatWindow.append(messageContainer);

            if (message.sender_id === currentUser.id) {
                messageContainer.classList.add('message__self');
            }

            if(message === messages[messages.length - 1]) {
                messageContainer.scrollIntoView(false);
            }
        })
    });
}

export function createMessageWindow() {
    const url = new URL(window.location);
    const id = url.searchParams.get('id');

    if (!id) {
        const chatContainer = document.querySelector('.chat__container');
        chatContainer.innerHTML = '';

        const chatWindow = document.createElement('div');
        chatWindow.className = 'chat__window';

        const chatHeader = createChatHeader(null);
        const chatInput = createChatInput(null);
        
        chatContainer.append(chatHeader, chatWindow, chatInput);
        return;
    }

    getDetailChat(id).then(data => {
        const chatContainer = document.querySelector('.chat__container');
        chatContainer.innerHTML = '';
        
        const chatWindow = document.createElement('div');
        chatWindow.className = 'chat__window';

        const chatHeader = createChatHeader(data);
        const chatInput = createChatInput(id);
        
        chatContainer.append(chatHeader, chatWindow, chatInput);

        restoreChatHistory();
    })
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

    if(chatId) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
    
                sendMessage(chatId);
                restoreChatHistory()
            }
        })
    }

    const button = document.createElement('button');
    button.type = 'submit';
    button.className = 'input_btn';

    if(!chatId) {
        button.disabled = true;
    }

    button.addEventListener('click', () => {
        sendMessage(chatId);
        restoreChatHistory()
    })

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

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    restoreChatHistory();
    createNodeListChat();
  };


