<script lang="ts">
	import { userStore } from '../domain/stores/user';
</script>

<section>
  <button on:click={() => userStore.signInWithGoogle()}>Log in with Google</button>
</section>

<style>
	section {
    padding: 24px;
  }
</style>
