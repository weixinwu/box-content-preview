let token;
export function setToken(aToken) {
    token = aToken;
}

/**
 * @return {{name: string, avatar_url: string}}
 */
export async function getUser(id) {
    return await request(`users/${id}`);
}

/**
 * @return {{name: string, avatar_url: string}}
 */
export async function getCurrentUser() {
    return await request('users/me');
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
