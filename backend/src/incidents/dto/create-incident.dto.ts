export class CreateIncidentDto {
  title: string;
  description: string;
  type: string;
  location: {
    type: string; // "Point" or other location type if needed
    coordinates: number[]; // [longitude, latitude]
  };
}
