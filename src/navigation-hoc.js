/**
 * react-keyboard-navigation
 *
 * Copyright (c) 2019 Orange
 *
 * This software is distributed under the terms and conditions of
 * the 'MIT' license which can be found in the LICENSE' file
 * in this distribution or at https://opensource.org/licenses/MIT
 */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { NavigationContext } from '.';

export default function withNavigation(WrappedComponent) {
  class WithNavigation extends React.Component {
    componentDidMount() {
      const { id, position, isModal } = this.props;
      const { actions } = this.context;
      actions.addContainer(id, position, isModal);
    }

    componentWillUnmount() {
      const { id } = this.props;
      const { actions } = this.context;
      actions.removeContainer(id);
    }

    render() {
      const { id } = this.props;
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <WrappedComponent parentId={id} {...this.props} />;
    }
  }

  WithNavigation.propTypes = {
    id: PropTypes.string.isRequired,
    isModal: PropTypes.bool,
    position: PropTypes.number,
  };

  WithNavigation.defaultProps = {
    isModal: false,
    position: null,
  };

  WithNavigation.contextType = NavigationContext;

  return WithNavigation;
}
