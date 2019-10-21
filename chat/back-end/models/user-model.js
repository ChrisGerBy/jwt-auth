import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  birthday: String,
  email: String,
  password: String,
},
{
  collection: 'users',
});

export default mongoose.model('User', UserSchema);
