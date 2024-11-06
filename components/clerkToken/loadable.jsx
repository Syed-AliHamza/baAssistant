/**
 *
 * Asynchronously loads the component for login Page
 *
 */

import loadable from '../../../utils/loadable';

export default loadable(() => import('./index'));
