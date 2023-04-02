import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import CustomError from '../../classes/CustomError';
import {OutputUser} from '../../interfaces/User';
import userModel from '../models/userModel';
import bcrypt from 'bcryptjs';
import LoginMessageResponse from '../../interfaces/LoginMessageResponse';

const login = async (req: Request, res: Response, next: NextFunction) => {
  const {username, password} = req.body;

  const user = await userModel.findOne({email: username});
  console.log(user, password);

  if (!user) {
    next(new CustomError('Invalid username/password', 200));
    return;
  }

  if (!bcrypt.compareSync(password, user.password)) {
    next(new CustomError('Invalid username/password', 200));
    return;
  }

  const outputUser: OutputUser = {
    id: user._id,
    user_name: user.user_name,
    email: user.email,
  };

  const token = jwt.sign(outputUser, process.env.JWT_SECRET as string);
  const message: LoginMessageResponse = {
    token,
    message: 'Login successful',
  };
  return res.json(message);
};

export {login};
