<script lang="ts">
  import { default as dayjs } from 'dayjs';

	import { habitsStore } from '../stores/habits';
	import { goalsStore } from '../stores/goals';


  export let goalId: string | undefined = undefined;

  let goal = goalId ? goalsStore.getOne(goalId) : undefined;
  $: list = goal ? habitsStore.filterByIds($goal!.habits.map(({id}) => id)) : habitsStore.list;


  function getWeek() {
    const curr = new Date();
    const firstDate = new Date(curr.setDate(curr.getDate() - curr.getDay()));

    return Array.from(new Array(7)).map((_, index) => {
      const date = new Date(firstDate);
      date.setDate(date.getDate() + index);

      return dayjs(new Date(date)).startOf('date').toDate(); 
    });
  }
  const week = getWeek();

  function checkDateIsPos(date: Date, habitDates: number[]) {
    return habitDates.includes(Math.round(date.getTime() / 1000));
  }

  function checkboxHandleClick(id: string, date: Date) {
    habitsStore.toggleDate(id, Math.round(date.getTime() / 1000));
  }

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
          {#each week as date}
            <td>
              <button
                type="button"
                on:click|preventDefault={() => checkboxHandleClick(habit.id, date)}
              >
                {checkDateIsPos(date, habit.dates) ? '+' : '-'}
              </button>
            </td>
          {/each}
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
