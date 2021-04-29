import { Role } from "./role";

export class User {
    id!: string;
    email!: string;
    password!: string;
    firstName!: string;
    lastName!: string;
    bookingNumber!: string;
    role!: Role;
    token?: string;
}