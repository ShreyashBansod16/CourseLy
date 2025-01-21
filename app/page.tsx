"use client"
import { Button } from '../components/ui/button';

export default function Home() {
  // function alertWindow(){
  //   window.alert("hello");
  // }
  return (
    <>
    <Button onClick={()=>window.alert("clicked")} className='bg-blue-300 p-10 m-10 hover:bg-blue-900'>Click Me</Button>
    </>
  );
}
