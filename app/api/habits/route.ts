import {prisma} from "@/lib/prisma";

export async function GET() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const habits = await prisma.habit.findMany({
        include: { checkIns: true },
        orderBy: { createdAt: 'asc' },
    });
    return Response.json(habits.map(habit => ({
        id: habit.id,
        name: habit.name,
        streak: habit.checkIns.length,
        done: habit.checkIns.some((c) => c.date >= startOfDay),
        color: 'violet',
    })));
}

export async function POST(request: Request) {
    const { name } = await request.json();
    const habit = await prisma.habit.create({
        data: { name },
    });
    return Response.json({
        id: habit.id
    });
}