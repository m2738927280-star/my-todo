import { useState, useEffect } from 'react';
import Add from './Add';
import TodoItems from './TodoItems';


const TodoList = () => {
  const [items, setItems] = useState(() => {
    const dataVault = localStorage.getItem('vault');
    if (dataVault) {
      return JSON.parse(dataVault);
    }
    return [
      { id: 1, thing: '吃牛排', done: false },
      { id: 2, thing: '敲React代码', done: true },
      { id: 3, thing: '出国旅游', done: false },
    ];
  });

  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState('all');

  let showItems;
  if (filter === 'all') {
    showItems = items.filter(t => t.thing.includes(keyword));
  } else if (filter === 'undo') {
    showItems = items.filter(t => t.thing.includes(keyword) && t.done === false);
  } else if (filter === 'done') {
    showItems = items.filter(t => t.thing.includes(keyword) && t.done === true);
  }

  useEffect(() => {
    const undoCount = items.filter(t => t.done === false).length;
    document.title = `${undoCount} thing(s) undo.`;
    localStorage.setItem('vault', JSON.stringify(items));
  }, [items]);

  return (
    <div className='min-h-screen bg-gray-100 p-4 max-w-md mx-auto'>
      <input className='w-full bg-white border border-gray-300 rounded-lg px-3 py-2 mb-3 outline-none focus:border-blue-500'
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="search thing..."
      />

      <div className='flex gap-2 mb-3'>
        <button className='flex-1 bg-white border border-gray-300 py-1.5 rounded-lg text-sm'
          onClick={() => setFilter('all')}
          style={{ backgroundColor: filter === 'all' ? 'lightblue' : '' }}
        >
          all
        </button>
        <button  className='flex-1 bg-white border border-gray-300 py-1.5 rounded-lg text-sm'
          onClick={() => setFilter('undo')}
          style={{ backgroundColor: filter === 'undo' ? 'lightblue' : '' }}
        >
          undo
        </button>
        <button  className='flex-1 bg-white border border-gray-300 py-1.5 rounded-lg text-sm'
          onClick={() => setFilter('done')}
          style={{ backgroundColor: filter === 'done' ? 'lightblue' : '' }}
        >
          done
        </button>
      </div>

      <Add
        onAdd={thing =>
          setItems([...items, { id: Date.now(), thing, done: false }])
        }
      />

      <ul>
        {showItems.map(item => (
          <TodoItems
            key={item.id}
            item={item}
            onToggle={() =>
              setItems(
                items.map(t => (t.id === item.id ? { ...t, done: !t.done } : t))
              )
            }
            onDelete={() => setItems(items.filter(t => t.id !== item.id))}
            onEdit={text =>
              setItems(
                items.map(t => (t.id === item.id ? { ...t, thing: text } : t))
              )
            }
          />
        ))}
      </ul>
      <button
        onClick={() => setItems(items.filter(t => t.done === false))}
        disabled={items.length === 0}
      >
        clear all finished items.
      </button>

      {items.length === 0 ? (
        <button disabled>no items available so button disabled</button>
      ) : items.every(t => t.done === true) ? (
        <button
          onClick={() => setItems(items.map(t => ({ ...t, done: false })))}
        >
          redo all items
        </button>
      ) : (
        <button
          onClick={() => setItems(items.map(t => ({ ...t, done: true })))}
        >
          finished all items
        </button>
      )}
    </div>
  );
};

export default TodoList;
