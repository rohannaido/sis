import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/db";
import bcrypt from "bcrypt";
import { UserSession } from "@/lib/auth";
import {  getServerAuthSession } from "@/lib/auth";

const signupRequestSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be 3 characters long.",
  }),
  schoolName: z.string().min(3, {
    message: "School name must be 3 characters long.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be 6 characters long.",
  }),
});

export async function POST(req: NextRequest) {
  try {
    const parsedRequest = signupRequestSchema.safeParse(await req.json());

    if (!parsedRequest.success) {
      return NextResponse.json(
        {
          error: parsedRequest.error,
        },
        {
          status: 400,
        }
      );
    }

    const { name, email, password } = parsedRequest.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return NextResponse.json(
        {
          error: "User already exists with this email.",
        },
        {
          status: 400,
        }
      );
    }

    const organization = await db.organization.create({
      data: {
        name: parsedRequest.data.schoolName,
      },
    });

    const user = await db.user.create({
      data: {
        organizationId: organization.id,
        name,
        email,
        password: hashedPassword,
        isAdmin: true,
      },
    });

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json(
      {
        error: err,
      },
      {
        status: 500,
      }
    );
  }
}
