import { Lounger } from "./lounger";

export class Reservation {
    id!: string;
    date!: string;
    startTime!: string;
    endTime!: string;
    userId!: string;
    loungers!: Lounger[];
}