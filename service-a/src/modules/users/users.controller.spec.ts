import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RedisService } from '../redis/redis.service';
import { ClientProxy } from '@nestjs/microservices';
import { User } from './users.interface';

describe('UsersController (integration)', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let redisClientMock: any;
  let grpcClientMock: Partial<ClientProxy>;
  let rabbitClientMock: Partial<ClientProxy>;

  beforeEach(async () => {
    redisClientMock = {
      hmset: jest.fn().mockResolvedValue('OK'),
      hgetall: jest.fn().mockResolvedValue({}),
    };

    grpcClientMock = {
      emit: jest.fn(),
    };

    rabbitClientMock = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: RedisService,
          useValue: {
            getClient: () => redisClientMock,
          },
        },
        {
          provide: 'NOTIFICATION_PACKAGE',
          useValue: {
            getService: () => ({
              notifyUser: jest.fn().mockReturnValue({
                toPromise: async () => ({ status: 'OK' }),
              }),
            }),
          },
        },
        {
          provide: 'RABBITMQ_SERVICE',
          useValue: rabbitClientMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should create a user and send notification', async () => {
    const userDto = {
      name: 'Carlos',
      email: 'carlos@example.com',
      age: 30,
    };

    const user = await controller.create(userDto);

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Carlos');
    expect(redisClientMock.hmset).toHaveBeenCalled();
  });

  it('should return null for nonexistent user', async () => {
    redisClientMock.hgetall.mockResolvedValueOnce({});
    const result = await controller.getUser('nonexistent');
    expect(result).toBeUndefined();
  });

  it('should update a user and emit event', async () => {
    // Simula usuario existente
    redisClientMock.hgetall.mockResolvedValueOnce({
      name: 'Carlos',
      email: 'carlos@example.com',
      age: '30',
    });

    const body: User = { name: 'Carlos Actualizado', email: 'carlos@example.com', age: 30, };
    const result = await controller.updateUser('abc123', body);

    expect(result.name).toBe('Carlos Actualizado');
    expect(redisClientMock.hmset).toHaveBeenCalledWith(
      'user:abc123',
      expect.objectContaining({
        name: 'Carlos Actualizado',
      }),
    );
    expect(rabbitClientMock.emit).toHaveBeenCalledWith('user_updated', result);
  });
});
