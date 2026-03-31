import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { UserDetails } from '../user-details/user-details.entity';
import { Country } from '../country/country.entity';
import { BadRequestException } from '@nestjs/common';
import { SignupStep1Dto } from './dto/signup-step1.dto';
import { Education } from 'src/education/education.entity';
import { WorkExperience } from 'src/work-experience/work-experience.entity';
import {
  EducationItemDto,
  ExperienceItemDto,
  SignupStep2Dto,
} from './dto/signup-step2.dto';
import { EmailService } from 'src/email/email.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(UserDetails)
    private userDetailsRepo: Repository<UserDetails>,

    @InjectRepository(Country)
    private countryRepo: Repository<Country>,

    @InjectRepository(Education)
    private educationRepo: Repository<Education>,

    @InjectRepository(WorkExperience)
    private workRepo: Repository<WorkExperience>,

    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // comment: check if email already exists
  async checkEmail(email: string) {
    // comment: find user by email
    const user = await this.userRepo.findOne({
      where: { email },
    });

    // comment: if user exists
    if (user) {
      // comment: if user is verified
      if (user.is_verified) {
        return {
          exists: true,
          verified: true,
          message: 'Email already registered and verified Please Login',
        };
      }
    }

    // comment: email not found
    return {
      exists: false,
      verified: false,
      message: 'Email available',
    };
  }

  async sendVerificationEmail(user: any) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is missing'); // comment: fail fast
    }

    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
    });

    const link = `process.env.FRONTEND_URL/auth/verify-email?token=${token}`;
    await this.emailService.sendVerificationEmail(user.email, link);
  }

  // comment: step1 signup logic
  async signupStep1(data: SignupStep1Dto, filename: string) {
    // comment: check password match
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // comment: check email duplicate
    const exist = await this.userRepo.findOne({
      where: { email: data.email },
    });

    if (exist) {
      throw new BadRequestException('Email already exists');
    }

    // comment: hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // comment: create user
    const user = this.userRepo.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'candidate',
    });

    const savedUser = await this.userRepo.save(user);

    // comment: find country
    const country = await this.countryRepo.findOne({
      where: { id: data.country_id },
    });

    if (!country) {
      throw new BadRequestException('Invalid country');
    }

    // comment: create user details
    const details = this.userDetailsRepo.create({
      user: savedUser,
      country,
      full_name: data.full_name,
      dob: data.dob,
      state: data.state,
      city: data.city,
      phone_number: data.phone_number,
      mobile_number: data.mobile_number,
      profile_picture: filename,
      total_experience: data.total_experience,
      key_skills: data.key_skills,
    });

    await this.userDetailsRepo.save(details);

    return {
      message: 'Step 1 completed successfully',
      user_id: savedUser.id,
    };
  }

  async signupStep2(data: SignupStep2Dto, filename: string) {
    const user = await this.userRepo.findOne({
      where: { id: data.user_id }, // comment: already number now
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // comment: parse safely with type assertion
    const educationArr = JSON.parse(data.education) as EducationItemDto[];
    const experienceArr = JSON.parse(data.experience) as ExperienceItemDto[];

    for (const edu of educationArr) {
      const education = this.educationRepo.create({
        user,
        qualification: { id: edu.qualification_id },
        specialization: edu.specialization,
      });

      await this.educationRepo.save(education);
    }

    for (const exp of experienceArr) {
      const experience = this.workRepo.create({
        user,
        designation: { id: exp.designation_id },
        organization_name: exp.organization_name,
        from_year: exp.from_year, // ✅ no error now
        to_year: exp.to_year,
        job_profile: exp.job_profile,
        is_current: exp.is_current,
        resume: filename,
      });

      await this.workRepo.save(experience);
    }

    user.is_profile_completed = true;
    await this.userRepo.save(user);
    this.sendVerificationEmail(user).catch((err) => {
      console.log('Email failed:', err);
    });
    return { message: 'Step 2 completed successfully' };
  }

  async verifyEmail(token: string) {
    try {
      // comment: verify token
      const decoded = this.jwtService.verify(token);

      const user = await this.userRepo.findOne({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      // comment: mark verified
      user.is_verified = true;
      await this.userRepo.save(user);

      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  // comment: login logic
  async login(data: LoginDto) {
    // comment: find user by email
    const user = await this.userRepo.findOne({
      where: { email: data.email },
    });

    // comment: user not found
    if (!user) {
      throw new BadRequestException('User Not Found');
    }

    // comment: check password
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    // comment: ADMIN LOGIN
    if (user.role === 'admin') {
      // comment: fetch all candidate users with their profile
      const candidates = await this.userRepo.find({
        where: { role: 'candidate' },

        // comment: load ALL required relations
        relations: {
          userDetails: true,
          education: true, // ✅ add this
          workExperience: true, // ✅ add this
        },
      });

      // comment: current admin user (without relations needed)
      const adminUser = await this.userRepo.findOne({
        where: { id: user.id },
      });

      // comment: generate token
      const token = this.jwtService.sign({
        userId: user.id,
        role: user.role,
      });

      return {
        token,
        data: {
          admin: adminUser, // ✅ current admin,
          role: 'admin',
          candidates: candidates, // ✅ all candidates with details,
          success: true,
          message: 'Admin login successful',
        },
      };
    }

    // comment: load user with details
    let userWithDetails: User | null = user;

    if (user.role === 'candidate') {
      const updatedUser = await this.userRepo.findOne({
        where: { id: user.id },
        relations: {
          userDetails: true,
          education: true, // ✅ add this
          workExperience: true, // ✅ add this
        },
      });

      // comment: ensure user exists
      if (!updatedUser) {
        throw new BadRequestException('User not found');
      }

      userWithDetails = updatedUser;
    }

    // comment: check email verification
    if (!user.is_verified) {
      return {
        success: false,
        message: 'Email not verified. Please verify your email.',
      };
    }

    // comment: check profile completion
    if (!user.is_profile_completed) {
      return {
        success: false,
        message: 'Profile not completed. Please complete your profile.',
      };
    }

    const token = this.jwtService.sign({
      userId: user.id,
      role: user.role,
    });

    return {
      token,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        user: userWithDetails, // ✅ safe,
        success: true,
        message: 'Login successful',
      },
    };
  }

  async refresh(req: Request, res: Response) {
    try {
      // comment: get token from cookie
      const token = req.cookies?.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token found',
        });
      }

      // comment: verify token
      const decoded = this.jwtService.verify(token);

      const user = await this.userRepo.findOne({
        where: { id: decoded.userId },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid user',
        });
      }

      // ================= ADMIN =================
      if (user.role === 'admin') {
        const candidates = await this.userRepo.find({
          where: { role: 'candidate' },
          relations: {
            userDetails: true,
            education: true,
            workExperience: true,
          },
        });

        return res.json({
          data: {
            role: 'admin',
            admin: user,
            candidates,
            success: true,
          },
        });
      }

      // ================= CANDIDATE =================
      if (user.role === 'candidate') {
        const candidate = await this.userRepo.findOne({
          where: { id: user.id },
          relations: {
            userDetails: true,
            education: true,
            workExperience: true,
          },
        });

        return res.json({
          data: {
            success: true,
            role: 'candidate',
            user: candidate,
          },
        });
      }
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Token expired or invalid',
      });
    }
  }
}
