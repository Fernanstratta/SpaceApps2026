import type { scoreAnalog } from '../../src/lib/analogScoring';
import type { ApodResponse, Comparison, DataResponse, HealthResponse, PlanetsResponse } from '../../src/lib/spaceApiTypes';
import type { AnalogComparison, CollectionResponse, EarthLocation, PlanetaryLocation, SatelliteImage, ScientificSource } from '../../src/types/planetaryAnalog';
import { createStarmanClient } from './starmanClient.js';

type RankedAnalog = AnalogComparison & { ranking: ReturnType<typeof scoreAnalog> };
interface ComparisonResult {
  comparison: RankedAnalog;
  earth: EarthLocation;
  planetary: PlanetaryLocation;
  imagery: SatelliteImage[];
  sources: ScientificSource[];
}
interface EarthGeoJson {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    id: string;
    geometry: { type: 'Point'; coordinates: [longitude: number, latitude: number] };
    properties: Pick<EarthLocation, 'name' | 'country' | 'state' | 'coordinateRole' | 'qualityFlags'>;
  }>;
  meta: CollectionResponse<EarthLocation>['meta'];
}

const api = createStarmanClient();

export function endpointCalls() {
  return {

    getHealth: api.get<HealthResponse>('/api/health'),
    listPlanets: api.get<PlanetsResponse>('/api/planets'),
    getApod: api.get<ApodResponse>('/api/apod'),
    getLunarAnalogs: api.get<DataResponse<Comparison>>('/api/lunar-analogs', new URLSearchParams('id=elegante_linne')),
    getAnalogs: api.get<CollectionResponse<RankedAnalog>>('/api/analogs', new URLSearchParams('limit=1')),
    getEarthLocations: api.get<EarthGeoJson>('/api/locations', new URLSearchParams('format=geojson&limit=1')),
    getComparison: api.get<DataResponse<ComparisonResult>>('/api/compare', new URLSearchParams('earth=cerro-prieto&planetary=gusev')),
    getRankings: api.get<CollectionResponse<RankedAnalog>>('/api/rankings', new URLSearchParams('planet=Mars&profile=geology&limit=1')),
    getPlanetarySites: api.get<CollectionResponse<PlanetaryLocation>>('/api/planetary', new URLSearchParams('planet=Mars&limit=1')),
    getSources: api.get<CollectionResponse<ScientificSource>>('/api/sources', new URLSearchParams('limit=1')),
    getDatasets: api.get<CollectionResponse<ScientificSource>>('/api/datasets', new URLSearchParams('limit=1')),
    getImagery: api.get<CollectionResponse<SatelliteImage>>('/api/imagery', new URLSearchParams('location=bagnold&limit=1')),
    getAnalogByPath: api.get<DataResponse<RankedAnalog>>('/api/analogs/cerro-prieto-gusev'),
    getEarthLocationByPath: api.get<DataResponse<EarthLocation>>('/api/locations/cerro-prieto'),
    getMarsSites: api.get<CollectionResponse<PlanetaryLocation>>('/api/planets/mars', new URLSearchParams('limit=1')),
    getMoonSites: api.get<CollectionResponse<PlanetaryLocation>>('/api/planets/moon', new URLSearchParams('limit=1')),
  };
}
