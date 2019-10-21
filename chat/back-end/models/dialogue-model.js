import mongoose from 'mongoose';

const DialogueSchema = new mongoose.Schema({
  id: String,
  fromName: String,
  fromID: String,
  toName: String,
  toID: String,
  messages: Array,
},
{
  collection: 'dialogue',
});

export default mongoose.model('Dialogue', DialogueSchema);
