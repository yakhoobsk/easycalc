import axios from "axios";
import config from "./config";
import { getSecureItem, setSecureItem } from "../../utils/webSecureStorage";
import { decryptIfNeeded } from "../../utils/cryptoAES";
import { startLoading, stopLoading } from "../../utils/loadingBar";


const calcFlask = axios.create({
    baseURL: config.BASEURL,
    headers: config.headersCommon,
    timeout: 20000,
});

calcFlask.interceptors.request.use(
    async (configuration) => {
        startLoading();
        try {
            const token = import.meta.env.VITE_BOOMI_BASIC_TOKEN;
            if (token) {
                setSecureItem("accessToken", token);
            }
            const encryptedToken = getSecureItem('accessToken');
            configuration.headers = configuration.headers || {};
            if (encryptedToken !== null) {
                const decryptedToken = decryptIfNeeded(encryptedToken);
                if (decryptedToken) {
                    configuration.headers.Authorization = `Basic ${decryptedToken}`;
                }
            }
        } catch (error) {
        }

        return configuration;
    },
    (error) => {
        stopLoading();
        return Promise.reject(error);
    }
);

calcFlask.interceptors.response.use(
    (response) => {
        stopLoading();
        return response;
    },
    (error) => {
        stopLoading();
        return Promise.reject(error);
    }
);

const urlGenarator = (url, pagination) => {
    let queryString = "?";
    Object.keys(pagination).map((key) => {
        queryString += key + "=" + pagination[key] + "&"
    })

    return (url + queryString).slice(0, -1);
}

const decryptedToken = () => {
    const encryptedToken = getSecureItem("accessToken");

    if (encryptedToken !== null) {
        return decryptIfNeeded(encryptedToken);
    }

    return null;
};

export { calcFlask, urlGenarator, decryptedToken, }