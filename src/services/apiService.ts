
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

import { Goal } from '../domain/Goal';
import type { IGoal } from '../domain/Goal';

import { Habit } from '../domain/Habit';
import type { IHabit } from '../domain/Habit';

import {
  PUBLIC_FIREBASE_API_KEY,
  PUBLIC_FIREBASE_AUTH_DOMAIN,
  PUBLIC_FIREBASE_PROJECT_ID,
  PUBLIC_FIREBASE_STORAGE_BUCKET,
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  PUBLIC_FIREBASE_APP_ID,
  PUBLIC_FIREBASE_MEASUREMENT_ID,
} from '$env/static/public';

const firebaseConfig = {
  apiKey: PUBLIC_FIREBASE_API_KEY,
  authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: PUBLIC_FIREBASE_APP_ID,
  measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface GoalDto {
  id: string;
  name: string;
  emoji: string | null;
  description: string;
  inspection_date: number; // timestamp in seconds
  attached_images: Array<{
    url: string,
    description: string;
    attached_at: number; // timestamp in seconds
  }>; 
  habits: Array<{
    id: string;
    attached_at: number; // timestamp in seconds
  }>;
  created_at: number; // timestamp in seconds
  updated_at: number; // timestamp in seconds
}

export interface HabitDto {
  id: string;
  name: string;
  emoji: string | null;
  description: string;
  dates: number[]; // array of timestamps in seconds
  created_at: number; // timestamp in seconds
  updated_at: number; // timestamp in seconds
}


export interface ApiService {
  goal: {
    getList: () => Promise<IGoal[]>;
    create: (goal: IGoal) => Promise<IGoal>;
    patch: (id: string, diff: Partial<IGoal>) => Promise<void>;
  };
  habit: {
    getList: () => Promise<IHabit[]>;
    create: (habit: IHabit) => Promise<IHabit>;
    patch: (id: string, diff: Partial<IHabit>) => Promise<void>;
  };
}

function mapGoalModelFieldsToDto (fields: Partial<IGoal>): Partial<GoalDto> {
  const mappers: Record<string, { fn: (value: any) => any; fieldName: string }> = {
    id: {
      fieldName: 'id',
      fn: (value: IGoal['id']) => value,
    },
    name: {
      fieldName: 'name',
      fn: (value: IGoal['name']) => value,
    },
    emoji: {
      fieldName: 'emoji',
      fn: (value: IGoal['emoji']) => value || null,
    },
    description: {
      fieldName: 'description',
      fn: (value: IGoal['description']) => value,
    },
    inspectionDate: {
      fieldName: 'inspection_date',
      fn: (value: IGoal['inspectionDate']) => value,
    },
    attachedImages: {
      fieldName: 'attached_images',
      fn: (value: IGoal['attachedImages']) => value.map(({ url, description, attachedAt }) => ({
        url,
        description,
        attached_at: attachedAt,
      })),
    },
    habits: {
      fieldName: 'habits',
      fn: (value: IGoal['habits']) => value.map(({ id, attachedAt }) => ({
        id,
        attached_at: attachedAt,
      })),
    },
    createdAt: {
      fieldName: 'created_at',
      fn: (value: IGoal['createdAt']) => value,
    },
    updatedAt: {
      fieldName: 'updated_at',
      fn: (value: IGoal['updatedAt']) => value,
    },
  };

  return Object.entries(fields).reduce((acc: Record<string, any>, entry) => {
    const [name, value] = entry;
    
    const { fieldName, fn } = mappers[name];
    acc[fieldName] = fn(value);

    return acc;
  }, {}) as Partial<GoalDto>;
}

function mapGoalDtoToModel (dto: GoalDto): IGoal {
  return new Goal({
    id: dto.id,
    name: dto.name,
    emoji: dto.emoji || undefined,
    description: dto.description,
    inspectionDate: dto.inspection_date,
    attachedImages: dto.attached_images.map(({ url, description, attached_at }) => ({
      url,
      description,
      attachedAt: attached_at,
    })),
    habits: dto.habits.map(({ id, attached_at }) => ({
      id,
      attachedAt: attached_at,
    })),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  });
}

function mapHabitDtoToModel (dto: HabitDto): IHabit {
  return new Habit({
    id: dto.id,
    name: dto.name,
    emoji: dto.emoji || undefined,
    dates: dto.dates,
    description: dto.description,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  });
}

function mapHabitModelFieldsToDto (fields: Partial<IHabit>): Partial<HabitDto> {
  const mappers: Record<string, { fn: (value: any) => any; fieldName: string }> = {
    id: {
      fieldName: 'id',
      fn: (value: IHabit['id']) => value,
    },
    name: {
      fieldName: 'name',
      fn: (value: IHabit['name']) => value,
    },
    emoji: {
      fieldName: 'emoji',
      fn: (value: IHabit['emoji']) => value || null,
    },
    dates: {
      fieldName: 'dates',
      fn: (value: IHabit['dates']) => value,
    },
    description: {
      fieldName: 'description',
      fn: (value: IHabit['description']) => value,
    },
    createdAt: {
      fieldName: 'created_at',
      fn: (value: IHabit['createdAt']) => value,
    },
    updatedAt: {
      fieldName: 'updated_at',
      fn: (value: IHabit['updatedAt']) => value,
    },
  }

  return Object.entries(fields).reduce((acc: Record<string, any>, entry) => {
    const [name, value] = entry;
    const { fieldName, fn } = mappers[name];
    acc[fieldName] = fn(value);

    return acc;
  }, {}) as Partial<HabitDto>;
}

class FirebaseApiService implements ApiService {
  private _fetchGoals = async () => {
    const querySnapshot = await getDocs<DocumentData>(collection(db, 'goals'));
    const dtos = (querySnapshot.docs || []).map((doc) => {
      return { ...doc.data() as GoalDto, id: doc.id };
    }) as GoalDto[];

    return dtos.map(mapGoalDtoToModel);
  };

  private _createGoal = async (goal: IGoal) => {
    const { id, ...payload } = mapGoalModelFieldsToDto(goal) as GoalDto;
    const doc = await addDoc(collection(db, 'goals'), payload);
    
    return mapGoalDtoToModel({
      ...payload,
      id: doc.id,
    });
  }

  private _patchGoal = async (id: string, diff: Partial<IGoal>): Promise<void> => {
    const payload = mapGoalModelFieldsToDto({
      ...diff,
      id,
    })
    
    const ref = doc(db, 'goals', id);
    await updateDoc(ref, payload);
  }

  get goal() {
    return {
      getList: this._fetchGoals,
      create: this._createGoal,
      patch: this._patchGoal,
    }
  }

  private _fetchHabits = async () => {
    const querySnapshot = await getDocs<DocumentData>(collection(db, 'habits'));
    const dtos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as HabitDto[];

    return (dtos || []).map(mapHabitDtoToModel);
  };

  private _createHabit = async (habit: IHabit) => {
    const { id, ...payload } = mapHabitModelFieldsToDto(habit) as HabitDto;
    const doc = await addDoc(collection(db, 'habits'), payload);
    
    const model = mapHabitDtoToModel({
      ...payload,
      id: doc.id,
    });

    return model as IHabit;
  }

  private _patchHabit = async (id: string, diff: Partial<IHabit>) => {
    const payload = mapHabitModelFieldsToDto({
      ...diff,
      id,
    });

    const ref = doc(db, 'habits', id);
    await updateDoc(ref, payload);
  }

  get habit() {
    return {
      getList: this._fetchHabits,
      create: this._createHabit,
      patch: this._patchHabit,
    }
  }
}

export const apiService = new FirebaseApiService();