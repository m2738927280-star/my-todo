import { useState } from 'react';

const TodoItems = props => {
  const [canEdit, setCanEdit] = useState(false);
  const [text, setText] = useState(props.item.thing);

  return (
    <li className='bg-white p-3 rounded-xl shadow-sm mb-3 list-none'>

      <div className='flex items-center justify-between gap-2 mb-2'>
      {canEdit ? (<input className='flex-1 border border-blue-400 rounded px-2 py-1 text-sm outline-none' value={text} onChange={e => setText(e.target.value)} />
      ) : (<span className='text-xs px-2 py-0.5 rounded-full  shrink-0'>{props.item.thing}</span>)}
      <span className='bg-gray-100 text-gray-500'>{props.item.done ? 'done' : 'undo'}</span>
      </div>

      <div className='flex gap-2 justify-end text-xs'>
      <button className='bg-green-50 text-green-600 px-2.5 py-1 rounded-md' onClick={props.onToggle}>{props.item.done ? 'mark as undo' : 'mark as done'}</button>
      <button className='bg-red-50 text-red-500 px-2.5 py-1 rounded-md' onClick={props.onDelete}>delete</button>
      {canEdit ? (<button className='bg-blue-500 text-white px-2.5 py-1 rounded-md' onClick={() => {props.onEdit(text);setCanEdit(false);
      }}>保存</button>) : (<button className='bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md ' onClick={() => setCanEdit(true)}>编辑</button>)}
      </div>

    </li>
  );
};

export default TodoItems;
