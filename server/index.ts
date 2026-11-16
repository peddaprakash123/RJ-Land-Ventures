import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient, type Collection } from 'mongodb';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHENNAI_PROPERTIES, type Property } from '../client/src/data/chennaiProperties';
import {
  isCloudinaryConfigured,
  uploadPropertyImage,
  UploadError,
} from './cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 4000);
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'singara_realties';
const API_KEY = process.env.API_KEY?.trim() || '';
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!MONGODB_URI) {
  console.error('[api] MONGODB_URI is missing. Add it to .env before starting the API.');
  process.exit(1);
}

const app = express();
app.disable('x-powered-by');
app.use(
  cors({
    origin: CLIENT_ORIGINS.length > 0 ? CLIENT_ORIGINS : true,
  })
);
app.use(express.json({ limit: '20mb' }));

let client: MongoClient | null = null;
let properties: Collection<Property> | null = null;

const getCollection = (): Collection<Property> => {
  if (!properties) throw new Error('Database is not ready yet.');
  return properties;
};

// Public health check (the Vite UI can use this to confirm the API is up).
app.get('/api/health', async (_req, res) => {
  try {
    await client?.db(MONGODB_DB).command({ ping: 1 });
    res.json({
      ok: true,
      database: MONGODB_DB,
      cloudinary: isCloudinaryConfigured,
    });
  } catch {
    res.status(503).json({ ok: false, error: 'Database unavailable.' });
  }
});

// Every property endpoint requires the API key. The frontend sends it with
// each request through VITE_API_KEY.
app.use('/api', (req, res, next) => {
  if (!API_KEY) return next();

  const provided =
    req.header('x-api-key') ||
    req.header('authorization')?.replace(/^Bearer\s+/i, '') ||
    '';

  if (provided !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: invalid or missing API key.' });
  }

  next();
});

// List all properties.
app.get('/api/properties', async (_req, res, next) => {
  try {
    const list = await getCollection()
      .find({}, { projection: { _id: 0 } })
      .toArray();
    res.json(list);
  } catch (error) {
    next(error);
  }
});

// Get one property by id.
app.get('/api/properties/:id', async (req, res, next) => {
  try {
    const property = await getCollection().findOne(
      { id: req.params.id },
      { projection: { _id: 0 } }
    );
    if (!property) return res.status(404).json({ error: 'Property not found.' });
    res.json(property);
  } catch (error) {
    next(error);
  }
});

// Create a property.
app.post('/api/properties', async (req, res, next) => {
  try {
    const body = req.body as Partial<Property> | null;
    if (!body || !body.id || !body.title) {
      return res.status(400).json({ error: 'Property id and title are required.' });
    }

    const collection = getCollection();
    const existing = await collection.findOne({ id: body.id });
    if (existing) {
      return res.status(409).json({ error: 'A property with this id already exists.' });
    }

    const property = {
      ...body,
      id: body.id,
      title: body.title,
      showDetailsInView: body.showDetailsInView !== false,
    } as Property;

    await collection.insertOne(property);
    res.status(201).json(property);
  } catch (error) {
    next(error);
  }
});

// Update a property (id cannot be changed).
app.put('/api/properties/:id', async (req, res, next) => {
  try {
    const { _id, id: _ignoredId, ...updates } = (req.body || {}) as Record<string, unknown>;
    const updated = await getCollection().findOneAndUpdate(
      { id: req.params.id },
      { $set: { ...updates, id: req.params.id } },
      { returnDocument: 'after', projection: { _id: 0 } }
    );

    if (!updated) return res.status(404).json({ error: 'Property not found.' });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Delete a property.
app.delete('/api/properties/:id', async (req, res, next) => {
  try {
    const result = await getCollection().deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Property not found.' });
    }
    res.json({ ok: true, id: req.params.id });
  } catch (error) {
    next(error);
  }
});

// Upload a property photo to Cloudinary. The browser sends a base64 data URI;
// the server keeps the Cloudinary API secret private and returns a permanent,
// optimised delivery URL that is safe to store in MongoDB.
app.post('/api/uploads/image', async (req, res, next) => {
  try {
    const { file } = (req.body || {}) as { file?: unknown };
    const image = await uploadPropertyImage(file);
    res.status(201).json(image);
  } catch (error) {
    if (error instanceof UploadError) {
      return res.status(error.status).json({ error: error.message });
    }
    next(error);
  }
});

// Built-in seed listings and preset photos reference /src/assets/images/... .
// Vite serves that folder during development, but it is not copied into dist,
// so keep it available from Express in production as well.
const sourceAssetsPath = path.resolve(__dirname, '..', 'client', 'src', 'assets');
if (existsSync(sourceAssetsPath)) {
  app.use(
    '/src/assets',
    express.static(sourceAssetsPath, { maxAge: '7d' })
  );
}

// Serve the production build from the same server when it exists.
const distPath = path.resolve(__dirname, '..', 'client', 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (
      typeof error === 'object' &&
      error !== null &&
      (error as { type?: string }).type === 'entity.too.large'
    ) {
      return res.status(413).json({
        error: 'The upload is too large. Maximum image size is 8 MB.',
      });
    }

    console.error('[api]', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
);

async function start(): Promise<void> {
  try {
    client = new MongoClient(MONGODB_URI!);
    await client.connect();

    const database = client.db(MONGODB_DB);
    properties = database.collection<Property>('properties');
    await properties.createIndex({ id: 1 }, { unique: true });

    // Seed the built-in catalog only once. A marker document prevents deleted
    // listings from reappearing after the collection becomes empty.
    const meta = database.collection<{ _id: string; seededAt?: Date }>('app_meta');
    const seedMarker = await meta.findOne({ _id: 'properties_seed' });
    if (!seedMarker) {
      const hasProperties =
        (await properties.countDocuments({}, { limit: 1 })) > 0;
      if (!hasProperties) {
        await properties.insertMany(
          CHENNAI_PROPERTIES.map((property) => ({
            ...property,
            showDetailsInView: property.showDetailsInView !== false,
          }))
        );
        console.log(`[api] Seeded ${CHENNAI_PROPERTIES.length} listings into MongoDB.`);
      }
      await meta.updateOne(
        { _id: 'properties_seed' },
        { $set: { seededAt: new Date() } },
        { upsert: true }
      );
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[api] Listening on http://localhost:${PORT}`);
      console.log(`[api] Connected to MongoDB database "${MONGODB_DB}".`);
    });
  } catch (error) {
    console.error('[api] Failed to start:', error);
    await client?.close().catch(() => undefined);
    process.exit(1);
  }
}

async function shutdown(): Promise<void> {
  await client?.close().catch(() => undefined);
  process.exit(0);
}

process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());

void start();
