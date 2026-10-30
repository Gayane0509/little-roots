// Registers every drawn theme with the art registry.
import { registerThemeArt } from '../index';

import { art as family } from './family';
import { art as food } from './food';
import { art as animals } from './animals';
import { art as colors } from './colors';
import { art as numbers } from './numbers';
import { art as body } from './body';
import { art as clothes } from './clothes';
import { art as home } from './home';
import { art as toys } from './toys';
import { art as nature } from './nature';
import { art as transport } from './transport';
import { art as feelings } from './feelings';

registerThemeArt('family', family);
registerThemeArt('food', food);
registerThemeArt('animals', animals);
registerThemeArt('colors', colors);
registerThemeArt('numbers', numbers);
registerThemeArt('body', body);
registerThemeArt('clothes', clothes);
registerThemeArt('home', home);
registerThemeArt('toys', toys);
registerThemeArt('nature', nature);
registerThemeArt('transport', transport);
registerThemeArt('feelings', feelings);
