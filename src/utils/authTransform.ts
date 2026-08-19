import { createTransform } from "redux-persist";
import { decryptIfNeeded, encryptIfNeeded } from "./cryptoAES";


export const authTransform = createTransform(
    (inboundState) => {
        return encryptIfNeeded(JSON.stringify(inboundState));
    },
    (outboundState) => {
        return JSON.parse(decryptIfNeeded(outboundState));
    },
    { whitelist: ["auth"] }
);
