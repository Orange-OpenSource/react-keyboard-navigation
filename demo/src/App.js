import React, { useState, useContext } from 'react';
import { Header, Input, ToDos, Softkey } from './components';
import { NavigationContext } from '../../src';

export default function App() {
  const [toDos, setToDo] = useState([]);

  const { state: {activeElement} } = useContext(NavigationContext);

  const onKeyCenter = (evt) => {
    if (activeElement.id === 'input' && evt.target.value && evt.target.value.length) {
      const toDo = { name: evt.target.value, completed: false };
      setToDo(prevState => [...prevState, toDo]);
      evt.target.value = "";
    } else if (activeElement.parentId === "todos") {
      setToDo(prevState => {
        const current = [...prevState];
        current[activeElement.position].completed = !current[activeElement.position].completed;
        return current;
      });
    }
  };

  const onKeyRight = () => {
    if (activeElement.parentId === "todos" && Object.keys(activeElement).length !== 0) {
      const currentIndex = activeElement.position;
      setToDo(prevState => {
        const current = [...prevState];
        current.splice(currentIndex, 1);
        return current;
      });
    }
  };

  return (
    <div>
      <Header title="ToDo List" />

      <Input type="text" label="New task" id="home" position={0} />
      <ToDos toDos={toDos} id="todos" position={1} />

      <Softkey
        center={activeElement.id === "input" ? "Insert" : "Toggle"}
        onKeyCenter={onKeyCenter}
        right={activeElement.parentId === "todos" ? "Delete" : ""}
        onKeyRight={onKeyRight}
      />
    </div>
  );
}
