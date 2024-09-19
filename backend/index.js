
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://aryan:aryan@list.xeyve.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error(err));

const recordSchema = new mongoose.Schema({
  tenant_id: String,
  record_stage_id: String,
  list_id: Number,
  list_type_id: Number,
  list_entry_id: String,
  list_name: String,
  version_number: Number,
  primary_name: String,
  action_id: Number,
  record_type: String,
  added_dtm: Date,
  added_user_id: String,
  claimed_by_id: String,
});

const Record = mongoose.model('Record', recordSchema);

app.get('/records', async (req, res) => {
  const { searchTerm = '', page = 1, limit = 10 } = req.query;

  const query = searchTerm ? { primary_name: { $regex: searchTerm, $options: 'i' } } : {};

  const records = await Record.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const totalRecords = await Record.countDocuments(query);

  res.json({
    data: records,
    totalRecords,
    page: Number(page),
    totalPages: Math.ceil(totalRecords / limit),
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
