<script lang="ts">
	import { firebaseAuthService } from '../services/authService/firebaseAuthService';

  firebaseAuthService.checkAuth().then((x) => {
    console.log(x);
    debugger
  })
</script>

<section>
  <button on:click={() => firebaseAuthService.signInWithGoogle()}>Log in with Google</button>
</section>

<style>
	section {
    padding: 24px;
  }
</style>
