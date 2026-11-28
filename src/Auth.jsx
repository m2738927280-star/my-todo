import { useState } from "react";
import { supabase } from "./supabase";

const Auth=()=>{
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [message,setMessage]=useState('');
    const [loading,setLoading]=useState(false);

    //login
    const handleSignIn=async(e)=>{
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const {error}=await supabase.auth.signInWithPassword({email,password});
        if(error) setMessage('login failure:'+error.message);
        setLoading(false);
    };

    //logup
    const handleSignUp=async()=>{
        setLoading(true);
        setMessage('');
        const {error}=await supabase.auth.signUp({email,password});
        if(error){
            setMessage('signup failure:'+error.message);
        }
        else{
            setMessage('signup success!entering...');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <form onSubmit={handleSignIn} className="w-full max-w-sm bg-white p-6 rounded-xl shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-center text-gray-800">todoItemsLogin</h2>

                <input type="email" required placeholder='input email' onChange={e=>setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"/>

                <input type='password' required minLength={6} placeholder="input message(至少4位)" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"/>

                {message&&<p className="text-sm text-red-500 text-center">{message}</p>}

                <div className="flex gap-2">
                    <button 
                    type="submit" 
                    disabled={loading} 
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                        登录
                    </button>

                    <button type="button" disabled={loading} onClick={handleSignUp} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                        注册
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Auth;