import * as dotenv from 'dotenv';
import path, { dirname } from 'node:path'
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, '/../.env') });