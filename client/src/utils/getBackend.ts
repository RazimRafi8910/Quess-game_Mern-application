
export default function getBackendURL():string {
    const production = import.meta.env.VITE_PRODUCTION;
    const productionUrl = import.meta.env.VITE_PRODCUTION_BACKEND_URL;
    if (production == 0) {
        return 'http://localhost:3001';
    }
    return productionUrl;
}