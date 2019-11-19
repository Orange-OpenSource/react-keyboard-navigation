import React from 'react';
import { withNavigation } from '../../../../src';
import { withFocus } from '../../../../src';
import css from './ToDos.module.css';

const SpanWithFocus = withFocus(
  ({ forwardedRef, ...props }) => <span ref={forwardedRef} {...props} />
);

export const ToDos = withNavigation(({ toDos }) => {
  if (toDos === undefined || !toDos.length) return null;

  return (
    <div className={css.todos}>
      {toDos.map((toDo, index) => (
        <SpanWithFocus
          key={index}
          className={`${css.todo} ${toDo.completed ? css.completed : ''}`}
          id={`todo-${index}`}
          parentId="todos"
          position={index}>
          {toDo.name}
        </SpanWithFocus>
      ))}
    </div>
  )
});
