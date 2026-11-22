import { useState } from 'react';

const Add = props => {
  const [thing, setThing] = useState('');

  return (
    <div className='flex gap-2 mb-5' >
      <input className='flex-1 bg-white border border-gray-300 rounded-lg shrink-0 active:bg-blue-600'
        value={thing}
        onChange={e => setThing(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && thing.trim() !== '') {
            props.onAdd(thing.trim());
            setThing('');
          }
        }}
      />
      <button
        className='bg-blue-500 text-white px-4 py-1 rounded-lg'
        onClick={() => {
          if (thing.trim() !== '') {
            props.onAdd(thing.trim());
            setThing('');
          }
        }}
      >
        上架
      </button>
    </div>
  );
};

export default Add;
