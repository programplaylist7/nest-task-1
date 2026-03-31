import { CheckEmailDto } from './dto/check-email.dto';
import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthService } from './auth.service';
import { SignupStep1Dto } from './dto/signup-step1.dto';
import type { Express } from 'express';
import { SignupStep2Dto } from './dto/signup-step2.dto';
import { LoginDto } from './dto/login.dto';
import { Res } from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  // comment: API to check duplicate email
  @Post('check-email')
  checkEmail(@Body() body: CheckEmailDto) {
    return this.service.checkEmail(body.email);
  }

  // comment: signup step-1 API
  @Post('signup-step1')
  @UseInterceptors(
    FileInterceptor('profile_picture', {
      storage: diskStorage({
        destination: './uploads/profile', // comment: folder
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + file.originalname;
          cb(null, uniqueName);
        },
      }),

      // comment: file size limit (1MB)
      limits: { fileSize: 1 * 1024 * 1024 },

      // comment: allow only images
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes('image')) {
          return cb(new BadRequestException('Only image allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  signupStep1(
    @Body() body: SignupStep1Dto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Profile image required');
    }

    return this.service.signupStep1(body, file.filename);
  }

  @Post('signup-step2')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './uploads/resume',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
        },
      }),
      limits: { fileSize: 1 * 1024 * 1024 }, // comment: max 1MB
    }),
  )
  signupStep2(
    @Body() body: SignupStep2Dto,
    @UploadedFile() file: Express.Multer.File, // comment: simple type
  ) {
    // comment: check if file exists
    if (!file) {
      throw new BadRequestException('Resume file is required');
    }
    return this.service.signupStep2(body, file.filename);
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.service.verifyEmail(token);
  }

  // comment: login API

  @Post('login')
  async login(@Body() data: LoginDto, @Res() res: Response) {
    const result = await this.service.login(data);

    // comment: set JWT token in httpOnly cookie
    res.cookie('token', result.token, {
      httpOnly: true, // ✅ secure (not accessible via JS)
      secure: false, // ⚠️ true in production (https)
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // comment: send response without token in body
    return res.json({
      data: result.data,
    });
  }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    return this.service.refresh(req, res);
  }

  @Get('logout')
  logout(@Res() res: Response) {
    // comment: clear cookie (same name used in login)
    res.clearCookie('token', {
      httpOnly: true,
      secure: false, // comment: true in production (HTTPS)
      sameSite: 'lax',
    });

    // comment: send response
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}
