import { create } from 'zustand';
export const useUI=create<{editing:boolean;setEditing:(value:boolean)=>void;toast:string;notify:(message:string)=>void}>((set)=>({editing:false,setEditing:editing=>set({editing}),toast:'',notify:toast=>set({toast})}));
