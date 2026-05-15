import { complexNumbersQuestions } from './complex-numbers';
import { sequencesQuestions } from './sequences';
import { exponentialLogQuestions } from './exponential-log';
import { derivativesQuestions } from './derivatives';
import { integralsQuestions } from './integrals';
import { limitsQuestions } from './limits';
import { probabilityQuestions } from './probability';
import { functionsQuestions } from './functions';
import { volumeQuestions } from './volume';
import { analyticGeometryQuestions } from './analytic-geometry';
import { solidGeometryQuestions } from './solid-geometry';
import { SeedQuestion } from './types';

export const allQuestions: SeedQuestion[] = [
  ...complexNumbersQuestions,
  ...sequencesQuestions,
  ...exponentialLogQuestions,
  ...derivativesQuestions,
  ...integralsQuestions,
  ...limitsQuestions,
  ...probabilityQuestions,
  ...functionsQuestions,
  ...volumeQuestions,
  ...analyticGeometryQuestions,
  ...solidGeometryQuestions,
];

export type { SeedQuestion };
