import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import './App.css'

function App() {
  const [totalSpent, setTotalSpent] = useState(0) 

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/expenses/total-spent")
      const data = await res.json()
      setTotalSpent(data.totalSpent)
    }

    fetchData()
  }, [])

  return (
    <>
      <Card className='w-[350px] m-auto'>
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>The total amount you've spent</CardDescription>
        </CardHeader>
        <CardContent>
          {totalSpent}
        </CardContent>
      </Card>      
    </>
  )
}

export default App
