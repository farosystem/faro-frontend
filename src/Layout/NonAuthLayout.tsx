import { Fragment } from 'react';
import PropTypes from 'prop-types';
import withRouter from '@/components/Common/withRouter';

const NonAuthLayout = (props) => {
  return <Fragment>{props.children}</Fragment>;
};

NonAuthLayout.propTypes = {
  children: PropTypes.any,
  location: PropTypes.object
};

export default withRouter(NonAuthLayout);
