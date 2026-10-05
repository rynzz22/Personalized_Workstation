import 'reflect-metadata';
import { JwtAuthGuard } from './jwt-auth.guard';import { WorkspaceGuard } from './workspace.guard';import { RolesGuard } from './roles.guard';import { Reflector } from '@nestjs/core';
const context=(request:any)=>({switchToHttp:()=>({getRequest:()=>request}),getHandler:()=>()=>{},getClass:()=>class{}}) as any;
describe('authorization boundaries',()=>{
 test('missing and malformed credentials never become a demo user',async()=>{const auth={verifyToken:jest.fn()};const guard=new JwtAuthGuard(auth as any);for(const header of [undefined,'dev-token','Basic abc','Bearer ','Bearer a b'])await expect(guard.canActivate(context({headers:{authorization:header}}))).rejects.toThrow();expect(auth.verifyToken).not.toHaveBeenCalled();});
 test('a rejected token is denied',async()=>{await expect(new JwtAuthGuard({verifyToken:async()=>null} as any).canActivate(context({headers:{authorization:'Bearer forged'}}))).rejects.toThrow();});
 test('a workspace without membership is concealed',async()=>{const guard=new WorkspaceGuard({workspaceMember:{findUnique:async()=>null}} as any);await expect(guard.canActivate(context({params:{workspaceId:'b'},user:{id:'a'},method:'GET'}))).rejects.toThrow('Workspace not found');});
 test('database failure does not grant access',async()=>{const guard=new WorkspaceGuard({workspaceMember:{findUnique:async()=>{throw Error('offline');}}} as any);await expect(guard.canActivate(context({params:{workspaceId:'b'},user:{id:'a'},method:'GET'}))).rejects.toThrow('offline');});
 test('viewers can read but cannot write',async()=>{const guard=new WorkspaceGuard({workspaceMember:{findUnique:async()=>({role:'viewer',workspace:{deletedAt:null}})}} as any);await expect(guard.canActivate(context({params:{workspaceId:'b'},user:{id:'a'},method:'GET'}))).resolves.toBe(true);await expect(guard.canActivate(context({params:{workspaceId:'b'},user:{id:'a'},method:'POST'}))).rejects.toThrow();});
 test('missing membership does not imply owner',()=>{const reflector={getAllAndOverride:()=>['admin']} as unknown as Reflector;expect(()=>new RolesGuard(reflector).canActivate(context({}))).toThrow();});
});
