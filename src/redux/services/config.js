
const BASEURL = import.meta.env.VITE_API_URL;
const CRYPTO_KEY = import.meta.env.VITE_CRYPTO_KEY_SECRET;

const config = {
  BASEURL: BASEURL,
  cryptoKey: CRYPTO_KEY,

  headersCommon: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },

};

export default config;
