<script>
	import { goalsStore } from '../domain/stores/goals';
	import AddGoalForm from '../components/AddGoalForm.svelte';

  let list = goalsStore.list;
</script>

<section>
  <ul>
    {#each $list as goal}
      <li><a href={`goals/${goal.id}`}>{goal.name}</a></li>
    {/each}
  </ul>
  <AddGoalForm />
</section>

<style>
	section {
		margin: 0 0 20px;
	}
</style>
