let token;
export function setToken(aToken) {
    token = aToken;
}

const users = {};

/**
 * @return {{name: string, avatar_url: string}}
 */
export async function getUser(id) {
    if (!users[id]) {
        users[id] = await request(`users/${id}`);
    }
    return users[id];
}

/**
 * @return {{name: string, avatar_url: string}}
 */
export async function getCurrentUser() {
    return await request('users/me');
}

export function getUserById() {
    const fakeId = Math.floor(Math.random() * 5);
    const user = [
        {
            name: 'Inesita Du Pre',
            initials: 'ID',
        },
        {
            name: 'Nani Shovelbottom',
            initials: 'NS',
        },
        {
            name: 'Sly Meysham',
            initials: 'SM',
        },
        {
            name: 'Larbette Yosephs',
            initials: 'LY',
        },
        {
            name: 'Melicent Biffen',
            initials: 'MB',
        },
    ];
    return user[fakeId];
}
async function request(url) {
    if (!token) throw new Error('Token is not set');

    const response = await fetch(`https://api.box.com/2.0/${url}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
        },
    });
    return response.json();
}
