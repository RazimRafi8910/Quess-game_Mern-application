

export function getCookieByName(cookieString, name) {
    const cookies = cookieString.split('; ');
    const token = cookies.find(c => c.startsWith(name + '='));
    return token ? token.split('=')[1] : null
}
