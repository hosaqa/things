
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

import { app } from '../../firebase';

import type { Goal } from '../../../domain/models/goal';
import type { GoalDto } from './dtos/goalDto';
import { mappers as goalMappers } from './dtos/goalDto';

import type { Habit } from '../../../domain/models/habit';
import type { HabitDto } from './dtos/habitDto';
import { mappers as habitMappers } from './dtos/habitDto';

import type { ApiService } from '../interface'


const db = getFirestore(app);


class FirebaseApiService implements ApiService {
  private _fetchGoals = async () => {
    const querySnapshot = await getDocs<DocumentData>(collection(db, 'goals'));
    const dtos = querySnapshot.docs.map((doc) => {
      return { ...doc.data() as GoalDto, id: doc.id };
    }) as GoalDto[];

    return (dtos || []).map(goalMappers.dtoToModel);
  };

  private _createGoal = async (goal: Goal) => {
    const { id, ...payload } = goalMappers.partialModelToDto(goal) as GoalDto;
    const doc = await addDoc(collection(db, 'goals'), payload);
    
    return goalMappers.dtoToModel({
      ...payload,
      id: doc.id,
    });
  }

  private _patchGoal = async (id: string, diff: Partial<Goal>): Promise<void> => {
    const payload = goalMappers.partialModelToDto({
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

    return (dtos || []).map(habitMappers.dtoToModel);
  };

  private _createHabit = async (habit: Habit) => {
    const { id, ...payload } = habitMappers.partialModelToDto(habit) as HabitDto;
    const doc = await addDoc(collection(db, 'habits'), payload);
    
    const model = habitMappers.dtoToModel({
      ...payload,
      id: doc.id,
    });

    return model as Habit;
  }

  private _patchHabit = async (id: string, diff: Partial<Habit>) => {
    const payload = habitMappers.partialModelToDto({
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

export const firebaseApiService = new FirebaseApiService();