// app/api/todos/exists/route.ts
// This API route checks if a todo with the given title already exists in the database.
// It is used to prevent duplicate todos from being created.
import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET(request: Request) {
  // Get the title from the query parameters
  const { searchParams } = new URL(request.url); 
  const title = searchParams.get("title");
  if (!title) {
    // If no title is provided, return a response indicating that the todo does not exist
    return NextResponse.json({ exists: false });
  }
  // Normalize the title by trimming and lowercasing it, and replacing multiple spaces with a single space
  const normalizedTitle = title.trim().toLowerCase().replace(/\s+/g, " ");
  // Check if a todo with the normalized title already exists in the database
  const duplicate = await prisma.todo.findFirst({
    where: {
      title: {
        equals: normalizedTitle,
        mode: "insensitive",
      },
    },
  });
  // Return a response indicating whether the todo exists or not
  return NextResponse.json({ exists: !!duplicate });
}

