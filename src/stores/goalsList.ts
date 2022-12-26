import { writable, derived } from 'svelte/store';

import { GoalsList } from '../domain/GoalsList';
import { Goal } from '../domain/Goal';

import { persistentStorage, PERSISTENT_STORAGE_KEYS } from '../services/persistentStorage';


const createStore = () => {
  const initialGoals = persistentStorage.get(PERSISTENT_STORAGE_KEYS.GOALS);
  const domain = new GoalsList(initialGoals || []);
  const observableList = writable(domain.list);
  
  return {
    list: observableList,
    getOne: (id: string) => {
      return derived(observableList, $observableList => $observableList.find(goal => goal.id === id));
    },
    add: ({ name, emoji, description }: { name: string, emoji?: string, description: string }) => {
      const goal = new Goal({
        id: Math.random().toString(),
        name: name,
        emoji,
        description: description,
        habits: [],
      });

      domain.add(goal);
      observableList.set(domain.list);

      persistentStorage.set(PERSISTENT_STORAGE_KEYS.GOALS, domain.list);
    },
    remove: (id: string) => {
      domain.remove(id);

      observableList.set(domain.list);

      persistentStorage.set(PERSISTENT_STORAGE_KEYS.GOALS, domain.list);
    }
  }
}
const goalsStore = createStore();

export { goalsStore };