import { NextRequest, NextResponse } from "next/server";
import db from '@/db'
import { getServerAuthSession, UserSession } from "@/lib/auth";
import { z } from "zod";

const requestBodySchema = z.object({
    classGradeId: z.number(),
    sectionId: z.number(),
    subjectId: z.number(),
    teacherId: z.number(),
    weeklyClassesCount: z.number(),
})

export async function GET(req: NextRequest) {
    try {
        const session = await getServerAuthSession();
        const organizationId = (session as UserSession)?.user?.organizationId;

        const lessons = await db.lesson.findMany({
            where: {
                organizationId
            }
        })
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong!" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerAuthSession();
        const organizationId = (session as UserSession)?.user?.organizationId;

        const parsedRequest = requestBodySchema.safeParse(await req.json());
        if (!parsedRequest.success) {
            return NextResponse.json(
                { error: parsedRequest.error.message },
                { status: 400 }
            )
        }

        const { classGradeId, sectionId, subjectId, teacherId, weeklyClassesCount } = parsedRequest.data;

        await db.lesson.create({
            data: {
                organizationId,
                classGradeId,
                sectionId,
                subjectId,
                teacherId,
                weeklyClassesCount,
            }
        })

    } catch (error) {
        return NextResponse.json(
            {
                error: "Something went wrong!"
            },
            {
                status: 500
            })
    }
}