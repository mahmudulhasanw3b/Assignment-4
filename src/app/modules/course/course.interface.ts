import { Types } from 'mongoose';

export interface TTag {
    name: string;
    isDeleted: boolean;
}

export interface TDetails {
    level: string;
    description: string;
}

export interface TCourse {
    title: string;
    instructor: string;
    categoryId: Types.ObjectId;
    price: number;
    tags: TTag[];
    startDate: Date | string;
    endDate: Date | string;
    language: string;
    provider: string;
    durationInWeeks?: number;
    details: TDetails;
    createdBy: Types.ObjectId;
}
