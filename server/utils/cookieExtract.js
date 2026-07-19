

export function getCookieByName(cookieString, name) {
    try {
        const cookies = cookieString.split(' ');
        const token = cookies.find(c => c.startsWith(name + '='));
        return token ? token.split('=')[1] : null
    } catch (e) {
        console.log(e.message);
        console.log("[cookieExtract] token : ", cookieString);
    }
}
