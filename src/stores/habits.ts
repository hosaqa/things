import { writable, derived, get } from 'svelte/store';

import { Habit } from '../domain/Habit';
import type { IHabit } from '../domain/Habit';

import { apiService } from '../services/apiService';


const createStore = () => {

  const observableList = writable<IHabit[]>([]);
  apiService.habit.getList().then((list) => {
    observableList.set(list);
  });
  
  return {
    list: observableList,
    filterByIds: (ids: string[]) => {
      return derived(observableList, $observableList => $observableList.filter(({ id }) => ids.includes(id)));
    },
    getOne: (id: string) => {
      return derived(observableList, $observableList => $observableList.find(habit => habit.id === id));
    },
    add: async ({ name, emoji, description }: { name: string, emoji?: string, description: string }) => {
      const newHabit = new Habit({
        id: 'temp',
        name,
        emoji,
        description,
        dates: [],
      });

      const created = await apiService.habit.create(newHabit.plain as IHabit);

      const updated = [...get(observableList), created];
      observableList.set(updated);

      return created;
    },
    remove: (id: string) => {
      throw new Error('should be implemented!');

      const updated = [...get(observableList)];
      const index = updated.findIndex(habitItem => habitItem.id === id);

      updated.splice(index, 0);

      observableList.set(updated);
    },
    toggleDate: async (habitId: string, date: number) => {
      const list = [...get(observableList)];
      const habit = list.find(h => h.id === habitId);
    
      if (habit?.dates.includes(date)) {
        habit?.removeDate(date);        
      } else {
        habit?.addDate(date);
      }
  
      await apiService.habit.patch(habitId, {
        dates: habit?.dates,
      });

      observableList.set(list);
    },
  }
}
const habitsStore = createStore();

export { habitsStore };