import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

if (process.env.VERCEL) {
    console.log('Detected Vercel environment. Updating Prisma schema to use PostgreSQL...');

    let schema = fs.readFileSync(schemaPath, 'utf8');

    // Replace provider
    schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');

    // Add directUrl if not present (simple check)
    if (!schema.includes('directUrl')) {
        schema = schema.replace(
            'url      = env("DATABASE_URL")',
            'url      = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")'
        );
    }

    fs.writeFileSync(schemaPath, schema);
    console.log('Prisma schema updated successfully.');
} else {
    console.log('Not in Vercel environment. Skipping Prisma schema update.');
}
