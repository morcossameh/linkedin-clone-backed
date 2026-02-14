import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  JwtPayload,
} from "../utils/jwt";

const userRepository = AppDataSource.getRepository(User);

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    headline?: string;
    bio?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const existingUser = await userRepository.findOne({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const user = userRepository.create(input);
    await userRepository.save(user);

    const payload: JwtPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await userRepository.save(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        headline: user.headline,
        bio: user.bio,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await userRepository.findOne({
      where: { email: input.email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(input.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const payload: JwtPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await userRepository.save(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        headline: user.headline,
        bio: user.bio,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = verifyRefreshToken(token);

      const user = await userRepository.findOne({
        where: { id: decoded.userId },
      });

      if (!user || user.refreshToken !== token) {
        throw new Error("Invalid refresh token");
      }

      const payload: JwtPayload = { userId: user.id, email: user.email };
      const newAccessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      user.refreshToken = newRefreshToken;
      await userRepository.save(user);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    return userRepository.findOne({ where: { id: userId } });
  }
}
