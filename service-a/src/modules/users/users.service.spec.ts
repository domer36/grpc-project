import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { RedisService } from '../redis/redis.service';
import Redis from 'ioredis';

describe('UsersService', () => {
  let service: UsersService;
  let redisClientMock: Partial<Redis>;

  beforeEach(async () => {
    redisClientMock = {
      hgetall: jest.fn().mockResolvedValue({}),
      hmset: jest.fn().mockResolvedValue('OK'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: RedisService,
          useValue: {
            getClient: () => redisClientMock,
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const result = await service.create({
      name: 'Test',
      email: 'test@example.com',
      age: 25,
    });

    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Test');
    expect(redisClientMock.hmset).toHaveBeenCalled();
  });

  it('should return null if user not found', async () => {
    (redisClientMock.hgetall as jest.Mock).mockResolvedValue({});
    const result = await service.findById('nonexistent');
    expect(result).toBeNull();
  });
});
