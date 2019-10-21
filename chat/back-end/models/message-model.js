import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  id: String,
  user: String,
  message: String,
  time: String,
});

export default mongoose.model('Message', MessageSchema);
