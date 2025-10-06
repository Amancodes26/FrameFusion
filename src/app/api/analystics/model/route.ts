import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "You are Unauthorized" }, { status: 401 });
    }
    const id = session.user.id;
    try {
        const modelUsage = await prisma.post.groupBy({
            by: ['model'],
            _count: {
                model: true
            },
            where: { userId: id },
            orderBy: {
                _count: {
                    model: 'desc'
                }
            }
        });
        return NextResponse.json(modelUsage);
    } catch {
        return NextResponse.json({ error: "Failed to retrieve model usage" }, { status: 500 });
    }
}
