import { Fragment } from 'react';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

import Routes from './Routes/index';

import './assets/scss/theme.scss';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.locale('es');

function App() {
  return (
    <Fragment>
      <Routes />
    </Fragment>
  );
}

export default App;
