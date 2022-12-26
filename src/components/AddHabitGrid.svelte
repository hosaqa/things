<script lang="ts">
	import { habitsStore } from '../stores/habits';

  export let goalId: string | undefined;

  let name = '';
  function handleSubmit () {
    habitsStore.add(name, goalId);
    name = '';
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="{$$restProps.class || ''}">
  <label for="New habit">Name</label>
  <input name="new_habit" type="text" bind:value={name} />
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
