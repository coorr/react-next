const express = require('express');
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')
const postsRouter = require('./routes/posts')
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');

const app = express();  // 서버
const db = require('./models');
const passportConfig = require('./passport');

dotenv.config();

passportConfig();
db.sequelize.sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(err => console.log(err))

app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:4000',
  credentials: true, // 프론트의 cookie가 백엔드로 보낼 수 있게 허용
}));
app.use(express.json());   // req.body 쓸 수 있게 해주는 부분
app.use(express.urlencoded({extended:true}));  // form 으로 넘겼을 떄 req.body 받을 수 있게 
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req,res) => {
  res.send('hello express');
})

app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/posts', postsRouter);

app.use((err,req,res,next) => {
  
})

app.listen(4001, () => {
  console.log("서버 실행 중!");
})


