import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';

describe('IncidentsController', () => {
  let controller: IncidentsController;
  let service: IncidentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentsController],
      providers: [
        {
          provide: IncidentsService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              title: 'Test incident',
              description: 'Something happened',
              type: 'accident',
              location: {
                type: 'Point',
                coordinates: [7.26, 43.71],
              },
            }),
            validateIncident: jest.fn().mockResolvedValue({
              validations: 1,
              invalidations: 0,
            }),
            invalidateIncident: jest.fn().mockResolvedValue({
              validations: 0,
              invalidations: 1,
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<IncidentsController>(IncidentsController);
    service = module.get<IncidentsService>(IncidentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an incident', async () => {
    const dto: CreateIncidentDto = {
      title: 'Test incident',
      description: 'Something happened',
      type: 'accident',
      location: {
        type: 'Point',
        coordinates: [7.26, 43.71],
      },
    };

    const fakeUserId = 'fakeUserId123';

const result = await controller['incidentsService'].create(dto, fakeUserId);

    expect(result.title).toBe('Test incident');
    expect(result.location.coordinates).toEqual([7.26, 43.71]);
  });

  it('should validate an incident', async () => {
    const incidentId = 'fakeIncidentId';
    const result = await controller.validateIncident(incidentId);

    expect(service.validateIncident).toHaveBeenCalledWith(incidentId);
    expect(result.validations).toBe(1);
    expect(result.invalidations).toBe(0);
  });

  it('should invalidate an incident', async () => {
    const incidentId = 'fakeIncidentId';
    const result = await controller.invalidateIncident(incidentId);

    expect(service.invalidateIncident).toHaveBeenCalledWith(incidentId);
    expect(result.validations).toBe(0);
    expect(result.invalidations).toBe(1);
  });
});
