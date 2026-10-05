import { CoreService } from './core.service';
describe('core domain rules',()=>{
 test('cross-workspace goal cannot be linked to a task',async()=>{const db={goal:{findFirst:jest.fn(async()=>null)},task:{create:jest.fn()}};await expect(new CoreService(db as any).task('a',{title:'Test',goalId:'foreign'})).rejects.toThrow();expect(db.task.create).not.toHaveBeenCalled();});
 test('bulk reordering rejects duplicate IDs before writing',async()=>{const db={$transaction:jest.fn()};await expect(new CoreService(db as any).reorder('a',['id','id'])).rejects.toThrow('Duplicate task');expect(db.$transaction).not.toHaveBeenCalled();});
 test('calendar rejects inverted ranges',async()=>{await expect(new CoreService({} as any).events('a','2026-10-02','2026-10-01')).rejects.toThrow();});
 test('goal progress is derived from linked tasks',async()=>{const db={goal:{findMany:async()=>[{id:'g',milestones:[{id:'m',completed:false}],tasks:[{milestoneId:'m',status:'done'},{milestoneId:'m',status:'todo'}]}]}};const result:any=await new CoreService(db as any).goals('a','g');expect(result.progress).toBe(50);});
});
