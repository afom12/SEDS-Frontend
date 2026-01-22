import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateTokenPair } from '../utils/jwt.utils.js';
import { createAdminLog } from '../utils/adminLog.utils.js';

const prisma = new PrismaClient();

// Register new user
export const register = async (req, res, next) => {
  try {
    const { email, password, name, role = 'DONOR' } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists.',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_ROUNDS) || 12
    );

    // Determine verification status based on role
    // AID_SEEKER and AID_PROVIDER need verification
    // DONOR can be auto-verified (optional - can change this)
    const roleUpper = role.toUpperCase();
    const shouldAutoVerify = roleUpper === 'DONOR'; // Only donors auto-verified
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: roleUpper,
        verified: shouldAutoVerify, // AID_SEEKER, AID_PROVIDER, RECEIVER need verification
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = generateTokenPair(user.id);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user,
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    // Generate tokens
    const tokens = generateTokenPair(user.id);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          verified: user.verified,
        },
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
        phone: true,
        address: true,
        organization: true,
        organizationType: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Refresh access token
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required.',
      });
    }

    const { verifyRefreshToken } = await import('../utils/jwt.utils.js');
    const decoded = verifyRefreshToken(refreshToken);

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found.',
      });
    }

    // Generate new token pair
    const tokens = generateTokenPair(user.id);

    res.json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired refresh token.',
    });
  }
};

// Logout (invalidate refresh token - in production, maintain a blacklist)
export const logout = async (req, res, next) => {
  try {
    // In production, you would add the refresh token to a blacklist
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Verify email (placeholder - implement email service in production)
export const verifyEmail = async (req, res, next) => {
  try {
    // Email verification logic would go here
    res.json({
      success: true,
      message: 'Email verification sent.',
    });
  } catch (error) {
    next(error);
  }
};

