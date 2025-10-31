import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';

// Add code to create express server to run on PORT 5000 and include the other required code we've used to console log that server is running on that port.
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',               // for Render.com PostgreSQL
  logging: false,
 dialectOptions: {
     ssl: { require: true, rejectUnauthorized: false }  // for Render.com PostgreSQL
 }
});

// Setup your Puppy model to handle these columns (this is something ORMs require)
const Puppy = sequelize.define('puppies', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
    breed: { type: DataTypes.STRING(100), allowNull: true },
    weight_lbs: { type: DataTypes.DECIMAL(5,2), allowNull: true },
    arrival_date: { type: DataTypes.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    vaccinated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, { tableName: 'puppies', timestamps: false, underscored: true });

// Setup routes --> Get/, GET/:id, PUT/:id, POST/, DELETE/:id
app.get('/api/puppies', async (req, res) => {
  const puppies = await Puppy.findAll();
  res.json(puppies);
});

app.get('/api/puppies/:id', async (req, res) => {
  const puppy = await Puppy.findByPk(req.params.id);
  if (puppy) {
    res.json(puppy);
  } else {
    res.status(404).send('Puppy not found');
  }
});

app.post('/api/puppies', express.json(), async (req, res) => {
  const newPuppy = await Puppy.create(req.body);
  res.status(201).json(newPuppy);
});

app.put('/api/puppies/:id', express.json(), async (req, res) => {
  const puppy = await Puppy.findByPk(req.params.id);
    if (puppy) {
        await puppy.update(req.body);
        res.json(puppy);
    } else {
        res.status(404).send('Puppy not found');
    }
});

app.delete('/api/puppies/:id', async (req, res) => {
  const puppy = await Puppy.findByPk(req.params.id);
    if (puppy) {
        await puppy.destroy();
        res.status(204).send();
    } else {
        res.status(404).send('Puppy not found');
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});