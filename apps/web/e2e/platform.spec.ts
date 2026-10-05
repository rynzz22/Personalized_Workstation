import { test,expect } from '@playwright/test';
test.skip(!process.env.E2E_FULL_STACK,'Requires the isolated API browser-test harness');
test('sign in, onboard, create and complete task, reload, notes and goals',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/login');await page.getByLabel('Email',{exact:true}).fill('browser@example.test');await page.getByLabel('Password',{exact:true}).fill('test-password');
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Your workspace starts here'})).toBeVisible();
 await page.getByLabel('Workspace name').fill('Browser Test Workspace');await page.getByLabel('Your role').selectOption('employee');
 await page.getByRole('button',{name:'Create workspace',exact:true}).click();
 await expect(page.getByRole('heading',{name:'A little focus goes a long way.'})).toBeVisible();
 await page.getByRole('link',{name:'Tasks',exact:true}).click();await page.getByRole('button',{name:'+ Add task'}).click();
 await page.getByLabel('Title',{exact:true}).fill('Verify persistent task');await page.getByRole('button',{name:'Save task'}).click();
 await expect(page.getByRole('button',{name:/Verify persistent task/})).toBeVisible();
 await page.getByRole('checkbox',{name:'Complete Verify persistent task'}).check();await expect(page.getByRole('checkbox',{name:'Complete Verify persistent task'})).toBeChecked();
 await page.reload();await expect(page.getByRole('checkbox',{name:'Complete Verify persistent task'})).toBeChecked();
 await page.getByRole('link',{name:'Notes',exact:true}).click();await page.getByRole('button',{name:'+ New note'}).click();await page.getByLabel('Title',{exact:true}).fill('Browser note');await page.getByRole('button',{name:'Create note'}).click();
 await page.locator('.tiptap').fill('A persisted idea');await page.getByRole('button',{name:'Save now'}).click();await expect(page.getByRole('status').filter({hasText:'Saved'})).toBeVisible();
 await page.getByRole('button',{name:'Close dialog'}).click();await page.reload();await page.getByRole('button',{name:/Browser note/}).click();await expect(page.locator('.tiptap')).toContainText('A persisted idea');
 await page.getByRole('button',{name:'Close dialog'}).click();await page.getByRole('link',{name:'Goals',exact:true}).click();await page.getByRole('button',{name:'+ New goal'}).click();await page.getByLabel('Title',{exact:true}).fill('Ship the foundation');await page.getByRole('button',{name:'Save goal'}).click();await expect(page.getByRole('heading',{name:'Ship the foundation'})).toBeVisible();
 await page.getByLabel('New milestone').fill('Verify a real database');await page.getByRole('button',{name:'Add milestone'}).click();await page.getByRole('checkbox',{name:'Verify a real database'}).check();await expect(page.getByText('100% complete')).toBeVisible();
 await page.getByRole('link',{name:'Dashboard',exact:true}).click();await page.screenshot({path:'../../artifacts/phase1-dashboard-desktop.png',fullPage:true});
 for(const width of [390,768]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.screenshot({path:'../../artifacts/phase1-dashboard-tablet.png',fullPage:true});
 expect(errors).toEqual([]);
});
