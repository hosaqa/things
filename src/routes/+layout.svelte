<script>
	import './styles.css';
</script>

<div class="app">
	<main>
		<slot />
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
