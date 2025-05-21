declare module 'firebase/firestore' {
  export interface Timestamp {
    seconds: number;
    nanoseconds: number;
    toDate(): Date;
    toMillis(): number;
  }

  export interface FieldValue {
    isEqual(other: FieldValue): boolean;
  }
} 