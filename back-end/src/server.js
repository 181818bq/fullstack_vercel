import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// allow only the front-end origin (set FRONTEND_URL on Render)
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));

// simple health / root endpoint (returns 200 instead of 404)
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

/* moving away from local credentials.json
  const credentials = JSON.parse(
  fs.readFileSync('./credentials.json')
);
 */

// getting credentials from Vercel/Render environment variables
const getFirebaseCredentials = () => {
  if (process.env.FIREBASE_CREDENTIALS) {
    try { return JSON.parse(process.env.FIREBASE_CREDENTIALS); }
    catch (e) { console.error('Invalid FIREBASE_CREDENTIALS JSON'); process.exit(1); }
  }
  // local dev fallback
  try { return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../credentials.json'), 'utf8')); }
  catch (e) { console.error('No Firebase credentials found'); process.exit(1); }
};

const credentials = getFirebaseCredentials();
admin.initializeApp({ credential: admin.credential.cert(credentials) });

let database;

async function connectToDatabase() {
  // Connection URI

  const uri = !process.env.MONGODB_USERNAME
  ? 'mongodb://127.0.0.1:27017' // local MongoDB URI
  : `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.jatp6xc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
  await client.connect();

  database = client.db('full-stack-react-db');
};

/* moving away from local hosting
app.use(express.static(path.join(__dirname, '../dist')));
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});
 */

app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;
  const article = await database.collection('articles').findOne({ name });

  res.status(200).json(article);
});

// Auth middleware — only for protected routes below
const authenticateUser = async (req, res, next) => {
  const { authtoken } = req.headers;

  if (authtoken) {
    const user = await admin.auth().verifyIdToken(authtoken);
    req.user = user;
    next();
  } else {
    res.status(403).send('Unauthorized');
  }
};

// Protected route
app.post('/api/articles/:name/upvote', authenticateUser, async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await database.collection('articles').findOne({ name });

  const upvoteIds = article.upvoteIds || [];
  const canUpvote = uid && !upvoteIds.includes(uid);

  if (canUpvote) {
    const updatedArticle = await database.collection('articles').findOneAndUpdate({ name }, {
      $inc: { upvotes: 1 },
      $push: { upvoteIds: uid }
    }, { 
      returnDocument: 'after',
    });

   res.status(200).json(updatedArticle);
  } else {
    res.sendStatus(403);
  }
});

// Protected route
app.post('/api/articles/:name/comments', authenticateUser, async (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;
    const newComment = { postedBy, text };
    
    const updatedArticle = await database.collection('articles').findOneAndUpdate({ name }, {
      $push: { comments: { newComment } }
    }, { 
      returnDocument: 'after',
    });

    res.status(200).json(updatedArticle);
});

const PORT = process.env.PORT || 8000;

async function startServer() {
    await connectToDatabase();

    app.listen(PORT, function() {
      console.log('Server is listening on port ' + PORT);

});
}

startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});