import { writable, derived, get } from 'svelte/store';

import { Habit } from '../domain/Habit';

import { persistentStorage, PERSISTENT_STORAGE_KEYS } from '../services/persistentStorage';


const createStore = () => {
  const initial = persistentStorage
    .get(PERSISTENT_STORAGE_KEYS.HABITS) as Array<{
      id: string;
      name: string;
      emoji?: string;
      description: string;
      dates: number[];
      createdAt: number; // timestamp in seconds
      updatedAt: number; // timestamp in seconds
    }> || [];
   
  const arr = initial
    .map(({ id, name, emoji, description, dates, createdAt, updatedAt }) => {
      return new Habit({ id, name, emoji, description, dates, createdAt, updatedAt });
    });
  const observableList = writable(arr);
  
  return {
    list: observableList,
    filterByIds: (ids: string[]) => {
      return derived(observableList, $observableList => $observableList.filter(({ id }) => ids.includes(id)));
    },
    getOne: (id: string) => {
      return derived(observableList, $observableList => $observableList.find(habit => habit.id === id));
    },
    add: ({ name, emoji, description }: { name: string, emoji?: string, description: string }) => {
      const newHabit = new Habit({
        id: Math.random().toString(),
        name,
        emoji,
        description,
        dates: [],
      });

      const updated = [...get(observableList), newHabit];
      observableList.set(updated);

      persistentStorage.set(PERSISTENT_STORAGE_KEYS.HABITS, updated);

      return newHabit;
    },
    remove: (id: string) => {

      const updated = [...get(observableList)];
      const index = updated.findIndex(habitItem => habitItem.id === id);

      updated.splice(index, 0);

      observableList.set(updated);

      persistentStorage.set(PERSISTENT_STORAGE_KEYS.HABITS, updated);
    },
    toggleDate: (habitId: string, date: number) => {
      const list = [...get(observableList)];
      const habit = list.find(h => h.id === habitId);
    
      if (habit?.dates.includes(date)) {
        habit?.removeDate(date);        
      } else {
        habit?.addDate(date);
      }
   
      observableList.set(list);
      persistentStorage.set(PERSISTENT_STORAGE_KEYS.HABITS, list);
    },
  }
}
const habitsStore = createStore();

export { habitsStore };