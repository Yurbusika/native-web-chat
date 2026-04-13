import { userService } from "../../../src/services/user.js";

import { getUserChats, createChat, findUsersByName, removeChat, getChat, logoutUser } from "../../../src/services/api.js";
import { createNodeMessage, createNodeListChat } from "../../../src/helpers/helpers.js";

const currentUser = userService.getUser()
const username = currentUser.username;
const id = currentUser.id;

const userName = document.querySelector('.header__name');
userName.textContent = username;

const chatList = document.querySelector('.chats__list');
const chatsBlank = document.querySelector('.chats__list_blank');
const chatWindow = document.querySelector('.chat__window');

const chatsList = await getUserChats();
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
        alert('Такого пользователя не существует')
        return;
    }

    const peerId = companion.id;
    console.log(peerId)
    const chatResult = await createChat(peerId)
    console.log(chatResult)

    const currentChats = await getUserChats();

    chatList.innerHTML = '';

    currentChats.forEach(data => {
        const chatListNode = createNodeListChat(data);
        chatList.append(chatListNode)
    });

    searchForm.reset();
})

const logoutBtn = document.querySelector('#logoutBtn');
logoutBtn.addEventListener('click', () => {
    logoutUser();
    window.location.href = '/login';
});