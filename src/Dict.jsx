import { useState } from "react";
const Dict=()=>{
    const [word,setWord]=useState('');
    const [result,setResult]=useState(null);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState('');

    const getWord=async()=>{
        if(word.trim()==='') return ;
        setLoading(true);
        setResult('');
        setError('');

        try{
          const response=await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.trim()}`);
          if(!response.ok){
            return setError('查不到这个词');
          }
          const data=await response.json();
          setResult(data[0]);
        }
        catch{
          setError('网络连不上')
        }
        finally{
          setLoading(false);
        }    
    };

    const audioUrl=result?.phonetics?.find(item=>item.audio)?.audio;
    const playAudio=()=>{
      if(audioUrl){
        new Audio(audioUrl).play().catch(()=>{
          const speak=new SpeeechSynthesisUtterance(result.word);
          speak.lang='en-US';
          window.speechSynthesis.speak(speak);
        });
      }
    };

    return (
      <div>
        <input value={word} onChange={e=>setWord(e.target.value)}
        placeholder="please input word..." />
        <button onClick={getWord}>look up a word</button>
        {loading &&<p>Searching...</p>}
        {error&&<p style={{color:'goldenrod'}}>{error}</p>}
        {result &&(
          <div>
            <h3>{result.word} {result.phonetic}
              {audioUrl&&(
                <button onClick={playAudio} style={{marginLeft:'8px'}}>
                  🔈 pronounce
                </button>
              )}
            </h3>
            {result.meanings.map((meaning,i)=>(
              <div key={i}>
                <h4>{meaning.partOfSpeech}</h4>
                <ul>
                  {meaning.definitions.map((item,j)=>(
                    <li key={j}>{item.definition}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>);
    };
export default Dict;