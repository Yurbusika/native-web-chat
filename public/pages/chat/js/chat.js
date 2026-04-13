import { userService } from "../../../src/services/user.js";

import { getUserChats, createChat, findUsersByName, logoutUser } from "../../../src/services/api.js";
import { createNodeListChat, createMessageWindow} from "../../../src/helpers/helpers.js";

function getRequiredHtmlElement(selector) {
    const el = document.querySelector(selector);
    if (!(el instanceof HTMLElement)) {
        throw new Error(`${selector} not found`);
    }
    return el;
}

const currentUser = userService.getUser()
const username = currentUser.username;

const userName = document.querySelector('.header__name');
userName.textContent = username;

const chatList = getRequiredHtmlElement('.chats__list');
const chatsBlank = getRequiredHtmlElement('.chats__list_blank');

createMessageWindow();

async function refreshChatList() {
    const currentChats = await getUserChats();
    chatList.innerHTML = '';
    if (!Array.isArray(currentChats) || !currentChats.length) {
        chatsBlank.style.display = 'flex';
    } else {
        chatsBlank.style.display = 'none';
        currentChats.forEach((data) => {
            const chatListNode = createNodeListChat(data);
            chatList.append(chatListNode);
        });
    }
}

await refreshChatList();

const searchForm = document.querySelector('#searchUserForm');
const userSearchResults = document.querySelector('#userSearchResults');

if (!(searchForm instanceof HTMLFormElement)) {
    throw new Error('Search form not found');
}
if (!(userSearchResults instanceof HTMLElement)) {
    throw new Error('userSearchResults not found');
}

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(searchForm);
    const query = formData.get('username');

    if (typeof query !== 'string' || !query.trim()) {
        alert('Введите имя');
        return;
    }

    const users = await findUsersByName(query.trim());

    userSearchResults.replaceChildren();

    if (!users.length) {
        userSearchResults.hidden = true;
        alert('Пользователи не найдены');
        return;
    }

    userSearchResults.hidden = false;

    users.forEach((user) => {
        const row = document.createElement('div');
        row.className = 'user-search-result';

        const nameEl = document.createElement('span');
        nameEl.className = 'user-search-result__name';
        nameEl.textContent = user.username;

        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'user-search-result__add';
        addBtn.textContent = 'Добавить';

        addBtn.addEventListener('click', async () => {
            addBtn.disabled = true;
            const result = await createChat(user.id);
            if (!result || (typeof result === 'object' && 'error' in result)) {
                addBtn.disabled = false;
                return;
            }
            await refreshChatList();
            userSearchResults.replaceChildren();
            userSearchResults.hidden = true;
            searchForm.reset();
        });

        row.append(nameEl, addBtn);
        userSearchResults.append(row);
    });
})

const logoutBtn = document.querySelector('#logoutBtn');
logoutBtn.addEventListener('click', () => {
    logoutUser();
    window.location.href = '/login';
});
