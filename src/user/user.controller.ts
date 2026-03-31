import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Response } from 'express'; // ✅ correct import

@Controller('setup')
export class UserController {
  constructor(private readonly service: UserService) {}

  // // comment: one-time admin creation API
  @Post('admin')
  createAdmin(@Body() body: any) {
    return this.service.createAdmin(body);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token'); // ✅ remove cookie

    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthGuard) // ✅ protect route
  @Get('profile')
  getProfile(@Req() req) {
    return req.user; // auto login user
  }
}
