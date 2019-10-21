# Chat

To run the project:  `npm run dev`

**React, Redux, Express, Websocket, MongoDB, Eslint styling**

- Log In component
- Sign Up component
- Chat (WebSocket)
  - user's dashboard
  - messages' history
  - form to send new messages
  - status (logged in as: User or not logged in)


**_16.10.2019_**
1. install material-ui
2. implement delete message function
3. implement edit message function
4. refactoring of mapDispatchToProps (as object in connect function)
5. install nodemailer
6. implement Forgot Password component and functionality


**_17.10.2019_**

Working on chat dialogues:
- create Dialogues collection
- change the interlocutor by clicking on name in the list
- load dialogue by clicking on dialogue
- fix delete and edit functions

Install styled-components library.

Install express-validator.
- add validation for email and password (sign up)
- add validation for email (if it was already in DB)

**_18.10.2019_**
- rewrite delete-message function so that it uses delete route
- show custom error messages for invalid email or password in sign up form
- use regexp to validate textarea if there are tags

**_21.10.2019_**
- replace async operations from components to actions
