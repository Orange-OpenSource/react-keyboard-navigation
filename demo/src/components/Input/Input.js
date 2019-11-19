import React from 'react';
import { withNavigation } from '../../../../src';
import { withFocus } from '../../../../src';
import css from './Input.module.css';

const InputWithFocus = withFocus(
  ({ forwardedRef, ...props }) => <input ref={forwardedRef} {...props} />
  );

export const Input = withNavigation(({ label, type, parentId }) => {
  return (
  <div className={css.input}>
    <InputWithFocus
      type={type}
      id="input"
      parentId={parentId}
      position={0}
      defaultActive
    />
    <label>{label}</label>
  </div>
  );
});
