import { useState, useEffect } from 'react';
import Add from './Add';
import TodoItems from './TodoItems';
import Auth from './Auth';
import { supabase } from './supabase';

const TodoList = () => {
  const [session,setSession]=useState(null);
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setSession(session);});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{setSession(session);});
    return ()=>subscription.unsubscribe();
  },[]);

  // 1. 网页刚打开时，去云端把所有待办拉回来
  useEffect(() => {
    if(!session){
      setItems([]);
      return;
    }
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data) {
        // 把云端的 text/completed 转成你原本用的 thing/done
        setItems(data.map(row => ({
          id: row.id,
          thing: row.text,
          done: row.completed
        })));
      }
    };
    fetchTodos();
  }, [session]);

  // 2. 更新浏览器标签页的未完成数量
  useEffect(() => {
    const undoCount = items.filter(t => t.done === false).length;
    document.title = `${undoCount} thing(s) undo.`;
  }, [items]);

  if(!session){
    return <Auth/>;
  }

  // 3. 添加一条待办到云端
  const handleAdd = async (thing) => {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ text: thing, completed: false }])
      .select();

    if (!error && data) {
      const newRow = data[0];
      setItems([...items, { id: newRow.id, thing: newRow.text, done: newRow.completed }]);
    }
  };

  // 4. 切换完成/未完成状态
  const handleToggle = async (item) => {
    const newDone = !item.done;
    const { error } = await supabase
      .from('todos')
      .update({ completed: newDone })
      .eq('id', item.id);

    if (!error) {
      setItems(items.map(t => (t.id === item.id ? { ...t, done: newDone } : t)));
    }
  };

  // 5. 删除单条待办
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (!error) {
      setItems(items.filter(t => t.id !== id));
    }
  };

  // 6. 修改待办文字
  const handleEdit = async (id, text) => {
    const { error } = await supabase
      .from('todos')
      .update({ text })
      .eq('id', id);

    if (!error) {
      setItems(items.map(t => (t.id === id ? { ...t, thing: text } : t)));
    }
  };

  // 7. 清空所有已完成
  const handleClearFinished = async () => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('completed', true);

    if (!error) {
      setItems(items.filter(t => t.done === false));
    }
  };

  // 8. 全部标为完成 / 全部重做
  const handleToggleAll = async (targetDone) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed: targetDone })
      .neq('id', 0);

    if (!error) {
      setItems(items.map(t => ({ ...t, done: targetDone })));
    }
  };

  let showItems;
  if (filter === 'all') {
    showItems = items.filter(t => t.thing.includes(keyword));
  } else if (filter === 'undo') {
    showItems = items.filter(t => t.thing.includes(keyword) && t.done === false);
  } else if (filter === 'done') {
    showItems = items.filter(t => t.thing.includes(keyword) && t.done === true);
  }

  return (
    <div className='min-h-screen bg-gray-100 p-4 max-w-md mx-auto'>
      <div className='flex justify-between items-center mb-3 text-sm text-gray-600'>
        <span>{session.user.email.replace('@todo.com','')}</span>
        <button onClick={()=>supabase.auth.signOut()} className='text-red-500 hover:underline'>退出登录</button>
      </div>

      <input
        className='w-full bg-white border border-gray-300 rounded-lg px-3 py-2 mb-3 outline-none focus:border-blue-500'
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="search thing..."
      />

      <div className='flex gap-2 mb-3'>
        <button
          className='flex-1 bg-white border border-gray-300 py-1.5 rounded-lg text-sm'
          onClick={() => setFilter('all')}
          style={{ backgroundColor: filter === 'all' ? 'lightblue' : '' }}
        >
          all
        </button>
        <button
          className='flex-1 bg-white border border-gray-300 py-1.5 rounded-lg text-sm'
          onClick={() => setFilter('undo')}
          style={{ backgroundColor: filter === 'undo' ? 'lightblue' : '' }}
        >
          undo
        </button>
        <button
          className='flex-1 bg-white border border-gray-300 py-1.5 rounded-lg text-sm'
          onClick={() => setFilter('done')}
          style={{ backgroundColor: filter === 'done' ? 'lightblue' : '' }}
        >
          done
        </button>
      </div>

      <Add onAdd={handleAdd} />

      <ul>
        {showItems.map(item => (
          <TodoItems
            key={item.id}
            item={item}
            onToggle={() => handleToggle(item)}
            onDelete={() => handleDelete(item.id)}
            onEdit={text => handleEdit(item.id, text)}
          />
        ))}
      </ul>

      <button
        onClick={handleClearFinished}
        disabled={items.length === 0}
      >
        clear all finished items.
      </button>

      {items.length === 0 ? (
        <button disabled>no items available so button disabled</button>
      ) : items.every(t => t.done === true) ? (
        <button onClick={() => handleToggleAll(false)}>
          redo all items
        </button>
      ) : (
        <button onClick={() => handleToggleAll(true)}>
          finished all items
        </button>
      )}
    </div>
  );
};

export default TodoList;