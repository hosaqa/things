<script lang="ts">
	import { habitsStore } from '../stores/habits';

  export let goalId: string | undefined = undefined;

  let list = goalId ? habitsStore.getRelatedToGoalId(goalId) : habitsStore.list;

  function getWeek() {
    const curr = new Date();
    const firstDate = new Date(curr.setDate(curr.getDate() - curr.getDay()));

    return Array.from(new Array(7)).map((_, index) => {
      const date = new Date(firstDate);
      date.setDate(date.getDate() + index);

      return date;
    });
  }
  const week = getWeek();
</script>

<section class="{$$restProps.class || ''}">
  <table border={0}>
    <thead>
      <tr>
        <th>name</th>
        {#each week as day}
          <th>{day.toLocaleDateString()}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each $list as habit}
        <tr>
          <td>{habit.name}</td>
          <td>1</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>

<style>
	section {
		margin: 0;
	}

  table {
    border-collapse: collapse;
    text-align: center;
	  vertical-align: middle;
  }

  th, td {
    border: 1px solid red;
  }
</style>
