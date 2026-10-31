// Historical tests assert editions before the October 31 reader rewrite; they read that exact copy.
import {briefs as current} from '../scripts/theme-current.mjs';
import {beforeReaderRewrite} from './theme-name-history.mjs';
export const briefs=current.map(beforeReaderRewrite);
