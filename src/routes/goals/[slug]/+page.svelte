<script>
  import AddHabitForm from '../../../components/AddHabitForm.svelte';
  import HabitsGrid from '../../../components/HabitsGrid.svelte';
  import Images from './Images.svelte';

  import { page } from '$app/stores';

  import { goalsStore } from '../../../domain/stores/goals';


  let goal = goalsStore.getOne($page.params.slug);
</script>



<svelte:head>
	<title>{$goal?.name}</title>
	<meta name="description" content={$goal?.name} />
</svelte:head>

<div class="container">
  <div class="to-home">
    <a href="/">← Back</a>
  </div>

  {#if $goal?.emoji}
	  <span class="emoji">
		  {$goal?.emoji}
	  </span>
  {/if}
  <h1 class="name">
    {$goal?.name}
  </h1>
  <p class="description">{$goal?.description}</p>
  <p>Inspection date {new Date($goal?.inspectionDate * 1000).toLocaleDateString()}</p>
  <Images images={$goal.attachedImages} />
  <HabitsGrid goalId={$goal?.id} class="grid" />
  <AddHabitForm goalId={$goal?.id} />
</div>

<style>
  .to-home {
    margin-bottom: 50px;
  }

  .emoji {
    font-size: 64px;
    display: block;
    margin: 0 0 16px;
  }

  .name {
    margin: 0 0 36px;
  }

  .description {
    white-space: pre-line;
  }

  .images {
    margin-bottom: 20px;
  }

  .container :global(.grid) {
    margin-bottom: 36px;
  }
</style>
