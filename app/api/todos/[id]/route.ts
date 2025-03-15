import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: params.id },
    });
    if (!todo) {
      return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
    }
    return NextResponse.json(todo, { status: 200 });
  } catch (error) {
    if (error) {
      return NextResponse.json({ message: 'Error fetching todo' }, { status: 500 });
    }
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, description, completed } = await request.json();
    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }
    const updatedTodo = await prisma.todo.update({
      where: { id: params.id },
      data: { title, description, completed },
    });
    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    if (error){
      return NextResponse.json({ message: 'Error updating todo' }, { status: 500 });
    }
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.todo.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Todo deleted' }, { status: 200 });
  } catch (error) {
    if (error) {
      return NextResponse.json({ message: 'Error deleting todo' }, { status: 500 });
    }
  }
}