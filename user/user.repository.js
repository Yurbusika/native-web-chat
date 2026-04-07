import { getAsync } from '../shared/utils/db-helpers.js';
import { runAsync } from '../shared/utils/db-helpers.js';

const escapeLikePattern = (value) =>
  value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');

export const getUserByName = async (username) => {
  return await getAsync('SELECT * FROM users WHERE username = ?', [username]);
};

export const getUserById = async (id) => {
  return await getAsync('SELECT id, username FROM users WHERE id = ?', [id]);
};

export const createUser = async (username, hashedPassword) => {
  const { lastID } = await runAsync(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword]
  );
  return { id: lastID, username };
};

export const findUserByNameRepository = async (partialName) => {
  const pattern = `%${escapeLikePattern(partialName)}%`;
  return await getAsync(
    "SELECT id, username FROM users WHERE LOWER(username) LIKE LOWER(?) ESCAPE '\\'",
    [pattern]
  );
};