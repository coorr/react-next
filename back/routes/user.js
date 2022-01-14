const express = require('express');
const { User, Post } = require('../models')
const bcrypt = require('bcrypt');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')

const router = express.Router();

router.post('/login',isNotLoggedIn, (req,res,next) => {
  passport.authenticate('local', (err,user,info) => {
    if(err) { // 서버 에러
      console.error(err);
      next(err);
    }
    if(info) { // 클라이언트 에러
      return res.status(401).send(info.reason);
    }

    return req.login(user, async(loginErr) => {
      if(loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
     try {
      const fullUserWithoutPassword =  await User.findOne({
        where: { id : user.id },
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        }]
      })
      return res.json(fullUserWithoutPassword);
     } catch (error) {
       
     }
      
    })
  })(req,res,next);
});

router.get('/', async (req,res,next) => {
  try {
    if(req.user) {
      const fullUserWithoutPassword =  await User.findOne({
        where: { id : req.user.id },
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        }]
      })
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.post('/', isNotLoggedIn ,  async (req,res,next) => {
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      }
    })
    if(exUser) {
     return res.status(403).send('이미 사용 중인 아이디입니다.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10~13 숫자가 높을수록 보완성이 좋다
    console.log(req);  
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    })
    res.send('ok');
  } catch (error) {
    console.log(error);
    next(error);
  }
})

router.post('/logout', isLoggedIn , (req,res) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
}) 

module.exports = router;

