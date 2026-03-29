import { prisma } from "../lib/prisma";

export type UserCreateInput = {
  userName: string;
  password: string;
  email: string;
};

export type UserUpdateInput = Partial<{
  userName: string;
  password: string;
  email: string;
  token: string | null;
}>;

export const findAll = () =>
  prisma.user.findMany({ orderBy: { createdAt: "desc" } });

export const findById = (id: string) =>
  prisma.user.findUnique({ where: { id } });

export const findByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } });

export const findByUserName = (userName: string) =>
  prisma.user.findFirst({ where: { userName } });

export const create = (data: UserCreateInput) =>
  prisma.user.create({ data });

export const update = (id: string, data: UserUpdateInput) =>
  prisma.user.update({ where: { id }, data });

export const remove = (id: string) =>
  prisma.user.delete({ where: { id } });
