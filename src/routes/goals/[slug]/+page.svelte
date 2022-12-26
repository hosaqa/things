<script>
  import AddHabitGrid from '../../../components/AddHabitGrid.svelte';
  import HabitsGrid from '../../../components/HabitsGrid.svelte';

  import { page } from '$app/stores';

  import { goalsStore } from '../../../stores/goalsList';

  let goal = goalsStore.getOne($page.params.slug);
</script>



<svelte:head>
	<title>{$goal?.name}</title>
	<meta name="description" content={$goal?.name} />
</svelte:head>

<div class="container">
  {#if $goal?.emoji}
	  <span class="emoji">
		  {$goal?.emoji}
	  </span>
  {/if}
  <h1 class="name">
    {$goal?.name}
  </h1>
  <p>{$goal?.description}</p>
  <HabitsGrid goalId={$goal?.id} class="grid" />
  <AddHabitGrid goalId={$goal?.id} />
</div>

<style>
  .emoji {
    font-size: 64px;
    display: block;
    margin: 0 0 16px;
  }

  .name {
    margin: 0 0 36px;
  }

  .container :global(.grid) {
    margin-bottom: 36px;
  }
</style>
