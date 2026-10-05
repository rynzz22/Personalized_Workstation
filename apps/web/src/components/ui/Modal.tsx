import { ReactNode, useEffect, useId, useRef } from 'react';
export interface ModalProps {isOpen:boolean;onClose:()=>void;title?:string;description?:string;children:ReactNode;maxWidth?:string;}
export function Modal({isOpen,onClose,title,description,children}:ModalProps) {
 const ref=useRef<HTMLDialogElement>(null);const id=useId();
 useEffect(()=>{const dialog=ref.current;if(isOpen&&!dialog?.open)dialog?.showModal();else if(!isOpen&&dialog?.open)dialog.close();},[isOpen]);
 return <dialog ref={ref} aria-labelledby={id} onCancel={onClose} onClose={onClose} className="modal"><header><div><h2 id={id}>{title}</h2>{description&&<p>{description}</p>}</div><button type="button" aria-label="Close dialog" onClick={onClose}>?</button></header>{children}</dialog>;
}
export function Drawer(props:ModalProps) {return <Modal {...props}/>;}
export const Dialog=Modal;
