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

const NavigationContext = React.createContext({
  state: {},
  actions: {
    addContainer: () => {},
    removeContainer: () => {},
    addElement: () => {},
    removeElement: () => {},
  },
});

export default NavigationContext;
