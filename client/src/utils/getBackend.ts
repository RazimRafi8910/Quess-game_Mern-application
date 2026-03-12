
export default function getBackendURL(): string {
    const production = import.meta.env.VITE_PRODUCTION;
    const productionUrl = import.meta.env.VITE_PRODUCTION_BACKENT_URL;
    if (production == 0) {
        return 'http://localhost:3001';
    }
    console.log(productionUrl)
    return productionUrl;
}