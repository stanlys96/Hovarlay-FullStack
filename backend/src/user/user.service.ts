import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginDto, LogInWithGoogleDto } from './user.dto';
import * as jwt from 'jsonwebtoken';
import { generateSecurePassword } from 'src/utils/utils';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const { password, ...safeUser } = user;
        return { message: 'User found', success: true, ...safeUser };
    }

    async register(createUserDto: CreateUserDto) {
        const { email, password } = createUserDto;

        if (!email || !password) {
            throw new BadRequestException('All fields are required.');
        }

        const existing = await this.userRepository.findOne({ where: { email } });
        if (existing) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.userRepository.create({
            email: email,
            password: hashedPassword,
            method: "email",
        });
        await this.userRepository.save(newUser);
        return {
            message: 'Register successful',
            success: true,
            email,
        };
    }

    async loginWithGoogle(loginWithGoogleDto: LogInWithGoogleDto) {
        const { email, name, image, googleId } = loginWithGoogleDto;
        if (!email) {
            throw new BadRequestException('All fields are required.');
        }
        const existing = await this.userRepository.findOne({ where: { email } });
        if (!existing) {
            const password = generateSecurePassword(15);
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = this.userRepository.create({
                email: email,
                password: hashedPassword,
                method: "google",
                name: name,
                image: image,
                googleId: googleId,
            });
            await this.userRepository.save(newUser);
        }
        return {
            message: 'Sign in success!',
            success: true,
            email,
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        if (!email || !password) {
            throw new BadRequestException('All fields are required.');
        }
        const userData = await this.userRepository.findOne({ where: { email } });
        const passwordMatch = await bcrypt.compare(password, userData?.password);
        if (!userData || !passwordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const accessToken = jwt.sign(
            { email: userData.email },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' },
        );
        const payload = {
            success: true,
            message: 'Login successful',
            id: userData.id,
            email: userData.email,
            name: "",
            image: "",
            token: accessToken,
        };
        return payload;
    }
}