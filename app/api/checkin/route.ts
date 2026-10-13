import {prisma} from "@/lib/prisma";

export async function POST( request: Request ) {
  const { habitId } = await request.json() 
  const checkIn = await prisma.checkIn.create({
    data: { habitId }
  })
  return Response.json({ id: checkIn.id })
}