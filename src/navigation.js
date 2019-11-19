/**
 * react-keyboard-navigation
 *
 * Copyright (c) 2019 Orange
 *
 * This software is distributed under the terms and conditions of
 * the 'MIT' license which can be found in the LICENSE' file
 * in this distribution or at https://opensource.org/licenses/MIT
 */
/* eslint-disable no-underscore-dangle, max-classes-per-file */

const sortBy = key => {
  return (a, b) => {
    if (a[key] === b[key]) {
      return 0;
    }
    return a[key] > b[key] ? 1 : -1;
  };
};

/**
 * Container for the navigation.
 */
class Container {
  /**
   * Create a new Container for the navigation.
   * @param {string} id - The id of the container.
   * @param {number} position - The position (order) of the container in the UI.
   * @param {boolean} isModal - The behavior of the container (is it a modal
   * window or not ?).
   */
  constructor(id, position, isModal) {
    if (!id) {
      throw new Error('Id parameter is required to create a new Container.');
    }
    this.id = id;
    this.position = position;
    this.isModal = isModal;
  }
}

/**
 * Element for the navigation.
 */
class Element {
  /**
   * Create a new Element for the navigation.
   * @param {string} id - The id of the element.
   * @param {string} parentId - The id of the container, parent of the element.
   * @param {number} position - The position (order) of the element in the UI.
   */
  constructor(id, parentId, position) {
    if (!id || !parentId) {
      throw new Error(
        'Id and parentId parameters are required to create a new Element.'
      );
    }
    this.id = id;
    this.parentId = parentId;
    this.position = position;
  }
}

/**
 * Navigation class to manage the containers, the elements and the behavior of
 * the navigation system.
 */
class Navigation {
  /**
   * Create a new Navigation system.
   * @param {string} id [id=main] - The id of the navigation.
   */
  constructor(id = 'main') {
    this._id = id;
    this._containers = [new Container('default')];
    this._elements = {};
  }

  /**
   * Add a Container in the navigation.
   * @param {string} id - The unique id of the container.
   * @param {number} position [position=null] - The position (order) of the
   * container in the UI.
   * @param {boolean} isModal [isModal=false] - The behavior of the container
   * (is it a modal window or not ?).
   */
  addContainer(id, position = null, isModal = false) {
    if (this._containers.findIndex(container => container.id === id) !== -1) {
      throw new Error('Id for this container already exist.');
    }
    const container = new Container(id, position, isModal);
    this._containers.push(container);
    if (position) {
      this._containers = this._containers.concat().sort(sortBy('position'));
    }
  }

  /**
   * Remove a Container from the navigation.
   * @param {string} id - The unique id of the container.
   */
  removeContainer(id) {
    const index = this._containers.findIndex(container => container.id === id);
    if (index !== -1) {
      this._containers.splice(index, 1);
    } else {
      throw new Error('Id for this container does not exist.');
    }
  }

  /**
   * Get the index of a focusable element from the navigation.
   * @param {string} id - The id of the element (unique per container).
   * @param {string} parentId [parentId=default] - The id of the container,
   * parent of the element (default container if not specified).
   * @return {number} The index of the focusable element found or -1.
   */
  getElementId(id, parentId = 'default') {
    if (!this._elements[parentId]) {
      throw new Error('ParentId for this element does not exist.');
    }
    return this._elements[parentId].findIndex(element => element.id === id);
  }

  /**
   * Get a focusable element from the navigation.
   * @param {string} id - The id of the element (unique per container).
   * @param {string} parentId [parentId=default] - The id of the container,
   * parent of the element (default container if not specified).
   * @return {Object} The focusable element found.
   */
  getElement(id, parentId = 'default') {
    const index = this.getElementId(id, parentId);
    if (index !== -1) {
      return this._elements[parentId][index];
    }
    throw new Error('Id for this element does not exist.');
  }

  /**
   * Add a focusable element in the navigation.
   * @param {string} id - The id of the element (unique per container).
   * @param {string} parentId [parentId=default] - The id of the container,
   * parent of the element (default container if not specified).
   * @param {number} position [position=null] - The position (order) of the
   * element in the container or in UI (if parentID is not specified).
   * @return {Object} The created focusable element.
   */
  addElement(id, parentId = 'default', position = null) {
    if (!this._elements[parentId]) {
      this._elements[parentId] = [];
    } else if (this.getElementId(id, parentId) !== -1) {
      throw new Error('Id for this element already exist.');
    }
    const element = new Element(id, parentId, position);
    this._elements[parentId].push(element);
    if (position) {
      this._elements[parentId] = this._elements[parentId]
        .concat()
        .sort(sortBy('position'));
    }
    return element;
  }

  /**
   * Remove a focusable element from the navigation.
   * @param {string} id - The id of the element (unique per container).
   * @param {string} parentId [parentId=default] - The id of the container,
   * parent of the element (default container if not specified).
   */
  removeElement(id, parentId = 'default') {
    const index = this.getElementId(id, parentId);
    if (index !== -1) {
      this._elements[parentId].splice(index, 1);
    } else {
      throw new Error('Id for this element does not exist.');
    }
  }

  /**
   * Give the next focusable element.
   * @param {Object} activeElement [activeElement={}] - The current active
   * (focused) element.
   * @param {number} direction [direction=1] - The search direction of the next
   * element.
   * It can be positive (1) to reach the next element or negative (-1) to reach
   * the previous element.
   * A value greater than |1| will change the step.
   * @return {Object} The next focusable element.
   */
  nextElement(activeElement = {}, direction = 1) {
    const activeId = activeElement.id || null;
    const activeParentId = activeElement.parentId || null;
    let elements = [];
    let currentId = 0;
    if (
      activeParentId &&
      this._containers.findIndex(
        container => container.id === activeParentId && container.isModal
      ) !== -1
    ) {
      // The container is a modal
      elements = this._elements[activeParentId];
    } else {
      // The container is not a modal, take them all
      this._containers.forEach(container => {
        if (this._elements[container.id]) {
          elements = elements.concat(this._elements[container.id]);
        }
      });
    }
    if (!elements.length) {
      return {};
    }
    // No current active element
    if (!activeId) {
      return elements[0];
    }
    // Current active element
    currentId = elements.findIndex(
      element => element.id === activeId && element.parentId === activeParentId
    );
    currentId = (currentId + direction) % elements.length;
    if (currentId < 0) {
      currentId += elements.length;
    }
    return elements[currentId];
  }
}

export default Navigation;
