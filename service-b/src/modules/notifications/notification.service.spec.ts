import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { RedisService } from '../redis/redis.service';
import Redis from 'ioredis';

describe('NotificationService', () => {
  let service: NotificationService;
  let redisClientMock: Partial<Redis>;

  beforeEach(async () => {
    redisClientMock = {
      lpush: jest.fn().mockResolvedValue(1),
      lrange: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: RedisService,
          useValue: {
            getClient: () => redisClientMock,
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should send a notification', async () => {
    const result = await service.send('user-123', 'Test message');
    expect(result.user.id).toBe('user-123');
    expect(redisClientMock.lpush).toHaveBeenCalled();
  });

  it('should get empty logs', async () => {
    const result = await service.getAll();
    expect(result).toEqual([]);
    expect(redisClientMock.lrange).toHaveBeenCalledWith('notifications', 0, -1);
  });
});
