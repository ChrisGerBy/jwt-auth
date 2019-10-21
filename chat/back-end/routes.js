import jwt from 'jsonwebtoken';
import bCrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { check, validationResult, body } from 'express-validator';
import User from './models/user-model';
import Message from './models/message-model';
import Dialogue from './models/dialogue-model';

const routes = (app) => {
  app.get('/users', (req, res) => {
    User.find({})
      .exec()
      .then((users) => res.send(users))
      .catch((err) => res.status(500).json({ message: err }));
  });

  app.get('/messages', (req, res) => {
    Message.find({})
      .exec()
      .then((messages) => res.send(messages))
      .catch((err) => res.status(500).json({ message: err }));
  });

  app.post('/create-user', [
    check('email').isEmail(),
    check('password', 'Password must be 3+ chars long.')
      .isLength({ min: 3 }).withMessage('Password must be at least 3 chars long.'),
  ], body('email').custom((value) => User.findOne({ email: value })
    .then((user) => {
      if (user) {
        return Promise.reject('E-mail already in use.');
      }
    })), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.array() });
    }
    const user = new User(req.body);
    user.save()
      .then((newUser) => res.json(newUser))
      .catch((err) => res.status(500).json(err));
  });

  app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
      .exec()
      .then((user) => {
        if (!user) {
          res.status(401).json({ message: 'User does not exist.' });
        }
        const salt = bCrypt.genSaltSync(10);
        const hash = bCrypt.hashSync(user.password, salt);
        const isValid = bCrypt.compareSync(password, hash);
        if (isValid) {
          const tokens = jwt.sign(user.email, `${process.env.TOKEN_SECRET}`);
          res.send(user);
        } else {
          res.status(401).send('Invalid credentials!');
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error });
      });
  });

  app.post('/send-message', (req, res) => {
    const message = new Message(req.body);
    message.save()
      .then((msg) => res.json(msg))
      .catch((err) => res.status(500).json(err));
  });

  app.post('/find-user', (req, res) => {
    User.findOne({ name: req.body.name })
      .exec()
      .then((user) => res.send(user))
      .catch(() => res.status(500).json({ message: 'User not found!' }));
  });

  app.get('/find-user/:email', (req, res) => {
    User.findOne({ email: req.params.email })
      .exec()
      .then((user) => {
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`,
          },
        });
        const mailOptions = {
          from: `${process.env.EMAIL_ADDRESS}`,
          to: `${user.email}`,
          subject: 'Your Password',
          text:
            'You are receiving this message because you have requested. \n'
            + `Your password is: ${user.password}.\n`,
        };
        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.log(`The error occurred:  ${err}`);
          } else {
            res.send(response);
          }
        });
      })
      .catch((err) => res.status(500).json({ message: err }));
  });

  app.post('/create-dialogue', (req, res) => {
    const dialogue = new Dialogue(req.body);
    dialogue.save()
      .then((dial) => res.json(dial))
      .catch((err) => res.status(500).json(err));
  });

  app.post('/find-dialogue', (req, res) => {
    Dialogue.findOne({
      fromID: req.body.fromID,
      toID: req.body.toID,
    })
      .exec()
      .then((dialogue) => res.send(dialogue))
      .catch(() => res.status(500).json({ message: 'Dialogue not found!' }));
  });

  app.put('/send-dialogue', (req, res) => {
    let messageText = req.body.newMessage.message;
    const obj = req.body;
    const reg = /<(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
    let tagsInMessage = messageText.match(reg);
    while (tagsInMessage) {
      messageText = messageText.replace(tagsInMessage[0], ' ');
      tagsInMessage = messageText.match(reg);
    }
    obj.newMessage.message = messageText.trim();
    obj.messages.push(obj.newMessage);
    delete obj.newMessage;

    Dialogue.findOneAndUpdate({
      fromID: req.body.fromID,
      toID: req.body.toID,
    }, obj)
      .then(() => {
        res.send('Message added!');
      })
      .catch((err) => res.status(500).json(err));
  });

  app.put('/edit-dialogue', (req, res) => {
    let messageText = req.body.newMessage.message;
    const obj = req.body;
    const reg = /<(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
    let tagsInMessage = messageText.match(reg);
    while (tagsInMessage) {
      messageText = messageText.replace(tagsInMessage[0], ' ');
      tagsInMessage = messageText.match(reg);
    }
    obj.newMessage.message = messageText.trim();
    delete obj.newMessage;

    Dialogue.findOneAndUpdate({
      fromID: req.body.fromID,
      toID: req.body.toID,
    }, obj)
      .then(() => {
        res.send('Message edited!');
      })
      .catch((err) => res.status(500).json(err));
  });

  app.post('/load-dialogue', (req, res) => {
    Dialogue.findOne({
      fromID: req.body.fromID,
      toID: req.body.toID,
    })
      .exec()
      .then((dialogue) => res.send(dialogue))
      .catch(() => res.status(500).json({ message: 'Dialogue not found!' }));
  });

  app.delete('/delete-message/:id/:str', (req, res) => {
    const obj = JSON.parse(req.params.str);
    const dial = {
      fromID: obj.fromID,
      toID: obj.toID,
    };
    const options = { $pull: { messages: {id: req.params.id}} };
    Dialogue.findOneAndUpdate(dial, options)
      .then(() => res.send(dial))
      .catch((err) => res.status(500).json({ message: err }));
  });
};


export default routes;
