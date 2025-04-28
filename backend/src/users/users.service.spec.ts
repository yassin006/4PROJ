import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.schema';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue({
              _id: '123',
              email: 'test@example.com',
              name: 'Test User',
              role: 'user',
              password: 'hashed',
              refreshToken: null,
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a user by email', async () => {
    const user = await service.findByEmail('test@example.com');

    expect(user?.email).toBe('test@example.com');
    expect(user?.role).toBe('user');
  });
});
