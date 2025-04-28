import { Test, TestingModule } from '@nestjs/testing';
import { PredictionsController } from './predictions.controller';
import { PredictionsService } from './predictions.service';

describe('PredictionsController', () => {
  let controller: PredictionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PredictionsController],
      providers: [
        {
          provide: PredictionsService,
          useValue: {
            predictCongestion: jest.fn().mockResolvedValue({
              predictionBasis: 'historique incidents par heure',
              mostCongestedHours: [
                { hour: 17, incidents: 5 },
                { hour: 18, incidents: 4 },
              ],
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<PredictionsController>(PredictionsController);
  });

  it('should return predicted congestion data', async () => {
    const result = await controller.getCongestionPrediction();
    expect(result.predictionBasis).toBe('historique incidents par heure');
    expect(result.mostCongestedHours.length).toBe(2);
  });
});
