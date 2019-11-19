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
import Navigation from './navigation';
import { NavigationContext } from '.';

class NavigationProvider extends React.Component {
  constructor(props) {
    super(props);
    this.navigation = new Navigation(props.id);
    this.state = { activeElement: {} };
    this.actions = {
      addContainer: (id, position, isModal) =>
        this.addContainer(id, position, isModal),
      removeContainer: id => this.removeContainer(id),
      addElement: (id, parentId, position, defaultActive) =>
        this.addElement(id, parentId, position, defaultActive),
      removeElement: (id, parentId) => this.removeElement(id, parentId),
    };
    this.handleArrow = this.handleArrow.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleArrow, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleArrow, false);
  }

  addContainer(id, position, isModal) {
    try {
      this.navigation.addContainer(id, position, isModal);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `The container component (withNavigation) - id: ${id} - failed => ${error}`
      );
    }
  }

  removeContainer(id) {
    try {
      this.navigation.removeContainer(id);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `The container component (withNavigation) - id: ${id} - deletion failed => ${error}`
      );
    }
  }

  addElement(id, parentId, position, defaultActive) {
    try {
      const element = this.navigation.addElement(id, parentId, position);
      if (defaultActive) {
        this.setState({ activeElement: element });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `The focusable component (withFocus) - id: ${id} - failed => ${error}`
      );
    }
  }

  removeElement(id, parentId) {
    try {
      const { activeElement } = this.state;
      const element = this.navigation.getElement(id, parentId);
      if (element === activeElement) {
        this.setState({ activeElement: this.navigation.nextElement() });
      }
      this.navigation.removeElement(id, parentId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `The focusable component (withFocus) - id: ${id} - deletion failed => ${error}`
      );
    }
  }

  handleArrow(event) {
    let direction = 0;
    switch (event.key) {
      case 'ArrowUp':
        direction = -1;
        break;
      case 'ArrowDown':
        direction = 1;
        break;
      default:
        return;
    }
    const { activeElement } = this.state;
    this.setState({
      activeElement: this.navigation.nextElement(activeElement, direction),
    });
  }

  render() {
    const { children } = this.props;
    return (
      <NavigationContext.Provider
        value={{ state: this.state, actions: this.actions }}
      >
        {children}
      </NavigationContext.Provider>
    );
  }
}

NavigationProvider.propTypes = {
  children: PropTypes.element.isRequired,
  id: PropTypes.string,
};

NavigationProvider.defaultProps = {
  id: 'main',
};

export default NavigationProvider;
