import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod"

export const expensesRoutes = new Hono();

const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string().min(3).max(100),
    amount: z.number().int().positive(),
})

type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({id: true})

const fakeExpenses: Expense[] = [
    {
        id: 1,
        title: "Lunch",
        amount: 15.45,
    },
    {
        id: 2,
        title: "Dinner",
        amount: 20.99,
    },
    {
        id: 3,
        title: "Breakfast",
        amount: 5.99,
    },
]

expensesRoutes
.get("/", (c) =>{
    return c.json({ expenses: fakeExpenses })
})
.post("/", zValidator("json",createPostSchema), async (c) =>{
    const expense = await c.req.valid("json")
    fakeExpenses.push({...expense, id: fakeExpenses.length + 1})
    console.log(expense)
    c.status(201)
    return c.json(expense)
})
.get("/:id{[0-9]+}", (c) =>{
    const id = Number.parseInt(c.req.param("id")) 
    const expense = fakeExpenses.find(expense => expense.id === id)
    if (!expense){
        return c.notFound()
    }
    return c.json(expense)
})
.delete("/:id{[0-9]+}", (c) =>{
    const id = Number.parseInt(c.req.param("id")) 
    const expense = fakeExpenses.find(expense => expense.id === id)
    if (!expense){
        return c.notFound()
    }
    const deletedExpense = fakeExpenses.splice(fakeExpenses.indexOf(expense), 1)
    return c.json({deletedExpense})
})
// .put