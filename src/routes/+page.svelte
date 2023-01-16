<script>
	import GoalsList from './GoalsList.svelte';
	import LoginForm from '../components/LoginForm.svelte';

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		My first svelte app
	</h1>
	<LoginForm />
	<GoalsList />
</section>

<style>

</style>
