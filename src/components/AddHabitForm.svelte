<script lang="ts">
	import { habitsStore } from '../stores/habits';
	import { goalsStore } from '../stores/goals';


  export let goalId: string | undefined;

  let name = '';
  let emoji = '';
  let description = '';

  function handleSubmit () {
    const { id } = habitsStore.add({ name, emoji, description });

    if (goalId) {
      goalsStore.attachHabit({ habitId: id, goalId });
    }

    name = '';
    emoji = '';
    description = ''
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="{$$restProps.class || ''}">
  <div>
    <label for="new_habit_name">Name</label>
    <input name="new_habit_name" type="text" bind:value={name} />
  </div>
  <div>
    <label for="new_habit_emoji">Emoji</label>
    <input name="new_habit_emoji" type="text" bind:value={emoji} />
  </div>
  <div>
    <label for="new_habit_description">Description</label>
    <input name="new_habit_description" type="text" bind:value={description} />
  </div>
  <button type="submit">Add</button>
</form>

<style>
	form {
		margin: 0;
	}

  label {
    margin: 0 0 16px;
  }

  input {
    margin: 0 0 16px;
  }
</style>
