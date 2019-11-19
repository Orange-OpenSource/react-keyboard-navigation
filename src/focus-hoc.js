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

export default function withFocus(WrappedComponent) {
  class WithFocus extends React.Component {
    constructor(props) {
      super(props);
      this.setFocusableRef = element => {
        if (element) {
          element.focus();
        }
      };
      this.handleEnter = this.handleEnter.bind(this);
    }

    componentDidMount() {
      const { id, parentId, position, defaultActive } = this.props;
      const { actions } = this.context;
      actions.addElement(id, parentId, position, defaultActive);
    }

    componentWillUnmount() {
      const { id, parentId } = this.props;
      const { actions } = this.context;
      actions.removeElement(id, parentId);
    }

    handleEnter(event) {
      const { onEnterDown = () => {} } = this.props;

      if (event.key === 'Enter') {
        onEnterDown();
      }
    }

    render() {
      const {
        tabIndex,
        id,
        parentId,
        position,
        defaultActive,
        onEnterDown,
        ...rest
      } = this.props;
      const {
        state: { activeElement },
      } = this.context;
      const focused =
        activeElement.id === id && activeElement.parentId === parentId;
      return (
        <WrappedComponent
          forwardedRef={focused ? this.setFocusableRef : null}
          tabIndex={tabIndex}
          onKeyDown={this.handleEnter}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
        />
      );
    }
  }

  WithFocus.propTypes = {
    id: PropTypes.string.isRequired,
    defaultActive: PropTypes.bool,
    onEnterDown: PropTypes.func,
    parentId: PropTypes.string,
    position: PropTypes.number,
    tabIndex: PropTypes.number,
  };

  WithFocus.defaultProps = {
    defaultActive: false,
    onEnterDown: () => undefined,
    parentId: 'default',
    position: null,
    tabIndex: 0,
  };

  WithFocus.contextType = NavigationContext;

  return WithFocus;
}
