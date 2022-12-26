<script>
	import { goalsStore } from '../stores/goalsList';

  let list = goalsStore.list;

  let name = '';
  let emoji = '';
  let description = '';

  function handleSubmit () {
    goalsStore.add({
      name,
      emoji: emoji ? emoji : undefined,
      description,
    });

    name = '';
    emoji = '';
    description = '';
  }
</script>

<section>
  <ul>
    {#each $list as goal}
      <li><a href={`goals/${goal.id}`}>{goal.name}</a></li>
    {/each}
  </ul>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="row">
      <label for="new_goal_name">Name</label>
      <input name="new_goal_name" bind:value={name} />
    </div>
    <div class="row">
      <label for="new_goal_description">Description</label>
      <textarea name="new_goal_description" bind:value={description} />
    </div>
    <div class="row">
      <label for="new_goal_emoji">Emoji</label>
      <input name="new_goal_emoji" bind:value={emoji} />
    </div>
    <button type="submit">Add</button>
  </form>
</section>

<style>
	section {
		margin: 0 0 20px;
	}

  .row {
    margin: 0 0 16px;
  }

  label {
    display: block;
    margin: 0 0 8px;
  }
</style>
