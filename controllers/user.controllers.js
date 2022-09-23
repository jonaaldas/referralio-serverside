import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import UserSchema from '../models/user.js';

// generte jwt
const generateToken = (id) => jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
  expiresIn: '30d',
});

// @desc Create User
// @route Post/api/user/register
// @access Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400)
        .json({ message: 'Please add new user' });
      return;
    }

    const userExist = await UserSchema.findOne({ email });
    if (userExist) {
      res.status(400)
        .json({ message: 'User Already Exists' });
      return;
    }

    // hashPassword
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = new UserSchema({
      name,
      email,
      // password: hashedPassword,
      password
    });

    await user.save();

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    return error;
  }
};

// @desc Authenticate a user
// @route Post/api/user/login
// @access Public
export const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await UserSchema.findOne({ email });
    console.log(email, password)
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid User Credentials' });
      return;
    }
  } catch (error) {
    console.log(error)
    return error;
  }
};
// @desc get Users
// @route Get/api/user/me
// @access Private
export const getUserData = async (req, res) => {
  const { name, email, _id } = await UserSchema.findById(req.user.id);
  res.json({
    id: _id,
    name,
    email,
  });
};

// forgot passowrd
export const forgotPassword = (req, res) => {
  const { email } = req.body;
  UserSchema.find({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ erro: 'User with this email already exists' });
    }

    const token = jwt.sign({ _id: user.id }, `${process.env.RESET_PASSWORD_KEY}`, { expiresIn: '15m' });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.GOOGLE_APP_EMAIL}`,
        pass: `${process.env.GOOGLE_APP_PW}`,
      },
    });

    const data = {
      from: 'noreply@referrals.io',
      to: email,
      subject: 'Reset Account Password Link',
      html: `
        <h3>Please click the link below to reset password</h3>
        <p>${process.env.CLIENT_URL}/update-password/${token}<p/>
        `,
      };
      // <p>${process.env.CLIENT_URL_LOCALHOST}/update-password/${token}<p/>

    return UserSchema.updateOne({ resetLink: token }, (err) => {
      if (err) {
        return res.status(400).json({ error: 'reset password link error' });
      }
      transporter.sendMail(data, (error) => {
        if (error) {
          return res.status(400).json({ error: error.message });
        }
        return res.status(200).json({ message: 'Email has been sent, please follow the instructions' });
      });
    });
  });
};

// updatePassword

export const updatePassowrd = async (req, res) => {
  const { token, password } = req.body;
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);
  if (token) {
    jwt.verify(token, process.env.RESET_PASSWORD_KEY, (error) => {
      if (error) {
        return res.status(400).json({ error: 'incorect token or it is expired' });
      }
      UserSchema.findOne({ resetLink: token }, (err, user) => {
        if (err || !user) {
          return res.status(400).json({ error: 'User with this token does not exist' });
        }
        // user.password = hashedPassword;
        user.password = password;
        user.save((err) => {
          if (err) {
            return res.status(400).json({ error: 'Reset Password Error' });
          }
          return res.status(200).json({ message: 'Your password has benn changed' });
        });
      });
    });
  } else {
    return res.status(401).json({ error: 'Auth Error' });
  }
};
