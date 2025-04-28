import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

describe('StatsController', () => {
  let controller: StatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [
        {
          provide: StatsService,
          useValue: {
            getIncidentStats: jest.fn().mockResolvedValue({
              totalIncidents: 10,
              incidentsByType: [{ _id: 'accident', count: 5 }],
              incidentsByStatus: [{ _id: 'pending', count: 7 }],
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<StatsController>(StatsController);
  });

  it('should return incident stats', async () => {
    const result = await controller.getIncidentStats();
    expect(result.totalIncidents).toBe(10);
    expect(result.incidentsByType[0]._id).toBe('accident');
    expect(result.incidentsByStatus[0].count).toBe(7);
  });
});
