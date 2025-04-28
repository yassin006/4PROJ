import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              { email: 'user1@example.com', role: 'user' },
              { email: 'admin@example.com', role: 'admin' },
            ]),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of users', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      { email: 'user1@example.com', role: 'user' },
      { email: 'admin@example.com', role: 'admin' },
    ]);
  });
});
