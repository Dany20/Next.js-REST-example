import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ todos }, { status: 200 });
  } catch (error) {
    if (error){
      return NextResponse.json({ error: 'Error fetching todos' }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();
    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }
    const newTodo = await prisma.todo.create({
      data: { title, description },
    });
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    if (error) {
      return NextResponse.json({ error: 'Error creating todo' }, { status: 500 });
    }
  }
}

export const dynamic = 'force-dynamic';