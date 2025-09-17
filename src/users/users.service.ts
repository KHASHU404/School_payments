// src/users/users.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(username: string, password: string) {
  const existing = await this.userModel.findOne({ username }).lean().exec();
  if (existing) throw new ConflictException('User already exists');

  const hash = await bcrypt.hash(password, 10);
  const created = new this.userModel({ username, password: hash });
  const saved = await created.save();
  
  const obj = saved.toObject();
  const { password: _, ...result } = obj; // ✅ Exclude password field
  return result;
}


  async findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec(); // returns full user (including password hash)
  }

  async findById(id: string) {
    return this.userModel.findById(id).select('-password').exec();
  }
}
