import { writable, derived, get } from 'svelte/store';
import type { ApiService } from '../../services/apiService/interface';
import { firebaseApiService } from '../../services/apiService/firebase/firebaseApiService';
import type { Habit } from '../models/habit';

const createStore = (apiService: ApiService) => {
  const list = writable<Habit[]>([]);
  const isFetching = writable(true);

  apiService.habit.getList()
    .then((fetchedList) => {
      list.set(fetchedList);
    })
    .finally(() => {
      isFetching.set(false);
    });
  
  return {
    isFetching: true,
    list: list,
    filterByIds: (ids: string[]) => {
      return derived(list, $list => $list.filter(({ id }) => ids.includes(id)));
    },
    getOne: (id: string) => {
      return derived(list, $list => $list.find(habit => habit.id === id));
    },
    add: async ({ name, emoji, description }: { name: string, emoji?: string, description: string }) => {
      const now = Date.now();
      const newHabit: Habit = {
        id: 'temp',
        name,
        emoji,
        description,
        dates: [],
        createdAt: now,
        updatedAt: now,
      };

      const created = await apiService.habit.create(newHabit);

      list.update((list) => {
        return [...list, created];
      });

      return created;
    },
    remove: (id: string) => {
      throw new Error('should be implemented!');
    },
    toggleDate: async (habitId: string, date: Date) => {
      const currentList = get(list);
      const habit = currentList.find(habitItem => habitItem.id === habitId);
    
      if (!habit) {
        throw new Error(`Habit with id ${habitId} doesn't exist!`);
      }

      const timestamp = date.getTime();
      const updatedDatesArr = [...habit.dates];
      
      const index = updatedDatesArr.indexOf(timestamp);
      if (index === -1) {
        updatedDatesArr.push(timestamp);        
      } else {
        updatedDatesArr.splice(index, 1);
      }
  
      await apiService.habit.patch(habitId, {
        dates: updatedDatesArr,
      });

      list.update((list) => {
        const index = list.indexOf(habit);
        list[index] = {
          ...habit,
          dates: updatedDatesArr,
        }

        return list;
      });
    },
  }
}
const habitsStore = createStore(firebaseApiService);

export { habitsStore };