import { Timestamp } from '@angular/fire/firestore';

export interface PhotoFromFirestore {
    id: string;
    url: string;
    type: 'nice' | 'ugly';
    username: string;
    votes: number;
    usersVoted: string[];
    createdAt: Timestamp;
}

export interface Photo {
    id: string;
    url: string;
    type: 'nice' | 'ugly';
    username: string;
    votes: number;
    usersVoted: string[];
    createdAt: Date;
}
