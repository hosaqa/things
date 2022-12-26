import { writable, derived, get } from 'svelte/store';

import { Habit } from '../domain/Habit';

import { persistentStorage, PERSISTENT_STORAGE_KEYS } from '../services/persistentStorage';


const createStore = () => {
  const initial = persistentStorage
    .get(PERSISTENT_STORAGE_KEYS.HABITS) as Array<{id: string, name: string, relatedGoalIds: string[], dates: number[]}> || [];
   
  const arr = initial.map(({id, name, relatedGoalIds, dates}) => new Habit(id, name, relatedGoalIds, dates));
  const observableList = writable(arr);
  
  return {
    list: observableList,
    getOne: (id: string) => {
      return derived(observableList, $observableList => $observableList.find(habit => habit.id === id));
    },
    getRelatedToGoalId: (id: string) => {
      return derived(observableList, $observableList => 
        $observableList.filter(({ relatedGoalIds }) => relatedGoalIds.includes(id)));
    },
    add: (name: string, goalId?: string) => {
      const newHabit = new Habit(
        Math.random().toString(),
        name,
        goalId ? [goalId] : [],
        [],
      );

      const updated = [...get(observableList), newHabit];
      observableList.set(updated);

      persistentStorage.set(PERSISTENT_STORAGE_KEYS.HABITS, updated);
    },
    remove: (id: string) => {

      const updated = [...get(observableList)];
      const index = updated.findIndex(habitItem => habitItem.id === id);

      updated.splice(index, 0);

      observableList.set(updated);

      persistentStorage.set(PERSISTENT_STORAGE_KEYS.HABITS, updated);
    }
  }
}
const habitsStore = createStore();

export { habitsStore };