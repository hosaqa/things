<script>
	import { userStore } from '../domain/stores/user';
	import LoginForm from '../components/LoginForm.svelte';

	import './styles.css';

	let authIsRestoring = userStore.authIsRestoring;
	let userIsLoggedIn = userStore.userIsLoggedIn;
</script>

<div class="app">
	<main>
		{#if $authIsRestoring}
			<div>Please, wait!</div>
		{:else}
			{#if $userIsLoggedIn}
				<slot />
			{:else}
				<LoginForm />
			{/if}
		{/if}
	</main>
</div>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 64px 24px;
		width: 100%;
		max-width: 768px;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
