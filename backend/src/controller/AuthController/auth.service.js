const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../../model/index.model');

class AuthService {
  async signup({ email, password, _id, username }) {
    const existingUser = await UserModel.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      _id,
      email,
      password: hashedPassword,
      username,
    });

    return {
      message: 'User registered successfully',
      userId: newUser._id,
      username: newUser.username,
    };
  }

  async login({ email, password }) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user?.username },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );

    return {
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username:user?.username
      },
    };
  }

  async profile() {
    const userId = req.user.id;
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      throw new Error('Invalid credentials');
    }

   return  {
        id: user._id,
        email: user.email,
        username:user?.username
      }
  }
}

module.exports = new AuthService();
