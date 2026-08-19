import SecureLS from 'secure-ls';

let secureLS = null;

if (typeof window !== 'undefined') {
    secureLS = new SecureLS({ encodingType: 'aes', isCompression: false });
}

export const setSecureItem = (key, value) => {
    if (secureLS) secureLS.set(key, value);
};

export const getSecureItem = (key) => {

    try {
        const encryptedToken = secureLS ? secureLS.get(key) : null;
        if (encryptedToken !== null) {
            if (encryptedToken) {

                return encryptedToken
            }
        }
    } catch (error) {
    }
};

export const removeSecureItem = (key) => {
    if (secureLS) secureLS.remove(key);
};
